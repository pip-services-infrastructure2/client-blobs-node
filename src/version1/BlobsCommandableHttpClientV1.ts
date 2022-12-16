import { ConfigParams } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { CommandableHttpClient } from 'pip-services3-rpc-nodex';

import { BlobInfoV1 } from './BlobInfoV1';
import { IBlobsClientV1 } from './IBlobsClientV1';
import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobsDataProcessorV1 } from './BlobsDataProcessorV1';
import { BlobsUriProcessorV1 } from './BlobsUriProcessorV1';
import { BlobsStreamProcessorV1 } from './BlobsStreamProcessorV1';
import { BlobDataV1 } from './BlobDataV1';

export class BlobsCommandableHttpClientV1 extends CommandableHttpClient
    implements IBlobsClientV1, IBlobsChunkyReaderV1, IBlobsChunkyWriterV1 {
    private _chunkSize: number = 10240;

    constructor(config?: any) {
        super('v1/blobs');

        if (config != null)
            this.configure(ConfigParams.fromValue(config));
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._chunkSize = config.getAsLongWithDefault('options.chunk_size', this._chunkSize);
    }

    public async getBlobsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<BlobInfoV1>> {
        return await this.callCommand(
            'get_blobs_by_filter',
            correlationId,
            {
                filter: filter,
                paging: paging
            }
        );
    }

    public async getBlobsByIds(correlationId: string, blobIds: string[]): Promise<BlobInfoV1[]> {
        return await this.callCommand(
            'get_blobs_by_ids',
            correlationId,
            {
                blob_ids: blobIds
            }
        );
    }

    public async getBlobById(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        return await this.callCommand(
            'get_blob_by_id',
            correlationId,
            {
                blob_id: blobId
            }
        );
    }

    public async createBlobFromUri(correlationId: string, blob: BlobInfoV1, uri: string): Promise<BlobInfoV1> {
        return await BlobsUriProcessorV1.createBlobFromUri(correlationId, blob, this, uri);
    }

    public async getBlobUriById(correlationId: string, blobId: string): Promise<string> {
        return await this.callCommand(
            'get_blob_uri_by_id',
            correlationId,
            {
                blob_id: blobId
            }
        );
    }

    public async createBlobFromData(correlationId: string, blob: BlobInfoV1, buffer: any): Promise<BlobInfoV1> {
        return await BlobsDataProcessorV1.createBlobFromData(correlationId, blob, this, buffer, this._chunkSize);
    }

    public async getBlobDataById(correlationId: string, blobId: string): Promise<BlobDataV1> {
        return await BlobsDataProcessorV1.getBlobDataById(correlationId, blobId, this, this._chunkSize);
    }

    public async createBlobFromStream(correlationId: string, blob: BlobInfoV1, readStream: any): Promise<BlobInfoV1> {
        return BlobsStreamProcessorV1.createBlobFromStream(correlationId, blob, this, readStream);
    }

    public async getBlobStreamById(correlationId: string, blobId: string, writeStream: any): Promise<any> {
        return await BlobsStreamProcessorV1.getBlobStreamById(correlationId, blobId, this, this._chunkSize, writeStream);
    }

    public async beginBlobWrite(correlationId: string, blob: BlobInfoV1): Promise<string> {
        return await this.callCommand(
            'begin_blob_write',
            correlationId,
            {
                blob: blob
            }
        );
    }

    public async writeBlobChunk(correlationId: string, token: string, chunk: string): Promise<string> {
        return await this.callCommand(
            'write_blob_chunk',
            correlationId,
            {
                token: token,
                chunk: chunk
            }
        );
    }

    public async endBlobWrite(correlationId: string, token: string, chunk: string): Promise<BlobInfoV1> {
        return await this.callCommand(
            'end_blob_write',
            correlationId,
            {
                token: token,
                chunk: chunk
            }
        );
    }

    public async abortBlobWrite(correlationId: string, token: string): Promise<void> {
        return await this.callCommand(
            'abort_blob_write',
            correlationId,
            {
                token: token
            }
        );
    }
    
    public async beginBlobRead(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        return await this.callCommand(
            'begin_blob_read',
            correlationId,
            {
                blob_id: blobId
            }
        );
    }

    public async readBlobChunk(correlationId: string, blobId: string, skip: number, take: number): Promise<string> {
        return await this.callCommand(
            'read_blob_chunk',
            correlationId,
            {
                blob_id: blobId,
                skip: skip,
                take: take
            }
        );
    }
    
    public async endBlobRead(correlationId: string, blobId: string): Promise<void> {
        return await this.callCommand(
            'end_blob_read',
            correlationId,
            {
                blob_id: blobId
            }
        );
    }

    public async updateBlobInfo(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1> {
        return await this.callCommand(
            'update_blob_info',
            correlationId,
            {
                blob: blob
            }
        );
    }

    public async markBlobsCompleted(correlationId: string, blobIds: string[]): Promise<void> {
        return await this.callCommand(
            'mark_blobs_completed',
            correlationId,
            {
                blobIds: blobIds
            }
        );
    }

    public async deleteBlobById(correlationId: string, blobId: string): Promise<void> {
        return await this.callCommand(
            'delete_blob_by_id',
            correlationId,
            {
                blob_id: blobId
            }
        );
    }

    public async deleteBlobsByIds(correlationId: string, blobIds: string[]): Promise<void> {
        return await this.callCommand(
            'delete_blobs_by_ids',
            correlationId,
            {
                blob_ids: blobIds
            }
        );
    }

}
