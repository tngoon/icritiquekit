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
	// $("#navbar-container").load("public/navbar.html");
	// $("#indicators").load("public/indicators.html")
	// $('#dynasuggestions').load("public/dynasuggestions.html")
	$('#help-modal').load("public/help.html")
});

//form validation to ensure consent form is clicked
function validateForm() {
	if(document.getElementById("consent_yes").checked) {
		document.getElementById("consent-button").classList.remove("disabled");
		socket.emit('consent', {cookie_val: cookie_val, consent:true});
		Cookies.set('critiquekit-cookie', {cookie_val: cookie_val, consent: true});	
		console.log('working');
	} else if (document.getElementById("consent_no").checked) {
		document.getElementById("consent-button").classList.remove("disabled");
		socket.emit('consent', {cookie_val: cookie_val, consent:false});
		Cookies.set('critiquekit-cookie', {cookie_val: cookie_val, consent: false});
	}
}

// Categorize and store comments after submitting
function submitComments() {
	var input = $('#comment-text').val().split(/\n/);
	var wordlength = input.split(' ').length;
	var allComments = localStorage.getItem("allComments");
	var Comment = {};
	var obj = [];

	if(allComments) {
		obj=JSON.parse(allComments)
	}

	if(input != "") {
		for (var i=0; i<input.length; i++) {		
			if(/\S/.test(input[i])) {
			Comment['comment'] = $.trim(input[i]);
				if (wordlength > 5) {
					var  specific == 1;
				} else {
					var specific == 0;
				}
				if (input.match(/(maybe|try|should|would|make|use|consider|remove|use|add|please)/gi)) {
					var isactionable == 1;
				} else {
					var isactionable  == 0;
				} 
				if (text.match(/(because|so|might|just)/gi)) {
					var isjustified == 1;
				} else {
					var isjustified == 0;
				}

				if (isspecific==1 && isactionable == 1 && isjustified == 1) {
					Comment['category'] = 111;
				} else if(isspecific == 1 && isactionable == 1 && isjustified == 0) {
					Comment['category'] = 110;
				} else if(isspecific == 1 && isactionable == 0 && isjustified == 1) {
					Comment['category'] = 110;
				} else if(isspecific == 0 && isactionable == 1 && isjustified == 0) {
					Comment['category'] = 010;
				} else if(isspecific == 0 && isactionable == 0 && isjustified == 1) {
					Comment['category'] = 001;
				} else if(isspecific == 0 && isactionable == 1 && isjustified == 1) {
					Comment['category'] = 011;
				} else {
					Comment['category'] = 0;
				}
			}	
		}
	} else if(input == "") {
		alert("You can't submit an empty comment!");
	}

	obj.push(Comment);
	console.log(Comment);
	console.log(Comment.category)
	sessionStorage.setItem("allComments", JSON.stringify(obj));

	//reset textbox value to blank
	$("#comment-text").val('');
	
	//reset the Submit button
	$("#submit-comment").className = '';
	$("#submit-comment").addClass('btn btn-danger');

	//send to server
	socket.emit('comment submitted',  {condition: "control", comment:Comment.comment, category: Comment.category, cookie_val: cookie_val})
}

//show submitted comments on click
function showComments() {
	$("#submitted-comments").show();

	var item = JSON.parse(localStorage.getItem("allComments"));
	console.log(item);
	var submitted = '';
	for(i = 0; i < item.length; i++) {
		console.log(item[i].comment);
		submitted = 'Comment: ' + item[i].comment + '<hr>'
		// document.getElementById("submitted-comments").innerHTML = item[i].comment;
		$("#submitted-comments").append(submitted);
		socket.emit('showed comments', {condition: "control", cookie_val: cookie_val})
	}
}

function loadDesign() {
	document.getElementById("design1").style.display="none";
	document.getElementById("design2").style.display="block";
}


