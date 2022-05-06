"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobsStreamProcessorV1 = void 0;
// Constructing finished from stream
const { pipeline } = require('stream');
// Constructing promisify from
const { promisify } = require('util');
// Defining pipelineAsync method
const pipelineAsync = promisify(pipeline);
const stream = require('stream');
class BlobsStreamProcessorV1 {
    static createBlobFromStream(correlationId, blob, writer, readStream) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = null;
            let error = null;
            let ws = stream.Writable();
            let promiseBlob;
            ws._write = (chunk, enc, next) => __awaiter(this, void 0, void 0, function* () {
                let err;
                try {
                    let buffer = chunk != null ? Buffer.from(chunk, enc) : null;
                    // Start writing when first chunk comes
                    if (token == null) {
                        token = yield writer.beginBlobWrite(correlationId, blob);
                    }
                    // Write chunks
                    chunk = buffer.toString('base64');
                    let tok = yield writer.writeBlobChunk(correlationId, token, chunk);
                    token = tok || token;
                }
                catch (ex) {
                    err = ex;
                }
                next(err);
            });
            let close = () => {
                if (error)
                    throw error;
                if (token == null)
                    return;
                promiseBlob = writer.endBlobWrite(correlationId, token, ' ');
                token = null;
            };
            ws.on('end', close);
            ws.on('finish', close);
            // Abort writing blob
            ws.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                error = err;
                if (token == null)
                    return;
                try {
                    yield writer.abortBlobWrite(correlationId, token);
                }
                catch (_a) {
                    // Ignore abort error
                }
                token = null;
            }));
            yield pipelineAsync(readStream, ws);
            return yield promiseBlob;
        });
    }
    static getBlobStreamById(correlationId, blobId, reader, chunkSize, writeStream) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs = stream.Readable();
            let blob;
            let skip = 0;
            let size = 0;
            let closed = false;
            rs._read = (sz) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Read blob, start reading
                    if (blob == null) {
                        let data = yield reader.beginBlobRead(correlationId, blobId);
                        blob = data;
                        size = blob != null ? blob.size : 0;
                        skip = 0;
                    }
                    // Read all chunks until the end
                    if (size != 0) {
                        let take = Math.min(chunkSize, size);
                        let chunk = yield reader.readBlobChunk(correlationId, blobId, skip, take);
                        let buffer = Buffer.from(chunk, 'base64');
                        size -= buffer.length;
                        skip += buffer.length;
                        rs.push(buffer);
                    }
                    // End reading
                    if (!(size > 0 && !closed)) {
                        yield reader.endBlobRead(correlationId, blobId);
                        closed = true;
                        rs.push(null);
                    }
                }
                catch (err) {
                    rs.emit('error', err);
                }
            });
            let close = (err) => {
                if (err)
                    throw err;
                // Postpone final callback until cache is processed
                setTimeout(() => {
                    blob;
                }, 0);
            };
            rs.on('end', close);
            rs.on('finish', close);
            // Abort writing blob
            rs.on('error', (err) => {
                if (err)
                    throw err;
            });
            yield pipelineAsync(rs, writeStream);
            return blob;
        });
    }
}
exports.BlobsStreamProcessorV1 = BlobsStreamProcessorV1;
//# sourceMappingURL=BlobsStreamProcessorV1.js.map