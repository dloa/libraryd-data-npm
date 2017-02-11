// LDD stands for LibraryD Data
var LDD = function () {
	// Should we load the current LibraryD database initially? Possibily if under 5mb total?

	// Define and store variables locally so they cannot be accessed.
	// artifactStorage contains all loaded artifacts.
	// ToDo: Implement a size limit to the amount of artifacts to store.
	this.artifactStorage = [];

	// URLS to connect to.
	this.dataHostname = "api.alexandria.io";
	this.dataHostnameSecure = true;
	this.dataSlug = "/alexandria/v2/"
};

// Method Name: LibraryD.getArtifact
// Description: Searches to check if an artifact already exists, if it does, it will return the artifact JSON, if not, it will lookup the artifact from LibraryD and store it.
// Paramaters: 
// 		- artifactHash: the hash of the artifact you are requesting
// Returns: Artifact JSON for requested hash.
LDD.prototype.getArtifact = function(artifactHash){

}

// Method Name: LibraryD.search
// Description: Searches through all stored artifact JSON, if an exact match is not found (or the term returns more than 3 artifacts) it will query LibraryD to make sure it accessed all matches. Data retrieved from LibraryD will always be stored.
// Paramaters: 
// 		- searchTerm: the term you wish to search for.
// Returns: Artifacts in a JSON object array.
LDD.prototype.search = function(searchTerm){

}

// Method Name: LibraryD.changeDataSource
// Description: Changes the data URL that this module requests from (i.e. to be used if you need to set a custom API endpoint instead of the default)
// Paramaters: 
// 		- hostname: the hostname to connect to (api.alexandria.io)
// 		- secure: is the connection secure/use https (true)
// 		- slug: the slugpath to connect to (/alexandria/v2/)
// Returns: Artifacts in a JSON object array.
LDD.prototype.changeDataSource = function(hostname, secure, slug){
	if (typeof hostname !== 'undefined')
		this.dataHostname = hostname;

	if (typeof secure !== 'undefined')
		this.dataHostnameSecure = secure;

	if (typeof secure !== 'undefined')
		this.dataSlug = slug;
}

// Expose LDD and all methods.
module.exports = new LDD();