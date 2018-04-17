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

// Get a reference to the storage service, which is used to create references in the storage bucket
var storage = firebase.storage();
var rootRef = storage.ref();

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then(function(accessToken) {
        $("#log-in").hide()
        $("#log-out").show()
        loadUserComment()
        document.getElementById('account-details').textContent = "Signed in as:" + displayName
      });
    } else {
      // User is signed out.
      document.getElementById('account-details').textContent = "User not Logged in"
      $("#log-out").hide()
      $("#log-in").show()
      document.getElementById("userComments").innerHTML = ""
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});

$(function() {
  // load html files in correct divs
  $("#navbar-container").load("navbar.html");
  $("#indicators").load("indicators.html");
  $('#dynasuggestions').load("dynasuggestions.html");
  $('#help-modal').load("help.html");
  $('#usercomments').load("usercomment.html");
  $('#assignment-list').load("assignmentlist.html");

});


$(function() {
  $(document).ready(function() {
    $('.modal').modal();
    $('#helpModal1').modal('open');
    $("#rubricbtn").click(function() {
      loadUserComment();
      $("#usercomments").toggle();
      $("#indicators").toggle();
      if ($("#usercomments").is(':hidden')) {
        document.getElementById("rubricbtn").innerHTML = "Your Comments";
      } else {
        document.getElementById("rubricbtn").innerHTML = "Suggestions";
      }
    });

    $("#log-out").click(function() {
      firebase.auth().signOut().then(function() {
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    });


    var user = firebase.auth().currentUser;

    if (user) {
      // User is signed in.
      document.getElementById('account-details').textContent = "Signed in as:" + user.displayName
    } else {
      // No user is signed in.
      document.getElementById('account-details').textContent = "User not Logged in"
    }

  });
})

// copy text of suggestion button to textbox
function copyText(x) {
  var currentTxt = document.getElementById("feedback").value;
  var submittedComment = x.innerHTML;
  document.getElementById("feedback").value = currentTxt + submittedComment;
  $('#feedback').trigger('autoresize');

  //tick boxes depdning on which suggestion clicked
  if ($(x).parent().attr('id') == "specific_suggestion") {
    document.getElementById("speccheck").innerHTML = "check_box";
  } else if ($(x).parent().attr('id') == "action_suggestion") {
    document.getElementById("actcheck").innerHTML = "check_box";
  } else if ($(x).parent().attr('id') == "justify_suggestion") {
    document.getElementById("justcheck").innerHTML = "check_box";
  }

  checkComments();
}

//check for characteristics of comments
function checkComments() {
  var text = $("#feedback").val();
  var wordlength = text.split(' ').length;
  var words = text.split(' ');
  var check = false;

  if (wordlength < 5) {
    document.getElementById("speccheck").innerHTML = "check_box_outline_blank";
    document.getElementById("specText").style.color = "red";
    document.getElementById("specTextCheck").innerHTML = "check_box_outline_blank";
    check = true;
  } else if (wordlength > 5) {
    document.getElementById("speccheck").innerHTML = "check_box";
    document.getElementById("specText").style.color = "green";
    document.getElementById("specTextCheck").innerHTML = "check_box";
  } else {
    document.getElementById("speccheck").innerHTML = "check_box_outline_blank";
    document.getElementById("specText").style.color = "red";
    document.getElementById("specTextCheck").innerHTML = "check_box_outline_blank";
    check = true;
  };

  if (text.match(/(maybe|try|should|would|make|use|consider|remove|use|add|please|reduce)/gi)) {
    document.getElementById("actcheck").innerHTML = "check_box";
    document.getElementById("actText").style.color = "green";
    document.getElementById("actTextCheck").innerHTML = "check_box";
  } else {
    document.getElementById("actcheck").innerHTML = "check_box_outline_blank";
    document.getElementById("actText").style.color = "red";
    document.getElementById("actTextCheck").innerHTML = "check_box_outline_blank";
    check = true;

  }

  if (text.match(/(because|so|might|just|to)/gi)) {
    document.getElementById("justcheck").innerHTML = "check_box";
    document.getElementById("justText").style.color = "green";
    document.getElementById("justTextCheck").innerHTML = "check_box";
  } else {
    document.getElementById("justcheck").innerHTML = "check_box_outline_blank";
    document.getElementById("justText").style.color = "red";
    document.getElementById("justTextCheck").innerHTML = "check_box_outline_blank";
    check = true;

  }

  if (check == true) {
    showSuggestions();
  }

}

function showSuggestions() {
  $("#need-suggestion").show();
  $("#need-specific").hide();
  $("#need-actionable").hide();
  $("#need-justified").hide();
  $("#need-specific-link").hide();
  $("#need-actionable-link").hide();
  $("#need-justified-link").hide();
  loadDynamicSuggestions();

  var spec = document.getElementById("speccheck").innerHTML;
  var act = document.getElementById("actcheck").innerHTML;
  var just = document.getElementById("justcheck").innerHTML;

  if (spec != "check_box") {
    $("#need-specific").show();
    $("#need-specific-link").show();
  }

  if (act != "check_box") {
    $("#need-actionable").show();
    $("#need-actionable-link").show();
  }

  if (just != "check_box") {
    $("#need-justified").show();
    $("#need-justified-link").show();
  }

}

function getUserID() {
  var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    return user.uid;
  } else {
    // No user is signed in.
    return "null";
  }
}

//store comments as JSON
function submitComments() {

  var comment = $("#feedback").val();

  var spec = document.getElementById("speccheck").innerHTML;
  var act = document.getElementById("actcheck").innerHTML;
  var just = document.getElementById("justcheck").innerHTML;
  var userID = getUserID();

  if (comment.length == 0) {
    alert("You can't submit an empty comment!");
  } else {

    db.collection("comments").where("comment", "==", comment)
      .get()
      .then(function(querySnapshot) {

        if (querySnapshot.empty == true) {
          console.log('no documents found, inserting new');


          if (spec == "check_box" && act != "check_box" && just != "check_box") {

            db.collection("comments").add({
              freq: 0,
              user_id: userID,
              comment: comment,
              actionable: false,
              justified: false,
              specific: true
            })

          } else if (spec == "check_box" && act == "check_box" && just != "check_box") {

            db.collection("comments").add({
              freq: 0,
              user_id: userID,
              comment: comment,
              actionable: true,
              justified: false,
              specific: true
            })

          } else if (spec == "check_box" && act == "check_box" && just == "check_box") {

            db.collection("comments").add({
              freq: 0,
              user_id: userID,
              comment: comment,
              actionable: true,
              justified: true,
              specific: true
            })

          } else if (spec != "check_box" && act == "check_box" && just != "check_box") {

            db.collection("comments").add({
              freq: 0,
              user_id: userID,
              comment: comment,
              actionable: true,
              justified: false,
              specific: false
            })

          } else if (spec != "check_box" && act == "check_box" && just == "check_box") {

            db.collection("comments").add({
              freq: 0,
              user_id: userID,
              comment: comment,
              actionable: true,
              justified: true,
              specific: false
            })

          } else if (spec != "check_box" && act != "check_box" && just == "check_box") {

            db.collection("comments").add({
              freq: 0,
              user_id: userID,
              comment: comment,
              actionable: false,
              justified: true,
              specific: false
            })

          } else if (spec == "check_box" && act != "check_box" && just == "check_box") {

            db.collection("comments").add({
              freq: 0,
              user_id: userID,
              comment: comment,
              actionable: false,
              justified: true,
              specific: true
            })

          }

        } else {
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots

            console.log(doc.id, " => ", doc.data().freq);
            if (doc.data().freq == null) {
              var docRef = db.collection("comments").doc(doc.id);
              return docRef.update({
                freq: 0
              })
            } else {
              var currNo = doc.get("freq");
              currNo++;
              var docRef = db.collection("comments").doc(doc.id);
              return docRef.update({
                freq: currNo
              })
            }
          });
        }

      });

  }

  document.getElementById("feedback").value = "";
  document.getElementById("speccheck").innerHTML = "check_box_outline_blank";
  document.getElementById("actcheck").innerHTML = "check_box_outline_blank";
  document.getElementById("justcheck").innerHTML = "check_box_outline_blank";
  $("dynasuggestions").hide();
  $("#need-suggestion").hide()

}



// Load "Specific" suggestions from database
function loadSpecificSuggestions() {
  loadSuggestions("specific", "specific_suggestion", 5);
}

// Load "Actionable" suggestions from database
function loadActionableSuggestions() {
  loadSuggestions("actionable", "action_suggestion", 5);
}

// Load "Justified" suggestions from database
function loadJustifiedSuggestions() {
  loadSuggestions("justified", "justify_suggestion", 5);
}

function loadDynamicSuggestions() {
  loadSuggestions("specific","dynamic_suggestion", 1)
  loadSuggestions("actionable","dynamic_suggestion", 1)
  loadSuggestions("justified","dynamic_suggestion", 1)
}

// Load suggestions from database based on type (specific, actionable, or justified)
// and place into the div container with specified id
function loadSuggestions(type, id, numElements) {
  var suggestionContainer = document.getElementById(id);
  suggestionContainer.innerHTML = "";
  var comments = [];

  var commentsRef = db.collection("comments").where(type, "==", true).where("user_id", "==", "null")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        comments.push({comment:doc.get("comment"), freq:doc.get("freq")})
        //var suggestion = createSuggestion(doc.get("comment"));
        //suggestionContainer.appendChild(suggestion);
      });

      comments.sort(function(a,b) {return b.freq-a.freq});
      for (i = 0; i < numElements; i++) {
        var suggestion = createSuggestion(comments[i].comment);
        suggestionContainer.appendChild(suggestion);
      }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });




}

function loadUserComment() {
  var suggestionContainer = document.getElementById("userComments");
  suggestionContainer.innerHTML = "";
  var userID = getUserID();

  if (userID != "null") {
    var commentsRef = db.collection("comments").where("user_id", "==", userID)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var suggestion = createSuggestion(doc.get("comment"));
          suggestionContainer.appendChild(suggestion);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
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

function fileUpload() {
  var fileInput = document.getElementById("fileUpload");
  var file = fileInput.files[0];
  var fileName = file.name;
  var fileRef = rootRef.child(fileName);

  var uploadTask = fileRef.put(file);
  uploadTask.on("state_changed", function(snapshot) {
    //alert("Uploaded " + file.name);
  }, function(error) {
    alert(error);
  }, function() {
    var downloadURL = uploadTask.snapshot.downloadURL;

    var iFrame = document.getElementById("design1");
    iFrame.setAttribute("src", downloadURL);
  });
}

function loadURL() {
  var url = document.getElementById("url").value;
  var iFrame = document.getElementById("design1");
  iFrame.setAttribute("src", url);
}

// Initialize modals
$(document).ready(function () {
  $('.modal').modal();
});
