import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobInfoV1 } from './BlobInfoV1';
import { BlobDataV1 } from './BlobDataV1';

export class BlobsDataProcessorV1 {

    public static async createBlobFromData(correlationId: string, blob: BlobInfoV1,
        writer: IBlobsChunkyWriterV1, data: any, chunkSize: number): Promise<BlobInfoV1> {
        
        let buffer = Buffer.from(data);
        let skip = 0;
        let size = buffer.length;
        let token: string = null;
        
        try {
            // Start writing when first chunk comes
            token = await writer.beginBlobWrite(correlationId, blob);

            // Write chunks
            while (size > chunkSize) {
                let chunk = buffer.toString('base64', skip, skip + chunkSize);
                token = await writer.writeBlobChunk(correlationId, token, chunk);
                skip += chunkSize;
                size -= chunkSize;
            }

            //End writing
            let chunk = buffer.toString('base64', skip, buffer.length);
            blob = await writer.endBlobWrite(correlationId, token, chunk);
            token = null;
        } catch(err) {
            // Ignore abort error
        } finally {
            if (token != null)
                await writer.abortBlobWrite(correlationId, token);
        }

        return blob;
    }

    public static async getBlobDataById(correlationId: string, blobId: string,
        reader: IBlobsChunkyReaderV1, chunkSize: number): Promise<BlobDataV1> {
        
        let blob: BlobInfoV1;
        let buffer: any = null;

        // Read blob, start reading
        blob = await reader.beginBlobRead(correlationId, blobId);

        if (blob != null) buffer = Buffer.alloc(0);
        
        // Read all chunks until the end
        let skip = 0;
        let size = blob.size;
        while (size > 0) {
            let take = Math.min(chunkSize, size);
            let chunk = await reader.readBlobChunk(correlationId, blobId, skip, take);
            let data = Buffer.from(chunk, 'base64');
            buffer = Buffer.concat([buffer, data]);
            size -= data.length;
            skip += data.length;
        }

        // End reading
        await reader.endBlobRead(correlationId, blobId);

        return { blob: blob, buffer: buffer };
    }
}