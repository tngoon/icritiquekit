//set cookie so modal will only show once on first load
$(window).on('load', function() {
	if(!Cookies.get('modalShown')) {
		$('#consent-modal').modal('show');
		// $('#consent-modal').load("consent.html");
		$('#consent-modal').load("../consent.html");
		Cookies.set('modalShown', true, 2);
	} else {
		console.log("modal has been shown");
	}
})

// load html files in correct divs
$(function() {
	// $("#navbar-container").load("navbar.html");
	// $("#indicators").load("indicators.html")
	// $('#dynasuggestions').load("dynasuggestions.html")
	// $('#help-modal').load("help.html")
	$("#navbar-container").load("../navbar.html");
	$("#indicators").load("../indicators.html");
	$('#dynasuggestions').load("../dynasuggestions.html");
	$('#help-modal').load("../help.html");

});

//form validation to ensure consent form is clicked
function validateForm(x) {
	if(x.checked) {
		document.getElementById("consent-button").classList.remove("disabled");
	} else {
		return false;
	}
}

// copy text of suggestion button to textbox
function copyText(x) {
		var currentTxt = document.getElementById("comment-text").value;
		document.getElementById("comment-text").value = currentTxt + " " + x.innerHTML;
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

  			socket.emit("suggestion inserted", {comment_id: comment_id, comment_text:comment, design_id:design_id, userid: address});

		});
	}



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
			// $("#specific").show();
			// $("#open-default").hide();
			spec.style.display = "block";
			opendefault.style.display = "none";
		} else if (wordlength > 5) {
			// $("#speccheck").prop('checked', true);
			// $("#specific").hide();
			// $("#open-default").hide();
			// $("#complete").hide();
			speccheck.checked = true;
			spec.style.display = "none";
			complete.style.display = "none";
			opendefault.style.display = "none";
		} else {
			// $("#speccheck").prop('checked', false);
			// $("#open-default").hide();
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
	}, 4000);

	//auto-check based on keyword search
	// if(text.match(/(maybe|try|should|would|make|use|consider|remove|use|add)/gi)) {
	// 	actcheck.checked = true;
	// 	opendefault.style.display = "none";
	// 	action.style.display = "none";
	// 	actjust.style.display = "none";
	// } 

	// if(text.match(/(because|so|might|just)/gi)) {
	// 	justcheck.checked = true;
	// 	opendefault.style.display = "none";
	// 	justify.style.display =  "none";
	// 	actjust.style.display = "none";
	// }
	//show/hide divs based on checkboxes
	if(speccheck.checked && !actcheck.checked && !justcheck.checked) {
		opendefault.style.display = "none";
		action.style.display = "block";
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
		complete.style.display = "block";
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

	if(input != "") {
		for (var i=0; i<input.length; i++) {			
			if(/\S/.test(input[i])) {
				Comment['comment'] = $.trim(input[i]);

				if(speccheck.checked && actcheck.checked && justcheck.checked) {
					Comment['category'] = 111;
				} else if(speccheck.checked && actcheck.checked) {
					Comment['category']= 110;
				} else if(speccheck.checked && justcheck.checked) {
					Comment['category']= 101;
				} else if(!speccheck.checked && actcheck.checked && !justcheck.checked) {
					Comment['category']= 010;
				} else if(!speccheck.checked && !actcheck.checked && justcheck.checked) {
					Comment['category']= 101;
				} else if(!speccheck.checked && actcheck.checked && justcheck.checked) {
					Comment['category']= 011;
				} else {
					Comment['category']= 0;
				}
			}			
		}
	} else if(input == "") {
		alert("You can't submit an empty comment!");
	}
	console.log(Comment.category)
	obj.push(Comment);
	console.log(Comment);
	sessionStorage.setItem("allComments", JSON.stringify(obj));
}

function resetPage() {
	$("#comment-text").val('');
	$("#open-default").show();
	$("#complete").hide();
	$("#need-specific").hide();
	$("#need-actionable").hide();
	$("#need-justify").hide();
	$("#act-justify").hide();
	$("#submit-comment").className = '';
	$("#submit-comment").addClass('btn btn-danger');
	$("#actcheck").prop('checked', false);
	$("#justcheck").prop('checked', false);
	$("#speccheck").prop('checked', false);

}

//show submitted comments
function showComments() {
	$("#submitted-comments").show();
	$("#open-default").hide();
	$("#need-specific").hide();
	$("#need-actionable").hide();
	$("#need-justify").hide();
	$("#act-justify").hide();
	// var item = Cookies.getJSON('allComments');
	var item = JSON.parse(sessionStorage.getItem("allComments"));
	console.log(item);
	var submitted = '';

	for(i = 0; i < item.length; i++) {
		console.log(item[i].comment);
		submitted = item[i].comment + '<hr>'
		// document.getElementById("submitted-comments").innerHTML = item[i].comment;
		$("#submitted-comments").append(submitted);
	}
}

//filter suggestions based on what user is typing
function filterSuggestions() {
	var input = document.getElementById("comment-text");
	var box = document.getElementById("dynasuggestions");
	var list = box.getElementsByTagName("li");
	var filter = input.value.toUpperCase();
	var words = $("#comment-text").val().split(' ');
	// var timeout = null;

	for (i=0; i<list.length; i++) {
		a=list[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().match(words)) {
			// list[i].style.display= "";
			list[i].parentNode.insertBefore(list[i], list[i].previousSibling);
		} else {
			// list[i].style.display= "";
			// list[i].parentNode.insertAfter(list[i], list[i].nextSibling);
		}
	}
}



