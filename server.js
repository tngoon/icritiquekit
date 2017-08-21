var http=require('http');
var express=require('express');
var jsonfile=require('jsonfile');
var path = require('path');
const PORT = process.env.PORT || 8080;
const path = require('path');

const INDEX = path.join(__dirname, '/public');
const CONTROL = path.join(__dirname)
const server = express()
		.use(express.static(__dirname + '/public'))
		.listen(PORT, () => console.log('Listening on ${PORT}'));

var logs = {"logs": []};
var log_file = "logs.json"
var file = "comments.json"


function updateJSON(file, obj) {
	jsonfile.writeFile(file, obj, {spaces: 4}, function (err) {
		console.error(err);
	});
}