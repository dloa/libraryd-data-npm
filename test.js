var LDD = require('./index.js');

/*
console.log(new Date().getTime())
LDD.getArtifact('fb7560ad53d4299b55250583f2f5c7975cd6e0c3c5b587cb49d7eee1799b58cf', function(data){
	console.log(JSON.stringify(data));
	console.log(new Date().getTime());
});*/

console.log(new Date().getTime());
LDD.search('', function(data){
	console.log(data.length);
	console.log(new Date().getTime());

	LDD.search('test', function(data2){
		var tmpstr = '';

		for (var i = 0; i < data.length; i++) {
			var match = false;
			for (var j = 0; j < data2.length; j++) {
				if (data[i].txid == data2[j].txid)
					match = true;
			}

			if (!match)
				tmpstr += data[i].txid + ',';
		}

		if (tmpstr === '')
			tmpstr = 'No unmatched results';

		//console.log(tmpstr);
		console.log(data2.length);
		console.log(new Date().getTime());
	});
});

