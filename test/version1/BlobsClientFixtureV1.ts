const assert = require('chai').assert;
const fs = require('fs');

// Constructing finished from stream
const { pipeline } = require('stream');
// Constructing promisify from
const { promisify } = require('util');
// Defining pipelineAsync method
const pipelineAsync = promisify(pipeline);

import { IdGenerator, FilterParams } from 'pip-services3-commons-nodex';

import { BlobInfoV1 } from '../../src/version1/BlobInfoV1';
import { IBlobsClientV1 } from '../../src/version1/IBlobsClientV1';

export class BlobsClientFixtureV1 {
    private _client: IBlobsClientV1;
    
    constructor(client: IBlobsClientV1) {
        this._client = client;
    }
        
    public async testReadWriteChunks() {
        let blobId = IdGenerator.nextLong();
        let token: string = null;
        let client: any = this._client;

        // Start writing blob
        let blob = new BlobInfoV1(
            blobId, 'test', 'file-' + blobId + '.dat', 6, 'application/binary'
        );

        token = await client.beginBlobWrite(
            null, blob
        );

        assert.isNotNull(token);

        // Write blob
        let chunk = Buffer.from([1, 2, 3]).toString('base64');

        token = await client.writeBlobChunk(
            null, token, chunk
        );
        
        assert.isNotNull(token);

        // Finish writing blob
        chunk = Buffer.from([4, 5, 6]).toString('base64');
        await client.endBlobWrite(
            null, token, chunk,
        );

        // Start reading
        blob = await client.beginBlobRead(
            null, blobId
        );

        assert.equal(6, blob.size);

        // Read first chunk
        chunk = await client.readBlobChunk(
            null, blobId, 0, 3
        );

        assert.isString(chunk);

        let buffer = Buffer.from(chunk, 'base64');
        assert.lengthOf(buffer, 3);
        assert.equal(1, buffer[0]);
        assert.equal(2, buffer[1]);
        assert.equal(3, buffer[2]);

        // Get blobs
        let page = await this._client.getBlobsByFilter(
            null,
            FilterParams.fromTuples(
                'group', 'test',
                'expired', true
            ),
            null
        );

        assert.lengthOf(page.data, 1);

        // Delete blob
        await this._client.deleteBlobsByIds(
            null, [blobId]
        );

        // Try to get deleted blob
        blob = await this._client.getBlobById(
            null, blobId
        )

        assert.isNull(blob);
    }

    public async testReadWriteData() {
        let blobId = IdGenerator.nextLong();
        let token: string = null;

        // Create blob
        let blob = new BlobInfoV1(
            blobId, 'test', 'file-' + blobId + '.dat', 6, 'application/binary'
        );
        let data = Buffer.from([1, 2, 3, 4, 5, 6]);

        blob = await this._client.createBlobFromData(
            null, blob, data
        );

        assert.isObject(blob);
        assert.equal(6, blob.size);

        // Get blob info
        blob = await this._client.getBlobById(
            null, blobId
        );

        assert.isObject(blob);
        assert.equal(6, blob.size);

        // Read blob
        let res = await this._client.getBlobDataById(
            null, blobId
        );

        [blob, data] = [res.blob, res.buffer];

        assert.equal(6, blob.size);
        assert.lengthOf(data, 6);
        assert.equal(1, data[0]);
        assert.equal(2, data[1]);
        assert.equal(3, data[2]);
        assert.equal(4, data[3]);
        assert.equal(5, data[4]);
        assert.equal(6, data[5]);
    }

    public async testReadWriteStream() {
        let blobId = IdGenerator.nextLong();
        let token: string = null;
        let sample: string = fs.readFileSync('./data/file.txt').toString();

        // Create blob
        let blob = new BlobInfoV1(
            blobId, 'test', './data/file.txt'
        );

        let rs = fs.createReadStream('./data/file.txt');

        blob = await this._client.createBlobFromStream(
            null, blob, rs
        );

        assert.isObject(blob);
        assert.equal('file.txt', blob.name);
        assert.equal(sample.length, blob.size);

        // Get blob info
        blob = await this._client.getBlobById(
            null, blobId
        );
        
        assert.isObject(blob);
        assert.equal('file.txt', blob.name);
        assert.equal(sample.length, blob.size);

        // Read blob
        if (fs.existsSync('./data/file.tmp'))
            fs.unlinkSync('./data/file.tmp');

        let ws = fs.createWriteStream(
            './data/file.tmp',
            {
                flags: 'w',
                autoClose: true
            }
        );

        blob = await this._client.getBlobStreamById(
            null, blobId, ws
        );

        assert.equal('file.txt', blob.name);
        assert.equal(sample.length, blob.size);

        // Wait until file cache is written
        await new Promise((res) => setTimeout(() => res(null), 100));

        let sample1 = fs.readFileSync('./data/file.tmp').toString();
        fs.unlinkSync('./data/file.tmp');
        assert.equal(sample1, sample);

        rs.pipe(ws);
    }

    public async testGetUriForMissingBlob() {
        await this._client.getBlobUriById(null, '123');
    }

    public async testWritingBlobUri() {
        // Writing blob
        let blobId = IdGenerator.nextLong();
        let blob = new BlobInfoV1(
            blobId, "test", "blob-" + blobId + ".dat", 0, "text/plain",
        )
        
        let blob1 = await this._client.createBlobFromUri(null, blob, 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
        
        assert.isNotNull(blob);
        assert.equal(blob.name, blob1.name);
        assert.equal(blob.group, blob1.group);
        assert.equal(blob.content_type, blob1.content_type);
        assert.isTrue(blob1.size > 0);

        // Reading blob
        let data = await this._client.getBlobDataById("", blobId);
        
        assert.isTrue(data.buffer.length > 0);
        await this._client.deleteBlobsByIds(null, [blobId]);
    }
}
