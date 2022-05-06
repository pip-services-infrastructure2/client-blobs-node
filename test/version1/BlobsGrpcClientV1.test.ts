// import { Descriptor } from 'pip-services3-commons-nodex';
// import { ConfigParams } from 'pip-services3-commons-nodex';
// import { References } from 'pip-services3-commons-nodex';
// import { ConsoleLogger } from 'pip-services3-components-nodex';

// import { BlobsMemoryPersistence } from 'service-blobs-node';
// import { BlobsController } from 'service-blobs-node';
// import { BlobsGrpcServiceV1 } from 'service-blobs-node';
// import { IBlobsClientV1 } from '../../src/version1/IBlobsClientV1';
// import { BlobsGrpcClientV1 } from '../../src/version1/BlobsGrpcClientV1';
// import { BlobsClientFixtureV1 } from './BlobsClientFixtureV1';

// var httpConfig = ConfigParams.fromTuples(
//     "connection.protocol", "http",
//     "connection.host", "localhost",
//     "connection.port", 3000
// );

// suite('BlobsGrpcClientV1', ()=> {
//     let service: BlobsGrpcServiceV1;
//     let client: BlobsGrpcClientV1;
//     let fixture: BlobsClientFixtureV1;

//     suiteSetup(async () => {
//         let logger = new ConsoleLogger();
//         let persistence = new BlobsMemoryPersistence();
//         let controller = new BlobsController();

//         service = new BlobsGrpcServiceV1();
//         service.configure(httpConfig);

//         let references: References = References.fromTuples(
//             new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
//             new Descriptor('service-blobs', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('service-blobs', 'controller', 'default', 'default', '1.0'), controller,
//             new Descriptor('service-blobs', 'service', 'grpc', 'default', '1.0'), service
//         );
//         controller.setReferences(references);
//         service.setReferences(references);

//         client = new BlobsGrpcClientV1();
//         client.setReferences(references);
//         client.configure(httpConfig);

//         fixture = new BlobsClientFixtureV1(client);

//         await service.open(null);
//         await client.open(null);
//     });
    
//     suiteTeardown(async () => {
//         await client.close(null);
//         await service.close(null);
//     });

//     test('Read / write chunks', async () => {
//         await fixture.testReadWriteChunks();
//     });

//     test('Read / write data', async () => {
//         await fixture.testReadWriteData();
//     });

//     test('Read / write stream', async () => {
//         await fixture.testReadWriteStream();
//     });

//     test('Get Uri for missing blob', async () => {
//         await fixture.testGetUriForMissingBlob();
//     });

//     test('Get Blob from Uri', async () => {
//         await fixture.testWritingBlobUri();
//     });
// });
