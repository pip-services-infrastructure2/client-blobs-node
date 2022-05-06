const services = require('../../../src/protos/blobs_v1_grpc_pb');
const messages = require('../../../src/protos/blobs_v1_pb');

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { GrpcClient } from 'pip-services3-grpc-nodex';

import { IBlobsClientV1 } from './IBlobsClientV1';
import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobsDataProcessorV1 } from './BlobsDataProcessorV1';
import { BlobsUriProcessorV1 } from './BlobsUriProcessorV1';
import { BlobsStreamProcessorV1 } from './BlobsStreamProcessorV1';
import { BlobInfoV1 } from './BlobInfoV1';
import { BlobsGrpcConverterV1 } from './BlobsGrpcConverterV1';
import { BlobDataV1 } from './BlobDataV1';

export class BlobsGrpcClientV1 extends GrpcClient
    implements IBlobsClientV1, IBlobsChunkyReaderV1, IBlobsChunkyWriterV1 {
    private _chunkSize: number = 10240;

    constructor(config?: any) {
        super(services.BlobsClient);

        if (config != null)
            this.configure(ConfigParams.fromValue(config));
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._chunkSize = config.getAsLongWithDefault('options.chunk_size', this._chunkSize);
    }

    public async getBlobsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<BlobInfoV1>> {
        let request = new messages.BlobInfoPageRequest();

        BlobsGrpcConverterV1.setMap(request.getFilterMap(), filter);
        request.setPaging(BlobsGrpcConverterV1.fromPagingParams(paging));

        let timing = this.instrument(correlationId, 'blobs.get_blobs_by_filter');

        try {
            let response = await this.call<any>('get_blobs_by_filter', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? BlobsGrpcConverterV1.toBlobInfoPage(response.getPage()) : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }  
    }

    public async getBlobsByIds(correlationId: string, blobIds: string[]): Promise<BlobInfoV1[]> {
        let request = new messages.BlobIdsRequest();
        request.setBlobIdsList(blobIds);

        let timing = this.instrument(correlationId, 'blobs.get_blobs_by_ids');

        try {
            let response = await this.call<any>('get_blobs_by_ids', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? BlobsGrpcConverterV1.toBlobInfos(response.getBlobsList()) : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }         
    }

    public async getBlobById(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        let request = new messages.BlobIdRequest();
        request.setBlobId(blobId);

        let timing = this.instrument(correlationId, 'blobs.get_blob_by_id');

        try {
            let response = await this.call<any>('get_blob_by_id', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async createBlobFromUri(correlationId: string, blob: BlobInfoV1, uri: string): Promise<BlobInfoV1> {
        return await BlobsUriProcessorV1.createBlobFromUri(correlationId, blob, this, uri);
    }

    public async getBlobUriById(correlationId: string, blobId: string): Promise<string> {
        let request = new messages.BlobIdRequest();
        request.setBlobId(blobId);

        let timing = this.instrument(correlationId, 'blobs.get_blob_uri_by_id');

        try {
            let response = await this.call<any>('get_blob_uri_by_id', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? response.getUri() : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public createBlobFromData(correlationId: string, blob: BlobInfoV1, buffer: any): Promise<BlobInfoV1> {
        return BlobsDataProcessorV1.createBlobFromData(correlationId, blob, this, buffer, this._chunkSize);
    }

    public async getBlobDataById(correlationId: string, blobId: string): Promise<BlobDataV1> {
        return await BlobsDataProcessorV1.getBlobDataById(correlationId, blobId, this, this._chunkSize);
    }

    public async createBlobFromStream(correlationId: string, blob: BlobInfoV1, readStream: any): Promise<BlobInfoV1> {
        return await BlobsStreamProcessorV1.createBlobFromStream(correlationId, blob, this, readStream);
    }

    public async getBlobStreamById(correlationId: string, blobId: string, writeStream: any): Promise<any> {
        return await BlobsStreamProcessorV1.getBlobStreamById(correlationId, blobId, this, this._chunkSize, writeStream);
    }

    public async beginBlobWrite(correlationId: string, blob: BlobInfoV1): Promise<string> {
        let blobObj = BlobsGrpcConverterV1.fromBlobInfo(blob);

        let request = new messages.BlobInfoObjectRequest();
        request.setBlob(blobObj);
    
        let timing = this.instrument(correlationId, 'blobs.begin_blob_write');

        try {
            let response = await this.call<any>('begin_blob_write', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? response.getToken() : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async writeBlobChunk(correlationId: string, token: string, chunk: string): Promise<string> {
        let request = new messages.BlobTokenWithChunkRequest();
        request.setToken(token);
        request.setChunk(chunk);
    
        let timing = this.instrument(correlationId, 'blobs.write_blob_chunk');

        try {
            let response = await this.call<any>('write_blob_chunk', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? response.getToken() : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async endBlobWrite(correlationId: string, token: string, chunk: string): Promise<BlobInfoV1> {
        let request = new messages.BlobTokenWithChunkRequest();
        request.setToken(token);
        request.setChunk(chunk);
    
        let timing = this.instrument(correlationId, 'blobs.end_blob_write');

        try {
            let response = await this.call<any>('end_blob_write', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async abortBlobWrite(correlationId: string, token: string): Promise<void> {
        let request = new messages.BlobTokenRequest();
        request.setToken(token);
    
        let timing = this.instrument(correlationId, 'blobs.abort_blob_write');

        try {
            let response = await this.call<any>('abort_blob_write', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }
    
    public async beginBlobRead(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        let request = new messages.BlobIdRequest();
        request.setBlobId(blobId);
    
        let timing = this.instrument(correlationId, 'blobs.begin_blob_read');

        try {
            let response = await this.call<any>('begin_blob_read', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async readBlobChunk(correlationId: string, blobId: string, skip: number, take: number): Promise<string> {
        let request = new messages.BlobReadRequest();
        request.setBlobId(blobId);
        request.setSkip(skip);
        request.setTake(take);
    
        let timing = this.instrument(correlationId, 'blobs.read_blob_chunk');

        try {
            let response = await this.call<any>('read_blob_chunk', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            return response ? response.getChunk() : null
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }
    
    public async endBlobRead(correlationId: string, blobId: string): Promise<void> {
        let request = new messages.BlobIdRequest();
        request.setBlobId(blobId);
    
        let timing = this.instrument(correlationId, 'blobs.end_blob_read');

        try {
            let response = await this.call<any>('end_blob_read', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async updateBlobInfo(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1> {
        let blobObj = BlobsGrpcConverterV1.fromBlobInfo(blob);

        let request = new messages.BlobInfoObjectRequest();
        request.setBlob(blobObj);
    
        let timing = this.instrument(correlationId, 'blobs.update_blob_info');

        try {
            let response = await this.call<any>('update_blob_info', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
            
            return response ? BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null;
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async markBlobsCompleted(correlationId: string, blobIds: string[]): Promise<void> {
        let request = new messages.BlobIdsRequest();
        request.setBlobIdsList(blobIds);
    
        let timing = this.instrument(correlationId, 'blobs.mark_blobs_completed');

        try {
            let response = await this.call<any>('mark_blobs_completed', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async deleteBlobById(correlationId: string, blobId: string): Promise<void> {
        let request = new messages.BlobIdRequest();
        request.setBlobId(blobId);
    
        let timing = this.instrument(correlationId, 'blobs.delete_blob_by_id');

        try {
            let response = await this.call<any>('delete_blob_by_id', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async deleteBlobsByIds(correlationId: string, blobIds: string[]): Promise<void> {
        let request = new messages.BlobIdsRequest();
        request.setBlobIdsList(blobIds);
    
        let timing = this.instrument(correlationId, 'blobs.delete_blobs_by_ids');

        try {
            let response = await this.call<any>('delete_blobs_by_ids', correlationId, request);

            if (response.error != null)
                throw BlobsGrpcConverterV1.toError(response.error);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }
 
}
