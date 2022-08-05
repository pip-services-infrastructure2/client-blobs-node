import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobInfoV1 } from './BlobInfoV1';
export declare class BlobsStreamProcessorV1 {
    static createBlobFromStream(correlationId: string, blob: BlobInfoV1, writer: IBlobsChunkyWriterV1, readStream: any): Promise<BlobInfoV1>;
    static getBlobStreamById(correlationId: string, blobId: string, reader: IBlobsChunkyReaderV1, chunkSize: number, writeStream: any): Promise<BlobInfoV1>;
}
