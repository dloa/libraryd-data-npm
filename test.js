var LDD = require('./index.js');

LDD.getArtifact('fb7560ad53d4299b55250583f2f5c7975cd6e0c3c5b587cb49d7eee1799b58cf', function(data){
	console.log(JSON.stringify(data));
});