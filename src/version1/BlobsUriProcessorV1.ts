const http = require('http');
const https = require('https');

import { BadRequestException } from 'pip-services3-commons-nodex';

import { BlobInfoV1 } from './BlobInfoV1';
import { IBlobsChunkyWriterV1 } from './IBlobsChunkyWriterV1';
import { BlobsStreamProcessorV1 } from './BlobsStreamProcessorV1';

export class BlobsUriProcessorV1 {

    public static async getUriStream(correlationId: string, blob: BlobInfoV1, uri: string): Promise<any> {

        // Download file from url and pass it to createFile
        let transport = null;
                
        if (uri.substring(0, 7) == 'http://') 
            transport = http;
        else if (uri.substring(0, 8) == 'https://') 
            transport = https;
        else {
            throw new BadRequestException(
                    correlationId,
                    'UNSUPPORTED_TRANSPORT',
                    'Unsupported transport in ' + uri
                )
                .withDetails('uri', uri)
        }

        return await new Promise<any>((resolve, reject) => {
            transport.get(uri, (response) => {
                if (response.statusCode >= 400) {
                    let err = new BadRequestException(
                        correlationId,
                        'BAD_URI',
                        'Uri ' + uri + ' cannot be opened'
                    ).withDetails('uri', uri);

                    reject(err);
                }

                resolve(response);
            });
        });
    }

    public static async createBlobFromUri(correlationId: string, blob: BlobInfoV1,
        writer: IBlobsChunkyWriterV1, uri: string): Promise<BlobInfoV1> {

        let rs = await BlobsUriProcessorV1.getUriStream(correlationId, blob, uri);

        blob.content_type = blob.content_type || rs.headers['content-type'];
        blob.size = blob.size || rs.headers['content-length'];
        // convert blob.size to number
        blob.size = +blob.size;

        blob = await BlobsStreamProcessorV1.createBlobFromStream(correlationId, blob, writer, rs);

        return blob;
    }

}