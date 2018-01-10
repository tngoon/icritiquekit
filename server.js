var http=require('http');
var express=require('express');
var fs = require('fs');
const PORT = process.env.PORT || 8080;
const path = require('path');

const INDEX = path.join(__dirname, '/public');
const app = express();
const server = app
		.all('/', function(req, res, next) {
	    	res.header("Access-Control-Allow-Origin", "*");
	    	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    	next();
		})
		.use(express.static(__dirname + '/public'))
		.listen(PORT, () => console.log(`Listening on ${PORT}`));

const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage });

app.post('/submit-assignment', upload.single('my-assigment'), (req, res, next) => {
  console.log('hit submit-assignment endpoint');
  res.end();
})


require('./websocket-logging')(server);
