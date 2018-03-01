// Initialize Firebase
var config = {
  apiKey: "AIzaSyDP0C5kLZ37Gt7lhoEAsQ5dQ1pXgCYRSPM",
  authDomain: "critiquekit-2df57.firebaseapp.com",
  databaseURL: "https://critiquekit-2df57.firebaseio.com",
  projectId: "critiquekit-2df57",
  storageBucket: "critiquekit-2df57.appspot.com",
  messagingSenderId: "1014909116725"
};
firebase.initializeApp(config);


var db = firebase.firestore();

$(function() {
  // load html files in correct divs
  $("#navbar-container").load("navbar.html");
  $("#indicators").load("indicators.html");
  $('#dynasuggestions').load("dynasuggestions.html");
  $('#help-modal').load("help.html");
  $('#rubric').load("rubric.html");
  $('#assignment-list').load("assignmentlist.html");
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

// copy text of suggestion button to textbox
function copyText(x) {
  var currentTxt = document.getElementById("feedback").value;
  var submittedComment = x.innerHTML;
  document.getElementById("feedback").value = currentTxt + " " + submittedComment;
  $('#feedback').trigger('autoresize');

  //tick boxes depdning on which suggestion clicked
  if ($(x).parent().attr('id') == "specific_suggestion") {
    document.getElementById("speccheck").innerHTML = "check_box";
  } else if ($(x).parent().attr('id') == "action_suggestion") {
    document.getElementById("actcheck").innerHTML = "check_box";
  } else if ($(x).parent().attr('id') == "justify_suggestion") {
    document.getElementById("justcheck").innerHTML = "check_box";
  }
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

  var comment = $("#feedback").val();

  var spec = document.getElementById("speccheck").innerHTML;
  var act = document.getElementById("actcheck").innerHTML;
  var just = document.getElementById("justcheck").innerHTML;
  var found = false;

  var query = db.collection("comments").where("comment", "==", comment);

  console.log(query);


  if (found != true) {
    if (spec == "check_box" && act != "check_box" && just != "check_box") {

      db.collection("comments").add({
        comment: comment,
        actionable: false,
        justified: false,
        specific: true
      })

    } else if (spec == "check_box" && act == "check_box" && just != "check_box") {

      db.collection("comments").add({
        comment: comment,
        actionable: true,
        justified: false,
        specific: true
      })

    }
  }



  if (comment.length == 0) {
    alert("You can't submit an empty comment!");
  }


  document.getElementById("feedback").value = "";


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
}

//hide submitted comments
function hideComments() {
  $("#submitted-comments").hide();

  // Toggle buttons
  $("#view-comments").show();
  $("#hide-comments").hide();

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
    }

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
