import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { ConsoleLogger } from 'pip-services3-components-nodex';

import { BlobsMemoryPersistence } from 'service-blobs-node';
import { BlobsController } from 'service-blobs-node';

import { BlobsDirectClientV1 } from '../../src/version1/BlobsDirectClientV1';
import { BlobsClientFixtureV1 } from './BlobsClientFixtureV1';

suite('BlobsDirectClientV1', ()=> {
    let client: BlobsDirectClientV1;
    let fixture: BlobsClientFixtureV1;

    suiteSetup(async () => {
        let logger = new ConsoleLogger();
        let persistence = new BlobsMemoryPersistence();
        let controller = new BlobsController();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('service-blobs', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-blobs', 'controller', 'default', 'default', '1.0'), controller,
        );
        controller.setReferences(references);

        client = new BlobsDirectClientV1();
        // client.configure(ConfigParams.fromTuples(
        //     'options.chunk_size', 3
        // ));
        client.setReferences(references);

        fixture = new BlobsClientFixtureV1(client);

        await client.open(null);
    });
    
    suiteTeardown(async () => {
        await client.close(null);
    });

    test('Read / write chunks', async () => {
        await fixture.testReadWriteChunks();
    });

    test('Read / write data', async () => {
        await fixture.testReadWriteData();
    });

    test('Read / write stream', async () => {
        await fixture.testReadWriteStream();
    });

    test('Get Uri for missing blob', async () => {
        await fixture.testGetUriForMissingBlob();
    });

    test('Get Blob from Uri', async () => {
        await fixture.testWritingBlobUri();
    });
});
