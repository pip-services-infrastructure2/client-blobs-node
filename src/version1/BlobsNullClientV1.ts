const stream = require('stream');

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';

import { BlobInfoV1 } from './BlobInfoV1';
import { IBlobsClientV1 } from './IBlobsClientV1';
import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobDataV1 } from './BlobDataV1';

export class BlobsNullClientV1
    implements IBlobsClientV1, IBlobsChunkyReaderV1, IBlobsChunkyWriterV1 {
    constructor(config?: any) {}

    public async beginBlobWrite(correlationId: string, blob: BlobInfoV1): Promise<string> {
        return null;
    }

    public async endBlobWrite(correlationId: string, token: string, chunk: string): Promise<BlobInfoV1> {
        return null;
    }

    public async abortBlobWrite(correlationId: string, token: string): Promise<void> {
        return null;
    }

    public async beginBlobRead(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        return null;
    }

    public async readBlobChunk(correlationId: string, blobId: string, skip: number, take: number): Promise<string> {
        return null;
    }

    public async endBlobRead(correlationId: string, blobId: string): Promise<void> {
        return null;
    }

    public async getBlobById(correlationId: string, blobId: string): Promise<BlobInfoV1> {
        return null;
    }

    public async createBlobFromUri(correlationId: string, blob: BlobInfoV1, uri: string): Promise<BlobInfoV1> {
        return null;
    }

    public async getBlobUriById(correlationId: string, blobId: string): Promise<string> {
        return null;
    }

    public async createBlobFromData(correlationId: string, blob: BlobInfoV1, buffer: any): Promise<BlobInfoV1> {
        return null;
    }

    public async markBlobsCompleted(correlationId: string, blobIds: string[]): Promise<void> {
        return null;
    }

    public async deleteBlobById(correlationId: string, blobId: string): Promise<void> {
        return null;
    }

    public async deleteBlobsByIds(correlationId: string, blobIds: string[]): Promise<void> {
        return null;
    }
        
    public async getBlobsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<BlobInfoV1>> {
        return new DataPage<BlobInfoV1>([], 0)
    }

    public async getBlobsByIds(correlationId: string, blobIds: string[]): Promise<BlobInfoV1[]> {
        return [];
    }

    public async getBlobDataById(correlationId: string, blobId: string): Promise<BlobDataV1> {
        return {blob: null, buffer: Buffer.alloc(0)};
    }

    public async createBlobFromStream(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1> {
        setTimeout(() => {
            blob
        }, 0);
        return stream.Stream();
    }

    public async getBlobStreamById(correlationId: string, blobId: string): Promise<any> {
        let rs = stream.Readable();
        setTimeout(() => {
            rs.push(null);
        }, 0);
        return rs;
    }

    public async writeBlobChunk(correlationId: string, token: string, chunk: string): Promise<string> {
        return token;
    }

    public async updateBlobInfo(correlationId: string, blob: BlobInfoV1): Promise<BlobInfoV1> {
        return blob;
    }

}
