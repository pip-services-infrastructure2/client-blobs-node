import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { BlobInfoV1 } from './BlobInfoV1';
import { IBlobsClientV1 } from './IBlobsClientV1';
import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobDataV1 } from './BlobDataV1';
export declare class BlobsNullClientV1 implements IBlobsClientV1, IBlobsChunkyReaderV1, IBlobsChunkyWriterV1 {
    constructor(config?: any);
    beginBlobWrite(correlationId: string, blob: BlobInfoV1): Promise<string>;
    endBlobWrite(correlationId: string, token: string, chunk: string): Promise<BlobInfoV1>;
    abortBlobWrite(correlationId: string, token: string): Promise<void>;
    beginBlobRead(correlationId: string, blobId: string): Promise<BlobInfoV1>;
    readBlobChunk(correlationId: string, blobId: string, skip: number, take: number): Promise<string>;
    endBlobRead(correlationId: string, blobId: string): Promise<void>;
    getBlobById(correlationId: string, blobId: string): Promise<BlobInfoV1>;
    createBlobFromUri(correlationId: string, blob: BlobInfoV1, uri: string): Promise<BlobInfoV1>;
    getBlobUriById(correlationId: string, blobId: string): Promise<string>;
    createBlobFromData(correlationId: string, blob: BlobInfoV1, buffer: any): Promise<BlobInfoV1>;
    markBlobsCompleted(correlationId: string, blobIds: string[]): Promise<void>;
    deleteBlobById(correlationId: string, blobId: string): Promise<void>;
    deleteBlobsByIds(correlationId: string, blobIds: string[]): Promise<void>;
    getBlobsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<BlobInfoV1>>;
    getBlobsByIds(correlationId: string, blobIds: string[]): Promise<BlobInfoV1[]>;
    getBlobDataById(correlationId: string, blobId: string): Promise<BlobDataV1>;
    createBlobFromStream(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1>;
    getBlobStreamById(correlationId: string, blobId: string): Promise<any>;
    writeBlobChunk(correlationId: string, token: string, chunk: string): Promise<string>;
    updateBlobInfo(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1>;
}
