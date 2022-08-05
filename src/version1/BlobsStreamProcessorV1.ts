// Constructing finished from stream
const { pipeline } = require('stream');
// Constructing promisify from
const { promisify } = require('util');
// Defining pipelineAsync method
const pipelineAsync = promisify(pipeline);
const stream = require('stream');

import { IBlobsChunkyReaderV1 } from './IBlobsChunkyReaderV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobInfoV1 } from './BlobInfoV1';

export class BlobsStreamProcessorV1 {

    public static async createBlobFromStream(correlationId: string, blob: BlobInfoV1, 
        writer: IBlobsChunkyWriterV1, readStream: any): Promise<BlobInfoV1> {

        let token: string = null;
        let error: any = null;
        let ws = stream.Writable();
        let promiseBlob: Promise<BlobInfoV1>;
        
        ws._write = async (chunk: any, enc: BufferEncoding, next: (err: any) => void) => {
            let err: Error;
            try {
                let buffer = chunk != null ? Buffer.from(chunk, enc) : null;

                // Start writing when first chunk comes
                if (token == null) {
                    token = await writer.beginBlobWrite(correlationId, blob);
                }

                // Write chunks
                chunk = buffer.toString('base64');
                let tok = await writer.writeBlobChunk(correlationId, token, chunk);
                token = tok || token;
            } catch(ex) {
                err = ex;
            }

            next(err);
        };

        
        let close = () => {
            if (error) throw error;
            if (token == null) return;
            promiseBlob = writer.endBlobWrite(correlationId, token, ' ');
            token = null;
        }

        ws.on('end', close);
        ws.on('finish', close);

        // Abort writing blob
        ws.on('error', async (err) => {
            error = err;

            if (token == null) return;

            try {
                await writer.abortBlobWrite(correlationId, token);
            } catch {
                // Ignore abort error
            }
            
            token = null;
        });

        await pipelineAsync(readStream, ws);

        return await promiseBlob;
    }

    public static async getBlobStreamById(correlationId: string, blobId: string,
        reader: IBlobsChunkyReaderV1, chunkSize: number, writeStream: any): Promise<BlobInfoV1> {
        
        let rs = stream.Readable();
        let blob: BlobInfoV1;
        let skip = 0;
        let size = 0;
        let closed = false;

        rs._read = async (sz: number) => {
            try {
                // Read blob, start reading
                if (blob == null) {
                    let data = await reader.beginBlobRead(correlationId, blobId);
                    blob = data;
                    size = blob != null ? blob.size : 0;
                    skip = 0;
                }

                // Read all chunks until the end
                if (size != 0) {
                    let take = Math.min(chunkSize, size);
                    let chunk = await reader.readBlobChunk(
                        correlationId, blobId, skip, take,
                    );

                    let buffer = Buffer.from(chunk, 'base64');
                    size -= buffer.length;
                    skip += buffer.length;
                    rs.push(buffer);
                }

                // End reading
                if (!(size > 0 && !closed)) {
                    await reader.endBlobRead(correlationId, blobId);
                    closed = true;
                    rs.push(null);
                }
            } catch(err) {
                rs.emit('error', err);
            }
        };

        let close = (err) => {
            if (err) throw err;
            // Postpone final callback until cache is processed
            setTimeout(() => {
                blob;
            }, 0);
        };

        rs.on('end', close);
        rs.on('finish', close);

        // Abort writing blob
        rs.on('error', (err) => {
            if (err) throw err;
        });

        await pipelineAsync(rs, writeStream);

        return blob;
    }
}