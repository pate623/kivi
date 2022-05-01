var playerCount;

var canPost = false;
var reRolling = false;
var placingMarble = false;

var p2UsedDices = 0;
var p3UsedDices = 0;
var p4UsedDices = 0;

var placedMarbles = "";


var allSlots = ["a1","a2","a3","a4","a5","a6","a7","b1","b2","b3","b4","b5","b6","b7","c1","c2","c3","c4","c5","c6","c7","d1","d2","d3","d4","d5","d6","d7","e1","e2","e3","e4","e5","e6","e7","f1","f2","f3","f4","f5","f6","f7","g1","g2","g3","g4","g5","g6","g7" ]

var all3scoreSlots = ["b2", "b4", "b6", "c5", "d4", "e3", "f2", "f4", "f6"];
var all2scoreSlots = ["a2", "a3", "a5", "a6", "b1", "b7", "c2", "c3", "c4", "c6", "d1", "d3", "d5", "d7", "e2", "e4", "e5", "e6", "f1", "f7", "g2", "g3", "g5", "g6"];
var all1scoreSlots = ["a1", "a4", "a7", "b3", "b5", "c1", "c7", "d2", "d6", "e1", "e7", "f3", "f5", "g1", "g4", "g7"]; 

for (var i = 0; i < 49; i++){
	localStorage.setItem("slot-" + allSlots[i] + "-state", 0)	
}

var gameEnded = false;

//password generator
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//async sleep
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

//String replacement
function replaceAt(string, index, replace) {
	return string.substring(0, index) + replace + string.substring(index + 1);
}


//cookie consent
//check if showing cookie consent is necessary
$(document).ready(function(){
	if (typeof(Storage) !== "undefined") {
		if(localStorage.getItem("consentedToCookies") == "accepted"){
			console.log("cookies accepted")
		}else{
			$("#cookieConsent").css({"display": "block"});	
			console.log("cookies not accepted")
		}
	}else{
		$("#cookieConsent").css({"display": "block"});	
		console.log("cookies not accepted")
	}
});
//accept cookies 
$(document).ready(function(){
	$("#cookieConsent__hideButton").click(function(){
		$("#cookieConsent").css({"display": "none"});
		localStorage.setItem("consentedToCookies", "accepted");
	});
});


/*  <<< transitioning from pre game to game >>> */
//player amount buttons
$(document).ready(function(){
	$("#playerAmounts__2PlayersButton").click(function(){
		playerCount = 2;
		$.fn.saveUserName()
		$.fn.gameStart()
		queues()
	});
	$("#playerAmounts__3PlayersButto").click(function(){
		playerCount = 3;
		$.fn.saveUserName()
		$.fn.gameStart()
		queues()
	});
	$("#playerAmounts__4PlayersButton").click(function(){
		playerCount = 4;
		$.fn.saveUserName()
		$.fn.gameStart()
		queues()
	});
});

//username
// Check if username already exist
$(document).ready(function(){
	if (typeof(Storage) !== "undefined") {
		console.log("looking for a saved user name")
		if(localStorage.getItem("kiviUsername")){
			document.getElementsByName('getUsername__labelName')[0].placeholder=localStorage.getItem("kiviUsername");
			console.log("\"" + localStorage.getItem("kiviUsername") + "\"" + " was your last used username")
		}else{
				console.log("no username found")	
		}
	}
})
//save username to local storage
$.fn.saveUserName = function() { 
	if (typeof(Storage) !== "undefined") {
		if($("#getUsername__inputName").val() != ""){
			localStorage.setItem("kiviUsername", $("#getUsername__inputName").val());
			console.log($("#getUsername__inputName").val() + " -> your username input")
			console.log(localStorage.getItem("kiviUsername") + " -> your username saved")
		}else{
			console.log("No new username created")	
		}
	}
};

$(document).ready(function(){
	$("#endOfGameScreen__close").click(function(){
		$("#endOfGameScreen__close").css({"display": "none"});
		$("#endOfGameScreen").css({"display": "none"});
	});
});

// Reveals the game
$.fn.gameStart = function() { 
	$("#preGameChoices").css({"display": "none" });
	$("#inGame").css({"display": "inline" });
	$("#queueMessages").css({"display": "block" });
	//show the right amount of player at the to pof the screen 
	if(playerCount == 2){
		$("#playersName__player3").css({"display": "none" });
		$("#playersName__player4").css({"display": "none" });
		$(".playersName__tags").css({"width": "50%" });
	}else if(playerCount == 3){
		$("#playersName__player4").css({"display": "none" });
		$(".playersName__tags").css({"width": "33.33%" });
	}
};


//<<< Queue>>>
// adds players into the queue 
function queues(){
	//check for username if it exist. If it doesn't set username to quest and save it into web storage
	var userName;
	var userTest = localStorage.getItem("kiviUsername");
	if(!(userTest == null)){
		userName = localStorage.getItem("kiviUsername"); 
	}else{
		localStorage.setItem("kiviUsername", "quest");
		userName = localStorage.getItem("kiviUsername");
		console.log("your username is set to be quest")
	}
	
	// generate random 8 string long password and save it into web storage
	var passwordGenerated = makeid(8);
	localStorage.setItem("kiviPassword", passwordGenerated);
	var myObj = {userName: userName, password: passwordGenerated, queue: playerCount};
	var queueRequest = JSON.stringify(myObj);
	
	console.log("Getting into " + playerCount + " players queue.");
	console.log("json string sent to server: " + queueRequest);
	
	$.ajax({
		method: 'POST', 
		enctype: 'application/x-www-form-urlencoded',
        processData: false,
		url: '../public_html/php/kiviQueue.php',
		data: queueRequest,
		dataType: 'json',
		success: function (aResult) { 
			if(aResult.errors == false){
				console.log("successfully entered into queue")
				console.log("your queue id is " + aResult.queueID)
				localStorage.setItem("queueID",aResult.queueID);
				console.log("Your queue info json: " + aResult.queueCheck)
				setTimeout(checkQueue(), 1500);
			}else{
				console.log("error in queuing")
				$("#errorMessages").css({"display": "block" });
				$("#errorMessages").html("Error in queuing<br>Please reload page");
			}
			//show all results/errors
			console.log("--error header-- : --error message--")
			console.log( "connection: " + aResult.connection)
			console.log("errors: " + aResult.errors)
			console.log("enoughUsers: " + aResult.enoughUsers)
			console.log("gameTypeCreated " + aResult.gameTypeCreated)
			console.log("gameCreated: " + aResult.gameCreated)
			console.log("usersUpdated: " + aResult.usersUpdated)
			console.log("-------")
			console.log("user1Name: " + aResult.user1Name)
			console.log("user1Password: " + aResult.user1Password)
			console.log("user2Name:" + aResult.user2Name )
			console.log("user2Password: " + aResult.user2Password  )
			console.log("-------")
			console.log("Game creations SQL string:  " + aResult.createdGame)
			console.log("statusUpdated:  " + aResult.statusUpdated)
			console.log("-------")
			console.log("usersUpdatedQeurry:  " + aResult.usersUpdatedQeurry)
			console.log("-------")
		},
	});
};

// waiting in the queue 
// send request once a second to see if you have gotten into a game
// uses queueID and password to check and confirm the queue
function checkQueue(){
	var queueJsonObj = {ID: localStorage.getItem("queueID"), password: localStorage.getItem("kiviPassword")};
	var queueCheck = JSON.stringify(queueJsonObj);
	console.log(queueCheck + "  <-- queueCheck");
	
	$.ajax({
		type: 'POST',
		enctype: 'application/x-www-form-urlencoded',
		processData: false,
		url: '../public_html/php/inQueueKivi.php',
		data: queueCheck,
		dataType: 'json',
		success: function(data){
			console.log("-----------")
			console.log("gameID: " + data.gameID)
			console.log("playerNumber: " + data.playerNumber)
			console.log("errors" + data.errors)
			console.log("gameFound: " + data.gameFound)
			console.log("playerFound: " + data.playerFound)
			console.log("sentSQLString: " + data.sentSQLString)
			console.log("refreshSQL: " + data.refreshSQL)
			console.log("-------------")
			if(data.gameFound == true){ //if game found
				localStorage.setItem("gameID", data.gameID);
				localStorage.setItem("gamePlayerNumber", data.playerNumber);
				console.log("Game found")
				enteringGame()
			}else if(data.errors == false){ //if in queue, wait one second before sending ajax request again
				console.log("no game found yet")
				always: 
					setTimeout(checkQueue, 2000);
			}else{
				console.log("Error while in queue")	
				$("#errorMessages").css({"display": "block" });
				$("#errorMessages").html("Error in queuing<br>Please reload page");
			}
		}
	});
};


// <<<start game>>>
function enteringGame(){
	//disable the queue mark and get player names
	$("#queueMessages").html("game found");
	//use ajax request to find out the rest
	var gameInfo = {ID: localStorage.getItem("gameID"), playerNumber: localStorage.getItem("gamePlayerNumber"), password: localStorage.getItem("kiviPassword")};
	var startGame = JSON.stringify(gameInfo);
	console.log("Game start json:  " + startGame)
	
	$.ajax({
		type: 'POST',
		enctype: 'application/x-www-form-urlencoded',
		processData: false,
		url: '../public_html/php/inGameKivi.php',
		data: startGame,
		dataType: 'json',
		success: function(data){
			//if successfully got information
			if(data.verification == "success"){
				$("#queueMessages").css({"display": "none" });
				$("#playersName__player1__name").html(data.p1Name);
				$("#playersName__player2__name").html(data.p2Name);
				localStorage.setItem("Player1Name", data.p1Name);
				localStorage.setItem("Player2Name", data.p2Name);
				if(playerCount == 4){
					$("#playersName__player4__name").html(data.p4Name);
					$("#playersName__player3__name").html(data.p3Name);
					localStorage.setItem("Player3Name", data.p3Name);
					localStorage.setItem("Player4Name", data.p4Name);
				}else if(playerCount == 3){	
					$("#playersName__player3__name").html(data.p3Name);
					localStorage.setItem("Player3Name", data.p3Name);
				}
				//set your dice color
				if(localStorage.getItem("gamePlayerNumber") == 1){
					$(".yourHand__marbles__aMarble").css("background-image",  "url(../public_html/pictures/kivi/marbles/blueMarble.svg)");
				}else if(localStorage.getItem("gamePlayerNumber") == 2){
					$(".yourHand__marbles__aMarble").css("background-image",  "url(../public_html/pictures/kivi/marbles/redMarble.svg)")	
				}else if(localStorage.getItem("gamePlayerNumber") == 3){
					$(".yourHand__marbles__aMarble").css("background-image",  "url(../public_html/pictures/kivi/marbles/yellowMarble.svg)")	
				}else if(localStorage.getItem("gamePlayerNumber") == 4){
					$(".yourHand__marbles__aMarble").css("background-image",  "url(../public_html/pictures/kivi/marbles/greenMarble.svg)")	
				}
				
				//start the game after successfully connection and refresh your activity once in a 5 seconds
				localStorage.setItem("gameTurn", 1);
				playerColorBackground(1)
				runningGameEvents()
			}
				//get all names from p1 to p4 depending on game type and show the names in top of the screen
				//remove queue message
			//if failed to get the game info
				//show error message saying game not found
			
			//all errors and info
			console.log("----------")
			console.log("sentSQLString: " + data.sentSQLString)
			console.log("errors: " + data.errors)
			console.log("verification: " + data.verification)
			console.log("p1Name: " + data.p1Name)
			console.log("p2Name: " + data.p2Name)
			console.log("p3Name: " + data.p3Name)
			console.log("p4Name: " + data.p4Name)
			console.log("-------")
		}
	});
}
//<<<End of queue>>>


// <<game actions>>
function sendYourChoice(){ //called from confirm button, used to send your choices into the server
	//uses web storage to figure out the choice user has made
	var jsonObject = {data: localStorage.getItem("yourCurrentChoice"), ID: localStorage.getItem("gameID"), user:localStorage.getItem("gamePlayerNumber"), password:localStorage.getItem("kiviPassword")}
	var yourChoiceOfAction = JSON.stringify(jsonObject);
	console.log("Sent Json of your choices" + yourChoiceOfAction)
	$.ajax({
		type: 'POST',
		enctype: 'application/x-www-form-urlencoded',
		processData: false,
		url: '../public_html/php/gameActions.php',
		data: yourChoiceOfAction,
		dataType: 'json',
		success: function(data){
			//console.log("modulusCheck " + data.modulusCheck)
			//console.log("running game found:")
			//console.log(data.gameFound)
			//console.log("server game turn: " + data.gameTurn)
			//console.log("server dices: " + data.dice1 + data.dice2 + data.dice3 + data.dice4 + data.dice5 + data.dice6)
			//console.log("server sqhInsert: " + data.sqhInsert) 
			//console.log("server dicesInfunc: " + data.dicesInfunc) 
			if(data.errors == false){
				console.log("Turn played successfully")
				//console.log("last actions: " + data.fta)
				//console.log("inRerollDices: " + data.dice1Reroll + data.dice2Reroll + data.dice3Reroll + data.dice4Reroll + data.dice5Reroll + data.dice6Reroll)
			}else{
				console.log("Error in send turn info")
			}
		}
	});
}

function closingGameConfirmation(){ //called from confirm button, used to send your choices into the server
	//uses web storage to figure out the choice user has made
	var jsonObject = {ID: localStorage.getItem("gameID")}
	var yourChoiceOfAction = JSON.stringify(jsonObject);
	$.ajax({
		type: 'POST',
		enctype: 'application/x-www-form-urlencoded',
		processData: false,
		url: '../public_html/php/reportFinished.php',
		data: yourChoiceOfAction,
		dataType: 'json',
		success: function(data){
			if(data.errors == false){
				console.log("Server agreed with game end")
			}else{
				console.log("Server didn't agree on game end")
			}
		}
	});
}


// get game change information's and act upon them
// the returned value is 2 dimensional array first one is game id second one is game info 
function runningGameEvents(){
	var gameInfoIn = new EventSource("../public_html/php/sendKiviGameStatus.php");
	gameInfoIn.onopen = function() {
		console.log("Listening server sent events"); 
	}
	
	gameInfoIn.onerror = function(err) {
		console.error("EventSource failed:", err);
		
	};
	
	//reconnect in case of error
	gameInfoIn.addEventListener('error', function(event) {
		switch (event.target.readyState) {
			case EventSource.CONNECTING:
				console.log('Reconnecting...');
				break;
			case EventSource.CLOSED:
				console.log('Connection failed,attempting second reconnect...');
				if (!gameEnded) {
					runningGameEvents()
				} else {
					console.log('Connection failed, will not reconnect');
                }
				break;
		}
	}, false);
	
	
	//do the p1 first move here
	//p1 is the last one to connect to this stream. no need to check for all player connection (at this point in coding)
	if (localStorage.getItem("gamePlayerNumber") == 1 && localStorage.getItem("gameTurn") < 17) {
		$("#yourHand__confirmButton").html("Throw");
		$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
		localStorage.setItem("yourCurrentChoice", 1); //there is no choices at throwing dices, this can be changed by any button
		console.log("first turn and p1")
		canPost = true
	}
	gameInfoIn.addEventListener("status", function(e) {
		var yourGame = String(localStorage.getItem("gameID"))
		
		//console.log("message before conversion: " + e.data)
		var messageIn = JSON.parse(e.data);
		//console.log("message after conversion: " + messageIn)
		
		if(localStorage.getItem("gameTurn") == parseInt(messageIn[yourGame])){
			//console.log("no change for your game")
		}else if(localStorage.getItem("gameTurn") < parseInt(messageIn[yourGame])){
			console.log("game has updated")
			console.log("Last 6 characters of the game state " + messageIn["fta" + yourGame]) 
			//if works can be used to get data this way without using ajax request	
			var infos = {fta: messageIn["fta" + yourGame], gt: messageIn[yourGame]};
			
			localStorage.setItem("gameTurn", parseInt(messageIn[yourGame]));
			//close the game end report of the game ending.
			if(p2UsedDices == 10 && playerCount == 2){
				getGameData(infos)
				console.log("game has ended")
				canPost = false;
				gameEnded = true;
				$("#yourHand__confirmButton").css({"textShadow": "0px 0px "});
				playerColorBackground(0)
				gameInfoIn.close();
				closingGameConfirmation()
				countScore()

			} else if (p3UsedDices == 10 && playerCount == 3) {
				getGameData(infos)
				console.log("game has ended")
				canPost = false;
				gameEnded = true;
				$("#yourHand__confirmButton").css({ "textShadow": "0px 0px " });
				playerColorBackground(0)
				gameInfoIn.close();
				closingGameConfirmation()
				countScore()

			} else if (p4UsedDices == 10 && playerCount == 4) {
				getGameData(infos)
				console.log("game has ended")
				canPost = false;
				gameEnded = true;
				$("#yourHand__confirmButton").css({ "textShadow": "0px 0px " });
				playerColorBackground(0)
				gameInfoIn.close();
				closingGameConfirmation()
				countScore()

			}else{ //proceed to continue the game
				getGameData(infos)
			}
		}else{
			console.log("can't parse data")	
			console.log("your game turn: " + localStorage.getItem("gameTurn"))	
			console.log("Server game turn: " + messageIn[yourGame])
		}
	},false);
}



//<<All in game buttons>>
//confirm button
$(function(){ //remember to not create button effect before document is loaded
	$("#yourHand__confirmButton").click(function(){
		console.log("can post: " + canPost)
		console.log("reRolling: " + reRolling)
		console.log("placingMarble: " + placingMarble)
		if(canPost){
			canPost = false;
			$("#yourHand__confirmButton").css({"textShadow": "0px 0px "});
			sendYourChoice()
		}
		if(reRolling){
			reRolling = false;
			$("#yourHand__confirmButton").css({"textShadow": "0px 0px "});
			$("#yourHand__dices_AtHand_dice1").css({"background-color": " #ffe"})
			$("#yourHand__dices_AtHand_dice2").css({"background-color": " #ffe"})
			$("#yourHand__dices_AtHand_dice3").css({"background-color": " #ffe"})
			$("#yourHand__dices_AtHand_dice4").css({"background-color": " #ffe"})
			$("#yourHand__dices_AtHand_dice5").css({"background-color": " #ffe"})
			$("#yourHand__dices_AtHand_dice6").css({"background-color": " #ffe"})
			sendYourChoice()
		}
		if (placingMarble) {
			//to prevent miss clicking send without selecting any slots: 
			//check to see if choice is 00 and at least one of the slots have a value of 1
			//if so do nothing. (code at later a warning message)
			var canBePlaced = false;

			for (var i = 0; i < 49; i++) {
				if (localStorage.getItem("slot-" + allSlots[i] + "-state") == 1) {
					canBePlaced = true;
                }
			}
			if (canBePlaced && localStorage.getItem("yourCurrentChoice") == 0 ) {
				//not placed any marbles even though there is available place for a marble.
				//create a pop uop to inform about this
				console.log("There is a place for a marble but no marble is placed, please put a marble on the board.")
			} else {
				placingMarble = false;
				$("#yourHand__confirmButton").css({ "textShadow": "0px 0px " });
				hidemarbleFromHand()
				sendYourChoice()
			}
		}
	});	
});

//all slot buttons, remember to use const to save the array value within the creation
//works but might not be the right way to use const
$(document).ready(function(){
	for (var i = 0; i < allSlots.length; i++){
		const theOne = allSlots[i]
		//console.log("theOne " + theOne)
		$("#" + allSlots[i] + "-slot").click(function(){
			console.log(theOne.valueOf() + "-slot clicked")
			if(localStorage.getItem("slot-" + theOne.valueOf()  + "-state") == 1 && placingMarble){
				console.log("Marble can be placed at " + theOne.valueOf() + "-slot")
				localStorage.setItem("yourCurrentChoice", theOne.valueOf());
				highlightCurrentChoice(theOne.valueOf());
			}
		});
	}
});

//all dices
$(document).ready(function(){
	$("#yourHand__dices_AtHand_dice1").click(function(){
		console.log("dice 1 clicked")
		if(reRolling){
			//set the first number in the string to be 1 if 0 and 0 if 1
			var currently = localStorage.getItem("yourCurrentChoice");
			//localStorage.setItem("yourCurrentChoice", "000000");
			if(currently.slice(0, 1) == "0"){
				//change to 1 which means reroll
				$("#yourHand__dices_AtHand_dice1").css({"background-color": " #faa"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 0, "1"));
			}else{
				//change to 0 which means do not reroll
				$("#yourHand__dices_AtHand_dice1").css({"background-color": " #ffe"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 0, "0"));
			}
		}
	});
	
	$("#yourHand__dices_AtHand_dice2").click(function(){
		console.log("dice 2 clicked")
		if(reRolling){
			//set the first number in the string to be 1 if 0 and 0 if 1
			var currently = localStorage.getItem("yourCurrentChoice");
			//localStorage.setItem("yourCurrentChoice", "000000");
			if(currently.slice(1, 2) == "0"){
				//change to 1 which means reroll
				$("#yourHand__dices_AtHand_dice2").css({"background-color": " #faa"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 1, "1"));
			}else{
				//change to 0 which means do not reroll
				$("#yourHand__dices_AtHand_dice2").css({"background-color": " #ffe"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 1, "0"));
			}
		}
	});
	
	$("#yourHand__dices_AtHand_dice3").click(function(){
		console.log("dice 3 clicked")
		if(reRolling){
			//set the first number in the string to be 1 if 0 and 0 if 1
			var currently = localStorage.getItem("yourCurrentChoice");
			//localStorage.setItem("yourCurrentChoice", "000000");
			if(currently.slice(2, 3) == "0"){
				//change to 1 which means reroll
				$("#yourHand__dices_AtHand_dice3").css({"background-color": " #faa"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 2, "1"));
			}else{
				//change to 0 which means do not reroll
				$("#yourHand__dices_AtHand_dice3").css({"background-color": " #ffe"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 2, "0"));
			}
		}
	});
	
	$("#yourHand__dices_AtHand_dice4").click(function(){
		console.log("dice 4 clicked")
		if(reRolling){
			//set the first number in the string to be 1 if 0 and 0 if 1
			var currently = localStorage.getItem("yourCurrentChoice");
			//localStorage.setItem("yourCurrentChoice", "000000");
			if(currently.slice(3, 4) == "0"){
				//change to 1 which means reroll
				$("#yourHand__dices_AtHand_dice4").css({"background-color": " #faa"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 3, "1"));
			}else{
				//change to 0 which means do not reroll
				$("#yourHand__dices_AtHand_dice4").css({"background-color": " #ffe"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 3, "0"));
			}
		}
	});
	
	$("#yourHand__dices_AtHand_dice5").click(function(){
		console.log("dice 5 clicked")
		if(reRolling){
			//set the first number in the string to be 1 if 0 and 0 if 1
			var currently = localStorage.getItem("yourCurrentChoice");
			//localStorage.setItem("yourCurrentChoice", "000000");
			if(currently.slice(4, 5) == "0"){
				//change to 1 which means reroll
				$("#yourHand__dices_AtHand_dice5").css({"background-color": " #faa"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 4, "1"));
			}else{
				//change to 0 which means do not reroll
				$("#yourHand__dices_AtHand_dice5").css({"background-color": " #ffe"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 4, "0"));
			}
		}
	});
	
	$("#yourHand__dices_AtHand_dice6").click(function(){
		console.log("dice 6 clicked")
		if(reRolling){
			//set the first number in the string to be 1 if 0 and 0 if 1
			var currently = localStorage.getItem("yourCurrentChoice");
			//localStorage.setItem("yourCurrentChoice", "000000");
			if(currently.slice(5, 6) == "0"){
				//change to 1 which means reroll
				$("#yourHand__dices_AtHand_dice6").css({"background-color": " #faa"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 5, "1"));
			}else{
				//change to 0 which means do not reroll
				$("#yourHand__dices_AtHand_dice6").css({"background-color": " #ffe"})
				localStorage.setItem("yourCurrentChoice", replaceAt(currently, 5, "0"));
			}
		}
	});
});


//<< In game and after game functions >>
function getGameData(data){ //called after the server sent event sends a new number.
	//gets back info of the game and executes upon ir
	//this info is already has filtered the game id of your game so no need to repeat it.
	//incoming info includes: gameTurn [gt], firstTurnAll [fta], boardUsedPositions [bup], boardState [bs]
	//firstTurnAll [fta] is cut in the last meaningfully characters by the server

	if(data.gt % 16 == 1){ //Result: p1 thew,  action: p1 re throw
		console.log("p1 throw the dices")
		playerColorBackground(1)
		setDiceNumber(data)
		if(localStorage.getItem("gamePlayerNumber") == 1){
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", "000000");
			reRolling = true
		}
	
	}else if(data.gt % 16 == 2){
		console.log("p1 rethrow")
		playerColorBackground(1)
		setDiceNumber(data)
		if(localStorage.getItem("gamePlayerNumber") == 1){
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", "000000");
			reRolling = true
		}
	}else if(data.gt % 16 == 3){ //time to place the marble
		console.log("p1 second rethrow")
		playerColorBackground(1)
		setDiceNumber(data)
		testAllSlots(data)
		
		if(localStorage.getItem("gamePlayerNumber") == 1){
			$("#yourHand__confirmButton").html("place");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", "00");
			placingMarble = true
		}
		
	}else if(data.gt % 16 == 4){ //Result: p1 placed marble,  action: p2 throw
		placeMarble(data.fta, 1)
		removeHighlights()
		playerColorBackground(2)
		if(localStorage.getItem("gamePlayerNumber") == 2){
			$("#yourHand__confirmButton").html("Throw");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", 1);
			console.log("first turn and p2")
			canPost = true
		}
		
	}else if(data.gt % 16 == 5){ //result: first throw p2  action: p2 rethrow 1
		setDiceNumber(data)
		playerColorBackground(2)
		if(localStorage.getItem("gamePlayerNumber") == 2){
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", "000000"); 
			reRolling = true
		}
		
	}else if(data.gt % 16 == 6){ //result: re throw p2   action: p2 rethrow 2
		setDiceNumber(data)
		playerColorBackground(2)
		if(localStorage.getItem("gamePlayerNumber") == 2){
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", "000000");
			reRolling = true
		}
		
	}else if(data.gt % 16 == 7){ //result: last re throw p2   action: p2 place marble
		setDiceNumber(data)
		testAllSlots(data)
		p2UsedDices++;
		playerColorBackground(2)
		
		if(localStorage.getItem("gamePlayerNumber") == 2){
			$("#yourHand__confirmButton").html("place");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", "00"); //no placement if 00
			placingMarble = true
		}
		
	} else if (data.gt % 16 == 8) { //result: p2 place marble  action: p3 throws the dices or p1 throws the dices
		placeMarble(data.fta, 2)
		removeHighlights()
		if(localStorage.getItem("gamePlayerNumber") == 3){
			$("#yourHand__confirmButton").html("Throw");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", 2);
			console.log("first turn and p3")
			canPost = true
		}
		if(localStorage.getItem("gamePlayerNumber") == 1 && playerCount == 2){
			$("#yourHand__confirmButton").html("Throw");
			$("#yourHand__confirmButton").css({"textShadow": "2px 2px #fff"});
			localStorage.setItem("yourCurrentChoice", 1); 
			canPost = true
		}
		if(playerCount == 2){
			playerColorBackground(1)
		}else{
			playerColorBackground(3)
		}
		
	} else if (data.gt % 16 == 9) {  //result: p3 threw dices   action: p3 re throw dices
		setDiceNumber(data)
		playerColorBackground(3)
		if (localStorage.getItem("gamePlayerNumber") == 3) {
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", "000000");
			reRolling = true
		}

	} else if (data.gt % 16 == 10) { //result: re throw p3   action: p3 rethrow 2
		setDiceNumber(data)
		playerColorBackground(3)
		if (localStorage.getItem("gamePlayerNumber") == 3) {
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", "000000");
			reRolling = true
		}

	} else if (data.gt % 16 == 11) { //result: last re throw p3   action: p3 place marble
		setDiceNumber(data)
		testAllSlots(data)
		p3UsedDices++;
		playerColorBackground(3)

		if (localStorage.getItem("gamePlayerNumber") == 3) {
			$("#yourHand__confirmButton").html("place");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", "00"); //no placement if 00
			placingMarble = true
		}

	} else if (data.gt % 16 == 12) { //result: p3 place marble  action: p4 throws the dices or p1 throws the dices
		placeMarble(data.fta, 3)
		removeHighlights()
		if (localStorage.getItem("gamePlayerNumber") == 4) {
			$("#yourHand__confirmButton").html("Throw");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", 1);
			console.log("first turn and p4")
			canPost = true
		}
		if (localStorage.getItem("gamePlayerNumber") == 1 && playerCount == 3) {
			$("#yourHand__confirmButton").html("Throw");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", 1);
			canPost = true
		}
		if (playerCount == 3) {
			playerColorBackground(1)
		} else {
			playerColorBackground(4)
		}

	} else if (data.gt % 16 == 13) {  //result: p4 threw dices   action: p4 re throw dices
		setDiceNumber(data)
		playerColorBackground(4)
		if (localStorage.getItem("gamePlayerNumber") == 4) {
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", "000000");
			reRolling = true
		}

	} else if (data.gt % 16 == 14) { //result: re throw p4   action: p4 rethrow 2
		setDiceNumber(data)
		playerColorBackground(4)
		if (localStorage.getItem("gamePlayerNumber") == 4) {
			$("#yourHand__confirmButton").html("Rethrow");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", "000000");
			reRolling = true
		}
	} else if (data.gt % 16 == 15) { //result: last re throw p4   action: p4 place marble
		setDiceNumber(data)
		testAllSlots(data)
		p4UsedDices++;
		playerColorBackground(4)

		if (localStorage.getItem("gamePlayerNumber") == 4) {
			$("#yourHand__confirmButton").html("place");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", "00"); //no placement if 00
			placingMarble = true
		}

	} else if (data.gt % 16 == 0) { //result: p4 place marble  action: p1 throws the dices
		placeMarble(data.fta, 4)
		removeHighlights()
		if (localStorage.getItem("gamePlayerNumber") == 1) {
			$("#yourHand__confirmButton").html("Throw");
			$("#yourHand__confirmButton").css({ "textShadow": "2px 2px #fff" });
			localStorage.setItem("yourCurrentChoice", 1);
			canPost = true
		}

		playerColorBackground(1)
	}
}



async function setDiceNumber(data){
	$("#yourHand__dices_AtHand_dice1").css("background-image", "none");
	$("#yourHand__dices_AtHand_dice2").css("background-image", "none");
	$("#yourHand__dices_AtHand_dice3").css("background-image", "none");
	$("#yourHand__dices_AtHand_dice4").css("background-image", "none");
	$("#yourHand__dices_AtHand_dice5").css("background-image", "none");
	$("#yourHand__dices_AtHand_dice6").css("background-image", "none");
	
	//$("#yourHand__dices_AtHand_dice1").css("background-color", "#989787");
	//$("#yourHand__dices_AtHand_dice2").css("background-color", "#989787");
	//$("#yourHand__dices_AtHand_dice3").css("background-color", "#989787");
	//$("#yourHand__dices_AtHand_dice4").css("background-color", "#989787");
	//$("#yourHand__dices_AtHand_dice5").css("background-color", "#989787");
	//$("#yourHand__dices_AtHand_dice6").css("background-color", "#989787");
	
	//for now only do a delay with no animation 
	await sleep(150);
	
	var dice1 = data.fta.slice(0, 1);
	if(dice1 == 1){
		$("#yourHand__dices_AtHand_dice1").css("background-image", "url(pictures/kivi/diceNumbers/one.svg)");
	}else if(dice1 == 2){
		$("#yourHand__dices_AtHand_dice1").css("background-image", "url(pictures/kivi/diceNumbers/two.svg)");
	}else if(dice1 == 3){
		$("#yourHand__dices_AtHand_dice1").css("background-image", "url(pictures/kivi/diceNumbers/three.svg)");
	}else if(dice1 == 4){
		$("#yourHand__dices_AtHand_dice1").css("background-image", "url(pictures/kivi/diceNumbers/four.svg)");
	}else if(dice1 == 5){
		$("#yourHand__dices_AtHand_dice1").css("background-image", "url(pictures/kivi/diceNumbers/five.svg)");
	}else if(dice1 == 6){
		$("#yourHand__dices_AtHand_dice1").css("background-image", "url(pictures/kivi/diceNumbers/six.svg)");
	}
	var dice2 = data.fta.slice(1, 2);
	if(dice2 == 1){
		$("#yourHand__dices_AtHand_dice2").css("background-image", "url(pictures/kivi/diceNumbers/one.svg)");
	}else if(dice2 == 2){
		$("#yourHand__dices_AtHand_dice2").css("background-image", "url(pictures/kivi/diceNumbers/two.svg)");
	}else if(dice2 == 3){
		$("#yourHand__dices_AtHand_dice2").css("background-image", "url(pictures/kivi/diceNumbers/three.svg)");
	}else if(dice2 == 4){
		$("#yourHand__dices_AtHand_dice2").css("background-image", "url(pictures/kivi/diceNumbers/four.svg)");
	}else if(dice2 == 5){
		$("#yourHand__dices_AtHand_dice2").css("background-image", "url(pictures/kivi/diceNumbers/five.svg)");
	}else if(dice2 == 6){
		$("#yourHand__dices_AtHand_dice2").css("background-image", "url(pictures/kivi/diceNumbers/six.svg)");
	}
	var dice3 = data.fta.slice(2, 3);
	if(dice3 == 1){
		$("#yourHand__dices_AtHand_dice3").css("background-image", "url(pictures/kivi/diceNumbers/one.svg)");
	}else if(dice3 == 2){
		$("#yourHand__dices_AtHand_dice3").css("background-image", "url(pictures/kivi/diceNumbers/two.svg)");
	}else if(dice3 == 3){
		$("#yourHand__dices_AtHand_dice3").css("background-image", "url(pictures/kivi/diceNumbers/three.svg)");
	}else if(dice3 == 4){
		$("#yourHand__dices_AtHand_dice3").css("background-image", "url(pictures/kivi/diceNumbers/four.svg)");
	}else if(dice3 == 5){
		$("#yourHand__dices_AtHand_dice3").css("background-image", "url(pictures/kivi/diceNumbers/five.svg)");
	}else if(dice3 == 6){
		$("#yourHand__dices_AtHand_dice3").css("background-image", "url(pictures/kivi/diceNumbers/six.svg)");
	}
	var dice4 = data.fta.slice(3, 4);
	if(dice4 == 1){
		$("#yourHand__dices_AtHand_dice4").css("background-image", "url(pictures/kivi/diceNumbers/one.svg)");
	}else if(dice4 == 2){
		$("#yourHand__dices_AtHand_dice4").css("background-image", "url(pictures/kivi/diceNumbers/two.svg)");
	}else if(dice4 == 3){
		$("#yourHand__dices_AtHand_dice4").css("background-image", "url(pictures/kivi/diceNumbers/three.svg)");
	}else if(dice4 == 4){
		$("#yourHand__dices_AtHand_dice4").css("background-image", "url(pictures/kivi/diceNumbers/four.svg)");
	}else if(dice4 == 5){
		$("#yourHand__dices_AtHand_dice4").css("background-image", "url(pictures/kivi/diceNumbers/five.svg)");
	}else if(dice4 == 6){
		$("#yourHand__dices_AtHand_dice4").css("background-image", "url(pictures/kivi/diceNumbers/six.svg)");
	}
	var dice5 = data.fta.slice(4, 5);
	if(dice5 == 1){
		$("#yourHand__dices_AtHand_dice5").css("background-image", "url(pictures/kivi/diceNumbers/one.svg)");
	}else if(dice5 == 2){
		$("#yourHand__dices_AtHand_dice5").css("background-image", "url(pictures/kivi/diceNumbers/two.svg)");
	}else if(dice5 == 3){
		$("#yourHand__dices_AtHand_dice5").css("background-image", "url(pictures/kivi/diceNumbers/three.svg)");
	}else if(dice5 == 4){
		$("#yourHand__dices_AtHand_dice5").css("background-image", "url(pictures/kivi/diceNumbers/four.svg)");
	}else if(dice5 == 5){
		$("#yourHand__dices_AtHand_dice5").css("background-image", "url(pictures/kivi/diceNumbers/five.svg)");
	}else if(dice5 == 6){
		$("#yourHand__dices_AtHand_dice5").css("background-image", "url(pictures/kivi/diceNumbers/six.svg)");
	}
	var dice6 = data.fta.slice(5, 6);
	if(dice6 == 1){
		$("#yourHand__dices_AtHand_dice6").css("background-image", "url(pictures/kivi/diceNumbers/one.svg)");
	}else if(dice6 == 2){
		$("#yourHand__dices_AtHand_dice6").css("background-image", "url(pictures/kivi/diceNumbers/two.svg)");
	}else if(dice6 == 3){
		$("#yourHand__dices_AtHand_dice6").css("background-image", "url(pictures/kivi/diceNumbers/three.svg)");
	}else if(dice6 == 4){
		$("#yourHand__dices_AtHand_dice6").css("background-image", "url(pictures/kivi/diceNumbers/four.svg)");
	}else if(dice6 == 5){
		$("#yourHand__dices_AtHand_dice6").css("background-image", "url(pictures/kivi/diceNumbers/five.svg)");
	}else if(dice6 == 6){
		$("#yourHand__dices_AtHand_dice6").css("background-image", "url(pictures/kivi/diceNumbers/six.svg)");
	}
	
	//do animation
	//$("#yourHand__dices_AtHand_dice1").css("background-color", "#ffffee");
	//$("#yourHand__dices_AtHand_dice2").css("background-color", "#ffffee");
	//$("#yourHand__dices_AtHand_dice3").css("background-color", "#ffffee");
	//$("#yourHand__dices_AtHand_dice4").css("background-color", "#ffffee");
	//$("#yourHand__dices_AtHand_dice5").css("background-color", "#ffffee");
	//$("#yourHand__dices_AtHand_dice6").css("background-color", "#ffffee");
	
}

function testAllSlots(data){
	//test all slots
	//check if a slot already has a marble
	//check if dices are correct to put marble in place
	//check the dice and used positions values from localStorage
	//localStorage.getItem("yourCurrentChoice");
	//localStorage.setItem("yourCurrentChoice", "000000");
	var dices = [
		parseInt(data.fta.slice(0, 1)),
		parseInt(data.fta.slice(1, 2)),
		parseInt(data.fta.slice(2, 3)),
		parseInt(data.fta.slice(3, 4)),
		parseInt(data.fta.slice(4, 5)),
		parseInt(data.fta.slice(5, 6))
	];
	
	//all variables that are used to check if the dices are a match for a slot
	//if there is a four of the same it counts as 1 of threes, 1 of twos and 1 of fours
	//if a slot requires 1*4 and 1*2 do it as 1*4 and 2*2 because the 4 is counted as both pairs and quartets
	var ones = 0;
	var twos = 0;
	var threes = 0;
	var fours = 0;
	var fives = 0;
	var sixes = 0;
	
	var pairs = 0;
	var triples = 0;
	var quartet = 0;
	var quintet = 0;
	var sextet = 0;
	
	var moreThan29 = 0;
	var lessThan13 = 0;
	var fiveRow = 0;
	var fourRow = 0;
	var odds = 0;
	var evens = 0;
	
	//see how many of each numbers exist
	for(var i=0; i<6; i++){
		if(dices[i] == 1){
			ones++;	
		}else if(dices[i] == 2){
			twos++;	
		}else if(dices[i] == 3){
			threes++;	
		}else if(dices[i] == 4){
			fours++;	
		}else if(dices[i] == 5){
			fives++;	
		}else if(dices[i] == 6){
			sixes++;	
		}
	}
	
	pairs += ones > 1 ? 1 : 0;
	pairs += twos > 1 ? 1 : 0;
	pairs += threes > 1 ? 1 : 0;
	pairs += fours > 1 ? 1 : 0;
	pairs += fives > 1 ? 1 : 0;
	pairs += sixes > 1 ? 1 : 0;
	
	triples += ones > 2 ? 1 : 0;
	triples += twos > 2 ? 1 : 0;
	triples += threes > 2 ? 1 : 0;
	triples += fours > 2 ? 1 : 0;
	triples += fives > 2 ? 1 : 0;
	triples += sixes > 2 ? 1 : 0;
	
	quartet += ones > 3 ? 1 : 0;
	quartet += twos > 3 ? 1 : 0;
	quartet += threes > 3 ? 1 : 0;
	quartet += fours > 3 ? 1 : 0;
	quartet += fives > 3 ? 1 : 0;
	quartet += sixes > 3 ? 1 : 0;
	
	quintet += ones > 4 ? 1 : 0;
	quintet += twos > 4 ? 1 : 0;
	quintet += threes > 4 ? 1 : 0;
	quintet += fours > 4 ? 1 : 0;
	quintet += fives > 4 ? 1 : 0;
	quintet += sixes > 4 ? 1 : 0;
	
	sextet += ones > 5 ? 1 : 0;
	sextet += twos > 5 ? 1 : 0;
	sextet += threes > 5 ? 1 : 0;
	sextet += fours > 5 ? 1 : 0;
	sextet += fives > 5 ? 1 : 0;
	sextet += sixes > 5 ? 1 : 0;
	
	var totalCount = dices[0] + dices[1] + dices[2] + dices[3] + dices[4] + dices[5];
	moreThan29 += totalCount > 29 ? 1 : 0;
	lessThan13 += totalCount < 13 ? 1 : 0;
	
	if(ones && twos && threes && fours && fives){
		fiveRow = 1;
	}else if(sixes && twos && threes && fours && fives){
		fiveRow = 1;
	}
	
	if(ones && twos && threes && fours){
		fourRow = 1;
	}else if(twos && threes && fours && fives){
		fourRow = 1;
	}else if(threes && fours && fives && sixes){
		fourRow = 1;
	}
	
	if(!twos && !fours && !sixes){
		odds = 1;	
	}
	if(!ones && !threes && !fives){
		evens = 1;	
	}
	
	//set the can/can't use value of each slot and highlight the ones that can be used.
	//the check to see if can be pressed is in the buttons themselves and disabling highlights is in the confirm button
	//state 0 = no matching dices, state 1 = matching dices and sate 2 = marble already placed.
	
	var boxShadowCss = "0px 0px 3px 3px #0F0";
	
	if(pairs >= 2 || sextet){ //AA BB
		if(localStorage.getItem("slot-a1-state") != 2){
			localStorage.setItem("slot-a1-state", 1);
			$("#a1-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-d6-state") != 2){
			localStorage.setItem("slot-d6-state", 1);
			$("#d6-slot").css("box-shadow", boxShadowCss);
		}
		if(localStorage.getItem("slot-e7-state") != 2){
			localStorage.setItem("slot-e7-state", 1);
			$("#e7-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-g4-state") != 2){
			localStorage.setItem("slot-g4-state", 1);
			$("#g4-slot").css("box-shadow", boxShadowCss);
		}
	}else{
		if(localStorage.getItem("slot-a1-state") != 2){
			localStorage.setItem("slot-a1-state", 0);
		}
		if(localStorage.getItem("slot-d6-state") != 2){
			localStorage.setItem("slot-d6-state", 0);
		}
		if(localStorage.getItem("slot-e7-state") != 2){
			localStorage.setItem("slot-e7-state", 0);
		}
		if(localStorage.getItem("slot-g4-state") != 2){
			localStorage.setItem("slot-g4-state", 0);
		}
	}
	
	if(fiveRow || sextet){ // A B C D E
		if(localStorage.getItem("slot-a2-state") != 2){
			localStorage.setItem("slot-a2-state", 1);
			$("#a2-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-c4-state") != 2){
			localStorage.setItem("slot-c4-state", 1);
			$("#c4-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-d7-state") != 2){
			localStorage.setItem("slot-d7-state", 1);
			$("#d7-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-e2-state") != 2){
			localStorage.setItem("slot-e2-state", 1);
			$("#e2-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-a2-state") != 2){
			localStorage.setItem("slot-a2-state", 0);
		}
		if(localStorage.getItem("slot-c4-state") != 2){
			localStorage.setItem("slot-c4-state", 0);
		}
		if(localStorage.getItem("slot-d7-state") != 2){
			localStorage.setItem("slot-d7-state", 0);
		}
		if(localStorage.getItem("slot-e2-state") != 2){
			localStorage.setItem("slot-e2-state", 0);
		}
	}
	
	if(lessThan13 || sextet){ // <13
		if(localStorage.getItem("slot-a3-state") != 2){
			localStorage.setItem("slot-a3-state", 1);
			$("#a3-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-d1-state") != 2){
			localStorage.setItem("slot-d1-state", 1);
			$("#d1-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-d5-state") != 2){
			localStorage.setItem("slot-d5-state", 1);
			$("#d5-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-f7-state") != 2){
			localStorage.setItem("slot-f7-state", 1);
			$("#f7-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-a3-state") != 2){
			localStorage.setItem("slot-a3-state", 0);
		}
		if(localStorage.getItem("slot-d1-state") != 2){
			localStorage.setItem("slot-d1-state", 0);
		}
		if(localStorage.getItem("slot-d5-state") != 2){
			localStorage.setItem("slot-d5-state", 0);
		}
		if(localStorage.getItem("slot-f7-state") != 2){
			localStorage.setItem("slot-f7-state", 0);
		}
	}
	
	if(triples){ // AAA
		if(localStorage.getItem("slot-a4-state") != 2){
			localStorage.setItem("slot-a4-state", 1);
			$("#a4-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-a7-state") != 2){
			localStorage.setItem("slot-a7-state", 1);
			$("#a7-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-b3-state") != 2){
			localStorage.setItem("slot-b3-state", 1);
			$("#b3-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-e1-state") != 2){
			localStorage.setItem("slot-e1-state", 1);
			$("#e1-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-a4-state") != 2){
			localStorage.setItem("slot-a4-state", 0);
		}
		if(localStorage.getItem("slot-a7-state") != 2){
			localStorage.setItem("slot-a7-state", 0);
		}
		if(localStorage.getItem("slot-b3-state") != 2){
			localStorage.setItem("slot-b3-state", 0);
		}
		if(localStorage.getItem("slot-e1-state") != 2){
			localStorage.setItem("slot-e1-state", 0);
		}
	}
	
	if(odds || sextet){ // 1, 3, 5
		if(localStorage.getItem("slot-a5-state") != 2){
			localStorage.setItem("slot-a5-state", 1);
			$("#a5-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-c6-state") != 2){
			localStorage.setItem("slot-c6-state", 1);
			$("#c6-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-e4-state") != 2){
			localStorage.setItem("slot-e4-state", 1);
			$("#e4-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-f1-state") != 2){
			localStorage.setItem("slot-f1-state", 1);
			$("#f1-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-g5-state") != 2){
			localStorage.setItem("slot-g5-state", 1);
			$("#g5-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-a5-state") != 2){
			localStorage.setItem("slot-a5-state", 0);
		}
		if(localStorage.getItem("slot-c6-state") != 2){
			localStorage.setItem("slot-c6-state", 0);
		}
		if(localStorage.getItem("slot-e4-state") != 2){
			localStorage.setItem("slot-e4-state", 0);
		}
		if(localStorage.getItem("slot-f1-state") != 2){
			localStorage.setItem("slot-f1-state", 0);
		}
		if(localStorage.getItem("slot-g5-state") != 2){
			localStorage.setItem("slot-g5-state", 0);
		}
	}
	
	if(evens || sextet){ // 2, 4, 6
		if(localStorage.getItem("slot-a6-state") != 2){
			localStorage.setItem("slot-a6-state", 1);
			$("#a6-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-b1-state") != 2){
			localStorage.setItem("slot-b1-state", 1);
			$("#b1-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-d3-state") != 2){
			localStorage.setItem("slot-d3-state", 1);
			$("#d3-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-a6-state") != 2){
			localStorage.setItem("slot-a6-state", 0);
		}
		if(localStorage.getItem("slot-b1-state") != 2){
			localStorage.setItem("slot-b1-state", 0);
		}
		if(localStorage.getItem("slot-d3-state") != 2){
			localStorage.setItem("slot-d3-state", 0);
		}
	}
	
	if((quartet && pairs >= 2) || sextet){ // AAAA BB
		if(localStorage.getItem("slot-b2-state") != 2){
			localStorage.setItem("slot-b2-state", 1);
			$("#b2-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-c5-state") != 2){
			localStorage.setItem("slot-c5-state", 1);
			$("#c5-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-f4-state") != 2){
			localStorage.setItem("slot-f4-state", 1);
			$("#f4-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-b2-state") != 2){
			localStorage.setItem("slot-b2-state", 0);
		}
		if(localStorage.getItem("slot-c5-state") != 2){
			localStorage.setItem("slot-c5-state", 0);
		}
		if(localStorage.getItem("slot-f4-state") != 2){
			localStorage.setItem("slot-f4-state", 0);
		}
	}
	
	if(pairs >= 3 || sextet){ // AA BB CC
		if(localStorage.getItem("slot-b4-state") != 2){
			localStorage.setItem("slot-b4-state", 1);
			$("#b4-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-e3-state") != 2){
			localStorage.setItem("slot-e3-state", 1);
			$("#e3-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-f6-state") != 2){
			localStorage.setItem("slot-f6-state", 1);
			$("#f6-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-b4-state") != 2){
			localStorage.setItem("slot-b4-state", 0);
		}
		if(localStorage.getItem("slot-e3-state") != 2){
			localStorage.setItem("slot-e3-state", 0);
		}
		if(localStorage.getItem("slot-f6-state") != 2){
			localStorage.setItem("slot-f6-state", 0);
		}
	}
	
	if(triples == 2 || sextet){ // AAA BBB
		if(localStorage.getItem("slot-b6-state") != 2){
			localStorage.setItem("slot-b6-state", 1);
			$("#b6-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-d4-state") != 2){
			localStorage.setItem("slot-d4-state", 1);
			$("#d4-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-f2-state") != 2){
			localStorage.setItem("slot-f2-state", 1);
			$("#f2-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-b6-state") != 2){
			localStorage.setItem("slot-b6-state", 0);
		}
		if(localStorage.getItem("slot-d4-state") != 2){
			localStorage.setItem("slot-d4-state", 0);
		}
		if(localStorage.getItem("slot-f2-state") != 2){
			localStorage.setItem("slot-f2-state", 0);
		}
	}
	
	if(fourRow || sextet){ // A B C D
		if(localStorage.getItem("slot-b5-state") != 2){
			localStorage.setItem("slot-b5-state", 1);
			$("#b5-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-c1-state") != 2){
			localStorage.setItem("slot-c1-state", 1);
			$("#c1-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-f3-state") != 2){
			localStorage.setItem("slot-f3-state", 1);
			$("#f3-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-g1-state") != 2){
			localStorage.setItem("slot-g1-state", 1);
			$("#g1-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-b5-state") != 2){
			localStorage.setItem("slot-b5-state", 0);
		}
		if(localStorage.getItem("slot-c1-state") != 2){
			localStorage.setItem("slot-c1-state", 0);
		}
		if(localStorage.getItem("slot-f3-state") != 2){
			localStorage.setItem("slot-f3-state", 0);
		}
		if(localStorage.getItem("slot-g1-state") != 2){
			localStorage.setItem("slot-g1-state", 0);
		}
	}
	
	if(moreThan29 || sextet){ // > 29
		if(localStorage.getItem("slot-b7-state") != 2){
			localStorage.setItem("slot-b7-state", 1);
			$("#b7-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-c3-state") != 2){
			localStorage.setItem("slot-c3-state", 1);
			$("#c3-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-e6-state") != 2){
			localStorage.setItem("slot-e6-state", 1);
			$("#e6-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-g2-state") != 2){
			localStorage.setItem("slot-g2-state", 1);
			$("#g2-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-b7-state") != 2){
			localStorage.setItem("slot-b7-state", 0);
		}
		if(localStorage.getItem("slot-c3-state") != 2){
			localStorage.setItem("slot-c3-state", 0);
		}
		if(localStorage.getItem("slot-e6-state") != 2){
			localStorage.setItem("slot-e6-state", 0);
		}
		if(localStorage.getItem("slot-g2-state") != 2){
			localStorage.setItem("slot-g2-state", 0);
		}
	}
	
	if(quartet){ // AAAA
		if(localStorage.getItem("slot-c2-state") != 2){
			localStorage.setItem("slot-c2-state", 1);
			$("#c2-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-e5-state") != 2){
			localStorage.setItem("slot-e5-state", 1);
			$("#e5-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-g3-state") != 2){
			localStorage.setItem("slot-g3-state", 1);
			$("#g3-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-g6-state") != 2){
			localStorage.setItem("slot-g6-state", 1);
			$("#g6-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-c2-state") != 2){
			localStorage.setItem("slot-c2-state", 0);
		}
		if(localStorage.getItem("slot-e5-state") != 2){
			localStorage.setItem("slot-e5-state", 0);
		}
		if(localStorage.getItem("slot-g3-state") != 2){
			localStorage.setItem("slot-g3-state", 0);
		}
		if(localStorage.getItem("slot-g6-state") != 2){
			localStorage.setItem("slot-g6-state", 0);
		}
	}
	
	if(sextet || (triples && pairs >= 2)){ // AAA BB
		if(localStorage.getItem("slot-c7-state") != 2){
			localStorage.setItem("slot-c7-state", 1);
			$("#c7-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-d2-state") != 2){
			localStorage.setItem("slot-d2-state", 1);
			$("#d2-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-f5-state") != 2){
			localStorage.setItem("slot-f5-state", 1);
			$("#f5-slot").css({"box-shadow": boxShadowCss});
		}
		if(localStorage.getItem("slot-g7-state") != 2){
			localStorage.setItem("slot-g7-state", 1);
			$("#g7-slot").css({"box-shadow": boxShadowCss});
		}
	}else{
		if(localStorage.getItem("slot-c7-state") != 2){
			localStorage.setItem("slot-c7-state", 0);
		}
		if(localStorage.getItem("slot-d2-state") != 2){
			localStorage.setItem("slot-d2-state", 0);
		}
		if(localStorage.getItem("slot-f5-state") != 2){
			localStorage.setItem("slot-f5-state", 0);
		}
		if(localStorage.getItem("slot-g7-state") != 2){
			localStorage.setItem("slot-g7-state", 0);
		}
	}
}



function placeMarble(data, player){
	var placeChoice = data.slice(4);
	placedMarbles += placeChoice;
	console.log("slot used" + placeChoice)
	var color;
	
	if(player == 1){
		color = "blueMarble";
	}else if(player == 2){
		color = "redMarble";
	}else if(player == 3){
		color = "yellowMarble";	
	}else if(player == 4){
		color = "greenMarble";
	}
	
	$("#"+ placeChoice + "-slot").css("background-image",  "url(../public_html/pictures/kivi/marbles/" + color + ".svg), url(../pictures/kivi/board/" + placeChoice + ".svg)");
	
	localStorage.setItem("slot-" + placeChoice + "-state", 2);
}


function removeHighlights(){
	for(var i = 0; i < 49; i++){
		$("#" + allSlots[i] + "-slot").css("box-shadow", "#000 0px 0px");
	}
}

function highlightCurrentChoice(picked){
	for(var i = 0; i < 49; i++){
		if(localStorage.getItem("slot-" + allSlots[i] +"-state") != 2){
			$("#" + allSlots[i] + "-slot").css("background-image", "url(../public_html/pictures/kivi/board/" + allSlots[i] + ".svg)");
		}	
	}
	$("#" + picked + "-slot").css("background-image", " url(../public_html/pictures/kivi/marbles/placing.svg), url(../public_html/pictures/kivi/board/" + picked + ".svg)");
}

function hidemarbleFromHand(){
	if( $("#yourHand__marbles__marble10").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble10").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble9").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble9").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble8").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble8").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble7").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble7").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble6").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble6").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble5").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble5").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble4").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble4").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble3").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble3").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble2").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble2").css({"visibility": "hidden"});
	}else if( $("#yourHand__marbles__marble1").css('visibility') == 'visible' ){
		$("#yourHand__marbles__marble1").css({"visibility": "hidden"});
	}
}			

function countScore(){
	var p1Score =0;
	var p2Score =0;
	var p3Score =0;
	var p4Score =0;
	
	
	var p1Xplace = [];
	var p1Yplace = [];
	
	var p2Xplace = [];
	var p2Yplace = [];
	
	var p3Xplace = [];
	var p3Yplace = [];
	
	var p4Xplace = [];
	var p4Yplace = [];
	
	
	var p1Choces = "";
	var p2Choces = "";
	var p3Choces = "";
	var p4Choces = "";

	var p1X1 = 0;
	var p1X2 = 0;
	var p1X3 = 0;
	var p1X4 = 0;
	var p1X5 = 0;
	var p1X6 = 0;
	var p1X7 = 0;

	var p1Y1 = 0;
	var p1Y2 = 0;
	var p1Y3 = 0;
	var p1Y4 = 0;
	var p1Y5 = 0;
	var p1Y6 = 0;
	var p1Y7 = 0;

	var p2X1 = 0;
	var p2X2 = 0;
	var p2X3 = 0;
	var p2X4 = 0;
	var p2X5 = 0;
	var p2X6 = 0;
	var p2X7 = 0;

	var p2Y1 = 0;
	var p2Y2 = 0;
	var p2Y3 = 0;
	var p2Y4 = 0;
	var p2Y5 = 0;
	var p2Y6 = 0;
	var p2Y7 = 0;

	var p3X1 = 0;
	var p3X2 = 0;
	var p3X3 = 0;
	var p3X4 = 0;
	var p3X5 = 0;
	var p3X6 = 0;
	var p3X7 = 0;

	var p3Y1 = 0;
	var p3Y2 = 0;
	var p3Y3 = 0;
	var p3Y4 = 0;
	var p3Y5 = 0;
	var p3Y6 = 0;
	var p3Y7 = 0;

	var p4X1 = 0;
	var p4X2 = 0;
	var p4X3 = 0;
	var p4X4 = 0;
	var p4X5 = 0;
	var p4X6 = 0;
	var p4X7 = 0;

	var p4Y1 = 0;
	var p4Y2 = 0;
	var p4Y3 = 0;
	var p4Y4 = 0;
	var p4Y5 = 0;
	var p4Y6 = 0;
	var p4Y7 = 0;

	var incBy1 = 0;
	//different loop for 2, 3 and 4 p games
	if (playerCount == 2) {
		for (var i = 0; i < placedMarbles.length; i += 4) {
			p1Xplace[incBy1] = placedMarbles.charAt(i);
			p1Yplace[incBy1] = placedMarbles.charAt(i + 1);
			p2Xplace[incBy1] = placedMarbles.charAt(i + 2);
			p2Yplace[incBy1] = placedMarbles.charAt(i + 3);

			p1Choces += placedMarbles.charAt(i)
			p1Choces += placedMarbles.charAt(i + 1)
			p2Choces += placedMarbles.charAt(i + 2);
			p2Choces += placedMarbles.charAt(i + 3);
			incBy1++;
		}
	}else if (playerCount == 3){
		for (var i = 0; i < placedMarbles.length; i += 6) {
			p1Xplace[incBy1] = placedMarbles.charAt(i);
			p1Yplace[incBy1] = placedMarbles.charAt(i + 1);
			p2Xplace[incBy1] = placedMarbles.charAt(i + 2);
			p2Yplace[incBy1] = placedMarbles.charAt(i + 3);
			p3Xplace[incBy1] = placedMarbles.charAt(i + 4);
			p3Yplace[incBy1] = placedMarbles.charAt(i + 5);

			p1Choces += placedMarbles.charAt(i)
			p1Choces += placedMarbles.charAt(i + 1)
			p2Choces += placedMarbles.charAt(i + 2);
			p2Choces += placedMarbles.charAt(i + 3);
			p3Choces += placedMarbles.charAt(i + 4);
			p3Choces += placedMarbles.charAt(i + 5);
			incBy1++;
		}
	}else if(playerCount == 4){
		for(var i = 0; i<placedMarbles.length; i += 8) {
			p1Xplace[incBy1] = placedMarbles.charAt(i);
			p1Yplace[incBy1] = placedMarbles.charAt(i + 1);
			p2Xplace[incBy1] = placedMarbles.charAt(i + 2);
			p2Yplace[incBy1] = placedMarbles.charAt(i + 3);
			p3Xplace[incBy1] = placedMarbles.charAt(i + 4);
			p3Yplace[incBy1] = placedMarbles.charAt(i + 5);
			p4Xplace[incBy1] = placedMarbles.charAt(i + 6);
			p4Yplace[incBy1] = placedMarbles.charAt(i + 7);

			p1Choces += placedMarbles.charAt(i)
			p1Choces += placedMarbles.charAt(i + 1)
			p2Choces += placedMarbles.charAt(i + 2);
			p2Choces += placedMarbles.charAt(i + 3);
			p3Choces += placedMarbles.charAt(i + 4);
			p3Choces += placedMarbles.charAt(i + 5);
			p4Choces += placedMarbles.charAt(i + 6);
			p4Choces += placedMarbles.charAt(i + 7);
			incBy1++;
		}
	}

	for (var i = 0; i < p1Xplace.length; i++) {
		if (p1Xplace[i] == "a") {
			p1X1++
		} else if (p1Xplace[i] == "b") {
			p1X2++
		} else if (p1Xplace[i] == "c") {
			p1X3++
		} else if (p1Xplace[i] == "d") {
			p1X4++
		} else if (p1Xplace[i] == "e") {
			p1X5++
		} else if (p1Xplace[i] == "f") {
			p1X6++
		} else if (p1Xplace[i] == "g") {
			p1X7++
		}
		if (p1Yplace[i] == 1) {
			p1Y1++
		} else if (p1Yplace[i] == 2) {
			p1Y2++
		} else if (p1Yplace[i] == 3) {
			p1Y3++
		} else if (p1Yplace[i] == 4) {
			p1Y4++
		} else if (p1Yplace[i] == 5) {
			p1Y5++
		} else if (p1Yplace[i] == 6) {
			p1Y6++
		} else if (p1Yplace[i] == 7) {
			p1Y7++
		}
	}
	for (var i = 0; i < p2Xplace.length; i++) {
		if (p2Xplace[i] == "a") {
			p2X1++
		} else if (p2Xplace[i] == "b") {
			p2X2++
		} else if (p2Xplace[i] == "c") {
			p2X3++
		} else if (p2Xplace[i] == "d") {
			p2X4++
		} else if (p2Xplace[i] == "e") {
			p2X5++
		} else if (p2Xplace[i] == "f") {
			p2X6++
		} else if (p2Xplace[i] == "g") {
			p2X7++
		}
		if (p2Yplace[i] == 1) {
			p2Y1++
		} else if (p2Yplace[i] == 2) {
			p2Y2++
		} else if (p2Yplace[i] == 3) {
			p2Y3++
		} else if (p2Yplace[i] == 4) {
			p2Y4++
		} else if (p2Yplace[i] == 5) {
			p2Y5++
		} else if (p2Yplace[i] == 6) {
			p2Y6++
		} else if (p2Yplace[i] == 7) {
			p2Y7++
		}
	}
	//only run in 3 and 4p games 
	if (playerCount == 3 || playerCount == 4 ) {
		for (var i = 0; i < p3Xplace.length; i++) {
			if (p3Xplace[i] == "a") {
				p3X1++
			} else if (p3Xplace[i] == "b") {
				p3X2++
			} else if (p3Xplace[i] == "c") {
				p3X3++
			} else if (p3Xplace[i] == "d") {
				p3X4++
			} else if (p3Xplace[i] == "e") {
				p3X5++
			} else if (p3Xplace[i] == "f") {
				p3X6++
			} else if (p3Xplace[i] == "g") {
				p3X7++
			}
			if (p3Yplace[i] == 1) {
				p3Y1++
			} else if (p3Yplace[i] == 2) {
				p3Y2++
			} else if (p3Yplace[i] == 3) {
				p3Y3++
			} else if (p3Yplace[i] == 4) {
				p3Y4++
			} else if (p3Yplace[i] == 5) {
				p3Y5++
			} else if (p3Yplace[i] == 6) {
				p3Y6++
			} else if (p3Yplace[i] == 7) {
				p3Y7++
			}
		}
	}
	//only run in 4p games
	if (playerCount == 4) {
		for (var i = 0; i < p4Xplace.length; i++) {
			if (p4Xplace[i] == "a") {
				p4X1++
			} else if (p4Xplace[i] == "b") {
				p4X2++
			} else if (p4Xplace[i] == "c") {
				p4X3++
			} else if (p4Xplace[i] == "d") {
				p4X4++
			} else if (p4Xplace[i] == "e") {
				p4X5++
			} else if (p4Xplace[i] == "f") {
				p4X6++
			} else if (p4Xplace[i] == "g") {
				p4X7++
			}
			if (p4Xplace[i] == 1) {
				p4Y1++
			} else if (p4Yplace[i] == 2) {
				p4Y2++
			} else if (p4Yplace[i] == 3) {
				p4Y3++
			} else if (p4Yplace[i] == 4) {
				p4Y4++
			} else if (p4Yplace[i] == 5) {
				p4Y5++
			} else if (p4Yplace[i] == 6) {
				p4Y6++
			} else if (p4Yplace[i] == 7) {
				p4Y7++
			}
		}
	}

	if (p1Y1 > 1) {
		p1Score += p1Y1 - 1;
	}
	if (p1Y2 > 1) {
		p1Score += p1Y2 - 1;
	}
	if (p1Y3 > 1) {
		p1Score += p1Y3 - 1;
	}
	if (p1Y4 > 1) {
		p1Score += p1Y4 - 1;
	}
	if (p1Y5 > 1) {
		p1Score += p1Y5 - 1;
	}
	if (p1Y6 > 1) {
		p1Score += p1Y6 - 1;
	}
	if (p1Y7 > 1) {
		p1Score += p1Y7 - 1;
	}
	if (p1X1 > 1) {
		p1Score += p1X1 - 1;
	}
	if (p1X2 > 1) {
		p1Score += p1X2 - 1;
	}
	if (p1X3 > 1) {
		p1Score += p1X3 - 1;
	}
	if (p1X4 > 1) {
		p1Score += p1X4 - 1;
	}
	if (p1X5 > 1) {
		p1Score += p1X5 - 1;
	}
	if (p1X6 > 1) {
		p1Score += p1X6 - 1;
	}
	if (p1X7 > 1) {
		p1Score += p1X7 - 1;
	}

	if (p2Y1 > 1) {
		p2Score += p2Y1 - 1;
	}
	if (p2Y2 > 1) {
		p2Score += p2Y2 - 1;
	}
	if (p2Y3 > 1) {
		p2Score += p2Y3 - 1;
	}
	if (p2Y4 > 1) {
		p2Score += p2Y4 - 1;
	}
	if (p2Y5 > 1) {
		p2Score += p2Y5 - 1;
	}
	if (p2Y6 > 1) {
		p2Score += p2Y6 - 1;
	}
	if (p2Y7 > 1) {
		p2Score += p2Y7 - 1;
	}
	if (p2X1 > 1) {
		p2Score += p2X1 - 1;
	}
	if (p2X2 > 1) {
		p2Score += p2X2 - 1;
	}
	if (p2X3 > 1) {
		p2Score += p2X3 - 1;
	}
	if (p2X4 > 1) {
		p2Score += p2X4 - 1;
	}
	if (p2X5 > 1) {
		p2Score += p2X5 - 1;
	}
	if (p2X6 > 1) {
		p2Score += p2X6 - 1;
	}
	if (p2X7 > 1) {
		p2Score += p2X7 - 1;
	}

	if (p3Y1 > 1) {
		p3Score += p3Y1 - 1;
	}
	if (p3Y2 > 1) {
		p3Score += p3Y2 - 1;
	}
	if (p3Y3 > 1) {
		p3Score += p3Y3 - 1;
	}
	if (p3Y4 > 1) {
		p3Score += p3Y4 - 1;
	}
	if (p3Y5 > 1) {
		p3Score += p3Y5 - 1;
	}
	if (p3Y6 > 1) {
		p3Score += p3Y6 - 1;
	}
	if (p3Y7 > 1) {
		p3Score += p3Y7 - 1;
	}
	if (p3X1 > 1) {
		p3Score += p3X1 - 1;
	}
	if (p3X2 > 1) {
		p3Score += p3X2 - 1;
	}
	if (p3X3 > 1) {
		p3Score += p3X3 - 1;
	}
	if (p3X4 > 1) {
		p3Score += p3X4 - 1;
	}
	if (p3X5 > 1) {
		p3Score += p3X5 - 1;
	}
	if (p3X6 > 1) {
		p3Score += p3X6 - 1;
	}
	if (p3X7 > 1) {
		p3Score += p3X7 - 1;
	}

	if (p4Y1 > 1) {
		p4Score += p4Y1 - 1;
	}
	if (p4Y2 > 1) {
		p4Score += p4Y2 - 1;
	}
	if (p4Y3 > 1) {
		p4Score += p4Y3 - 1;
	}
	if (p4Y4 > 1) {
		p4Score += p4Y4 - 1;
	}
	if (p4Y5 > 1) {
		p4Score += p4Y5 - 1;
	}
	if (p4Y6 > 1) {
		p4Score += p4Y6 - 1;
	}
	if (p4Y7 > 1) {
		p4Score += p4Y7 - 1;
	}
	if (p4X1 > 1) {
		p4Score += p4X1 - 1;
	}
	if (p4X2 > 1) {
		p4Score += p4X2 - 1;
	}
	if (p4X3 > 1) {
		p4Score += p4X3 - 1;
	}
	if (p4X4 > 1) {
		p4Score += p4X4 - 1;
	}
	if (p4X5 > 1) {
		p4Score += p4X5 - 1;
	}
	if (p4X6 > 1) {
		p4Score += p4X6 - 1;
	}
	if (p4X7 > 1) {
		p4Score += p4X7 - 1;
	}

	console.log("Score before adding in the slots themselves but after adding the connection bonus, p1:" + p1Score + " p2:" + p2Score + " p3:" + p3Score + " p4:" + p4Score)
	var p1Connection = p1Score;
	var p2Connection = p2Score;
	var p3Connection = p3Score;
	var p4Connection = p4Score;

	for (i = 0; i < all3scoreSlots.length; i++) {
		if (p1Choces.includes(all3scoreSlots[i])) {
			p1Score += 3;
		}
	}
	for (i = 0; i < all2scoreSlots.length; i++) {
		if (p1Choces.includes(all2scoreSlots[i])) {
			p1Score += 2;
		}
	}
	for (i = 0; i < all1scoreSlots.length; i++) {
		if (p1Choces.includes(all1scoreSlots[i])) {
			p1Score += 1;
		}
	}

	for (i = 0; i < all3scoreSlots.length; i++) {
		if (p2Choces.includes(all3scoreSlots[i])) {
			p2Score += 3;
		}
	}
	for (i = 0; i < all2scoreSlots.length; i++) {
		if (p2Choces.includes(all2scoreSlots[i])) {
			p2Score += 2;
		}
	}
	for (i = 0; i < all1scoreSlots.length; i++) {
		if (p2Choces.includes(all1scoreSlots[i])) {
			p2Score += 1;
		}
	}
	//only run in 3 and 4p games
	if (playerCount == 3 || playerCount == 4) {
		for (i = 0; i < all3scoreSlots.length; i++) {
			if (p3Choces.includes(all3scoreSlots[i])) {
				p3Score += 3;
			}
		}
		for (i = 0; i < all2scoreSlots.length; i++) {
			if (p3Choces.includes(all2scoreSlots[i])) {
				p3Score += 2;
			}
		}
		for (i = 0; i < all1scoreSlots.length; i++) {
			if (p3Choces.includes(all1scoreSlots[i])) {
				p3Score += 1;
			}
		}
	}
	// only 4p games
	if (playerCount == 4) {
		for (i = 0; i < all3scoreSlots.length; i++) {
			if (p4Choces.includes(all3scoreSlots[i])) {
				p4Score += 3;
			}
		}
		for (i = 0; i < all2scoreSlots.length; i++) {
			if (p4Choces.includes(all2scoreSlots[i])) {
				p4Score += 2;
			}
		}
		for (i = 0; i < all1scoreSlots.length; i++) {
			if (p4Choces.includes(all1scoreSlots[i])) {
				p4Score += 1;
			}
		}
	}

	console.log("p1Choces " + p1Choces)
	console.log("p2Choces " + p2Choces)
	console.log("p3Choces " + p3Choces)
	console.log("p4Choces " + p4Choces)

	console.log("p1 score: " + p1Score)
	console.log("p2 score: " + p2Score)
	console.log("p3 score: " + p3Score)
	console.log("p4 score: " + p4Score)


	//count the winner and set a crown besides their score.
	//winner is the one with most points.
	//if two player have same amount of points winner is the one hwo hsa more connection point.
	//if both players have same points and same connection points then winner is the one with bigger player number.
	var p1winner = false;
	var p2winner = false;
	var p3winner = false;
	var p4winner = false;

	var biggestNumber = Math.max(p1Score, p2Score, p3Score, p4Score);
	var allHighScores = [];
	if (p1Score == biggestNumber) {allHighScores.push("p1")}
	if (p2Score == biggestNumber) {allHighScores.push("p2")} 
	if (p3Score == biggestNumber) {allHighScores.push("p3")}
	if (p4Score == biggestNumber) {allHighScores.push("p4")}

	if (allHighScores.length > 1) { //if there is a tie
		//check to see what are the connection points between all players
		var connectionBonuses = [];
		if (allHighScores.includes("p1")) { connectionBonuses.push(p1Connection) }
		if (allHighScores.includes("p2")) { connectionBonuses.push(p2Connection) }
		if (allHighScores.includes("p3")) { connectionBonuses.push(p3Connection) }
		if (allHighScores.includes("p4")) { connectionBonuses.push(p4Connection) }

		var biggestConnection = Math.max(...connectionBonuses);
		var highestScoreAndConnection = [];
		if (p1Score == biggestNumber && p1Connection == biggestConnection) { highestScoreAndConnection.push("p1")}
		if (p2Score == biggestNumber && p2Connection == biggestConnection) { highestScoreAndConnection.push("p2") }
		if (p3Score == biggestNumber && p3Connection == biggestConnection) { highestScoreAndConnection.push("p3") }
		if (p4Score == biggestNumber && p4Connection == biggestConnection) { highestScoreAndConnection.push("p4") }

		if (highestScoreAndConnection.length > 1) { //if the winner is the player with bigger player number
			if (highestScoreAndConnection.includes("p4")) {
				p4winner = true;
			} else if (highestScoreAndConnection.includes("p3")) {
				p3winner = true;
			} else if (highestScoreAndConnection.includes("p2")) {
				p2winner = true;
			} else if (highestScoreAndConnection.includes("p1")) {
				p1winner = true;
			} else {
				console.log("error in counting who is the winner")
			}


		} else { //if the winner is declared with bigger connection score
			if (highestScoreAndConnection[0] == "p1") {
				p1winner = true;
			} else if (highestScoreAndConnection[0] == "p2") {
				p2winner = true;
			} else if (highestScoreAndConnection[0] == "p3") {
				p3winner = true;
			} else if (highestScoreAndConnection[0] == "p4") {
				p4winner = true;
			}
		}

	} else {//if there is no tie
		if (allHighScores[0] == "p1") {
			p1winner = true;
		} else if (allHighScores[0] == "p2") {
			p2winner = true;
		} else if (allHighScores[0] == "p3") {
			p3winner = true;
		} else if (allHighScores[0] == "p4") {
			p4winner = true;
		}
	}

	
	//show the results in the results div
	$("#endOfGameScreen__close").css({ "display": "block" });
	$("#endOfGameScreen").css({ "display": "block" });

	if (playerCount == 4) {
		$("#p1NameEnd").append('<span class="p1Color">' + localStorage.getItem("Player1Name") + ' (p1)</span> score: ' + p1Score);
		$("#p2NameEnd").append('<span class="p2Color">' + localStorage.getItem("Player2Name") + ' (p2)</span> score: ' + p2Score); 
		$("#p3NameEnd").append('<span class="p3Color">' + localStorage.getItem("Player3Name") + ' (p3)</span> score: ' + p3Score); 
		$("#p4NameEnd").append('<span class="p4Color">' + localStorage.getItem("Player4Name") + ' (p4)</span> score: ' + p4Score);
	} else if (playerCount == 3) {
		$("#p1NameEnd").append('<span class="p1Color">' + localStorage.getItem("Player1Name") + ' (p1)</span> score: ' + p1Score);
		$("#p2NameEnd").append('<span class="p2Color">' + localStorage.getItem("Player2Name") + ' (p2)</span> score: ' + p2Score); 
		$("#p3NameEnd").append('<span class="p3Color">' + localStorage.getItem("Player3Name") + ' (p3)</span> score: ' + p3Score); 
	} else if (playerCount == 2) {
		$("#p1NameEnd").append('<span class="p1Color">' + localStorage.getItem("Player1Name") + ' (p1)</span> score: ' + p1Score);
		$("#p2NameEnd").append('<span class="p2Color">' + localStorage.getItem("Player2Name") + ' (p2)</span> score: ' + p2Score); 
	}

	//use p*winner variables to decide which one is the winner and put the crown to them

	if (p1winner) {
		console.log("p1 won the game.")
		$("#p1NameEnd").css({ "background-image": "url(../public_html/pictures/kivi/medal/medal.png)" });
	}
	if (p2winner) {
		console.log("p2 won the game.")
		$("#p2NameEnd").css({ "background-image": "url(../public_html/pictures/kivi/medal/medal.png)" });
	}
	if (p3winner) {
		console.log("p3 won the game.")
		$("#p3NameEnd").css({ "background-image": "url(../public_html/pictures/kivi/medal/medal.png)" });
	}
	if (p4winner) {
		console.log("p4 won the game.")
		$("#p4NameEnd").css({ "background-image": "url(../public_html/pictures/kivi/medal/medal.png)" });
	}
	
}


function playerColorBackground(p){
	$("#playersName__player1__name").css({"text-shadow": "none"});
	$("#playersName__player2__name").css({"text-shadow": "none"});
	$("#playersName__player3__name").css({"text-shadow": "none"});
	$("#playersName__player4__name").css({"text-shadow": "none"});
	
	if(p == 1){
		$("#playersName__player1__name").css({"text-shadow": "-2px -2px 2px #fff, 2px 2px 2px #fff, -2px 2px 2px #fff, 2px -2px 2px #fff"});
	}else if(p == 2){
		$("#playersName__player2__name").css({"text-shadow": "-2px -2px 2px #fff, 2px 2px 2px #fff, -2px 2px 2px #fff, 2px -2px 2px #fff"});
	}else if(p == 3){
		$("#playersName__player3__name").css({"text-shadow": "-2px -2px 2px #fff, 2px 2px 2px #fff, -2px 2px 2px #fff, 2px -2px 2px #fff"});
	}else if(p == 4){
		$("#playersName__player4__name").css({"text-shadow": "-2px -2px 2px #fff, 2px 2px 2px #fff, -2px 2px 2px #fff, 2px -2px 2px #fff"});
	}
	
}






