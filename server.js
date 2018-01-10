var http=require('http');
var express=require('express');
var fs = require('fs');
const PORT = process.env.PORT || 8080;
const path = require('path');

const INDEX = path.join(__dirname, '/public');
const server = express()
		.all('/', function(req, res, next) {
	    	res.header("Access-Control-Allow-Origin", "*");
	    	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    	next();
		})
		.use(express.static(__dirname + '/public'))
		.listen(PORT, () => console.log(`Listening on ${PORT}`));

require('./websocket-logging')(server);
