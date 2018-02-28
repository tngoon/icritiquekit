<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase.js"></script>
<script>
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
</script>

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

  var comment = $("#feedback").val();

  var spec = document.getElementById("speccheck").innerHTML;
  var act = document.getElementById("actcheck").innerHTML;
  var just = document.getElementById("justcheck").innerHTML;


  var fs = require('fs');

  if (spec == "check_box") {

    fs.readFile('../json/comments.JSON', 'utf-8', function(err, data) {

      if (err) throw err

      var arrayOfObjects = JSON.parse(data)
      arrayOfObjects.users.push({
        comment: $("#feedback").val(),
        category: "specific"
      })
      fs.writeFile('../json/commonts.JSON', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
        if (err) throw err
        console.log('Done!')
      })
    })
  }

  if (act == "check_box") {

    fs.readFile('../json/comments.JSON', 'utf-8', function(err, data) {
      if (err) throw err

      var arrayOfObjects = JSON.parse(data)
      arrayOfObjects.users.push({
        comment: $("#feedback").val()
      })
      fs.writeFile('../json/comments.JSON', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
        if (err) throw err
        console.log('Done!')
      })
    })
  }

  if (just == "check_box") {

    fs.readFile('../json/comments.JSON', 'utf-8', function(err, data) {
      if (err) throw err

      var arrayOfObjects = JSON.parse(data)
      arrayOfObjects.users.push({
        comment: $("#feedback").val()
      })
      fs.writeFile('../json/comments.JSON', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
        if (err) throw err
        console.log('Done!')
      })
    })
  }



  var allComments = sessionStorage.getItem("allComments");
  var Comment = {};
  var obj = [];


  if (comment.length != 0) {
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

  document.getElementById("feedback").value = "";

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
