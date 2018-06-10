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
      console.log(uid);
      user.getIdToken().then(function(accessToken) {
        $("#log-in").hide()
        $("#log-out").show()
        //document.getElementById('account-details').textContent = "Signed in as:" + displayName
      });
    } else {
      // User is signed out.
      //document.getElementById('account-details').textContent = "User not Logged in"
      $("#log-out").hide()
      $("#log-in").show()
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});

function logOut() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}


$(function() {
  // load html files in correct divs
  $("#navbar-container").load("navbar.html");
});


$(function() {
  $(document).ready(function() {
    $("#navbar-container").load("navbar.html");
    $('.modal').modal();
    loadSuggestions();
    $("#log-out").click(function() {
      firebase.auth().signOut().then(function() {
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    });


    var user = firebase.auth().currentUser;
    var userID;
    var isInstructor = false;

    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {
        // User is signed in.
        var docRef = db.collection("users").doc(user.uid);
        docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              isInstructor = doc.data()["instructor"];
              if (isInstructor) {
                $("#allSuggestions").show()
              } else {
                $('#modal1').modal('open');
              }
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      } else {
        // No user is signed in.
        $('#modal2').modal('open');
        $("#allSuggestions").hide()
      }
    });

  });
})

//create comments
function createSuggestion(comment, id) {
  var suggestion = document.createElement("a");

  var href = document.createAttribute("href");
  href.value = "#";
  suggestion.setAttributeNode(href);

  var onclick = document.createAttribute("onclick");
  onclick.value = "editComment(this)";
  suggestion.setAttributeNode(onclick);

  var dataid = document.createAttribute("data-id");
  dataid.value = id;
  suggestion.setAttributeNode(dataid);

  var classAtt = document.createAttribute("class");
  classAtt.value = "collection-item";
  suggestion.setAttributeNode(classAtt);

  suggestion.textContent = comment;

  return suggestion;
}

//load all the comments
function loadSuggestions() {
  var suggestionContainer = document.getElementById("allSuggestions");
  suggestionContainer.innerHTML = "";
  var comments = [];
  var ids = [];

  var commentsRef = db.collection("comments")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        comments.push({comment:doc.get("comment"), freq:doc.get("freq")})
        ids.push(doc.id);
        //var suggestion = createSuggestion(doc.get("comment"));
        //suggestionContainer.appendChild(suggestion);
      });

      for (i = 0; i < comments.length; i++) {
        var suggestion = createSuggestion(comments[i].comment, ids[i]);
        suggestionContainer.appendChild(suggestion);
      }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });

}

//function to edit the comment
function editComment(curr) {
  var comment = curr.innerHTML;
  var id = curr.dataset.id;

  document.getElementById("editComment").value = comment;
  document.getElementById("editComment").dataset.id = id;

  $('#modal3').modal('open');

}

//apply change and submit to firebase
function submitChange() {
  var changedComment = document.getElementById("editComment").value;
  var id = document.getElementById("editComment").dataset.id;
  var docRef = db.collection("comments").doc(id);

  return docRef.update({
    comment: changedComment
  })
  .then(function() {
      console.log("Document successfully updated!");
      document.getElementById("editComment").value = "";
      document.getElementById("editComment").dataset.id = "";
      loadSuggestions();
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });

}
