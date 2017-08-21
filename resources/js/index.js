var roomNo;
var gamePlayerCount;
var playerName;
var playersJson = [];
var playerID;


//Utility Functions ------------------------
function generateRoomCode(){
  roomNo = ( Math.random() * 100000) | 0;
  return roomNo;
}

//Game Lobby Functions ------------------------

//UPDATE PLAYER COUNT IN LOBBY

function emptyList(){
    $("#lobby_playerList").empty();
}

function updatePlayerCount(count){
  $("#lobby_playerCount").html(count);
}

function updatePlayerListUI(){
  $("#lobby_playerList").empty();
  playersJson.forEach(function(element){
      $("#lobby_playerList").append("<li><span>" + element.p_name + "<span></li>");
  });
}

function updatePlayerList(snapshot){
  //var ctr = 0;


  //check if key already exists in json
  if(JSON.stringify(playersJson).indexOf(snapshot.key) == -1){

        var key = snapshot.key;
        var name = snapshot.val().p_name;


        item = {}
        item ["key"] = key;
        item ["p_name"] = name;
        playersJson.push(item);

    console.log(playersJson);

    updatePlayerListUI();
  }

}

function updateRoomNo(){
  $("#room_no").html(roomNo);
}


//CREATE ROOM
function createRoom(){
  // Get a reference to the database service

 firebaseDB = firebase.database();
 roomNo = generateRoomCode();
 localStorage.setItem("roomNo", roomNo);
 document.getElementById("accessCode_i").innerHTML = roomNo;

 var playerCountRef = firebase.database().ref("game/" + roomNo + "/players");
 playerCountRef.on('value', function(snapshot) {
  updatePlayerCount(snapshot.numChildren());
});

  var playerNamesRef = firebase.database().ref("game/" + roomNo + "/players").orderByKey();
  playerNamesRef.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      updatePlayerList(childSnapshot);
  });
});


  var playerNamesRef = firebase.database().ref("game/" + roomNo);
  playerNamesRef.on("value", function(snapshot) {
        if(snapshot.val().game_status == "starting"){
              window.location.href="game_status.html";
        }
  });

 var updates = {}
 var gameStatus = {
                    game_status: "waiting"
                  }
 updates['game/' + roomNo] = roomNo;
 updates['game/' + roomNo] = gameStatus;
 return firebase.database().ref().update(updates);
}

function joinRoom(){
 playerName = localStorage.getItem("playerName");
 roomNo = localStorage.getItem("roomNo");
 $("#room_no").html
 firebaseDB = firebase.database();
 var playerCountRef = firebase.database().ref("game/" + roomNo + "/players");
 var key = playerCountRef.push().key;
 localStorage.setItem("playerKey", key);

    var newPlayer = {
                      p_name: playerName.toString(),
                      diff_bombs: 0,
                      hits: 0,
                      lives: 3,
                      bomb_time: 0
                   }

   var updates = {};

   updates['game/' + roomNo + '/players/' + key] = newPlayer;

  var playerNamesRef = firebase.database().ref("game/" + roomNo);
  playerNamesRef.on("value", function(snapshot) {
        if(snapshot.val().game_status == "starting"){
              window.location.href="plant_bomb.html";
        }
  });

   playerCountRef.on('value', function(snapshot) {
    console.log("SNAPSHOT: " + JSON.stringify(snapshot));
    updatePlayerCount(snapshot.numChildren());
  });

  var playerNamesRef = firebase.database().ref("game/" + roomNo + "/players").orderByKey();
  playerNamesRef.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      updatePlayerList(childSnapshot);
      // childData will be the actual contents of the child
      //var childData = childSnapshot.val();
  });
});

  updateRoomNo();

 return firebase.database().ref().update(updates);

}

function storePlayerAndRoomDetails(){
   playerName = document.getElementById("first_name").value;
   roomNo = document.getElementById("room_code").value;

   localStorage.setItem("playerName", playerName);
   localStorage.setItem("roomNo", roomNo);
    window.location.href="lobby_m.html"
}


function startGame(){
  firebaseDB = firebase.database();
  var updates = {}
  var gameStatus = "starting"
 updates['game/' + roomNo + "/game_status"] = gameStatus;
 return firebase.database().ref().update(updates);
}

//Gameplay Functions ------------------------


//ADD BOMB TO TARGET PLAYER
function plantBomb(playerSource, playerDestination, bombTime){
firebaseDB = firebase.database()
var newBombKey = firebaseDB.ref("/game" + roomNo + "/player" + playerDestination + "/bombs").push().key;
var newBomb = {
                 time: bombTime,
                 source: playerSource
              }

var updates = {};
updates['game/' + roomNo + '/players/' + playerDestination + "/bombs/" + newBombKey] = newBomb;

return firebase.database().ref().update(updates);
}








