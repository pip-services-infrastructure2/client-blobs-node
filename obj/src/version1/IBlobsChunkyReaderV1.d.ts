import { BlobInfoV1 } from './BlobInfoV1';
export interface IBlobsChunkyReaderV1 {
    beginBlobRead(correlationId: string, blobId: string): Promise<BlobInfoV1>;
    readBlobChunk(correlationId: string, blobId: string, skip: number, take: number): Promise<string>;
    endBlobRead(correlationId: string, blobId: string): Promise<void>;
}
