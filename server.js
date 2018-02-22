var http=require('http');
var express=require('express');
var jsonfile=require('jsonfile');
var fs = require('fs');
// var request = require('request');
var socketIO = require('socket.io');
const PORT = process.env.PORT || 8080;
const path = require('path');

// Load JSON files
var commentsData = require('./public/json/comments.json');
var studentList = require('./public/json/studentList.json');

const INDEX = path.join(__dirname, '/public');
const server = express()
		.all('/', function(req, res, next) {
	    	res.header("Access-Control-Allow-Origin", "*");
	    	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    	next();
		})
		.use(express.static(__dirname + '/public'))
		.listen(PORT, () => console.log(`Listening on ${PORT}`));

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
var design_file = "design_data.json";

const io = socketIO(server);

// function saveNewComment(data, category, address, new_comment) {
// 	comments.push({"comment": new_comment,
// 		"category": category,
// 		"length": new_comment.split(" ").length,
// 		"user": address,
// 		"design_id": design_id});

// 	updateJSON(comments_file, comments);

// 	logs.logs.push({"time": new Date().getTime(),
// 					"user": address,
// 					"event": "comment submitted",
// 					"category": category,
// 					"comment": data.comment_text,
// 					"design_id": data.design_id});
// 	updateJSON(log_file, logs);
// }


io.on('connection', function(socket) {
	var address = socket.handshake.headers['x-forwarded-for'];
	if (address == undefined) address = "local";
	console.log('New connection from ' + address);

	sockets[address] = socket.id;
	console.log(sockets);

	socket.on('set cookie', function(cookie_val) {
		console.log('setting cookie');
		console.log(cookie_val);
		logs.logs.push({"time": new Date().getTime(),
						"user": cookie_val,
						"event": "new connection"});

		updateJSON(log_file, logs);

		if (user_data[cookie_val] == undefined) {
			console.log("starting new save");
			user_data[cookie_val] = {};
			user_data[cookie_val]["comments"] = [];
			updateJSON(user_file, user_data);
		}
	});

	socket.on('consent', function(data) {
		user_data[data.cookie_val]["consent"] = data.consent;
		updateJSON(user_file, user_data);
	});

	socket.on('suggestion inserted', function(data) {
		logs.logs.push({"time": new Date().getTime(),
						"user": data.cookie_val,
						"condition": data.condition,
						"event": "inserted suggestion",
						"comment ID": data.comment_id,
						"comment text": data.comment_text});

		updateJSON(log_file, logs);
	});

/*
	socket.on('comment submitted', function(data) {

  		// save to user data
  		user_data[data.cookie_val].comments.push({"comment": data.comment,
  									"category": data.category,
  									"condition": data.condition});
  		updateJSON(user_file, user_data);

  		logs.logs.push({"time": new Date().getTime(),
  						"condition": data.condition,
						"user": data.cookie_val,
						"event": "submitted comment",
						"comment": data.comment});

		updateJSON(log_file, logs);
	});
  */

	socket.on('showed comments', function(data) {
		logs.logs.push({"time": new Date().getTime(),
						"condition": data.condition,
						"user": data.cookie_val,
						"event": "showed comments"});
		updateJSON(log_file, logs);
	});

	socket.on('next design', function(data) {
		logs.logs.push({"time": new Date().getTime(),
					"condition": data.condition,
					"user": data.cookie_val,
					"event": "clicked next design"});
		updateJSON(log_file, logs);
	});

	socket.on('category clicked', function(data) {
		user_data[data.cookie_val].comments.push({"categories": data.categories});
		updateJSON(user_file, user_data);

		logs.logs.push({"time": new Date().getTime(),
						"condition": data.condition,
						"user": data.cookie_val,
						"event": "clicked categories",
						"categories": data.categories});
	});

	socket.on('finished study', function(data) {
		logs.logs.push({"time": new Date().getTime(),
						"condition": data.condition,
						"user": data.cookie_val})
	})

  socket.on('requestStudentList', function() {
    socket.emit('studentList', studentList);
  });

});
