// LDD stands for LibraryD Data
var LDD = function () {};

// Method Name: LibraryD.getArtifact
// Description: Searches to check if an artifact already exists, if it does, it will return the artifact JSON, if not, it will lookup the artifact from LibraryD and store it.
// Paramaters: artifactHash: the hash of the artifact you are requesting
// Returns: Artifact JSON for requested hash.
LDD.prototype.getArtifact = function(artifactHash){

}

// Method Name: LibraryD.search
// Description: Searches through all stored artifact JSON, if an exact match is not found (or the term returns more than 3 artifacts) it will query LibraryD to make sure it accessed all matches. Data retrieved from LibraryD will always be stored.
// Paramaters: searchTerm: the term you wish to search for.
// Returns: Artifacts in a JSON object array.
LDD.prototype.search = function(searchTerm){

}

// Expose LDD and all methods.
module.exports = new LDD();