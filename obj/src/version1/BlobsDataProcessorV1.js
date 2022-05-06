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
exports.BlobsDataProcessorV1 = void 0;
class BlobsDataProcessorV1 {
    static createBlobFromData(correlationId, blob, writer, data, chunkSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = Buffer.from(data);
            let skip = 0;
            let size = buffer.length;
            let token = null;
            try {
                // Start writing when first chunk comes
                token = yield writer.beginBlobWrite(correlationId, blob);
                // Write chunks
                while (size > chunkSize) {
                    let chunk = buffer.toString('base64', skip, skip + chunkSize);
                    token = yield writer.writeBlobChunk(correlationId, token, chunk);
                    skip += chunkSize;
                    size -= chunkSize;
                }
                //End writing
                let chunk = buffer.toString('base64', skip, buffer.length);
                blob = yield writer.endBlobWrite(correlationId, token, chunk);
                token = null;
            }
            catch (err) {
                // Ignore abort error
            }
            finally {
                if (token != null)
                    yield writer.abortBlobWrite(correlationId, token);
            }
            return blob;
        });
    }
    static getBlobDataById(correlationId, blobId, reader, chunkSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let blob;
            let buffer = null;
            // Read blob, start reading
            blob = yield reader.beginBlobRead(correlationId, blobId);
            if (blob != null)
                buffer = Buffer.alloc(0);
            // Read all chunks until the end
            let skip = 0;
            let size = blob.size;
            while (size > 0) {
                let take = Math.min(chunkSize, size);
                let chunk = yield reader.readBlobChunk(correlationId, blobId, skip, take);
                let data = Buffer.from(chunk, 'base64');
                buffer = Buffer.concat([buffer, data]);
                size -= data.length;
                skip += data.length;
            }
            // End reading
            yield reader.endBlobRead(correlationId, blobId);
            return { blob: blob, buffer: buffer };
        });
    }
}
exports.BlobsDataProcessorV1 = BlobsDataProcessorV1;
//# sourceMappingURL=BlobsDataProcessorV1.js.map