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
exports.BlobsNullClientV1 = void 0;
const stream = require('stream');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class BlobsNullClientV1 {
    constructor(config) { }
    beginBlobWrite(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    endBlobWrite(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    abortBlobWrite(correlationId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    beginBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    readBlobChunk(correlationId, blobId, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    endBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    createBlobFromUri(correlationId, blob, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getBlobUriById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    createBlobFromData(correlationId, blob, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    markBlobsCompleted(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    deleteBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    deleteBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getBlobsByFilter(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return new pip_services3_commons_nodex_1.DataPage([], 0);
        });
    }
    getBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getBlobDataById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return { blob: null, buffer: Buffer.alloc(0) };
        });
    }
    createBlobFromStream(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => {
                blob;
            }, 0);
            return stream.Stream();
        });
    }
    getBlobStreamById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs = stream.Readable();
            setTimeout(() => {
                rs.push(null);
            }, 0);
            return rs;
        });
    }
    writeBlobChunk(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            return token;
        });
    }
    updateBlobInfo(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return blob;
        });
    }
}
exports.BlobsNullClientV1 = BlobsNullClientV1;
//# sourceMappingURL=BlobsNullClientV1.js.map