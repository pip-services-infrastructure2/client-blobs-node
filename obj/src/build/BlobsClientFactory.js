"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobsClientFactory = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const BlobsNullClientV1_1 = require("../version1/BlobsNullClientV1");
const BlobsDirectClientV1_1 = require("../version1/BlobsDirectClientV1");
const BlobsHttpClientV1_1 = require("../version1/BlobsHttpClientV1");
const BlobsLambdaClientV1_1 = require("../version1/BlobsLambdaClientV1");
const BlobsS3ClientV1_1 = require("../version1/BlobsS3ClientV1");
const BlobsCommandableGrpcClientV1_1 = require("../version1/BlobsCommandableGrpcClientV1");
const BlobsGrpcClientV1_1 = require("../version1/BlobsGrpcClientV1");
class BlobsClientFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(BlobsClientFactory.NullClientV1Descriptor, BlobsNullClientV1_1.BlobsNullClientV1);
        this.registerAsType(BlobsClientFactory.DirectClientV1Descriptor, BlobsDirectClientV1_1.BlobsDirectClientV1);
        this.registerAsType(BlobsClientFactory.HttpClientV1Descriptor, BlobsHttpClientV1_1.BlobsHttpClientV1);
        this.registerAsType(BlobsClientFactory.LambdaClientV1Descriptor, BlobsLambdaClientV1_1.BlobsLambdaClientV1);
        this.registerAsType(BlobsClientFactory.S3ClientV1Descriptor, BlobsS3ClientV1_1.BlobsS3ClientV1);
        this.registerAsType(BlobsClientFactory.CommandableGrpcClientV1Descriptor, BlobsCommandableGrpcClientV1_1.BlobsCommandableGrpcClientV1);
        this.registerAsType(BlobsClientFactory.GrpcClientV1Descriptor, BlobsGrpcClientV1_1.BlobsGrpcClientV1);
    }
}
exports.BlobsClientFactory = BlobsClientFactory;
BlobsClientFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'factory', 'default', 'default', '1.0');
BlobsClientFactory.NullClientV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'client', 'null', 'default', '1.0');
BlobsClientFactory.DirectClientV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'client', 'direct', 'default', '1.0');
BlobsClientFactory.HttpClientV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'client', 'http', 'default', '1.0');
BlobsClientFactory.LambdaClientV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'client', 'lambda', 'default', '1.0');
BlobsClientFactory.S3ClientV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'client', 's3', 'default', '1.0');
BlobsClientFactory.CommandableGrpcClientV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'client', 'commandable-grpc', 'default', '1.0');
BlobsClientFactory.GrpcClientV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-blobs', 'client', 'grpc', 'default', '1.0');
//# sourceMappingURL=BlobsClientFactory.js.map