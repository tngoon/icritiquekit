var formidable = require('formidable');
var fs = require('fs');

var assignmentNum = "A1";
var quarterDir = "/public/ixd-w18";
var assignmentDir = "/assignment-" + assignmentNum;
var submissionDir = __dirname + quarterDir + assignmentDir + "/";

module.exports = {
	processForm: function (req, res) {
		var form = new formidable.IncomingForm({
			uploadDir: submissionDir,
			keepExtensions: "true"
		});

		form.on('error', function (err) { console.log(err); });
		form.on('aborted', function () { console.log('Aborted'); });

		form.parse(req, saveVersion);

		res.write('File uploaded and moved!');
	}
}

// Saves the file with the correct version number
// * Only works correctly if previous versions are not deleted
function saveVersion(err, fields, files) {
	var versionNumber = 0;
	var extension = ".pdf";
	var oldpath = files.assignment.path;
	var newpath;

	// Determine the correct version number for submission
	do {
		versionNumber++;
		newpath = submissionDir + fields.pid + "-" + versionNumber + extension;
	} while (fsExistsSync(newpath));

	fs.rename(oldpath, newpath, function (err) {
		if (err) throw err;
	});
}

// Returns true if the path exists and false otherwise
function fsExistsSync(path) {
	try {
		fs.accessSync(path);
		return true;
	} catch (error) {
		return false;
	}
}