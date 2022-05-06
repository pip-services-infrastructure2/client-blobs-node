import { ConfigParams } from 'pip-services3-commons-nodex';

import { BlobsClientFixtureV1 } from './BlobsClientFixtureV1';
import { BlobsLambdaClientV1 } from '../../src/version1/BlobsLambdaClientV1';

suite('BlobsLambdaClient', ()=> {
    let AWS_LAMDBA_ARN = process.env["AWS_LAMDBA_ARN"] || "";
    let AWS_ACCESS_ID = process.env["AWS_ACCESS_ID"] || "";
    let AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"] || "";

    if (!AWS_LAMDBA_ARN || !AWS_ACCESS_ID || !AWS_ACCESS_KEY)
        return;

    let config = ConfigParams.fromTuples(
        "lambda.connection.protocol", "aws",
        "lambda.connection.arn", AWS_LAMDBA_ARN,
        "lambda.credential.access_id", AWS_ACCESS_ID,
        "lambda.credential.access_key", AWS_ACCESS_KEY,
        "lambda.options.connection_timeout", 30000
    );
    let lambdaConfig = config.getSection('lambda');

    // Skip if connection is not configured
    if (lambdaConfig.getAsNullableString("connection.protocol") != "aws")
        return;

    let client: BlobsLambdaClientV1;
    let fixture: BlobsClientFixtureV1;

    setup(async () => {
        client = new BlobsLambdaClientV1();
        client.configure(lambdaConfig);

        fixture = new BlobsClientFixtureV1(client);

        await client.open(null);
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