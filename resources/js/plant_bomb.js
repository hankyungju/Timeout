	var roomNo = localStorage.getItem("roomNo");
	var timer = 10; //in seconds	
		var red = "#d9534f", orange = "#FF7043", yellow = "#f0ad4e", green = "#5cb85c", blue = "#337ab7", violet = "#9575CD";
		
		var timerColor = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];
		var sequenceAnswer = ["001011011010010", "110100100101101", "101010010110101"];
		
		var clickedBtn = ""; 
		var index = 0;
		
		var num_of_lives = 3;
		var stageComplete = 0;
		var pointer = 0;
		
		var didMakeMistake = false;
		
		function btnClick(btn_id){
			//alert(btn_id);
			clickedBtn = btn_id;
			
			gamePlay();
		}
		
		function gameTimer() {
			if(timer <= 0){
				document.getElementById("timer").innerHTML = "Time is up!";
				killPlayer();
				//window.location.replace("choose_function.html");
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
				else if (timer > 40)
				{
					document.getElementById("timer").style.color = "#4CAF50";
				}
				
				if(index <= 3 && !didMakeMistake)
					document.getElementById("timer").innerHTML = timer + "s";
			}
		}
		
		function gamePlay() {
			if(stageComplete < 3){
				if(timer >= 0){		
					var input = sequenceAnswer[index].split('');
	
					if(pointer < input.length)
					{
						//alert(clickedBtn +" b "+ input[pointer].toString());
						if(clickedBtn.localeCompare(input[pointer].toString()) == 0){
							//alert('Tama');
							pointer++;
						}
						else{
							//alert('Mali');
							didMakeMistake = true;
							document.getElementById(clickedBtn.toString()).style.backgroundColor = red;
							document.getElementById(clickedBtn.toString()).style.color = "#F7F7F7";
						}
					}
					
					if(pointer == input.length && !didMakeMistake)
					{
						//alert('You Win!');
						index++;
						stageComplete++;
						gameInit();
						gameStart();
						//ADD BOMB TO ALL PLAYERS
					}
					
					if(didMakeMistake)
					{
						//alert('You Made a Mistake!');
						//MINUS LIFE
						removeLife();
						
					}
				}
				else{
					document.getElementById("timer").innerHTML = "Time is up!";
				}
			}
		}
		
		function gameStart(){
			if(index >=0 && index <= 2){
				document.getElementById("textToGuess").innerHTML = sequenceAnswer[index];
			}
			else if(index > 2)
			{
				document.getElementById("textToGuess").innerHTML = "You Win!";
				document.getElementById("textToGuess").style.color = "#4CAF50";
			}
		}
		
		function removeLife() {
			document.getElementById("timer").innerHTML = timer + "s";
			var key = localStorage.getItem("playerKey");
			if(num_of_lives > 1)
			{
				var list = document.getElementById("livesLeft");
				list.removeChild(list.childNodes[num_of_lives-1]);
				
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
			var lives = num_of_lives;
			console.log("LIVES @ remove life: " + lives);
			updates['game/' + roomNo + '/players/' + key + '/lives'] = lives;
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
		
		function gameInit(){
			pointer = 0;
			didMakeMistake = false;
			timer = 10;
		}
		
		function killPlayer(){
			//PLAYER IS DEAD
			document.getElementById("timer").innerHTML = "TIMEOUT";
		}

		function switchPage(){
			window.location.href = "diffuse_a_bomb.html";
		}

		function leavePage(){
			window.location.href = "index.html";
		}
