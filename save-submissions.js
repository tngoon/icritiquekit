var formidable = require('formidable');
var fs = require('fs');

var quarterDir = "/public/ixd-w18";
var assignmentNum = "A1";
var assignmentDir = "/assignment-" + assignmentNum;
var uploadDir = __dirname + quarterDir + assignmentDir + "/";

module.exports = {
	processForm: function (req, res) {
		var form = new formidable.IncomingForm({
			uploadDir: __dirname + quarterDir + "/",
			keepExtensions: "true"
		});

		console.log(form);

		form.on('error', function (err) { console.log(err); });
		form.on('aborted', function () { console.log('Aborted'); });
		form.on('file', function (name, file) { console.log('file=' + file); });

		form.parse(req, function (err, fields, files) {
			var oldpath = files.assignment.path;
			var newpath = __dirname + quarterDir + "/" + fields.pid + ".pdf";
			fs.rename(oldpath, newpath, function (err) {
				if (err) throw err;
			});
			console.log(files);
			console.log(fields);
			console.log("PID: " + fields.pid);
			console.log(files.assignment);
		})

		res.write('File uploaded and moved!');
	}
}