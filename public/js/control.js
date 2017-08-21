// Store comments after submitting
function storeComments() {
	var input = $('#comment-text').val().split(/\n/);
	var allComments = localStorage.getItem("allComments");
	var Comment = {};
	var obj = [];

	if(allComments) {
		obj=JSON.parse(allComments)
	}

	for (var i=0; i<input.length; i++) {
		
		if(/\S/.test(input[i])) {
			Comment['comment'] = $.trim(input[i]);
		}
		
	}

	obj.push(Comment);
	console.log(Comment);
	localStorage.setItem("allComments", JSON.stringify(obj));
	// Cookies.set("allComments", true, 1);
	//reset textbox value to blank
	$("#comment-text").val('');
	
	//reset the Submit button
	$("#submit-comment").className = '';
	$("#submit-comment").addClass('btn btn-danger');
}

//show submitted comments on click
function showComments() {
	$("#submitted-comments").show();
	// var item = Cookies.getJSON('allComments');
	var item = JSON.parse(localStorage.getItem("allComments"));
	console.log(item);
	var submitted = '';
	for(i = 0; i < item.length; i++) {
		console.log(item[i].comment);
		submitted = 'Comment: ' + item[i].comment + '<hr>'
		// document.getElementById("submitted-comments").innerHTML = item[i].comment;
		$("#submitted-comments").append(submitted);
	}
}

//form validation to ensure consent form is clicked
function validateForm(x) {
	if(x.checked) {
		document.getElementById("consent-button").classList.remove("disabled");
	} else {
		return false;
	}
}

//set cookie so modal will only show once on first load
$(window).on('load', function() {
	if(!Cookies.get('modalShown')) {
		$('#consent-modal').modal('show');
		$('#consent-modal').load("public/consent.html");
		Cookies.set('modalShown', true, 2);
	} else {
		console.log("modal has been shown");
	}
})

// load html files in correct divs
$(function() {
	$("#navbar-container").load("public/navbar.html");
	$("#indicators").load("public/indicators.html")
	$('#dynasuggestions').load("public/dynasuggestions.html")
	$('#help-modal').load("public/help.html")
});