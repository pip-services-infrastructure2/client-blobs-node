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
exports.BlobsUriProcessorV1 = void 0;
const http = require('http');
const https = require('https');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const BlobsStreamProcessorV1_1 = require("./BlobsStreamProcessorV1");
class BlobsUriProcessorV1 {
    static getUriStream(correlationId, blob, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            // Download file from url and pass it to createFile
            let transport = null;
            if (uri.substring(0, 7) == 'http://')
                transport = http;
            else if (uri.substring(0, 8) == 'https://')
                transport = https;
            else {
                throw new pip_services3_commons_nodex_1.BadRequestException(correlationId, 'UNSUPPORTED_TRANSPORT', 'Unsupported transport in ' + uri)
                    .withDetails('uri', uri);
            }
            return yield new Promise((resolve, reject) => {
                transport.get(uri, (response) => {
                    if (response.statusCode >= 400) {
                        let err = new pip_services3_commons_nodex_1.BadRequestException(correlationId, 'BAD_URI', 'Uri ' + uri + ' cannot be opened').withDetails('uri', uri);
                        reject(err);
                    }
                    resolve(response);
                });
            });
        });
    }
    static createBlobFromUri(correlationId, blob, writer, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs = yield BlobsUriProcessorV1.getUriStream(correlationId, blob, uri);
            blob.content_type = blob.content_type || rs.headers['content-type'];
            blob.size = blob.size || rs.headers['content-length'];
            // convert blob.size to number
            blob.size = +blob.size;
            blob = yield BlobsStreamProcessorV1_1.BlobsStreamProcessorV1.createBlobFromStream(correlationId, blob, writer, rs);
            return blob;
        });
    }
}
exports.BlobsUriProcessorV1 = BlobsUriProcessorV1;
//# sourceMappingURL=BlobsUriProcessorV1.js.map