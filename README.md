# Blobs Microservice Client SDK for Node.js / ES2017

This is a Node.js client SDK for [pip-services-storage](https://github.com/pip-services-infrastructure2/service-blobs-node) microservice.
It provides an easy to use abstraction over communication protocols:

* HTTP/REST client
* Seneca client (see http://www.senecajs.org)
* AWS Lambda client
* Direct client for monolythic deploments
* S3 client to work with S3 storage directly
* Null client to be used in testing

<a name="links"></a> Quick Links:

* [Development Guide](doc/Development.md)
* [API Version 1](doc/NodeClientApiV1.md)

## Install

Add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-blobs-node": "^1.0.*",
        ...
    }
}
```

Then install the dependency using **npm** tool
```bash
# Install new dependencies
npm install

# Update already installed dependencies
npm update
```

## Use

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('client-blobs-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.StorageRestClient(config);

// Connect to the microservice
try {
    await client.open(null);
    // Work with the microservice
    ...
} catch(err) {
    console.error('Connection to the microservice failed');
    console.error(err);
}
```

Now the client is ready to perform operations
```javascript
// Create a new picture
let blob = {
    group: "pictures",
    name: "google_search.jpg"
};

let blob = await client.createBlobFromUrl(
    null,
    blob,
    "https://www.google.com/logos/doodles/2016/doodle-4-google-2016-us-winner-5664555055185920-hp.jpg"
);
```

```javascript
// Start reading blobs in chunks
let blobData: BlobDataV1 = await client.getBlobDataById(
    null,
    blob_id
);
```    

## Acknowledgements

This client SDK was created and currently maintained by *Sergey Seroukhov*.

