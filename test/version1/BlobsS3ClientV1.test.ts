import { ConfigParams } from 'pip-services3-commons-nodex';

import { BlobsS3ClientV1 } from '../../src/version1/BlobsS3ClientV1';
import { BlobsClientFixtureV1 } from './BlobsClientFixtureV1';

suite('BlobsS3ClientV1', ()=> {
    let client: BlobsS3ClientV1;
    let fixture: BlobsClientFixtureV1;

    let S3_ARN = process.env["S3_ARN"] || "";
    let AWS_ACCESS_ID = process.env["AWS_ACCESS_ID"] || "";
    let AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"] || "";

    if (S3_ARN == "" || AWS_ACCESS_ID == "" || AWS_ACCESS_KEY == "")
        return;

    let dbConfig = ConfigParams.fromTuples(
        "connection.arn", S3_ARN,
        "credential.access_id", AWS_ACCESS_ID,
        "credential.access_key", AWS_ACCESS_KEY
    );

    setup(async () => {
        client = new BlobsS3ClientV1();
        client.configure(dbConfig);

        fixture = new BlobsClientFixtureV1(client);

        await client.open(null);
        await client.clear(null);
    });
    
    teardown(async () => {
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