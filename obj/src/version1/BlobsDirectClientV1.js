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
exports.BlobsDirectClientV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const BlobsUriProcessorV1_1 = require("./BlobsUriProcessorV1");
const BlobsDataProcessorV1_1 = require("./BlobsDataProcessorV1");
const BlobsStreamProcessorV1_1 = require("./BlobsStreamProcessorV1");
//import { IBlobsController } from 'service-blobs-node';
class BlobsDirectClientV1 extends pip_services3_rpc_nodex_1.DirectClient {
    constructor(config) {
        super();
        this._chunkSize = 10240;
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_2.Descriptor("service-blobs", "controller", "*", "*", "*"));
        if (config != null)
            this.configure(pip_services3_commons_nodex_1.ConfigParams.fromValue(config));
    }
    configure(config) {
        super.configure(config);
        this._chunkSize = config.getAsLongWithDefault('options.chunk_size', this._chunkSize);
    }
    getBlobsByFilter(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.getBlobsByFilter(correlationId, filter, paging);
        });
    }
    getBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.getBlobsByIds(correlationId, blobIds);
        });
    }
    getBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.getBlobById(correlationId, blobId);
        });
    }
    createBlobFromUri(correlationId, blob, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlobsUriProcessorV1_1.BlobsUriProcessorV1.createBlobFromUri(correlationId, blob, this, uri);
        });
    }
    getBlobUriById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.getBlobUriById(correlationId, blobId);
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
            return yield this._controller.beginBlobWrite(correlationId, blob);
        });
    }
    writeBlobChunk(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.writeBlobChunk(correlationId, token, chunk);
        });
    }
    endBlobWrite(correlationId, token, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.endBlobWrite(correlationId, token, chunk);
        });
    }
    abortBlobWrite(correlationId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._controller.abortBlobWrite(correlationId, token);
        });
    }
    beginBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.beginBlobRead(correlationId, blobId);
        });
    }
    readBlobChunk(correlationId, blobId, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.readBlobChunk(correlationId, blobId, skip, take);
        });
    }
    endBlobRead(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._controller.endBlobRead(correlationId, blobId);
        });
    }
    updateBlobInfo(correlationId, blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._controller.updateBlobInfo(correlationId, blob);
        });
    }
    markBlobsCompleted(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._controller.markBlobsCompleted(correlationId, blobIds);
        });
    }
    deleteBlobById(correlationId, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._controller.deleteBlobById(correlationId, blobId);
        });
    }
    deleteBlobsByIds(correlationId, blobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._controller.deleteBlobsByIds(correlationId, blobIds);
        });
    }
}
exports.BlobsDirectClientV1 = BlobsDirectClientV1;
//# sourceMappingURL=BlobsDirectClientV1.js.map