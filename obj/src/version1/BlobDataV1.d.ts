/// <reference types="node" />
import { BlobInfoV1 } from "service-blobs-node";
export declare class BlobDataV1 {
    constructor(blob: BlobInfoV1, buffer: Buffer);
    blob: BlobInfoV1;
    buffer: Buffer;
}
