var game_status;
var playersJson = [];
var checkAlivePlayersCount;
var roomNo;
var timer = 120;

function init(){
	var key;
	firebaseDB = firebase.database();
	roomNo = localStorage.getItem("roomNo");
	$("#roomNo").html(roomNo);
	//RETRIEVES PLAYER INFO AND STORES TO JSON

	//CHANGES ON PLAYERS LIST
	var playerNamesRef = firebase.database().ref("game/" + roomNo + "/players").orderByKey();
  	playerNamesRef.on("value", function(snapshot) {
    snapshot.forEach(function(snapshot) {
      initPlayerList(snapshot);
  	});
  	});


    	


    //UPDATE 
  	var playerNamesRef = firebase.database().ref("game/" + roomNo);
  	playerNamesRef.on("value", function(snapshot) {
  	      checkEndGame(snapshot);
  	});
}



function checkEndGame(snapshot){
	if(snapshot.val().game_status == "end"){
		//DECLARE WINNER
		getWinner();

	}
}

function getWinner(){
	 var winner;
	 var winner_lives = 0;
	 var ctr = 1;
	 var winner_ctr;
	 playersJson.forEach(function(element){
	 	if(element.lives > winner_lives){
	 		winner_lives = element.lives;
	 		winner = element.p_name;
	 		winner_ctr = ctr;
	 	}
	 	ctr++;

  	});	

	 $("#playerCol" + winner_ctr).css("background","#2ecc71");
	  ctr = 1;

	  playersJson.forEach(function(element){
	 		if(ctr != winner_ctr)
	 			 $("#playerCol" + ctr).css("background","#c0392b");
	 		ctr++;
  		});	
	 timer = 0;
}

function initPlayerList(snapshot){
  //var ctr = 0;

  //check if key already exists in json
  if(JSON.stringify(playersJson).indexOf(snapshot.key) == -1){

        var key = snapshot.key;
        var name = snapshot.val().p_name;
        var lives = snapshot.val().lives;
        console.log("KEY: " + key + " Name: " + name + " Lives: " + lives);
        item = {}
        item ["key"] = key;
        item ["p_name"] = name;
        item ["lives"] = lives;
        playersJson.push(item);

    console.log(playersJson);

      	var playerLivesRef = firebase.database().ref("game/" + roomNo + "/players/" + key + '/lives');
  	  	playerLivesRef.on("value", function(snapshot) {
  	      updatePlayerLifeCount(snapshot);
  	  	});

    initPlayerListUI();
  }

}

function initPlayerListUI(){
  var ctr = 1;
  playersJson.forEach(function(element){
  	  $("#playerName" + ctr).html(element.p_name);
      $("#playerLives" + ctr).html(element.lives);
      ctr++;
  });
}

function updatePlayerLifeCount(snapshot){
	var key = snapshot.key;
	var ctr = 1;
	 playersJson.forEach(function(element){
	 	console.log(element.key + "==" + key);
  		if(element.key == key){
  			 $("#playerLives" + ctr).html(snapshot.val().lives);
  		}
  		ctr++;
  	 });
}


function checkAlivePlayersCount(){
  var count = 0;
  playersJson.forEach(function(element){
  	if(element.lives > 0){
  		count++;
  	}
  });

  if(count > 1){
  	return true
  }else{
  	endGame()
  }

}

function endGame(){
	firebaseDB = firebase.database()
	var updates = {};
	updates['game/' + roomNo + '/game_status/'] = "end";
	return firebaseDB.ref().update(updates);
}

function leaveGame(){
	window.location.href="index.html";
	localStorage.removeItem("roomNo");
}

function gameTimer() {
			if(timer <= 0){
				endGame();
			}
			else{
				timer--;				
				setTimeout(gameTimer, 1000);
				
				if(timer <= 10)
				{
					document.getElementById("timeRemaining").style.color = "red";
				}
				else if (timer <= 20)
				{
					document.getElementById("timeRemaining").style.color = "#FF9800";
				}
				else if (timer <= 30)
				{
					document.getElementById("timeRemaining").style.color = "yellow";
				}
				else if (timer <= 40)
				{
					document.getElementById("timeRemaining").style.color = "#CDDC39";
				}
				else if (timer <= 60)
				{
					document.getElementById("timeRemaining").style.color = "#4CAF50";
				}
					document.getElementById("timeRemaining").innerHTML = timer + "s";
			}
}

