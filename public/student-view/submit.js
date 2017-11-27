function promptUpload() {
	$('#fileupload').trigger('click');
	setTimeout(function () {
		document.location = 'submitview.html'
	}, 4000);
}

function confirmSuccess() {
	setTimeout(function () {
		Materialize.toast('Submission Successful!', 4000)
	}, 1500);
}

function toggleResubmitButton() {
	document.getElementById("submit-btn").style.visibility = "hidden";
	document.getElementById("resubmit-btn").style.visibility = "visible";
}

$(document).ready(function () {
	// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
	$('.modal').modal();
});