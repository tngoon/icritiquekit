$(document).ready(function() {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();

  $('#modal1').modal('open');
});

function submitID() {
  var ID = $("#TAID").val();
  console.log(ID);

  socket.emit('requestStudentList');
  socket.on('studentList', function(data) {
    studentList = data;

    console.log(data.length);
  });
}

function parseTable(){
  socket.emit('requestStudentList');
  socket.on('studentList', function(data) {
    studentList = data;

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

    var divContainer = document.getElementById("showTable2");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  });
}
