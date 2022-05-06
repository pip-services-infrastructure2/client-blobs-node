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
exports.BlobsGrpcClientV1 = void 0;
const services = require('../../../src/protos/blobs_v1_grpc_pb');
const messages = require('../../../src/protos/blobs_v1_pb');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const BlobsDataProcessorV1_1 = require("./BlobsDataProcessorV1");
const BlobsUriProcessorV1_1 = require("./BlobsUriProcessorV1");
const BlobsStreamProcessorV1_1 = require("./BlobsStreamProcessorV1");
const BlobsGrpcConverterV1_1 = require("./BlobsGrpcConverterV1");
class BlobsGrpcClientV1 extends pip_services3_grpc_nodex_1.GrpcClient {
    constructor(config) {
        super(services.BlobsClient);
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
            let request = new messages.BlobInfoPageRequest();
            BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.setMap(request.getFilterMap(), filter);
            request.setPaging(BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.fromPagingParams(paging));
            let timing = this.instrument(correlationId, 'blobs.get_blobs_by_filter');
            try {
                let response = yield this.call('get_blobs_by_filter', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toBlobInfoPage(response.getPage()) : null;
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
            let request = new messages.BlobIdsRequest();
            request.setBlobIdsList(blobIds);
            let timing = this.instrument(correlationId, 'blobs.get_blobs_by_ids');
            try {
                let response = yield this.call('get_blobs_by_ids', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toBlobInfos(response.getBlobsList()) : null;
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
            let request = new messages.BlobIdRequest();
            request.setBlobId(blobId);
            let timing = this.instrument(correlationId, 'blobs.get_blob_by_id');
            try {
                let response = yield this.call('get_blob_by_id', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null;
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
            let request = new messages.BlobIdRequest();
            request.setBlobId(blobId);
            let timing = this.instrument(correlationId, 'blobs.get_blob_uri_by_id');
            try {
                let response = yield this.call('get_blob_uri_by_id', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? response.getUri() : null;
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
        return BlobsDataProcessorV1_1.BlobsDataProcessorV1.createBlobFromData(correlationId, blob, this, buffer, this._chunkSize);
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
            let blobObj = BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.fromBlobInfo(blob);
            let request = new messages.BlobInfoObjectRequest();
            request.setBlob(blobObj);
            let timing = this.instrument(correlationId, 'blobs.begin_blob_write');
            try {
                let response = yield this.call('begin_blob_write', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? response.getToken() : null;
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
            let request = new messages.BlobTokenWithChunkRequest();
            request.setToken(token);
            request.setChunk(chunk);
            let timing = this.instrument(correlationId, 'blobs.write_blob_chunk');
            try {
                let response = yield this.call('write_blob_chunk', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? response.getToken() : null;
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
            let request = new messages.BlobTokenWithChunkRequest();
            request.setToken(token);
            request.setChunk(chunk);
            let timing = this.instrument(correlationId, 'blobs.end_blob_write');
            try {
                let response = yield this.call('end_blob_write', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null;
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
            let request = new messages.BlobTokenRequest();
            request.setToken(token);
            let timing = this.instrument(correlationId, 'blobs.abort_blob_write');
            try {
                let response = yield this.call('abort_blob_write', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
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
            let request = new messages.BlobIdRequest();
            request.setBlobId(blobId);
            let timing = this.instrument(correlationId, 'blobs.begin_blob_read');
            try {
                let response = yield this.call('begin_blob_read', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null;
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
            let request = new messages.BlobReadRequest();
            request.setBlobId(blobId);
            request.setSkip(skip);
            request.setTake(take);
            let timing = this.instrument(correlationId, 'blobs.read_blob_chunk');
            try {
                let response = yield this.call('read_blob_chunk', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? response.getChunk() : null;
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
            let request = new messages.BlobIdRequest();
            request.setBlobId(blobId);
            let timing = this.instrument(correlationId, 'blobs.end_blob_read');
            try {
                let response = yield this.call('end_blob_read', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
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
            let blobObj = BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.fromBlobInfo(blob);
            let request = new messages.BlobInfoObjectRequest();
            request.setBlob(blobObj);
            let timing = this.instrument(correlationId, 'blobs.update_blob_info');
            try {
                let response = yield this.call('update_blob_info', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
                return response ? BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toBlobInfo(response.getBlob()) : null;
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
            let request = new messages.BlobIdsRequest();
            request.setBlobIdsList(blobIds);
            let timing = this.instrument(correlationId, 'blobs.mark_blobs_completed');
            try {
                let response = yield this.call('mark_blobs_completed', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
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
            let request = new messages.BlobIdRequest();
            request.setBlobId(blobId);
            let timing = this.instrument(correlationId, 'blobs.delete_blob_by_id');
            try {
                let response = yield this.call('delete_blob_by_id', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
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
            let request = new messages.BlobIdsRequest();
            request.setBlobIdsList(blobIds);
            let timing = this.instrument(correlationId, 'blobs.delete_blobs_by_ids');
            try {
                let response = yield this.call('delete_blobs_by_ids', correlationId, request);
                if (response.error != null)
                    throw BlobsGrpcConverterV1_1.BlobsGrpcConverterV1.toError(response.error);
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
exports.BlobsGrpcClientV1 = BlobsGrpcClientV1;
//# sourceMappingURL=BlobsGrpcClientV1.js.map