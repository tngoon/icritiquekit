var http=require('http');
var express=require('express');
var jsonfile=require('jsonfile');
var path = require('path');
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
var comments = "comments.json";

const io = socketIO(server);

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

	
})



function saveNewComment(data, category, address, new_comment) {
	JSON.parse()
	new_id = parseInt()
}
