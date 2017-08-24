//set cookie so modal will only show once on first load
$(window).on('load', function() {
	if(!Cookies.get('modalShown')) {
		$('#consent-modal').modal('show');
		$('#consent-modal').load("consent.html");
		Cookies.set('modalShown', true, 2);
	} else {
		console.log("modal has been shown");
	}
})

//connect to server
$(function() {
	socket = io.connect('http://d.ucsd.edu', {path: '/api/icritiquekit/socket.io', secure: false})
	// socket = io();

	// check for cookie
	if (Cookies.get('critiquekit-cookie') != undefined) {
		cookie_val = Cookies.get('critiquekit-cookie').cookie_val;
		socket.emit('set cookie', cookie_val);
	} else {
		cookie_val = Math.random().toString(10) + new Date().getTime();
		Cookies.set('critiquekit-cookie', {condition: "control", cookie_val: cookie_val}, { expires: 7 });
		socket.emit('set cookie', cookie_val);
	}
});

$(function() {
	$('body').on('click', "#submit-comment", function() {
		$("#comment-text").val('');
	});
	$('body').on('click', "#cancel-comment", function() {
		$("#comment-text").val('');
		$("#submitted-comments").hide();
	});
})

//form validation to ensure consent form is clicked
function validateForm() {
	if(document.getElementById("consent_yes").checked) {
		document.getElementById("consent-button").classList.remove("disabled");
		socket.emit('consent', {cookie_val: cookie_val, consent:true});
		Cookies.set('critiquekit-cookie', {cookie_val: cookie_val, consent: true});	
	} else if (document.getElementById("consent_no").checked) {
		document.getElementById("consent-button").classList.remove("disabled");
		socket.emit('consent', {cookie_val: cookie_val, consent:false});
		Cookies.set('critiquekit-cookie', {cookie_val: cookie_val, consent: false});
	}
}

// Categorize and store comments after submitting
function submitComments() {
	var input = $('#comment-text').val().split(/\n/);
	var allComments = sessionStorage.getItem("allComments");
	var Comment = {};
	var obj = [];

	if(allComments) {
		obj=JSON.parse(allComments)
	}

	if(input.length != 0 && input[0] != "") {
		for (var i=0; i<input.length; i++) {	
			var wordlength = input[i].split(' ').length;	
			if(/\S/.test(input[i])) {
			Comment['comment'] = $.trim(input[i]);
				var isspecific;
				var isactionable;
				var isjustified;

				if (wordlength > 5) {
					isspecific = 1;
				} else {
					isspecific = 0;
				}
				if (Comment['comment'].match(/(maybe|try|should|would|make|use|consider|remove|use|add|please)/gi)) {
					isactionable = 1;
				} else {
					isactionable  = 0;
				} 
				if (Comment['comment'].match(/(because|so|might|just)/gi)) {
					isjustified = 1;
				} else {
					isjustified = 0;
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

			Comment['condition'] = "control";	
		}

		obj.push(Comment);
		console.log(Comment);
		sessionStorage.setItem("allComments", JSON.stringify(obj));

		//send to server
		socket.emit('comment submitted',  {condition:Comment.condition, comment:Comment.comment, category: Comment.category, cookie_val: cookie_val})
	} else {
		alert("You can't submit an empty comment!");
	}
}

//show submitted comments on click
function showComments() {
	$("#submitted-comments").show();

	var item = JSON.parse(sessionStorage.getItem("allComments"));
	console.log(item);
	var submitted = '';
	for(i = 0; i < item.length; i++) {
		console.log(item[i].comment);
		submitted = item[i].comment + '<hr>'
		// document.getElementById("submitted-comments").innerHTML = item[i].comment;
		$("#submitted-comments").append("Comment: " + submitted);
		socket.emit('showed comments', {condition: "control", cookie_val: cookie_val})
	}
}

function loadDesign() {
	document.getElementById("design1").style.display="none";
	document.getElementById("design2").style.display="block";
	socket.emit('next design', {condition:"critiquekit", cookie_val: cookie_val});
}

function finishFeedback() {
	socket.emit('finished study', {condition: "control", cookie_val:cookie_val});
}

