import { DataPage } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { BlobInfoV1 } from './BlobInfoV1';

export interface IBlobsClientV1 {
    getBlobsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<BlobInfoV1>>;
    getBlobsByIds(correlationId: string, blobIds: string[]): Promise<BlobInfoV1[]>;
    getBlobById(correlationId: string, blobId: string): Promise<BlobInfoV1>;

    createBlobFromUri(correlationId: string, blob: BlobInfoV1, uri: string): Promise<BlobInfoV1>;
    getBlobUriById(correlationId: string, blobId: string): Promise<string>;

    createBlobFromData(correlationId: string, blob: BlobInfoV1, buffer: any): Promise<BlobInfoV1>;
    getBlobDataById(correlationId: string, blobId: string): Promise<any>;

    createBlobFromStream(correlationId: string, blob: BlobInfoV1, readStream: any): Promise<BlobInfoV1>;
    getBlobStreamById(correlationId: string, blobId: string, writeStream: any): Promise<any>;

    updateBlobInfo(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1>;
    markBlobsCompleted(correlationId: string, blobIds: string[]): Promise<void>;

    deleteBlobById(correlationId: string, blobId: string): Promise<void>;

    deleteBlobsByIds(correlationId: string, blobIds: string[]): Promise<void>;
}
