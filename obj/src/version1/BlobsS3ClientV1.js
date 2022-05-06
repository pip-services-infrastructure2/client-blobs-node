"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobsS3ClientV1 = void 0;
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);
const stream = require('stream');
const querystring = require('querystring');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_components_nodex_2 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
const pip_services3_aws_nodex_1 = require("pip-services3-aws-nodex");
const BlobsUriProcessorV1_1 = require("./BlobsUriProcessorV1");
class BlobsS3ClientV1 {
    constructor(config) {
        this._opened = false;
        this._connectTimeout = 30000;
        this._minChunkSize = 5 * 1024 * 1024;
        this._maxBlobSize = 100 * 1024;
        this._reducedRedundancy = true;
        this._maxPageSize = 100;
        this._connectionResolver = new pip_services3_aws_nodex_1.AwsConnectionResolver();
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._counters = new pip_services3_components_nodex_2.CompositeCounters();
        if (config != null)
            this.configure(pip_services3_commons_nodex_1.ConfigParams.fromValue(config));
    }
    configure(config) {
        this._connectionResolver.configure(config);
        this._minChunkSize = config.getAsLongWithDefault('options.min_chunk_size', this._minChunkSize);
        this._maxBlobSize = config.getAsLongWithDefault('options.max_blob_size', this._maxBlobSize);
        this._reducedRedundancy = config.getAsBooleanWithDefault('options.reduced_redundancy', this._reducedRedundancy);
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
        this._connectTimeout = config.getAsIntegerWithDefault("options.connect_timeout", this._connectTimeout);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    isOpen() {
        return this._opened;
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen()) {
                return;
            }
            this._connection = yield this._connectionResolver.resolve(correlationId);
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
        });
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._opened = false;
        });
    }
    normalizeName(name) {
        if (name == null)
            return null;
        name = name.replace('\\', '/');
        let pos = name.lastIndexOf('/');
        if (pos >= 0)
            name = name.substring(pos + 1);
        return name;
    }
    dataToInfo(id, data) {
        if (data == null)
            return null;
        let metadata = data.Metadata;
        return {
            id: id || data.Key,
            group: this.decodeString(metadata.group),
            name: this.decodeString(metadata.name),
            size: data.ContentLength,
            content_type: data.ContentType,
            create_time: data.LastModified,
            expire_time: data.Expires,
            completed: pip_services3_commons_nodex_4.BooleanConverter.toBoolean(metadata.completed)
        };
    }
    encodeString(value) {
        if (value == null)
            return null;
        return querystring.escape(value);
    }
    decodeString(value) {
        if (value == null)
            return null;
        return querystring.unescape(value);
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        if (this.matchString(item.group, search))
            return true;
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_6.FilterParams();
        let search = this.encodeString(filter.getAsNullableString('search'));
        let id = filter.getAsNullableString('id');
        let name = this.encodeString(filter.getAsNullableString('name'));
        let group = this.encodeString(filter.getAsNullableString('group'));
        let completed = filter.getAsNullableBoolean('completed');
        let expired = filter.getAsNullableBoolean('expired');
        let fromCreateTime = filter.getAsNullableDateTime('from_create_time');
        let toCreateTime = filter.getAsNullableDateTime('to_create_time');
        let now = new Date();
        return (item) => {
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
    getBlobsByFilter(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterCurl = this.composeFilter(filter);
            paging = paging || new pip_services3_commons_nodex_7.PagingParams();
            let skip = paging.getSkip(0);
            let take = paging.getTake(this._maxPageSize);
            let result = [];
            let token = null;
            let completed = false;
            while (completed == false && result.length < take) {
                let params = {
                    Bucket: this._bucket,
                    ContinuationToken: token,
                    MaxKeys: this._maxPageSize
                };
                let data = yield this._s3.listObjectsV2(params).promise();
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
                let blobs = yield this.getBlobsByIds(correlationId, blobIds);
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
            let page = new pip_services3_commons_nodex_8.DataPage(result, null);
            return page;
        });
    }
    getBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let blobs = [];
            for (let blobId of blobIds) {
                let blob = yield this.getBlobById(correlationId, blobId);
                if (blob)
                    blobs.push(blob);
            }
            return blobs;
        });
    }
    getBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                Bucket: this._bucket,
                Key: blobId
            };
            let item = yield new Promise((resolve, reject) => {
                this._s3.headObject(params, (err, data) => {
                    if (err && err.code == "NotFound")
                        err = null;
                    if (err == null && data != null) {
                        let item = this.dataToInfo(blobId, data);
                        resolve(item);
                    }
                    else
                        reject(err);
                });
            });
            return item;
        });
    }
    createBlobFromUri(correlationId, blob, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            blob.id = blob.id || pip_services3_commons_nodex_2.IdGenerator.nextLong();
            blob.name = this.normalizeName(blob.name);
            let rs = yield BlobsUriProcessorV1_1.BlobsUriProcessorV1.getUriStream(correlationId, blob, uri);
            blob.content_type = blob.content_type || rs.headers['content-type'];
            blob.size = blob.size || rs.headers['content-length'];
            let ws = yield this.createBlobFromStream(correlationId, blob);
            yield pipelineAsync(rs, ws);
            return blob;
        });
    }
    getBlobUriById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                Bucket: this._bucket,
                Key: blobId
            };
            return yield this._s3.getSignedUrl('getObject', params).promise();
        });
    }
    createBlobFromData(correlationId, blob, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            blob.id = blob.id || pip_services3_commons_nodex_2.IdGenerator.nextLong();
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
                Expires: pip_services3_commons_nodex_5.DateTimeConverter.toNullableDateTime(blob.expire_time),
                Metadata: {
                    name: blob.name || blob.id,
                    group: blob.group || "",
                    completed: pip_services3_commons_nodex_3.StringConverter.toString(blob.completed)
                },
                Body: buffer
            };
            let data = yield this._s3.upload(params).promise();
            return yield this.getBlobById(correlationId, blob.id);
        });
    }
    getBlobDataById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                Bucket: this._bucket,
                Key: blobId
            };
            let data = yield this._s3.getObject(params);
            let blob = this.dataToInfo(blobId, data);
            let buffer = data != null ? data.Body : null;
            return { blob: blob, buffer: buffer };
        });
    }
    createBlobFromStream(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            blob.id = blob.id || pip_services3_commons_nodex_2.IdGenerator.nextLong();
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
                Expires: pip_services3_commons_nodex_5.DateTimeConverter.toNullableDateTime(blob.expire_time),
                Metadata: {
                    name: blob.name || blob.id,
                    group: blob.group || "",
                    completed: pip_services3_commons_nodex_3.StringConverter.toString(blob.completed)
                },
                Body: ws
            };
            yield this._s3.upload(params).promise();
            return yield this.getBlobById(correlationId, blob.id);
        });
    }
    getBlobStreamById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                Bucket: this._bucket,
                Key: blobId
            };
            let completed = false;
            let blob = yield new Promise((resolve, reject) => {
                let rs = this._s3.getObject(params, (err, data) => {
                    // Avoid double exit which may happen on errors
                    if (completed)
                        return;
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
        });
    }
    updateBlobInfo(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
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
                Expires: pip_services3_commons_nodex_5.DateTimeConverter.toNullableDateTime(blob.expire_time),
                Metadata: {
                    name: blob.name,
                    group: blob.group,
                    completed: pip_services3_commons_nodex_3.StringConverter.toString(blob.completed)
                },
                MetadataDirective: "REPLACE"
            };
            blob = yield this._s3.copyObject(params).promise();
            return blob;
        });
    }
    markBlobsCompleted(correlationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let id of ids) {
                let item = yield this.getBlobById(correlationId, id);
                if (item == null || item.completed) {
                    continue;
                }
                else {
                    item.completed = true;
                    yield this.updateBlobInfo(correlationId, item);
                }
            }
        });
    }
    deleteBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                Bucket: this._bucket,
                Key: blobId
            };
            yield this._s3.deleteObject(params).promise();
        });
    }
    deleteBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                Bucket: this._bucket,
                Delete: {
                    Objects: []
                }
            };
            for (let blobId of blobIds) {
                params.Delete.Objects.push({ Key: blobId });
            }
            yield this._s3.deleteObjects(params).promise();
        });
    }
    clear(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                Bucket: this._bucket,
            };
            let data = yield this._s3.listObjects(params).promise();
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
                delParams.Delete.Objects.push({ Key: c.Key });
            yield this._s3.deleteObjects(delParams).promise();
        });
    }
}
exports.BlobsS3ClientV1 = BlobsS3ClientV1;
//# sourceMappingURL=BlobsS3ClientV1.js.map