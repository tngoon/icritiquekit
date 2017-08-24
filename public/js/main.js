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


$(function() {
	socket = io.connect('http://d.ucsd.edu', {path: '/api/icritiquekit/socket.io', secure: false})
	// socket = io();

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
		$("#need-specific").hide();
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
		$("#need-specific").hide();
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

  	socket.emit("suggestion inserted", {condition: "critiquekit", comment_text:submittedComment, cookie_val: cookie_val});

	});
}

//check for characteristics of comments
function checkComments() {
	var text = $("#comment-text").val();
	var wordlength = text.split(' ').length;
	var words = text.split(' ');
	
	//divs for different characteristics
	var opendefault = document.getElementById("open-default");
	var spec = document.getElementById("need-specific");
	var action = document.getElementById("need-actionable");
	var justify = document.getElementById("need-justify");
	var complete = document.getElementById("complete");
	var actjust = document.getElementById("act-justify");

	//checkboxes
	var speccheck = document.getElementById("speccheck");
	var actcheck = document.getElementById("actcheck");
	var justcheck = document.getElementById("justcheck");

	var submit = document.getElementById("submit-comment");

	setTimeout(function() {
		if (wordlength < 5) {
			spec.style.display = "block";
			opendefault.style.display = "none";
		} else if (wordlength > 5) {
			speccheck.checked = true;
			spec.style.display = "none";
			complete.style.display = "none";
			opendefault.style.display = "none";
		} else {
			opendefault.style.display = "block";
			speccheck.checked = false;
		}
		if(text.match(/(maybe|try|should|would|make|use|consider|remove|use|add|please)/gi)) {
			actcheck.checked = true;
			opendefault.style.display = "none";
			action.style.display = "none";
			actjust.style.display = "none";
		} 
		if(text.match(/(because|so|might|just)/gi)) {
			justcheck.checked = true;
			opendefault.style.display = "none";
			justify.style.display =  "none";
			actjust.style.display = "none";
		}
	}, 3500);

	//show/hide divs based on checkboxes
	if(speccheck.checked && !actcheck.checked && !justcheck.checked) {
		opendefault.style.display = "none";
		action.style.display = "none";
		actjust.style.display = "block";
		justify.style.display = "none";
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-warning');
	} else if(actcheck.checked && !justcheck.checked) {
		opendefault.style.display = "none";
		action.style.display = "none";
		actjust.style.display = "none";
		justify.style.display = "block";
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-warning');
	} else if(!actcheck.checked && justcheck.checked) {
		opendefault.style.display = "none";
		action.style.display = "block";
		justify.style.display = "none";
		actjust.style.display = "none";
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-warning');
	} else if(actcheck.checked && speccheck.checked && justcheck.checked) {
		opendefault.style.display = "none";
		action.style.display = "none";
		actjust.style.display = "none";
		spec.style.display = "none";
		justify.style.display = "none";
		action.style.display = "none";
		submit.classList.remove('btn-warning');
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-success');
	} 
}

// show and hide different suggestions based on checkboxes
function ShowHideDiv() {
	//divs for different characteristics
	var opendefault = document.getElementById("open-default");
	var spec = document.getElementById("need-specific");
	var action = document.getElementById("need-actionable");
	var justify = document.getElementById("need-justify");
	var complete = document.getElementById("complete");
	var actjust = document.getElementById("act-justify");

	//checkboxes
	var speccheck = document.getElementById("speccheck");
	var actcheck = document.getElementById("actcheck");
	var justcheck = document.getElementById("justcheck");

	var submit = document.getElementById("submit-comment");

	if(speccheck.checked && !actcheck.checked && !justcheck.checked) {
		opendefault.style.display = "none";
		actjust.style.display = "block";
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-warning');
	 } else if(speccheck.checked && !justcheck.checked) {
		complete.style.display = "none";;
		opendefault.style.display = "none";
		actjust.style.display = "none";
		spec.style.display = "none";
		action.style.display = "none";
		justify.style.display = "block";
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-warning');
	} else if(speccheck.checked && !actcheck.checked) {
		complete.style.display = "none";
		opendefault.style.display = "none";
		actjust.style.display = "none";
		spec.style.display = "none";
		justify.style.display = "none";
		action.style.display = "block";
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-warning');
	} else if(!speccheck.checked) {
		complete.style.display = "none";
		opendefault.style.display = "none";
		spec.style.display = "block";
		submit.classList.remove('btn-danger');
		submit.classList.add('btn-warning');
	} else {
		complete.style.display = "block";
		opendefault.style.display = "none";
		actjust.style.display = "none";
		spec.style.display = "none";
		justify.style.display = "none";
		action.style.display = "none";
		submit.classList.remove('btn-danger');
		submit.classList.remove('btn-warning');
		submit.classList.add('btn-success');
	}

	var checked = [];
	if(speccheck.checked) {
		var x = 1;
	} else {
		var x = 0
	}
	if(actcheck.checked) {
		var y = 1;
	} else {
		var y = 0;
	} if(justcheck.checked) {
		var z = 1;
	} else {
		var z = 0;
	}

	checked.push(x,y,z);
	console.log(checked);
	socket.emit('category clicked', {condition: "critiquekit", categories: checked, cookie_val: cookie_val})
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
	}

	if(input.length != 0 && input[0] != "") {
		for (var i=0; i<input.length; i++) {			
			if(/\S/.test(input[i])) {
				Comment['comment'] = $.trim(input[i]);

				if(speccheck.checked && actcheck.checked && justcheck.checked) {
					Comment['category'] = 111;
				} else if(speccheck.checked && !actcheck.checked && !justcheck.checked) {
					Comment['category'] = 100;
				} else if(speccheck.checked && actcheck.checked) {
					Comment['category']= 110;
				} else if(speccheck.checked && justcheck.checked) {
					Comment['category']= 101;
				} else if(!speccheck.checked && actcheck.checked && !justcheck.checked) {
					Comment['category']= 010;
				} else if(!speccheck.checked && !actcheck.checked && justcheck.checked) {
					Comment['category']= 001;
				} else if(!speccheck.checked && actcheck.checked && justcheck.checked) {
					Comment['category']= 011;
				} else {
					Comment['category']= 0;
				}
			}			
		}
		
	} else {
		alert("You can't submit an empty comment!");
	}

	Comment['condition'] = "critiquekit";
	obj.push(Comment);
	console.log(Comment);
	sessionStorage.setItem("allComments", JSON.stringify(obj));

	socket.emit('comment submitted', {condition:Comment.condition, comment:Comment.comment, category: Comment.category, cookie_val: cookie_val})
}

//show submitted comments
function showComments() {
	$("#submitted-comments").show();
	$("#open-default").hide();
	$("#need-specific").hide();
	$("#need-actionable").hide();
	$("#need-justify").hide();
	$("#act-justify").hide();
	$("#search").hide();

	var item = JSON.parse(sessionStorage.getItem("allComments"));
	console.log(item);
	var submitted = '';

	var item = JSON.parse(sessionStorage.getItem("allComments"));
	console.log(item);
	var submitted = '';
	for(i = 0; i < item.length; i++) {
		console.log(item[i].comment);
		submitted = item[i].comment + '<hr>'
		// document.getElementById("submitted-comments").innerHTML = item[i].comment;
		$("#submitted-comments").append('<b>' + 'Comment: ' + '</b>' + submitted);
	}
	$("#submitted-comments").append('<b>' + 'Comment: ' + '</b>' + submitted);
	socket.emit('showed comments', {condition: "control", cookie_val: cookie_val})
}

//filter suggestions based on what user is typing
function filterSuggestions() {
	var input = document.getElementById("search-bar");
	var box = document.getElementById("dynasuggestions");
	var list = box.getElementsByTagName("li");
	var filter = input.value.toUpperCase();
	// var timeout = null;

	for (i=0; i<list.length; i++) {
		a=list[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			list[i].style.display= "";
			// list[i].parentNode.insertBefore(list[i], list[i].previousSibling);
		} else {
			list[i].style.display = "none";
		}
	}
}

function loadDesign() {
	document.getElementById("design1").style.display="none";
	document.getElementById("design2").style.display="block";
	socket.emit('next design', {condition:"critiquekit", cookie_val: cookie_val});
}

function finishFeedback() {
	socket.emit('finished study', {condition: "critiquekit", cookie_val:cookie_val});
}


