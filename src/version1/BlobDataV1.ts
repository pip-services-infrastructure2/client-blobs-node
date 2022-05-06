import { BlobInfoV1 } from "service-blobs-node";

export class BlobDataV1 {

    public constructor(blob: BlobInfoV1, buffer: Buffer) {
        this.blob = blob;
        this.buffer = buffer;
    }

    public blob: BlobInfoV1; // blob  object
    public buffer: Buffer; // binary data
}