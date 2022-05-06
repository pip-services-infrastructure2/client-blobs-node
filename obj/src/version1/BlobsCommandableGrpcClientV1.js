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
exports.BlobsCommandableGrpcClientV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const BlobsDataProcessorV1_1 = require("./BlobsDataProcessorV1");
const BlobsUriProcessorV1_1 = require("./BlobsUriProcessorV1");
const BlobsStreamProcessorV1_1 = require("./BlobsStreamProcessorV1");
class BlobsCommandableGrpcClientV1 extends pip_services3_grpc_nodex_1.CommandableGrpcClient {
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
            let timing = this.instrument(correlationId, 'blobs.send_message');
            try {
                return yield this.callCommand('get_blobs_by_filter', correlationId, {
                    filter: filter,
                    paging: paging
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    getBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.get_blobs_by_ids');
            try {
                return yield this.callCommand('get_blobs_by_ids', correlationId, {
                    blob_ids: blobIds
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    getBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.get_blob_by_id');
            try {
                return yield this.callCommand('get_blob_by_id', correlationId, {
                    blob_id: blobId
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    createBlobFromUri(correlationId, blob, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlobsUriProcessorV1_1.BlobsUriProcessorV1.createBlobFromUri(correlationId, blob, this, uri);
        });
    }
    getBlobUriById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.get_blob_uri_by_id');
            try {
                return yield this.callCommand('get_blob_uri_by_id', correlationId, {
                    blob_id: blobId
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
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
            return yield BlobsStreamProcessorV1_1.BlobsStreamProcessorV1.createBlobFromStream(correlationId, blob, this, readStream);
        });
    }
    getBlobStreamById(correlationId, blobId, writeStream) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlobsStreamProcessorV1_1.BlobsStreamProcessorV1.getBlobStreamById(correlationId, blobId, this, this._chunkSize, writeStream);
        });
    }
    beginBlobWrite(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.begin_blob_write');
            try {
                return yield this.callCommand('begin_blob_write', correlationId, {
                    blob: blob
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    writeBlobChunk(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.write_blob_chunk');
            try {
                return yield this.callCommand('write_blob_chunk', correlationId, {
                    token: token,
                    chunk: chunk
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    endBlobWrite(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.end_blob_write');
            try {
                return yield this.callCommand('end_blob_write', correlationId, {
                    token: token,
                    chunk: chunk
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    abortBlobWrite(correlationId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.abort_blob_write');
            try {
                return yield this.callCommand('abort_blob_write', correlationId, {
                    token: token
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    beginBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.begin_blob_read');
            try {
                return yield this.callCommand('begin_blob_read', correlationId, {
                    blob_id: blobId
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    readBlobChunk(correlationId, blobId, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.read_blob_chunk');
            try {
                return yield this.callCommand('read_blob_chunk', correlationId, {
                    blob_id: blobId,
                    skip: skip,
                    take: take
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    endBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.end_blob_read');
            try {
                return yield this.callCommand('end_blob_read', correlationId, {
                    blob_id: blobId
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    updateBlobInfo(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.update_blob_info');
            try {
                return yield this.callCommand('update_blob_info', correlationId, {
                    blob: blob
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    markBlobsCompleted(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.mark_blobs_completed');
            try {
                return yield this.callCommand('mark_blobs_completed', correlationId, {
                    blobIds: blobIds
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    deleteBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.delete_blob_id');
            try {
                return yield this.callCommand('delete_blob_id', correlationId, {
                    blob_id: blobId
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    deleteBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'blobs.delete_blobs_by_ids');
            try {
                return yield this.callCommand('delete_blobs_by_ids', correlationId, {
                    blob_ids: blobIds
                });
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
}
exports.BlobsCommandableGrpcClientV1 = BlobsCommandableGrpcClientV1;
//# sourceMappingURL=BlobsCommandableGrpcClientV1.js.map