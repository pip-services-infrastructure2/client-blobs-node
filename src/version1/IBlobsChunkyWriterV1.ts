import { BlobInfoV1 } from './BlobInfoV1';

export interface IBlobsChunkyWriterV1 {
    beginBlobWrite(correlationId: string, blob: BlobInfoV1): Promise<string>;
    writeBlobChunk(correlationId: string, token: string, chunk: string): Promise<string>;
    endBlobWrite(correlationId: string, token: string, chunk: string): Promise<BlobInfoV1>;
    abortBlobWrite(correlationId: string, token: string): Promise<void>;
}
