//orderedBy: TimeDescending, TimeAscending, highLow, lowHigh
var getHeaderData = { pAmount:"all", gamesShown: 10, orderedBy:"TimeDescending", page:1};

//change this based on info from the server
var maxpage = 1;


//set to 0 if there isn't enough pages to show
var firstNumVal = 1;
var secondNumVal = 2;
var thirdNumVal = 3;
var fourthNumVal = 4;
var fifthNumVal = 5;

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


//save your choices into the "getHeaderData" object
$(document).ready(function(){
	$("#players").change(function(){
		var str = "";
		var names =["PAmount", "NOfGames", "OrderBy"];
		$( "#players option:selected" ).each(function() {
			if($(this).text() == "all" ){
				getHeaderData.pAmount = "all";
			}else if($(this).text() == "2p" ){
				getHeaderData.pAmount = "2p";
			}else if($(this).text() == "3p" ){
				getHeaderData.pAmount = "3p";
			}else if($(this).text() == "4p" ){
				getHeaderData.pAmount = "4p";
			}
			getHeaderData.page = 1;
		});
		console.log("header data for get request is:");
		console.log(getHeaderData);
		redirectWithGet()
	});
});

$(document).ready(function(){
	$("#gamesShown").change(function(){
		$( "#gamesShown option:selected" ).each(function() {
			if($(this).text() == "10" ){
				getHeaderData.gamesShown = 10;
			}else if($(this).text() == "25" ){
				getHeaderData.gamesShown = 25;
			}else if($(this).text() == "50" ){
				getHeaderData.gamesShown = 50;
			}else if($(this).text() == "100" ){
				getHeaderData.gamesShown = 100;
			}
			getHeaderData.page = 1;
		});
		console.log("header data for get request is:");
		console.log(getHeaderData);
		redirectWithGet()
	});
});

$(document).ready(function(){
	$("#orderedBy").change(function(){
		$( "#orderedBy option:selected" ).each(function() {
			if($(this).text() == "TimePlayed (newest to oldest)" ){
				getHeaderData.orderedBy = "TimeDescending";
			}else if($(this).text() == "TimePlayed (oldest to newest)" ){
				getHeaderData.orderedBy = "TimeAscending";
			}else if($(this).text() == "High Score (High to Low)" ){
				getHeaderData.orderedBy = "highLow";
			}else if($(this).text() == "High Score (Low to High)" ){
				getHeaderData.orderedBy = "lowHigh";
			}
			getHeaderData.page = 1;
		});
		console.log("header data for get request is:");
		console.log(getHeaderData);
		redirectWithGet()
	});
});

//next and previous pages
$(document).ready(function(){
	$(".pages__previous").click(function(){
		if(getHeaderData.page > 1){
			getHeaderData.page --;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	$(".pages__pagesTotal--oneToLeft").click(function(){
		if(getHeaderData.page > 1){
			getHeaderData.page --;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	
	$(".pages__pagesTotal--oneToRight").click(function(){
		if(getHeaderData.page != maxpage){
			getHeaderData.page ++;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	$(".pages__next").click(function(){
		if(getHeaderData.page != maxpage){
			getHeaderData.page ++;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	
	$(".pages__pagesTotal--leftMostPage").click(function(){
		if(getHeaderData.page != 1){
			getHeaderData.page = 1;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	$(".pages__pagesTotal--rightMostPage").click(function(){
		if(getHeaderData.page != maxpage){
			getHeaderData.page = maxpage;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	
	//number selection for the pages
	$(".pages__pagesTotal__availablePageNumber__firstNumber").click(function(){
		if(getHeaderData.page != firstNumVal && firstNumVal){
			console.log("first number clicked")
			getHeaderData.page = firstNumVal;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	$(".pages__pagesTotal__availablePageNumber__secondNumber").click(function(){
		if(getHeaderData.page != secondNumVal && secondNumVal){
			console.log("second number clicked")
			getHeaderData.page = secondNumVal;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	$(".pages__pagesTotal__availablePageNumber__thirdNumber").click(function(){
		if(getHeaderData.page != thirdNumVal && thirdNumVal){
			console.log("third number clicked")
			getHeaderData.page = thirdNumVal;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	$(".pages__pagesTotal__availablePageNumber__fourthNumber").click(function(){
		if(getHeaderData.page != fourthNumVal && fourthNumVal){
			console.log("third number clicked")
			getHeaderData.page = fourthNumVal;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	$(".pages__pagesTotal__availablePageNumber__fifthNumber").click(function(){
		if(getHeaderData.page != fifthNumVal && fifthNumVal){
			console.log("third number clicked")
			getHeaderData.page = fifthNumVal;
			console.log(getHeaderData);
			redirectWithGet()
		}
	});
	
});

//get the info right away
$(document).ready(function(){
	getPageInfo()
});

//send the php get request
function getPageInfo(){
	data = JSON.parse(allGamesFromServer);
	
	//set your header data to match the data from server
	getHeaderData.pAmount = data["yourSettings"]["pAmount"]
	getHeaderData.gamesShown =  parseInt(data["yourSettings"]["gamesShown"])
	getHeaderData.orderedBy = data["yourSettings"]["orderedBy"]
	getHeaderData.page = parseInt(data["yourSettings"]["page"])
	console.log(getHeaderData)
	
	//set the settings seen in the page to match the ones you got from server
	var playersForm = '<option value="all"';
	if(data["yourSettings"]["pAmount"] == "all"){
		playersForm += ' selected ';
	}
	playersForm += ' >';
	playersForm += 'all</option><option value="2p"';
	if(data["yourSettings"]["pAmount"] == "2p"){
		playersForm += ' selected ';
	}
	playersForm += ' >';
	playersForm += '2p</option><option value="3p"';
	if(data["yourSettings"]["pAmount"] == "3p"){
		playersForm += ' selected ';
	}
	playersForm += ' >';
	playersForm += '3p</option><option value="4p"';
	if(data["yourSettings"]["pAmount"] == "4p"){
		playersForm += ' selected ';
	}
	playersForm += ' >';
	playersForm += '4p</option>';
	
	console.log(playersForm)
	$("#players").html(playersForm);
	
	 
	var gamesShwonForm = '<option value="10"';
	if(data["yourSettings"]["gamesShown"] == 10){
		gamesShwonForm += ' selected ';
	}
	gamesShwonForm += ' >';
	gamesShwonForm += '10</option><option value="25"';
	if(data["yourSettings"]["gamesShown"] == 25){
		gamesShwonForm += ' selected ';
	}
	gamesShwonForm += ' >';
	gamesShwonForm += '25</option><option value="50"';
	if(data["yourSettings"]["gamesShown"] == 50){
		gamesShwonForm += ' selected ';
	}
	gamesShwonForm += ' >';
	gamesShwonForm += '50</option><option value="100"';
	if(data["yourSettings"]["gamesShown"] == 100){
		gamesShwonForm += ' selected ';
	}
	gamesShwonForm += ' >';
	gamesShwonForm += '100</option>';
	
	console.log(gamesShwonForm)
	$("#gamesShown").html(gamesShwonForm);
	
	 
	var orderedByForm = '<option value="TimeDescending"';
	if(data["yourSettings"]["orderedBy"] == "TimeDescending"){
		orderedByForm += ' selected ';
	}
	orderedByForm += ' >';
	orderedByForm += 'TimePlayed (newest to oldest)</option><option value="TimeAscending"';
	if(data["yourSettings"]["orderedBy"] == "TimeAscending"){
		orderedByForm += ' selected ';
	}
	orderedByForm += ' >';
	orderedByForm += 'TimePlayed (oldest to newest)</option><option value="highLow"';
	if(data["yourSettings"]["orderedBy"] == "highLow"){
		orderedByForm += ' selected ';
	}
	orderedByForm += ' >';
	orderedByForm += 'High Score (High to Low)</option><option value="lowHigh"';
	if(data["yourSettings"]["orderedBy"] == "lowHigh"){
		orderedByForm += ' selected ';
	}
	orderedByForm += ' >';
	orderedByForm += 'High Score (Low to High)</option>';
	
	console.log(orderedByForm)
	$("#orderedBy").html(orderedByForm);
	
	
	
	//remove the now showing games
	$("#shownGames").html("");
	//var higherOfTwo = Math.min(data.numOfgames, data["yourSettings"]["gamesShown"])
	
	for(var i = 0; i < data["numOfShowingGames"] ; i++){
		
		//Add relative link from this script to the kiviPreviewGame.php file
		var relativeKiviPreviewLink = window.location.href.substring(0 , toString(window.location.href).indexOf("?"));
		relativeKiviPreviewLink += "?ID=";
		relativeKiviPreviewLink = relativeKiviPreviewLink.replace("gameHistory", "kiviPreviewGame");
		// '<a href="http://rmbrawl.net/kiviPreviewGame.php?ID='
		
		var toBeappended = '<a href=';
		toBeappended += relativeKiviPreviewLink;
		toBeappended += String(data["game"][i]["ID"]); //link to the game	<<< !! still testing !! >>>
		toBeappended += ' target="_blank">';
		toBeappended += '<div class="shownGames__game">';
		toBeappended += '<div class="shownGames__game__time">';
		toBeappended += data["game"][i]["startTime"]; // add the day
		
		//add the minutes
		//var minutesTaken = data["game"][i]["endTime"] - data["game"][i]["startTime"];
		//toBeappended += "(" + String(minutesTaken) + ")</div>";
		toBeappended += '</div>';
		
		toBeappended += '<div class="shownGames__game__nameAndScore"';
		
		//add the margin left if needed
		if (data["game"][i]["playerCount"] == 2){
			toBeappended += 'style=" margin-left: 25vw; width: 70vw;"';
		}else if (data["game"][i]["playerCount"] == 3){
			toBeappended += 'style=" margin-left: 12.5vw; width: 82vw;"';
		}
		toBeappended +='>';
		
		
		//p1 name and score
		toBeappended += '<div class="shownGames__game__nameAndScore__p1"'; 
		
		if (data["game"][i]["winner"] == 1){
			toBeappended += ' style="background-image: url(pictures/kivi/medal/medal.png);"';
		}
		
		toBeappended += '><div class="shownGames__game__nameAndScore__p1__Name"><span class="p1Color">';
		toBeappended += String(data["game"][i]["p1Name"]) + '</span></div>';
		toBeappended += '<div class="shownGames__game__nameAndScore__p1__Score">' + String(data["game"][i]["p1Score"]) + '</div></div>';	
		
		//p2
		toBeappended += '<div class="shownGames__game__nameAndScore__p2"';

		if (data["game"][i]["winner"] == 2){
			toBeappended += 'style="background-image: url(pictures/kivi/medal/medal.png);"';
		}
		toBeappended += '>';

		toBeappended += '<div class="shownGames__game__nameAndScore__p2__Name"><span class="p2Color">' + String(data["game"][i]["p2Name"]) + '</span></div>';
		toBeappended += '<div class="shownGames__game__nameAndScore__p2__Score">' + String(data["game"][i]["p2Score"]) + '</div></div>';
		
		if(data["game"][i]["playerCount"] > 2){
			//p3
			toBeappended += '<div class="shownGames__game__nameAndScore__p3"';
			
			if (data["game"][i]["winner"] == 3){
				toBeappended += 'style="background-image: url(pictures/kivi/medal/medal.png);"';
			}
			toBeappended += '>';
			
			toBeappended += '<div class="shownGames__game__nameAndScore__p3__Name"><span class="p3Color">' + String(data["game"][i]["p3Name"]) + '</span></div>';
			toBeappended += '<div class="shownGames__game__nameAndScore__p3__Score">' + String(data["game"][i]["p3Score"]) + '</div></div>';
		}
		if(data["game"][i]["playerCount"] == 4){
			toBeappended += '<div class="shownGames__game__nameAndScore__p4"';
			if (data["game"][i]["winner"] == 4){
				toBeappended += ' style="background-image: url(pictures/kivi/medal/medal.png);"';
			}
			toBeappended += '>'
			toBeappended += '<div class="shownGames__game__nameAndScore__p4__Name"><span class="p4Color"> ' + String(data["game"][i]["p4Name"]) + '</span></div>';
			toBeappended += '<div class="shownGames__game__nameAndScore__p4__Score">' + String(data["game"][i]["p4Score"]) + '</div></div>';
		}
		
		//closing, regardless if game is 2p, 3p or 4p
		toBeappended += '</div></div></a>';
		
		
		$("#shownGames").append(toBeappended);
	}//end of loop
	
	//show the total amount of games and how many are shown now
	maxpage = Math.ceil(data.numOfgames / data["yourSettings"]["gamesShown"])
	
	var gamesShown = "";
	var firstPage = (data["yourSettings"]["page"] - 1) * data["yourSettings"]["gamesShown"] +1;
	 
	var lastPage ;
	if(data["yourSettings"]["gamesShown"] < data.numOfgames){
		lastPage = parseInt(data["yourSettings"]["gamesShown"]) * (getHeaderData.page -1) + data["numOfShowingGames"];
	}else{
		lastPage = data.numOfgames;
	}
	
	gamesShown += firstPage + " - " + lastPage + " / " + data.numOfgames;
	
	$(".pages__gamesTotal__shownGamesNumbers").html(gamesShown);
	
	
	//change the numbers in page list to math the search
	
	console.log("maxpage" + maxpage)
	
	if(maxpage >= 5){ //if all buttons can be enabled
		if(maxpage > data["yourSettings"]["page"] + 1){ //if the current page can be the middle button
			firstNumVal = parseInt(data["yourSettings"]["page"]) - 2;
			secondNumVal = parseInt(data["yourSettings"]["page"]) - 1;
			thirdNumVal = parseInt(data["yourSettings"]["page"]);
			fourthNumVal = parseInt(data["yourSettings"]["page"]) + 1;
			fifthNumVal = parseInt(data["yourSettings"]["page"]) + 2;	
		}else{//if the middle page has to be either fourth or fifth number
			if( data["yourSettings"]["page"] == maxpage){ //if the current page should be the last
				firstNumVal = parseInt(data["yourSettings"]["page"]) - 3;
				secondNumVal = parseInt(data["yourSettings"]["page"]) - 2;
				thirdNumVal = parseInt(data["yourSettings"]["page"]) - 1;
				fourthNumVal = parseInt(data["yourSettings"]["page"]);
				fifthNumVal = parseInt(data["yourSettings"]["page"]) + 1;
			}else{ //if  the current page should be second last
				firstNumVal = parseInt(data["yourSettings"]["page"]) - 4;
				secondNumVal = parseInt(data["yourSettings"]["page"]) - 3;
				thirdNumVal = parseInt(data["yourSettings"]["page"]) - 2;
				fourthNumVal = parseInt(data["yourSettings"]["page"]) - 1;
				fifthNumVal = parseInt(data["yourSettings"]["page"]);
			}
		}
	}else{
		firstNumVal = 1;
		secondNumVal = maxpage >= 2 ? 2 : 0;
		thirdNumVal = maxpage >= 3 ? 3 : 0;
		fourthNumVal = maxpage >= 4 ? 4 : 0;
		fifthNumVal = maxpage >= 5 ? 5 : 0;
	}
	
	//set the html text match the variables
	if(firstNumVal){
		$(".pages__pagesTotal__availablePageNumber__firstNumber").html(firstNumVal);
	}else{
		$(".pages__pagesTotal__availablePageNumber__firstNumber").html("1");
	}
	if(secondNumVal){
		$(".pages__pagesTotal__availablePageNumber__secondNumber").html(secondNumVal);
	}else{
		$(".pages__pagesTotal__availablePageNumber__secondNumber").html("2");
	}
	if(thirdNumVal){
		$(".pages__pagesTotal__availablePageNumber__thirdNumber").html(thirdNumVal);
	}else{
		$(".pages__pagesTotal__availablePageNumber__thirdNumber").html("3");	
	}
	if(fourthNumVal){
		$(".pages__pagesTotal__availablePageNumber__fourthNumber").html(fourthNumVal);
	}else{
		$(".pages__pagesTotal__availablePageNumber__fourthNumber").html("4");	
	}
	if(fifthNumVal){
		$(".pages__pagesTotal__availablePageNumber__fifthNumber").html(fifthNumVal);
	}else{
		$(".pages__pagesTotal__availablePageNumber__fifthNumber").html("5");	
	}
	
	
	//if the value is 0 set the text color to #666
	//if this is the current page set text to #818
	//else set the text to #f8f
	if(firstNumVal == getHeaderData.page){
		$(".pages__pagesTotal__availablePageNumber__firstNumber").css({"color" : "#818"});
	}else if(firstNumVal){
		$(".pages__pagesTotal__availablePageNumber__firstNumber").css({"color" : "#f8f"});
	}else{
		$(".pages__pagesTotal__availablePageNumber__firstNumber").css({"color" : "#666"});
	}
	if(secondNumVal == getHeaderData.page){
		$(".pages__pagesTotal__availablePageNumber__secondNumber").css({"color" : "#818"});
	}else if(secondNumVal){
		$(".pages__pagesTotal__availablePageNumber__secondNumber").css({"color" : "#f8f"});
	}else{
		$(".pages__pagesTotal__availablePageNumber__secondNumber").css({"color" : "#666"});
	}
	if(thirdNumVal == getHeaderData.page){
		$(".pages__pagesTotal__availablePageNumber__thirdNumber").css({"color" : "#818"});
	}else if(thirdNumVal){
		$(".pages__pagesTotal__availablePageNumber__thirdNumber").css({"color" : "#f8f"});
	}else{
		$(".pages__pagesTotal__availablePageNumber__thirdNumber").css({"color" : "#666"});
	}
	if(fourthNumVal == getHeaderData.page){
		$(".pages__pagesTotal__availablePageNumber__fourthNumber").css({"color" : "#818"});
	}else if(fourthNumVal){
		$(".pages__pagesTotal__availablePageNumber__fourthNumber").css({"color" : "#f8f"});
	}else{
		$(".pages__pagesTotal__availablePageNumber__fourthNumber").css({"color" : "#666"});
	}
	if(fifthNumVal == getHeaderData.page){
		$(".pages__pagesTotal__availablePageNumber__fifthNumber").css({"color" : "#818"});
	}else if(fifthNumVal){
		$(".pages__pagesTotal__availablePageNumber__fifthNumber").css({"color" : "#f8f"});
	}else{
		$(".pages__pagesTotal__availablePageNumber__fifthNumber").css({"color" : "#666"});
	}
};

function redirectWithGet(){
	//use get header data to determine what the whole address should be 
	//getHeaderData
	var headerInfo ="?gamesShown=" + getHeaderData.gamesShown + "&orderedBy=" + getHeaderData.orderedBy + "&pAmount=" + getHeaderData.pAmount + "&page=" + getHeaderData.page;
	
	//Prevent header info stacking
	var cleanedHeader = window.location.href;
	cleanedHeader =  cleanedHeader.substr(0, cleanedHeader.indexOf("?"));
	
	window.location.href = cleanedHeader + headerInfo;
}



