const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);
const stream = require('stream');
const querystring = require('querystring');

import { IOpenable } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';
import { CompositeCounters } from 'pip-services3-components-nodex';
import { IdGenerator } from 'pip-services3-commons-nodex';
import { StringConverter } from 'pip-services3-commons-nodex';
import { BooleanConverter } from 'pip-services3-commons-nodex';
import { DateTimeConverter } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { AwsConnectionResolver } from 'pip-services3-aws-nodex';
import { AwsConnectionParams } from 'pip-services3-aws-nodex';

import { BlobInfoV1 } from './BlobInfoV1';
import { IBlobsClientV1 } from './IBlobsClientV1';
import { BlobsUriProcessorV1 } from './BlobsUriProcessorV1';
import { BlobDataV1 } from './BlobDataV1';
import { resolve } from 'path';
import { rejects } from 'assert';

export class BlobsS3ClientV1
    implements IOpenable, IConfigurable, IReferenceable, IBlobsClientV1 {

    protected _s3: any;
    protected _opened: boolean = false;
    protected _connection: AwsConnectionParams;
    protected _bucket: string;
 
    protected _connectTimeout: number = 30000;
    protected _minChunkSize: number = 5 * 1024 * 1024;
    protected _maxBlobSize: number = 100 * 1024;
    protected _reducedRedundancy: boolean = true;
    protected _maxPageSize: number = 100;

    protected _connectionResolver: AwsConnectionResolver = new AwsConnectionResolver();
    protected _logger: CompositeLogger = new CompositeLogger();
    protected _counters: CompositeCounters = new CompositeCounters();

    public constructor(config?: any) {
        if (config != null)
            this.configure(ConfigParams.fromValue(config));
    }

    public configure(config: ConfigParams): void {
        this._connectionResolver.configure(config);

        this._minChunkSize = config.getAsLongWithDefault('options.min_chunk_size', this._minChunkSize);
        this._maxBlobSize = config.getAsLongWithDefault('options.max_blob_size', this._maxBlobSize);
        this._reducedRedundancy = config.getAsBooleanWithDefault('options.reduced_redundancy', this._reducedRedundancy);
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
        this._connectTimeout = config.getAsIntegerWithDefault("options.connect_timeout", this._connectTimeout);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
    }

    public isOpen(): boolean {
        return this._opened;
    }

    public async open(correlationId: string): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        this._connection = await this._connectionResolver.resolve(correlationId);

        let aws = require('aws-sdk');

        aws.config.update({
            accessKeyId: this._connection.getAccessId(),
            secretAccessKey: this._connection.getAccessKey(),
            region: this._connection.getRegion()
        });

        aws.config.httpOptions = {
            timeout: this._connectTimeout
        };

        this._s3 = new aws.S3();
        this._bucket = this._connection.getResource();

        this._opened = true;
        this._logger.debug(correlationId, "S3 persistence connected to %s", this._connection.getArn());
    }

    public async close(correlationId: string): Promise<void> {
        this._opened = false;
    }

    private normalizeName(name: string): string {
        if (name == null) return null;

        name = name.replace('\\', '/');
        let pos = name.lastIndexOf('/');
        if (pos >= 0)
            name = name.substring(pos + 1);

        return name;
    }

    private dataToInfo(id: string, data: any): BlobInfoV1 {
        if (data == null) return null;

        let metadata = data.Metadata;
        return <BlobInfoV1>{
            id: id || data.Key,
            group: this.decodeString(metadata.group),
            name: this.decodeString(metadata.name),
            size: data.ContentLength,
            content_type: data.ContentType,
            create_time: data.LastModified,
            expire_time: data.Expires,
            completed: BooleanConverter.toBoolean(metadata.completed)
        };
    }

    private encodeString(value: string): string {
        if (value == null) return null;
        return querystring.escape(value);
    }

    private decodeString(value: string): string {
        if (value == null) return null;
        return querystring.unescape(value);
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: BlobInfoV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        if (this.matchString(item.group, search))
            return true;
        return false;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        let search = this.encodeString(filter.getAsNullableString('search'));
        let id = filter.getAsNullableString('id');
        let name = this.encodeString(filter.getAsNullableString('name'));
        let group = this.encodeString(filter.getAsNullableString('group'));
        let completed = filter.getAsNullableBoolean('completed');
        let expired = filter.getAsNullableBoolean('expired');
        let fromCreateTime = filter.getAsNullableDateTime('from_create_time');
        let toCreateTime = filter.getAsNullableDateTime('to_create_time');

        let now = new Date();

        return (item: BlobInfoV1) => {
            if (search != null && !this.matchSearch(item, search))
                return false;
            if (id != null && id != item.id)
                return false;
            if (name != null && name != item.name)
                return false;
            if (group != null && group != item.group)
                return false;
            if (completed != null && completed != item.completed)
                return false;
            if (expired != null && expired == true && item.expire_time > now)
                return false;
            if (expired != null && expired == false && item.expire_time <= now)
                return false;
            if (fromCreateTime != null && item.create_time >= fromCreateTime)
                return false;
            if (toCreateTime != null && item.create_time < toCreateTime)
                return false;
            return true;
        };
    }

    public async getBlobsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<BlobInfoV1>> {
        let filterCurl = this.composeFilter(filter);

        paging = paging || new PagingParams();
        let skip = paging.getSkip(0);
        let take = paging.getTake(this._maxPageSize);

        let result: BlobInfoV1[] = [];
        let token = null;
        let completed = false;

        while (completed == false && result.length < take) {
            let params = {
                Bucket: this._bucket,
                ContinuationToken: token,
                MaxKeys: this._maxPageSize
            };

            let data = await this._s3.listObjectsV2(params).promise();

            // Set token to continue
            token = data.ContinuationToken;
            completed = token == null;

            // If nothing is returned then exit
            if (data.Contents == null || data.Contents.length == 0) {
                completed = true;
                continue;
            }

            // Extract ids and retrieve objects
            let blobIds = data.Contents.map(c => c.Key);

            let blobs = await this.getBlobsByIds(correlationId, blobIds);

            // Filter items using provided criteria
            blobs = blobs.filter(filterCurl);

            // Continue if skipped completely
            if (blobs.length <= skip) {
                skip -= blobs.length;
                continue;
            }

            // Truncate by skip number
            if (skip > 0 && blobs.length >= skip) {
                skip = 0;
                blobs = blobs.splice(0, skip);
            }

            // Include items until page is over
            for (let blob of blobs) {
                if (take > 0) {
                    result.push(blob);
                    take--;
                }
            }
        }

        let page = new DataPage<BlobInfoV1>(result, null);

        return page;
    }

    public async getBlobsByIds(correlationId: string, blobIds: string[]): Promise<BlobInfoV1[]> {
        let blobs: BlobInfoV1[] = [];
        for (let blobId of blobIds) {
            let blob = await this.getBlobById(correlationId, blobId);
            if (blob) blobs.push(blob);
        }
        
        return blobs
    }

    public async getBlobById(correlationId: string, blobId: string): Promise<BlobInfoV1> {

        let params = {
            Bucket: this._bucket,
            Key: blobId
        };

        let item = await new Promise<any>((resolve, reject) => {
            this._s3.headObject(
                params,
                (err, data) => {
                    if (err && err.code == "NotFound") err = null;

                    if (err == null && data != null) {
                        let item = this.dataToInfo(blobId, data);
                        resolve(item);
                    } else reject(err);
                }
            );  
        });
        
        return item;
    }

    public async createBlobFromUri(correlationId: string, blob: BlobInfoV1, uri: string): Promise<BlobInfoV1> {

        blob.id = blob.id || IdGenerator.nextLong();
        blob.name = this.normalizeName(blob.name);

        let rs = await BlobsUriProcessorV1.getUriStream(correlationId, blob, uri);

        blob.content_type = blob.content_type || rs.headers['content-type'];
        blob.size = blob.size || rs.headers['content-length'];

        let ws = await this.createBlobFromStream(correlationId, blob);

        await pipelineAsync(rs, ws);

        return blob;
    }

    public async getBlobUriById(correlationId: string, blobId: string): Promise<string> {
        let params = {
            Bucket: this._bucket,
            Key: blobId
        };

        return await this._s3.getSignedUrl('getObject', params).promise();
    }

    public async createBlobFromData(correlationId: string, blob: BlobInfoV1, buffer: any): Promise<BlobInfoV1> {

        blob.id = blob.id || IdGenerator.nextLong();
        blob.group = this.encodeString(blob.group);
        blob.name = this.normalizeName(blob.name);
        blob.name = this.encodeString(blob.name);
        let filename = blob.name || (blob.id + '.dat');

        let params = {
            Bucket: this._bucket,
            Key: blob.id,
            ACL: 'public-read',
            ContentDisposition: 'inline; filename=' + filename,
            ContentType: blob.content_type,
            StorageClass: this._reducedRedundancy ? 'REDUCED_REDUNDANCY' : 'STANDARD',
            Expires: DateTimeConverter.toNullableDateTime(blob.expire_time),
            Metadata: {
                name: blob.name || blob.id,
                group: blob.group || "",
                completed: StringConverter.toString(blob.completed)
            },
            Body: buffer
        };

        let data = await this._s3.upload(params).promise();

        return await this.getBlobById(correlationId, blob.id);
    }

    public async getBlobDataById(correlationId: string, blobId: string): Promise<BlobDataV1> {

        let params = {
            Bucket: this._bucket,
            Key: blobId
        };

        let data = await this._s3.getObject(params);
        let blob = this.dataToInfo(blobId, data);
        let buffer = data != null ? data.Body : null;

        return { blob: blob, buffer: buffer };
    }

    public async createBlobFromStream(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1> {

        blob.id = blob.id || IdGenerator.nextLong();
        blob.group = this.encodeString(blob.group);
        blob.name = this.normalizeName(blob.name);
        blob.name = this.encodeString(blob.name);
        let filename = blob.name || (blob.id + '.dat');

        let ws = stream.PassThrough();

        let params = {
            Bucket: this._bucket,
            Key: blob.id,
            ACL: 'public-read',
            ContentDisposition: 'inline; filename=' + filename,
            ContentType: blob.content_type,
            StorageClass: this._reducedRedundancy ? 'REDUCED_REDUNDANCY' : 'STANDARD',
            Expires: DateTimeConverter.toNullableDateTime(blob.expire_time),
            Metadata: {
                name: blob.name || blob.id,
                group: blob.group || "",
                completed: StringConverter.toString(blob.completed)
            },
            Body: ws
        };

        await this._s3.upload(params).promise();
        
        return await this.getBlobById(correlationId, blob.id)
    }

    public async getBlobStreamById(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        let params = {
            Bucket: this._bucket,
            Key: blobId
        };
        let completed = false;

        let blob = await new Promise<BlobInfoV1>((resolve, reject) => {
            let rs = this._s3.getObject(params, (err, data) => {
                // Avoid double exit which may happen on errors
                if (completed) return;
                completed = true;
                let blob = this.dataToInfo(blobId, data);

                resolve(blob);
            }).createReadStream();

            rs.on('error', (err) => {
                // Hack: ignore error "read after end""
                if (!completed)
                    this._logger.error(correlationId, err, 'Failed to read blob ' + blobId);
            });
        });

        return blob;
    }

    public async updateBlobInfo(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1> {
        blob.group = this.encodeString(blob.group);
        blob.name = this.normalizeName(blob.name);
        blob.name = this.encodeString(blob.name);
        let filename = blob.name || (blob.id + '.dat');

        let params = {
            Bucket: this._bucket,
            Key: blob.id,
            CopySource: this._bucket + '/' + blob.id,
            ACL: 'public-read',
            ContentDisposition: 'inline; filename=' + filename,
            ContentType: blob.content_type,
            StorageClass: this._reducedRedundancy ? 'REDUCED_REDUNDANCY' : 'STANDARD',
            Expires: DateTimeConverter.toNullableDateTime(blob.expire_time),
            Metadata: {
                name: blob.name,
                group: blob.group,
                completed: StringConverter.toString(blob.completed)
            },
            MetadataDirective: "REPLACE"
        };

        blob = await this._s3.copyObject(params).promise();

        return blob;
    }

    public async markBlobsCompleted(correlationId: string, ids: string[]): Promise<void> {
        for (let id of ids) {
            let item = await this.getBlobById(correlationId, id);
            if (item == null || item.completed) {
                continue;
            } else {
                item.completed = true;
                await this.updateBlobInfo(correlationId, item);
            }
        }
    }


    public async deleteBlobById(correlationId: string, blobId: string): Promise<void> {
        let params = {
            Bucket: this._bucket,
            Key: blobId
        };

        await this._s3.deleteObject(params).promise();
    }

    public async deleteBlobsByIds(correlationId: string, blobIds: string[]): Promise<void> {
    
        let params = {
            Bucket: this._bucket,
            Delete: {
                Objects: []
            }
        };

        for (let blobId of blobIds) {
            params.Delete.Objects.push({ Key: blobId });
        }

        await this._s3.deleteObjects(params).promise();
    }

    public async clear(correlationId: string): Promise<void> {
        let params = {
            Bucket: this._bucket,
        };

        let data = await this._s3.listObjects(params).promise();
        if (data.Contents.length == 0) {
            return;
        }

        let delParams = {
            Bucket: this._bucket,
            Delete: {
                Objects: []
            }
        };

        for (let c of data.Contents)
            delParams.Delete.Objects.push({ Key: c.Key })

        await this._s3.deleteObjects(delParams).promise();
    }
}