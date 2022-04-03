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
var severGameInfo;
//set the color of each player
$(document).ready(function(){
	severGameInfo = JSON.parse(gameInfoFromServer);
	
	if(severGameInfo.gameFound === true){
		console.log("game loaded successfully")
		$("#playersName__player1__name").html(severGameInfo.p1Name);
		$("#playersName__player2__name").html(severGameInfo.p2Name);
		
		if(severGameInfo.playerCount == 4){
			$("#playersName__player4__name").html(severGameInfo.p4Name);
			$("#playersName__player3__name").html(severGameInfo.p3Name);
		}else if(severGameInfo.playerCount == 3){	
			$("#playersName__player3__name").html(severGameInfo.p3Name);
		}
		
		if(severGameInfo.playerCount == 2){
			$("#playersName__player3").css({"display": "none" });
			$("#playersName__player4").css({"display": "none" });
			$(".playersName__tags").css({"width": "50%" });
		}else if(severGameInfo.playerCount == 3){
			$("#playersName__player4").css({"display": "none" });
			$(".playersName__tags").css({"width": "33.33%" });
		}
	
		var p1Medal ="";
		if(severGameInfo.winner == 1){
			p1Medal =' style="background-image: url(../pictures/kivi/medal/medal.png)"';
		}
		var p2Medal ="";
		if(severGameInfo.winner == 2){
			p2Medal =' style="background-image: url(../pictures/kivi/medal/medal.png)"';
		}
		var p3Medal ="";
		if(severGameInfo.winner == 3){
			p3Medal =' style="background-image: url(../pictures/kivi/medal/medal.png)"';
		}
		var p4Medal ="";
		if(severGameInfo.winner == 4){
			p4Medal =' style="background-image: url(../pictures/kivi/medal/medal.png)"';
		}
		
		$("#postGameInfo").html("")
		
		var toBeappended = "";
		
		toBeappended += '<table><tr><th id="boldTable">Name</th><th id="boldTable">Score</th><th id="boldTable">Connection Score</th></tr>';
		toBeappended += '<tr><th' + p1Medal + '><span class="p1Color">' + severGameInfo.p1Name + '</span></th><th><span class="p1Color">' + severGameInfo.p1Score + '</span></th><th><span class="p1Color"> ' + severGameInfo.p1ConScore + '</span></th></tr>';
		
		toBeappended += '<tr><th' + p2Medal + '><span class="p2Color">' + severGameInfo.p2Name + '</span></th><th><span class="p2Color">' + severGameInfo.p2Score + '</span></th><th><span class="p2Color">' + severGameInfo.p2ConScore + '</span></th></tr>';
		
		if(severGameInfo.playerCount > 2){
			toBeappended += '<tr><th' + p3Medal + '><span class="p3Color">' + severGameInfo.p3Name + '</th><th><span class="p3Color">' + severGameInfo.p3Score + '</span></th><th><span class="p3Color"> ' + severGameInfo.p3ConScore + '</span></th></tr>';
		}
		if(severGameInfo.playerCount > 3){
			toBeappended += '<tr><th' + p4Medal + '><span class="p4Color">' + severGameInfo.p4Name + '</th><th><span class="p4Color">' + severGameInfo.p4Score + '</span></th><th><span class="p4Color"> ' + severGameInfo.p4ConScore + '</span></th></tr>';
		}
		
		toBeappended += '</table>';
		
		$("#postGameInfo").append(toBeappended);
		
		//call to a  function that will do the rest
		fillTheSlots(severGameInfo.boardUsedPositions)
	}else if(severGameInfo.gameFound === false){
		console.log("game not found")
	}else{
		console.log("php script not working")
	}	
})



// << set a background images of slots  >>
//also set a text from 1-10 to specify which slot was used and when
function placeMarble(data, player, marbleNumber){
	var placeChoice = data;
	placedMarbles = placeChoice;
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
	
	$("#"+ placeChoice + "-slot").css("background-image",  "url(../pictures/kivi/marbles/" + color + ".svg), url(../pictures/kivi/board/" + placeChoice + ".svg)");
	$("#"+ placeChoice + "-slot").append(String(marbleNumber));
}

var choicesP1 = [];
var choicesP2 = [];
var choicesP3 = [];
var choicesP4 = [];

function fillTheSlots(placedMarbles){
	incBy1 = 0;
	if (severGameInfo.playerCount == 2) {
		for (var i = 0; i < severGameInfo.boardUsedPositions.length; i += 4) {
			choicesP1[incBy1] = placedMarbles.charAt(i)
			choicesP1[incBy1] += placedMarbles.charAt(i + 1)
			
			choicesP2[incBy1] = placedMarbles.charAt(i + 2);
			choicesP2[incBy1] += placedMarbles.charAt(i + 3);
			
			incBy1++;
		}
	}else if (severGameInfo.playerCount == 3) {
		for (var i = 0; i < severGameInfo.boardUsedPositions.length; i += 6) {
			choicesP1[incBy1] = placedMarbles.charAt(i)
			choicesP1[incBy1] += placedMarbles.charAt(i + 1)
			
			choicesP2[incBy1] = placedMarbles.charAt(i + 2);
			choicesP2[incBy1] += placedMarbles.charAt(i + 3);
			
			choicesP3[incBy1] = placedMarbles.charAt(i + 4);
			choicesP3[incBy1] += placedMarbles.charAt(i + 5);
			
			incBy1++;
		}
	}else if (severGameInfo.playerCount == 4) {
		for (var i = 0; i < severGameInfo.boardUsedPositions.length; i += 8) {
			choicesP1[incBy1] = placedMarbles.charAt(i)
			choicesP1[incBy1] += placedMarbles.charAt(i + 1)
			
			choicesP2[incBy1] = placedMarbles.charAt(i + 2);
			choicesP2[incBy1] += placedMarbles.charAt(i + 3);
			
			choicesP3[incBy1] = placedMarbles.charAt(i + 4);
			choicesP3[incBy1] += placedMarbles.charAt(i + 5);
			
			choicesP4[incBy1] = placedMarbles.charAt(i + 6);
			choicesP4[incBy1] += placedMarbles.charAt(i + 7);
			
			incBy1++;
		}
	}
	for(var i = 0; i < 10; i++){
		placeMarble(choicesP1[i], 1, i+1)
	}
	for(var i = 0; i < 10; i++){
		placeMarble(choicesP2[i], 2, i+1)
	}
	
	if(severGameInfo.playerCount == 3 || severGameInfo.playerCount == 4){
		for(var i = 0; i < 10; i++){
			placeMarble(choicesP3[i], 3, i+1)
		}
	}
	if(severGameInfo.playerCount == 4){
		for(var i = 0; i < 10; i++){
			placeMarble(choicesP4[i], 4, i+1)
		}
	}
}





















