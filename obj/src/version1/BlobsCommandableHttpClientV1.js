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
exports.BlobsCommandableHttpClientV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const BlobsDataProcessorV1_1 = require("./BlobsDataProcessorV1");
const BlobsUriProcessorV1_1 = require("./BlobsUriProcessorV1");
const BlobsStreamProcessorV1_1 = require("./BlobsStreamProcessorV1");
class BlobsCommandableHttpClientV1 extends pip_services3_rpc_nodex_1.CommandableHttpClient {
    constructor(config) {
        super('v1/blobs');
        this._chunkSize = 10240;
        if (config != null)
            this.configure(pip_services3_commons_nodex_1.ConfigParams.fromValue(config));
    }
    configure(config) {
        super.configure(config);
        this._chunkSize = config.getAsLongWithDefault('options.chunk_size', this._chunkSize);
    }
    getBlobsByFilter(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('get_blobs_by_filter', correlationId, {
                filter: filter,
                paging: paging
            });
        });
    }
    getBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('get_blobs_by_ids', correlationId, {
                blob_ids: blobIds
            });
        });
    }
    getBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('get_blob_by_id', correlationId, {
                blob_id: blobId
            });
        });
    }
    createBlobFromUri(correlationId, blob, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlobsUriProcessorV1_1.BlobsUriProcessorV1.createBlobFromUri(correlationId, blob, this, uri);
        });
    }
    getBlobUriById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('get_blob_uri_by_id', correlationId, {
                blob_id: blobId
            });
        });
    }
    createBlobFromData(correlationId, blob, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlobsDataProcessorV1_1.BlobsDataProcessorV1.createBlobFromData(correlationId, blob, this, buffer, this._chunkSize);
        });
    }
    getBlobDataById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlobsDataProcessorV1_1.BlobsDataProcessorV1.getBlobDataById(correlationId, blobId, this, this._chunkSize);
        });
    }
    createBlobFromStream(correlationId, blob, readStream) {
        return __awaiter(this, void 0, void 0, function* () {
            return BlobsStreamProcessorV1_1.BlobsStreamProcessorV1.createBlobFromStream(correlationId, blob, this, readStream);
        });
    }
    getBlobStreamById(correlationId, blobId, writeStream) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlobsStreamProcessorV1_1.BlobsStreamProcessorV1.getBlobStreamById(correlationId, blobId, this, this._chunkSize, writeStream);
        });
    }
    beginBlobWrite(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('begin_blob_write', correlationId, {
                blob: blob
            });
        });
    }
    writeBlobChunk(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('write_blob_chunk', correlationId, {
                token: token,
                chunk: chunk
            });
        });
    }
    endBlobWrite(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('end_blob_write', correlationId, {
                token: token,
                chunk: chunk
            });
        });
    }
    abortBlobWrite(correlationId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('abort_blob_write', correlationId, {
                token: token
            });
        });
    }
    beginBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('begin_blob_read', correlationId, {
                blob_id: blobId
            });
        });
    }
    readBlobChunk(correlationId, blobId, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('read_blob_chunk', correlationId, {
                blob_id: blobId,
                skip: skip,
                take: take
            });
        });
    }
    endBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('end_blob_read', correlationId, {
                blob_id: blobId
            });
        });
    }
    updateBlobInfo(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('update_blob_info', correlationId, {
                blob: blob
            });
        });
    }
    markBlobsCompleted(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('mark_blobs_completed', correlationId, {
                blobIds: blobIds
            });
        });
    }
    deleteBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('delete_blob_by_id', correlationId, {
                blob_id: blobId
            });
        });
    }
    deleteBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('delete_blobs_by_ids', correlationId, {
                blob_ids: blobIds
            });
        });
    }
}
exports.BlobsCommandableHttpClientV1 = BlobsCommandableHttpClientV1;
//# sourceMappingURL=BlobsCommandableHttpClientV1.js.map