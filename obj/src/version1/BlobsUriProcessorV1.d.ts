import { BlobInfoV1 } from './BlobInfoV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
export declare class BlobsUriProcessorV1 {
    static getUriStream(correlationId: string, blob: BlobInfoV1, uri: string): Promise<any>;
    static createBlobFromUri(correlationId: string, blob: BlobInfoV1, writer: IBlobsChunkyWriterV1, uri: string): Promise<BlobInfoV1>;
}
