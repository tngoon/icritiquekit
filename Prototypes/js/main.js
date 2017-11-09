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

$(function() {
	// load html files in correct divs
	$("#navbar-container").load("navbar.html");
	$("#indicators").load("indicators.html");
	$('#dynasuggestions').load("dynasuggestions.html");
	$('#help-modal').load("help.html");
});

$(function () {
	// Run on server
	socket = io.connect('http://d.ucsd.edu', {path: '/api/icritiquekit/socket.io', secure: false})

	// Test on localhost
	//socket = io();

	// check for cookie
	if (Cookies.get('critiquekit-cookie') != undefined) {
		cookie_val = Cookies.get('critiquekit-cookie').cookie_val;
		socket.emit('set cookie', cookie_val);
	} else {
		cookie_val = Math.random().toString(10) + new Date().getTime();
		Cookies.set('critiquekit-cookie', {cookie_val: cookie_val}, { expires: 7 });
		socket.emit('set cookie', cookie_val);
	}
});

//reset page w/o reloading when submit and cancel buttons hit
$(function() {
	$('body').on('click', "#submit-comment", function() {
		$("#comment-text").val('');
		$('input:checkbox').prop('checked', false);
		$("#open-default").show();
		$("#complete").hide();
		$("#need-actionable").hide();
		$("#need-justify").hide();
		$("#act-justify").hide();
		$("#submit-comment").className = '';
		$("#submit-comment").addClass('btn btn-danger');
		$("#search-bar").val('');
	});
});

$(function() {
	$('body').on('click', "#cancel-comment", function() {
		$("#comment-text").val('');
		$('input:checkbox').prop('checked', false);
		$("#open-default").show();
		$("#complete").hide();
		$("#need-actionable").hide();
		$("#need-justify").hide();
		$("#act-justify").hide();
		$("#submitted-comments").hide();
		$("#search").show();
		$("#submit-comment").className = '';
		$("#submit-comment").addClass('btn btn-danger');
		$("#search-bar").val('');
	});
})

$(function() {
	$('body').on('keydown', "#comment-text", function() {
		$("#submitted-comments").hide();
	})
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

// copy text of suggestion button to textbox
function copyText(x) {
	var currentTxt = document.getElementById("comment-text").value;
	var submittedComment = x.innerHTML;
	document.getElementById("comment-text").value = currentTxt + " " + submittedComment;
	//if suggestion clicked, move to top of list
	$("li").click(function() {
  		$(this).parent().prepend($(this));

  	//check boxes if suggestion checked fits these categories
	  	if ($(this).parent('#specific').length) {
	  		$("#speccheck").prop('checked', true);
	  	} else if ($(this).parent('#action').length) {
	  		$("#actcheck").prop('checked', true);
	  	} else if ($(this).parent('#justify').length) {
	  		$("#justcheck").prop('checked', true);
	  	} else if($(this).parent('#actjust').length) {
	  		$("#actcheck").prop('checked', true);
	  		$("#justcheck").prop('checked', true);
	  	}
	});

	socket.emit("suggestion inserted", {condition: "critiquekit", comment_text:submittedComment, cookie_val: cookie_val});
}

//check for characteristics of comments
function checkComments() {
	var text = $("#comment-text").val();
	var wordlength = text.split(' ').length;
	var words = text.split(' ');
	
	if(wordlength < 5) {
		$("#speccheck").prop('checked', false);
	} else if (wordlength > 5) {
		$("#speccheck").prop('checked', true);
		$("#open-default").hide();
		$("#complete").hide();
	} else {
		$("#open-default").hide();
		$("#speccheck").prop('checked', false)
	};
		
	if(text.match(/(maybe|try|should|would|make|use|consider|remove|use|add|please)/gi)) {
		$('#actcheck').prop('checked', true);
		$('#open-default').hide();
		$('#need-actionable').hide();
		$('#act-justify').hide();		
	} 
	if(text.match(/(because|so|might|just)/gi)) {
		$('#justcheck').prop('checked', true);
		$("#need-justify").hide();
		$('#act-justify').hide();
	}

	//checkboxes
	var speccheck = document.getElementById("speccheck");
	var actcheck = document.getElementById("actcheck");
	var justcheck = document.getElementById("justcheck");

	//show/hide divs based on checkboxes
	if(speccheck.checked && !actcheck.checked && !justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").hide();
		$("#need-justify").hide();
		$("#act-justify").show();
		$("#submit-comment").removeClass('btn-danger');
		$("#submit-comment").addClass('btn-warning');
	} else if(actcheck.checked && !justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").hide();
		$("#need-justify").show();
		$("#act-justify").hide();
	} else if(!actcheck.checked && justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").show();
		$("#need-justify").hide();
		$("#act-justify").hide();
	} else if(actcheck.checked && speccheck.checked && justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").hide();
		$("#need-justify").hide();
		$("#act-justify").hide();
		$("#complete").show();
	} 
}

// show and hide different suggestions based on checkboxes
function ShowHideDiv() {

	//checkboxes
	var speccheck = document.getElementById("speccheck");
	var actcheck = document.getElementById("actcheck");
	var justcheck = document.getElementById("justcheck");

	if(speccheck.checked && !actcheck.checked && !justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").hide();
		$("#need-justify").hide();
		$("#act-justify").show();
	} else if(actcheck.checked && !justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").hide();
		$("#need-justify").show();
		$("#act-justify").hide();
	} else if(!actcheck.checked && justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").show();
		$("#need-justify").hide();
		$("#act-justify").hide();
	} else if(actcheck.checked && speccheck.checked && justcheck.checked) {
		$("#open-default").hide();
		$("#need-actionable").hide();
		$("#need-justify").hide();
		$("#act-justify").hide();
		$("#complete").show();
	}

	socket.emit('category clicked', {condition: "critiquekit", cookie_val: cookie_val})
}

//store comments as JSON
function submitComments() {
	var input = $('#comment-text').val().split(/\n/);
	var allComments = sessionStorage.getItem("allComments");
	var Comment = {};
	var obj = [];

	var speccheck = document.getElementById("speccheck");
	var actcheck = document.getElementById("actcheck");
	var justcheck = document.getElementById("justcheck");

	if(allComments) {
		obj=JSON.parse(allComments)
	} else {
		alert("You can't submit an empty comment!");
	}

	Comment['condition'] = "critiquekit";
	obj.push(Comment);
	console.log(Comment);
	sessionStorage.setItem("allComments", JSON.stringify(obj));

	var item = JSON.parse(sessionStorage.getItem("allComments"));
		console.log(item);
		var submitted = '';

		for(i = 0; i < item.length; i++) {
			// console.log(item[i].comment);
			submitted = item[i].comment + '<hr>'
		}
		$("#submitted-comments").append('<b>' + 'Comment: ' + '</b>' + submitted);

	socket.emit('comment submitted', {condition:Comment.condition, comment:Comment.comment, category: Comment.category, cookie_val: cookie_val})
}

//show submitted comments
function showComments() {
	$("#submitted-comments").show();
	$("#open-default").hide();
	$("#need-actionable").hide();
	$("#need-justify").hide();
	$("#act-justify").hide();

	// Toggle buttons
	$("#view-comments").hide();
	$("#hide-comments").show();

	socket.emit('showed comments', {condition: "critiquekit", cookie_val: cookie_val})
}

//hide submitted comments
function hideComments() {
	$("#submitted-comments").hide();
	$("#open-default").show();

	// Toggle buttons
	$("#view-comments").show();
	$("#hide-comments").hide();

	socket.emit('hid comments', {condition: "critiquekit", cookie_val: cookie_val})
}

