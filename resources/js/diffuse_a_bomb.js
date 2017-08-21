var timer = 5; //in seconds
var bomb_count;
var bomb_key;
var playerKey;
var roomNo = localStorage.getItem("roomNo");
		
		var red = "#d9534f", orange = "#FF7043", yellow = "#f0ad4e", green = "#5cb85c", blue = "#337ab7", violet = "#9575CD";
		
		var timerColor = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];
		var sequenceAnswer = ["green_btn", "yellow_btn", "violet_btn", "red_btn", "blue_btn"];
		var sequenceColor = [green, yellow, violet, red, blue];
		var sequenceText = ["BLUE", "RED", "GREEN", "YELLOW", "GREEN"];
		
		var clickedBtn = ""; 
		var index = 0;
		
		var num_of_lives = 3;
		
		function btnClick(btn_id){
			//alert(btn_id);
			clickedBtn = btn_id;
			
			gamePlay();
		}
		
		function gameTimer() {
			if(timer <= 0){

				if(removeLifeAndCheckGamePlay()){
					timer--;	
					setTimeout(gameTimer, 1000);
					index++;
					setTimeout(gameStart, 500);

					//setTimeout(gameTimer, 1000);
					//setTimeout(gamePlay, 1000);
				}
			}
			else{
				timer--;				
				setTimeout(gameTimer, 1000);
				
				if(timer <= 10)
				{
					document.getElementById("timer").style.color = red;
				}
				else if (timer <= 20)
				{
					document.getElementById("timer").style.color = "#FF9800";
				}
				else if (timer <= 30)
				{
					document.getElementById("timer").style.color = yellow;
				}
				else if (timer <= 40)
				{
					document.getElementById("timer").style.color = "#CDDC39";
				}
				else if (timer <= 60)
				{
					document.getElementById("timer").style.color = "#4CAF50";
				}
				
				if(index <= 4)
					document.getElementById("timer").innerHTML = timer + "s";
			}
		}
		
		function gamePlay() {
			document.getElementById("timer").innerHTML = timer + "s";
			bomb_count = 1;
			if(index < 5){
				if(timer >= 0 || (timer < 0 && bomb_count > 0)){				
					if(clickedBtn.localeCompare(sequenceAnswer[index]) == 0){
						index++;
						gameStart();
					}
					else if(clickedBtn.localeCompare(sequenceAnswer[index]) != 0 && clickedBtn.localeCompare("") != 0){
						removeLife();
					}	
				}
				else{
						//PLAYER IS DEAD
						removeLife();
				}
			}
		}
		
		function gameStart(){
			if(index >=0 && index <= 4){
				document.getElementById("textToGuess").innerHTML = sequenceText[index];
				document.getElementById("textToGuess").style.color = sequenceColor[index];
			}
			else if(index > 4)
			{
				//BOMB IS DIFFUSED
				document.getElementById("textToGuess").innerHTML = "You Win!";
				document.getElementById("textToGuess").style.color = "#4CAF50";

			}
		}
		

		function removeLifeAndCheckGamePlay(){

			if(num_of_lives > 1){
				setTimeout(removeLife(),500);
				//GET TIMER FROM BOMB
				timer = 5;
				//setTimeout(gamePlay(),500);
				return true;
			}else{
				removeLife();
				return false;
			}
		}

		function removeLife() {
			document.getElementById("timer").innerHTML = timer + "s";
			if(num_of_lives > 1)
			{
				var list = document.getElementById("livesLeft");
				list.removeChild(list.childNodes[num_of_lives-1]);
				var key = localStorage.getItem("playerKey");
				num_of_lives--;
			}
			else
			{
				var list = document.getElementById("livesLeft");
				list.removeChild(list.childNodes[1]);
				var content = list.innerHTML;
				list.innerHTML = content;
				num_of_lives--;
				killPlayer();
				//alert('Game Over!');
			}
			var updates = {}
			var lifeUpdate = {
								lives: num_of_lives.toString()
							 };
			updates['game/' + roomNo + '/players/' + key] = lifeUpdate;
			return firebase.database().ref().update(updates);
		}
		
		function displayLivesInit() {		
			for(count = 0; count < num_of_lives; count++){
				var elem = document.createElement("img");
				elem.src = 'resources/images/heart.PNG';
				elem.setAttribute("height", "50");
				elem.setAttribute("width", "50");
				elem.setAttribute("align", "left");
				document.getElementById("livesLeft").appendChild(elem);
            }
		}
		
//FIREBASE DB


//function getBomb

//BOMB FUNCTIONS
function getBomb(){

}


function startBombTimer(){

}


//PLAYER FUNCTIONS
function killPlayer(){
	//PLAYER IS DEAD
	document.getElementById("timer").innerHTML = "TIMEOUT";
}

function updateDeductPlayerLife(){

}

function updateAddBombPlanterHits(){

}

//EVENT FUNCTIONS
function noMoreBombs(){
	//DISPLAY NO BOMBS TO DIFFUSE
	//TELL USER NO BOMBS TO DIFFUSE
}

function diffuseSuccessful(){
	//DECREMENT PLAYER'S BOMB COUNT
	bomb_count -= 1;
	firebaseDB = firebase.database();
	var bombRef = firebaseDB.ref('game/' + roomNo + '/players/' + playerKey + "/bombs/" + bombKey);
		bombRef.remove()
	  .then(function() {
	    console.log("Remove succeeded.")
	  })
	  .catch(function(error) {
	    console.log("Remove failed: " + error.message)
	  });
}

function diffuseFailed(){
	//DECREMENT PLAYER'S BOMB COUNT
	//DECREMENT PLAYER'S LIVES COUNT
	firebaseDB = firebase.database();
	var bombRef = firebaseDB.ref('game/' + roomNo + '/players/' + playerKey + "/bombs/" + bombKey);
		bombRef.remove()
	  .then(function() {
	    console.log("Remove succeeded.")
	  })
	  .catch(function(error) {
	    console.log("Remove failed: " + error.message)
	  });
	bomb_count -= 1;

}

		function switchPage(){
			window.location.href = "plant_bomb.html";
		}

		function leavePage(){
			window.location.href = "index.html";
		}
