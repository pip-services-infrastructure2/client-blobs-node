import { Descriptor } from 'pip-services3-commons-nodex';
import { Factory } from 'pip-services3-components-nodex';

import { BlobsNullClientV1 } from '../version1/BlobsNullClientV1';
import { BlobsDirectClientV1 } from '../version1/BlobsDirectClientV1';
import { BlobsHttpClientV1 } from '../version1/BlobsHttpClientV1';
import { BlobsLambdaClientV1 } from '../version1/BlobsLambdaClientV1';
import { BlobsS3ClientV1 } from '../version1/BlobsS3ClientV1';
import { BlobsCommandableGrpcClientV1 } from '../version1/BlobsCommandableGrpcClientV1';
import { BlobsGrpcClientV1 } from '../version1/BlobsGrpcClientV1';

export class BlobsClientFactory extends Factory {
	public static Descriptor: Descriptor = new Descriptor('service-blobs', 'factory', 'default', 'default', '1.0');
	public static NullClientV1Descriptor = new Descriptor('service-blobs', 'client', 'null', 'default', '1.0');
	public static DirectClientV1Descriptor = new Descriptor('service-blobs', 'client', 'direct', 'default', '1.0');
	public static HttpClientV1Descriptor = new Descriptor('service-blobs', 'client', 'http', 'default', '1.0');
	public static LambdaClientV1Descriptor = new Descriptor('service-blobs', 'client', 'lambda', 'default', '1.0');
	public static S3ClientV1Descriptor = new Descriptor('service-blobs', 'client', 's3', 'default', '1.0');
	public static CommandableGrpcClientV1Descriptor = new Descriptor('service-blobs', 'client', 'commandable-grpc', 'default', '1.0');
	public static GrpcClientV1Descriptor = new Descriptor('service-blobs', 'client', 'grpc', 'default', '1.0');
	
	constructor() {
		super();

		this.registerAsType(BlobsClientFactory.NullClientV1Descriptor, BlobsNullClientV1);
		this.registerAsType(BlobsClientFactory.DirectClientV1Descriptor, BlobsDirectClientV1);
		this.registerAsType(BlobsClientFactory.HttpClientV1Descriptor, BlobsHttpClientV1);
		this.registerAsType(BlobsClientFactory.LambdaClientV1Descriptor, BlobsLambdaClientV1);
		this.registerAsType(BlobsClientFactory.S3ClientV1Descriptor, BlobsS3ClientV1);
		this.registerAsType(BlobsClientFactory.CommandableGrpcClientV1Descriptor, BlobsCommandableGrpcClientV1);
		this.registerAsType(BlobsClientFactory.GrpcClientV1Descriptor, BlobsGrpcClientV1);
	}
	
}
