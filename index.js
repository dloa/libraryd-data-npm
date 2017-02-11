var request = require('request');

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

	// SEARCH_DELAY is the amount of time required between full loads from LibraryD.
	this.SEARCH_DELAY = 30 * 60 * 1000; 
	this.MAX_SEARCH_RESULTS = 50;

	// Time since the last full query from LibraryD
	this.lastFullUpdate = 0;

	// Method Name: buildURL
	// Description: A helper method to build the URL string using private variables.
	// Paramaters: None
	// Returns: Returns a URL built from private variables.
	this.buildURL = function(){
		var secureStr = this.dataHostnameSecure ? 'https' : 'http';
		return secureStr + '://' + this.dataHostname + this.dataSlug;
	}
};

// Method Name: LDD.getArtifact
// Description: Searches to check if an artifact already exists, if it does, it will return the artifact JSON, if not, it will lookup the artifact from LibraryD and store it.
// Paramaters: 
// 		- artifactTXID: the txid of the artifact you are requesting
// 		- callback: function that will be called once the search finishes.
// Returns: Returns data via the callback function.
LDD.prototype.getArtifact = function(artifactTXID, callback){
	// Go through entire artifact storage backwards (doing it backwards will allow the searching through the most recent artifacts first.)
	for (var i = this.artifactStorage.length - 1; i >= 0; i--) {
		if (typeof this.artifactStorage[i].txid !== 'undefined') {
			if (this.artifactStorage[i].txid == artifactTXID){
				if (typeof callback !== 'function'){
					return [this.artifactStorage[i]];
				} else {
					callback([this.artifactStorage[i]]);
					return;
				}
			}
		}
	}

	// Make sure the callback exists.
	if (typeof callback !== 'function'){
		// There is no callback so abort before attempting to query LibraryD.
		console.log("No callback, aborting getArtifact before querying LibraryD!");
		return [];
	}

	// Since we got here no artifact was found. Lets get it from LibraryD.
	this.queryLibraryD(artifactTXID, 'txid', callback);
}

// Method Name: LDD.search
// Description: Searches through all stored artifact JSON, if the last full query of LibraryD was more than SEARCH_DELAY minutes ago then do another full query.
// Paramaters: 
// 		- searchTerm: The text we are searching for.
// 		- searchOn: the variable name (txid, publisher, address, etc) or for everything '*' (default '*')
// 		- module: the module we are searching on, this should be 'media' in almost all cases. It is however an option if wished to be set. (default 'media')
// 		- callback: function that will be called once the search finishes.
// Returns: Artifacts in a JSON object array.
LDD.prototype.search = function(searchTerm, searchOn, module, callback){
	// Make sure paramaters are set and are strings. If they are not set, or if they are not a string, then they will be set to default.
	if (typeof searchOn !== 'string'){
		// Since it is not a string, check if they put the callback here.
		if (typeof searchOn === 'function')
			callback = searchOn;

		searchOn = '*';
	}

	if (typeof module !== 'string'){
		// Since it is not a string, check if they put the callback here.
		if (typeof module === 'function')
			callback = module;

		module = 'media';
	}

	if (typeof callback !== 'function'){
		// If the callback is not a function cancel the search as we cannot return data recieved.
		// It is likely that the user is attempting to call it directly.
		// If they called this method and expected the value to be returned into a variable it will return a blank array.
		if (searchOn == 'txid')
			return this.getArtifact(searchTerm);
		else
			return [];
	}

	if (typeof searchTerm !== 'string'){
		// No search term provided, return an empty array.
		callback([]);
		return;
	}

	// Check to see if it has been at least SEARCH_DELAY ms since the last full query.
	var tmpTime = new Date().getTime();
	if (tmpTime - this.lastFullUpdate > this.SEARCH_DELAY){
		this.queryLibraryD(searchTerm, searchOn, module, callback);
	} else {
		// It has not been SEARCH_DELAY ms yet, just search the local db.
		callback(this.searchArtifactStorage(searchTerm, searchOn, module));
	}
}

// Method Name: LDD.changeDataSource
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

// Method Name: LDD.queryLibraryD
// Description: Looks up the requested term from LibraryD then stores updated data in the cache.
// Paramaters: 
// 		- searchTerm: The text we are searching for.
// 		- searchOn: the variable name (txid, publisher, address) or for everything '*' (default '*')
// 		- module: the module we are searching on, this should be 'media' in almost all cases. It is however an option if wished to be set. (default 'media')
// 		- callback: a function that can revieve JSON data from the search. This will be called with one paramater, the JSON array full of artifacts that fit the search. ( function(matches){} )
// Returns: Returns data via the callback parameter. If no callback is provided; will return an empty array.
LDD.prototype.queryLibraryD = function(searchTerm, searchOn, module, callback){
	// Make sure paramaters are set and are strings. If they are not set, or if they are not a string, then they will be set to default.
	if (typeof searchOn !== 'string'){
		// Since it is not a string, check if they put the callback here.
		if (typeof searchOn === 'function')
			callback = searchOn;

		searchOn = '*';
	}

	if (typeof module !== 'string'){
		// Since it is not a string, check if they put the callback here.
		if (typeof module === 'function')
			callback = module;

		module = 'media';
	}

	if (typeof callback !== 'function'){
		// If the callback is not a function cancel the search as we cannot return data recieved.
		// It is likely that the user is attempting to call it directly.
		// If they called this method and expected the value to be returned into a variable it will return a blank array.
		console.error("No callback provided! Cannot return search data! Aborting searchLibraryD function!");
		return [];
	}

	if (typeof searchTerm !== 'string'){
		// No search term provided, return an empty array.
		callback([]);
		return;
	}


	// Build the request URL
	var requestURL = this.buildURL() + 'search';

	// Build the query we are sending.
	var queryString = {
		"protocol": module, 
		"search-on": searchOn, 
		"search-for": searchTerm, 
		"search-like": true
	};

	// Build the options.
	var opts = {
		method: 'POST', 
		url: requestURL, 
		body: queryString, 
		json: true
	};

	var self = this;
	request(opts, function(err, res, body){
		if (err){
			console.log("Recieved a " + " error when attempting to search LibraryD. \nRequestURL: " + requestURL + "\nqueryString: " + queryString + "\nStacktrace: " + err);
		}

		// Check if there is any data in the body.
		if (body){
			// Store the new values we loaded.
			if (typeof body.response === 'object'){
				if (searchTerm !== ''){
					self.artifactStorage = mergeArrays(self.artifactStorage, body.response);
				} else if (searchTerm === ''){
					self.artifactStorage = body.response;
					self.lastFullUpdate = new Date().getTime();
				}
			}

			callback(body.response);
			return;
		}

		// Some error happened, return an empty array.
		callback([]);
	});
}

// Method Name: LDD.searchArtifactStorage
// Description: Searches the local artifact cache and returns any matches.
// Paramaters: 
// 		- searchTerm: The text we are searching for.
// 		- searchOn: the variable name (txid, publisher, address) or for everything '*' (default '*')
// 		- module: the module we are searching on, this should be 'media' in almost all cases. It is however an option if wished to be set. (default 'media')
// Returns: Returns any matches.
LDD.prototype.searchArtifactStorage = function(searchTerm, searchOn, module){
	if (typeof searchTerm !== 'string')
		return [];

	if (typeof searchOn !== 'string')
		searchOn = '*';

	if (typeof module !== 'string')
		module = 'media';

	// If the searchOn can be found at the root of the JSON object, then just search the root and do not search recursively.
	if (searchOn == 'tags' || searchOn == 'timestamp' || searchOn == 'title' || searchOn == 'txid' || searchOn == 'type' || searchOn == 'year' || searchOn == 'publisher'){
		var matches = [];

		for (var i = 0; i < this.artifactStorage.length; i++) {
			if (searchArtifact({a: this.artifactStorage[i][searchOn]}, searchTerm))
				matches.push(this.artifactStorage[i]);
		}

		return matches;
	}

	// We need to preform a recursive search.
	var results = [];
	for (var i = this.artifactStorage.length - 1; i >= 0; i--) {
		// If we have more than the max results for a '*' search, then break.
		if (results.length >= this.MAX_SEARCH_RESULTS)
			break;

		if (searchArtifact(this.artifactStorage[i], searchTerm))
			results.push(this.artifactStorage[i]);
	}

	return results;
}

// Method Name: mergeArrays
// Description: Merges two JSON arrays.
// Paramaters: 
// 		- arrayOne: The array containing all current artifact objects.
// 		- arrayTwo: The array containing the new values to be checked and merged in.
// Returns: A JSON array containing all values from the merge.
var mergeArrays = function(arrayOne, arrayTwo){
	// Check to see if we have initialized the first array yet.
	if (typeof arrayOne !== 'object'){
		arrayOne = [];
	}

	// If the array we are merging in is empty just return arrayOne (arrayOne contains artifactStorage)
	if (typeof arrayTwo !== 'object'){
		return arrayOne;
	}

	// If the first array is blank, return the second array.
	if (arrayOne == []){
		return arrayTwo;
	}

	// Variable to hold items that need to be merged in.
	var newArray = arrayOne;

	// Figure out what items we need to merge in.
	for (var i = arrayTwo.length - 1; i >= 0; i--) {
		var match = false;

		for (var j = arrayOne.length - 1; j >= 0; j--) {
			if (arrayTwo[i].txid == arrayOne[j].txid){
				match = true;
				break;
			}
		}

		if (!match)
			newArray.push(arrayTwo[i]);
	}

	return newArray;
}

// Method Name: searchArtifact
// Description: Searches a single artifact for the searchTerm
// Paramaters: 
// 		- artifact: JSON Artifact Object
// 		- searchTerm: String of search term
// Returns: true if the artifact contains the searchTerm in any of its children, false if it does not at all.
var searchArtifact = function(artifact, searchTerm){
	for (key in artifact){
		var item = artifact[key];

		if (typeof item !== 'object') {
			if (typeof item === 'string'){
				if (item === searchTerm){
					return true;
				} else if (item.toLowerCase() === searchTerm.toLowerCase()){
					return true;
				} else if (item.indexOf(searchTerm) !== -1){
					return true;
				} else if (item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
					return true;
				} else if (item.toLowerCase().includes(searchTerm.toLowerCase())){
					return true;
				}
			} else if (item.toString().toLowerCase() === searchTerm.toLowerCase()){
				return true;
			}
		} else {
			var subresult = searchArtifact(item, searchTerm);

			// If the subresult returns true then it was a match.
			if (subresult)
				return true;
		}
	}

	// If the entire search fails, return false.
	return false;
}

// Expose LDD and all methods.
module.exports = new LDD();