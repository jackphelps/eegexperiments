var nodeThinkGear = require('node-neurosky');
var http = require('http');
var fs = require('fs');

var eegjson = "";

function getjson() {
	console.log(eegjson[eegjson - 1]);
	return JSON.stringify(eegjson) || "WHAT";
}

function refresh_file(data) {

	fs.writeFile("data.json", data, function(err) {
    	if(err) {
    	    console.log(err);
    	}
	}); 
}

http.createServer(function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/json'});
  res.header("Access-Control-Allow-Methods","GET, POST, OPTIONS"); 
  res.end(getjson());
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var tgClient = nodeThinkGear.createClient({
	appName:'NodeThinkGear',
	appKey:'00000141b4b45c675cc8d3a765b8d71c5bde9390'
});

tgClient.on('data',function(data){
	eegjson = data;
	console.log(data);
	refresh_file(JSON.stringify(data));
});

tgClient.connect();