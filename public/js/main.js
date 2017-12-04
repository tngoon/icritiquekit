//set cookie so modal will only show once on first load
$(window).on('load', function() {
  if (!Cookies.get('modalShown')) {
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
  $('#rubric').load("rubric.html");
  $('#assignment-list').load("assignmentlist.html");
});

$(function() {
  // Run on server
  socket = io.connect('http://d.ucsd.edu', {
    path: '/api/icritiquekit/socket.io',
    secure: false
  })

  // Test on localhost
  //socket = io();

  // check for cookie
  if (Cookies.get('critiquekit-cookie') != undefined) {
    cookie_val = Cookies.get('critiquekit-cookie').cookie_val;
    socket.emit('set cookie', cookie_val);
  } else {
    cookie_val = Math.random().toString(10) + new Date().getTime();
    Cookies.set('critiquekit-cookie', {
      cookie_val: cookie_val
    }, {
      expires: 7
    });
    socket.emit('set cookie', cookie_val);
  }
});

//reset page w/o reloading when submit and cancel buttons hit
$(function() {
  $('body').on('click', "#submit-comment", function() {
    $("#feedback").val('');
    $('input:checkbox').prop('checked', false);
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
    $("#feedback").val('');
    $('input:checkbox').prop('checked', false);
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

$(function() {
  $(document).ready(function() {
    $("#rubricbtn").click(function() {
      $("#rubric").toggle();
      $("#indicators").toggle();
      if ($("#rubric").is(':hidden')) {
        document.getElementById("rubricbtn").innerHTML = "Rubric";
      } else {
        document.getElementById("rubricbtn").innerHTML = "Suggestions";
      }
    });
  });
})

//form validation to ensure consent form is clicked
function validateForm() {
  if (document.getElementById("consent_yes").checked) {
    document.getElementById("consent-button").classList.remove("disabled");
    socket.emit('consent', {
      cookie_val: cookie_val,
      consent: true
    });
    Cookies.set('critiquekit-cookie', {
      cookie_val: cookie_val,
      consent: true
    });
  } else if (document.getElementById("consent_no").checked) {
    document.getElementById("consent-button").classList.remove("disabled");
    socket.emit('consent', {
      cookie_val: cookie_val,
      consent: false
    });
    Cookies.set('critiquekit-cookie', {
      cookie_val: cookie_val,
      consent: false
    });
  }
}

// copy text of suggestion button to textbox
function copyText(x) {
  var currentTxt = document.getElementById("feedback").value;
  var submittedComment = x.innerHTML;
  document.getElementById("feedback").value = currentTxt + " " + submittedComment;
  $('#feedback').trigger('autoresize');
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
    } else if ($(this).parent('#actjust').length) {
      $("#actcheck").prop('checked', true);
      $("#justcheck").prop('checked', true);
    }
  });

  socket.emit("suggestion inserted", {
    condition: "critiquekit",
    comment_text: submittedComment,
    cookie_val: cookie_val
  });
}

//check for characteristics of comments
function checkComments() {
  var text = $("#feedback").val();
  var wordlength = text.split(' ').length;
  var words = text.split(' ');

  if (wordlength < 5) {
    $("#speccheck").prop('checked', false);
    document.getElementById("speccheck").innerHTML = "check_box_outline_blank";
  } else if (wordlength > 5) {
    document.getElementById("speccheck").innerHTML = "check_box";
  } else {
    document.getElementById("speccheck").innerHTML = "check_box_outline_blank";
  };

  if (text.match(/(maybe|try|should|would|make|use|consider|remove|use|add|please)/gi)) {
    document.getElementById("actcheck").innerHTML = "check_box";
  } else {
    document.getElementById("actcheck").innerHTML = "check_box_outline_blank";
  }

  if (text.match(/(because|so|might|just)/gi)) {
    document.getElementById("justcheck").innerHTML = "check_box";
  } else {
    document.getElementById("justcheck").innerHTML = "check_box_outline_blank";
  }
}

//store comments as JSON
function submitComments() {
  var input = $('#feedback').val().split(/\n/);
  var allComments = sessionStorage.getItem("allComments");
  var Comment = {};
  var obj = [];

  var speccheck = document.getElementById("speccheck");
  var actcheck = document.getElementById("actcheck");
  var justcheck = document.getElementById("justcheck");

  if (allComments) {
    obj = JSON.parse(allComments)
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

  for (i = 0; i < item.length; i++) {
    // console.log(item[i].comment);
    submitted = item[i].comment + '<hr>'
  }
  $("#submitted-comments").append('<b>' + 'Comment: ' + '</b>' + submitted);

  socket.emit('comment submitted', {
    condition: Comment.condition,
    comment: Comment.comment,
    category: Comment.category,
    cookie_val: cookie_val
  })
}

//show submitted comments
function showComments() {
  $("#submitted-comments").show();
  $("#need-actionable").hide();
  $("#need-justify").hide();
  $("#act-justify").hide();

  // Toggle buttons
  $("#view-comments").hide();
  $("#hide-comments").show();

  socket.emit('showed comments', {
    condition: "critiquekit",
    cookie_val: cookie_val
  })
}

//hide submitted comments
function hideComments() {
  $("#submitted-comments").hide();

  // Toggle buttons
  $("#view-comments").show();
  $("#hide-comments").hide();

  socket.emit('hid comments', {
    condition: "critiquekit",
    cookie_val: cookie_val
  })
}

function parseAssignmentJSON() {
  var studentList = [{
      "Student ID": "A13342434",
      "Student Name": "Jack F.",
      "Assignment Number": "02",
      "Reviewed": "true"
    },
    {
      "Student ID": "A13342234",
      "Student Name": "May F.",
      "Assignment Number": "02",
      "Reviewed": "false"
    },
    {
      "Student ID": "A13346734",
      "Student Name": "Jack G.",
      "Assignment Number": "02",
      "Reviewed": "true"
    },

  ]

  var col = [];
  for (var i = 0; i < studentList.length; i++) {
    for (var key in studentList[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  var table = document.createElement("table");

  var tr = table.insertRow(-1);

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  for (var i = 0; i < studentList.length; i++) {

    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = studentList[i][col[j]];
    }
  }

  var divContainer = document.getElementById("showTable");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}
