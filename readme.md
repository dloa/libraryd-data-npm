# libraryd-data

## Introduction

`libraryd-data` was created to allow users to easily access artifacts and hashes without having to call the LibraryD API endpoint. It exposes functions that allow quick; fast; and easy storage/recall of all OIP/Alexandria artifacts. It will store any new hashes that it requests from LibraryD to speed up future recalls of data.

## Installation

Install using NPM

```bash
$ npm install libraryd-data
```

## Code Samples

```javascript
var LDD = require("libraryd-data");

LDD.getArtifact("artifactTXID");
LDD.search("searchTerm");
LDD.changeDataSource("127.0.0.1", false);
```

### Get Artifact using the TXID
This method will return the artifact JSON using only the txid. If a callback function is not provided, then it will only search the local cache.
```javascript
LDD.getArtifact('fb7560ad53d4299b55250583f2f5c7975cd6e0c3c5b587cb49d7eee1799b58cf', function(data){
	console.log(JSON.stringify(data));
});
```

### Search for Artifact
This method will return all matching artifacts that match the text provided. This will return up to 50 results.
```javascript
LDD.search('test', function(data){
	console.log(JSON.stringify(data));
});
```