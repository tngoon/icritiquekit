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

  if (comment.length == 0) {
    alert("You can't submit an empty comment!");
  } else {

    db.collection("comments").where("comment", "==", comment)
      .get()
      .then(function(querySnapshot) {

        if (querySnapshot.empty == true) {
          console.log('no documents found');


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

          } else if (spec == "check_box" && act == "check_box" && just == "check_box") {

            db.collection("comments").add({
              comment: comment,
              actionable: true,
              justified: true,
              specific: true
            })

          } else if (spec != "check_box" && act == "check_box" && just != "check_box") {

            db.collection("comments").add({
              comment: comment,
              actionable: true,
              justified: false,
              specific: false
            })

          } else if (spec != "check_box" && act == "check_box" && just == "check_box") {

            db.collection("comments").add({
              comment: comment,
              actionable: true,
              justified: true,
              specific: false
            })

          } else if (spec != "check_box" && act != "check_box" && just == "check_box") {

            db.collection("comments").add({
              comment: comment,
              actionable: false,
              justified: true,
              specific: false
            })

          } else if (spec == "check_box" && act != "check_box" && just == "check_box") {

            db.collection("comments").add({
              comment: comment,
              actionable: false,
              justified: true,
              specific: true
            })

          }

        } else {
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
        }

      });

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

// Load "Specific" suggestions from database
function loadSpecificSuggestions() {
  loadSuggestions("specific", "specific_suggestion");
}

// Load "Actionable" suggestions from database
function loadActionableSuggestions() {
  loadSuggestions("actionable", "action_suggestion");
}

// Load "Justified" suggestions from database
function loadJustifiedSuggestions() {
  loadSuggestions("justified", "justify_suggestion");
}

function loadSuggestions(type, id) {
  var suggestionContainer = document.getElementById(id);
  suggestionContainer.innerHTML = "";

  var commentsRef = db.collection("comments").where(type, "==", true)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var suggestion = createSuggestion(doc.get("comment"));
        suggestionContainer.appendChild(suggestion);
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

function createSuggestion(comment) {
  var suggestion = document.createElement("a");

  var href = document.createAttribute("href");
  href.value = "#";
  suggestion.setAttributeNode(href);

  var onclick = document.createAttribute("onclick");
  onclick.value = "copyText(this)";
  suggestion.setAttributeNode(onclick);

  var classAtt = document.createAttribute("class");
  classAtt.value = "collection-item";
  suggestion.setAttributeNode(classAtt);

  suggestion.textContent = comment;

  return suggestion;
}