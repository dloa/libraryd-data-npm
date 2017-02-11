# libraryd-data

## Introduction

`libraryd-data` was created to allow users to easily access artifacts and hashes without having to call the LibraryD API endpoint. It exposes functions that allow quick; fast; and easy storage/recall of all OIP/Alexandria artifacts. It will store any new hashes that it requests from LibraryD to speed up future recalls of data.

## Installation

Install using NPM

`npm install libraryd-data`

## Code Samples

```
var LDD = require("libraryd-data");

LDD.getArtifact("artifactHash");
LDD.search("searchTerm");
```