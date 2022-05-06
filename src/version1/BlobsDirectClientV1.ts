import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams} from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { DirectClient } from 'pip-services3-rpc-nodex';

import { BlobInfoV1 } from './BlobInfoV1';
import { IBlobsClientV1 } from './IBlobsClientV1';
import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobsUriProcessorV1 } from './BlobsUriProcessorV1';
import { BlobsDataProcessorV1 } from './BlobsDataProcessorV1';
import { BlobsStreamProcessorV1 } from './BlobsStreamProcessorV1';
import { BlobDataV1 } from './BlobDataV1';
//import { IBlobsController } from 'service-blobs-node';

export class BlobsDirectClientV1 extends DirectClient<any>
    implements IBlobsClientV1, IBlobsChunkyReaderV1, IBlobsChunkyWriterV1 {
    private _chunkSize: number = 10240;
            
    public constructor(config?: any) {
        super();
        this._dependencyResolver.put('controller', new Descriptor("service-blobs", "controller", "*", "*", "*"))

        if (config != null)
            this.configure(ConfigParams.fromValue(config));
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._chunkSize = config.getAsLongWithDefault('options.chunk_size', this._chunkSize);
    }

    public async getBlobsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<BlobInfoV1>> {
        return await this._controller.getBlobsByFilter(correlationId, filter, paging);
    }

    public async getBlobsByIds(correlationId: string, blobIds: string[]): Promise<BlobInfoV1[]> {
        return await this._controller.getBlobsByIds(correlationId, blobIds);
    }

    public async getBlobById(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        return await this._controller.getBlobById(correlationId, blobId);
    }

    public async createBlobFromUri(correlationId: string, blob: BlobInfoV1, uri: string): Promise<BlobInfoV1> {
        return await BlobsUriProcessorV1.createBlobFromUri(correlationId, blob, this, uri);
    }

    public async getBlobUriById(correlationId: string, blobId: string): Promise<string> {
        return await this._controller.getBlobUriById(correlationId, blobId);
    }

    public async createBlobFromData(correlationId: string, blob: BlobInfoV1, buffer: any): Promise<BlobInfoV1> {
        return await BlobsDataProcessorV1.createBlobFromData(correlationId, blob, this, buffer, this._chunkSize);
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
        return await this._controller.beginBlobWrite(correlationId, blob);
    }

    public async writeBlobChunk(correlationId: string, token: string, chunk: string): Promise<string> {
        return await this._controller.writeBlobChunk(correlationId, token, chunk);
    }

    public async endBlobWrite(correlationId: string, token: string, chunk: string): Promise<BlobInfoV1> {
        return await this._controller.endBlobWrite(correlationId, token, chunk);
    }

    public async abortBlobWrite(correlationId: string, token: string): Promise<void> {
        await this._controller.abortBlobWrite(correlationId, token);
    }
    
    public async beginBlobRead(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        return await this._controller.beginBlobRead(correlationId, blobId);
    }

    public async readBlobChunk(correlationId: string, blobId: string, skip: number, take: number): Promise<string> {
        return await this._controller.readBlobChunk(correlationId, blobId, skip, take);
    }
    
    public async endBlobRead(correlationId: string, blobId: string): Promise<void> {
        await this._controller.endBlobRead(correlationId, blobId);
    }

    public async updateBlobInfo(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1> {
        return await this._controller.updateBlobInfo(correlationId, blob);
    }

    public async markBlobsCompleted(correlationId: string, blobIds: string[]): Promise<void> {
        await this._controller.markBlobsCompleted(correlationId, blobIds);
    }

    public async deleteBlobById(correlationId: string, blobId: string): Promise<void> {
        await this._controller.deleteBlobById(correlationId, blobId);
    }

    public async deleteBlobsByIds(correlationId: string, blobIds: string[]): Promise<void> {
        await this._controller.deleteBlobsByIds(correlationId, blobIds);
    }

}