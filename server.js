var http=require('http');
var express=require('express');
var jsonfile=require('jsonfile');
var fs = require('fs');
// var request = require('request');
var socketIO = require('socket.io');
const PORT = process.env.PORT || 8080;
const path = require('path');

const INDEX = path.join(__dirname, '/public');
const CONTROL = path.join(__dirname)
const server = express()
		.use(express.static(__dirname + '/public'))
		.listen(PORT, () => console.log('Listening on ${PORT}'));

function updateJSON(file, obj) {
	jsonfile.writeFile(file, obj, {spaces: 4}, function (err) {
		console.error(err);
	});
}

var sockets = {};
var logs = {"logs": []};
var log_file = "logs.json";
var user_data = {};
var user_file = "user_data.json";
var comments = {};
var comment_obj = [];
var comments_file = "comments.json";
var design_data = [];
var design_file = "design_data.json"

const io = socketIO(server);

function saveNewComment(data, category, address, new_comment) {
	comments.push({"comment": new_comment,
		"category": category,
		"length": new_comment.split(" ").length,
		"user": address,
		"design_id": design_id});

	updateJSON(comments_file, comments);

	logs.push({"time": new Date().getTime(),
					"user": address,
					"event": "comment submitted",
					"category": category,
					"comment": data.comment_text,
					"design_id": data.design_id});
	updateJSON(log_file, logs);
}
 

io.on('connection', function(socket) {
	var address = socket.handshake.address;
	if (address == undefined) address = "local";
	console.log('New connection from ' + address);

	sockets[address] = socket.id;

	socket.on('set cookie', function(address) {
		console.log('setting cookie');
		console.log('address');
		logs.push({"time": new Date().getTime(),
						"user": address,
						"event": "new connection"});

		updateJSON(log_file, logs);
	});

	socket.on('consent', function(data) {
		user_data[data.address]["consent"] = data.consent;
		updateJSON(user_file, user_data);
	});

	socket.on('loaded design', function(data) {
		logs.push({"time": new Date().getTime(),
						"user": data.address,
						"event": "loaded design",
						"design_id": data.design_id})
	});

	socket.on('suggestion inserted', function(data) {
		logs.push({"time": new Date().getTime(),
						"user": data.address,
						"event": "inserted suggestion",
						"comment ID": data.comment_id,
						"suggestion text": data.suggestion_text,
						"comment text": data.comment_text,
						"selection length": data.suggestion_length,
						"design_id": data.design_id});

		updateJSON(log_file, logs);
	});

	socket.on('user category added', function(data) {
		logs.push({"time": new Date().getTime(),
					"user": data.address,
					"event": "added category",
					"comment_text":  data.comment_text,
					"category_added": data.category_add,
					"design_id": data.design_id});

		updateJSON(log_file, logs);
	});

	socket.on('user category removed', function(data) {
  		logs.push({ "time": new Date().getTime(), 
  						"user": data.userid,
  						"event": "removed category", 
  						"comment text": data.comment_text,
  						"category removed": data.category_remove,
  						"design_id": data.design_id}); 
  		updateJSON(log_file, logs);	
	});
})

