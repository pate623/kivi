<?php
header('Content-Type: application/json');

/*
 The turnAlls (1-10) will cointain following inforamtion
 the dice inforamtion are in 6 packs. it will only contain outcomes 
 one players dices will take 18 characters.
 
 After the 18 dice throws will be the marble palcement
  it will take two character places regardless of placment (00 for no palce, 01-49 for palced ones )
  
 Total characters for one player run is 20
  player runs are oin total 4*10= 40
   Total character to be used: 40*20 = 800.
   
 Turn counter will only increase by 1
  player run increases the counter in total by 4
  if there is fewer than 4 players then the counter will be automatically increased.
  at the end of each round the counter is increased by 4*4 = 16
  
  To fiqure out which player turn it is and what to do the moduls need to be counterd
  if 16% gives out 1 it mens that the tun is ony just starting.
  turn 17 means player 1 first turn because 17/16 has a modulus of 1
    modulus of 1 is p1 first throw
	modulus of 2 is p1 second throw
    ...
	modulus of 0 is p4 placing the marble
*/


$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //kivi as table

$conn = mysqli_connect($servername, $username, $password, $dbname);

$jsonRecived = file_get_contents('php://input');
$dirtyText = json_decode($jsonRecived, true);

$userSettings = array();	
$aResult = array();
$sqlupdate = "";
$curentGame = array();

foreach( $dirtyText as $key => $value ) {
	$userSettings[$key] = filter_var( $value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
}


//update players game status in here rather tahn spamming the server unnecesary
$checkForMatch = strval("SELECT * FROM kiviRunningGames WHERE gameID=" . $userSettings["ID"] );
$lookMatches = mysqli_query($conn, $checkForMatch);
if (mysqli_num_rows($lookMatches) == 1) { //if user is found the game
	$row = mysqli_fetch_array($lookMatches);
	
	$refreshTimer = "UPDATE kiviRunningGames SET " ."p" . $userSettings["user"] . "Active" . "=5 WHERE gameID=" . $userSettings["ID"];
	if(mysqli_query($conn, $refreshTimer)){ //update timer
	}
}


//verify the player against their given player number, password and game id
$verifying = "SELECT * FROM kivi WHERE gameID=" . $userSettings["ID"] . " AND p". $userSettings["user"] ."Password='" . $userSettings["password"] . "'";
$verified = mysqli_query($conn, $verifying);



if(mysqli_num_rows($verified) > 0){
	$aResult['errors'] = false;
	$aResult['gameFound'] = true;
	// save data for later usage
	while($row = mysqli_fetch_assoc($verified)) {
		$curentGame["gameTurn"] = $row["gameTurn"];
		$curentGame["playerCount"] = $row["playerCount"];
		$curentGame["boardState"] = $row["boardState"];
		$curentGame["boardUsedPositions"] = $row["boardUsedPositions"];
		$curentGame["firstTurnAll"] = $row["firstTurnAll"];
		$aResult['gameTurn'] = $row["gameTurn"]; //testing
		$aResult["fta"] = $row["firstTurnAll"]; //testing
	}
	
	$aResult["dice1Reroll"] = substr($aResult["fta"], -6, 1);
	$aResult["dice2Reroll"] = substr($aResult["fta"], -5, 1);
	$aResult["dice3Reroll"] = substr($aResult["fta"], -4, 1);
	$aResult["dice4Reroll"] = substr($aResult["fta"], -3, 1);
	$aResult["dice5Reroll"] = substr($aResult["fta"], -2, 1);
	$aResult["dice6Reroll"] = substr($aResult["fta"], -1, 1);
	
	//chech the game turn to define which actions need to be taken 
	//use modulus (%) to  figure out the turn.
	//use a moduls of 16.
	if($curentGame["gameTurn"] == 1){ //if it's the first turn action
		$dicesThrown = diceThrow(); //returns an array
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		//create the sql insertion string.
		//chech to see whics turnAll is needed.
		//take the one that is needed and add to it the last (this case 6) characters.
		$updateTurn = $curentGame["firstTurnAll"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll= '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn=17 WHERE gameID=" . $userSettings["ID"] . ";"; 
	
	}elseif($curentGame["gameTurn"] == 657){//if it's the last turn
		
	}elseif($curentGame["gameTurn"] % 16 == 0){//if it's time to throw the dice p1 //same as turn 1 or turn 8 in 2p games, or turn 12 in 3p games, only used in 4p player games
		$dicesThrown = diceThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		$updateTurn = $curentGame["firstTurnAll"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll= '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn=  gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		
	}elseif($curentGame["gameTurn"] % 16 == 1){//if it's time to re throw the dice p1
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		
	}elseif($curentGame["gameTurn"] % 16 == 2){//if it's time for last re throw p1
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		
	}elseif($curentGame["gameTurn"] % 16 == 3){//if it's time put a marble p1
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"]; 
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		$updateUsedPositions = $curentGame["boardUsedPositions"] . $userSettings["data"];
		$sqlupdate .= "UPDATE kivi SET boardUsedPositions = '" . $updateUsedPositions . "' WHERE gameID=" . $userSettings["ID"] . ";";
		
		
	}elseif($curentGame["gameTurn"] % 16 == 4){//if it's time to throw the dice p2
		$dicesThrown = diceThrow(); 
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll= '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		
	}elseif($curentGame["gameTurn"] % 16 == 5){//if it's time to re throw the dice p2
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
			
	}elseif($curentGame["gameTurn"] % 16 == 6){//if it's time for last re throw p2
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		
	}elseif($curentGame["gameTurn"] % 16 == 7){//if it's time put a marble p2
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 	
		$updateUsedPositions = $curentGame["boardUsedPositions"] . $userSettings["data"]; 
		$sqlupdate .= "UPDATE kivi SET boardUsedPositions = '" . $updateUsedPositions . "' WHERE gameID=" . $userSettings["ID"] . ";";
		
	}elseif($curentGame["gameTurn"] % 16 == 8){//if it's time to throw the dice p3 or in 2player games its p1 turn to throw
		if($curentGame["playerCount"] == 2){
			$dicesThrown = diceThrow();
			$aResult["dice1"]= $dicesThrown[0];
			$aResult["dice2"]= $dicesThrown[1];
			$aResult["dice3"]= $dicesThrown[2];
			$aResult["dice4"]= $dicesThrown[3];
			$aResult["dice5"]= $dicesThrown[4];
			$aResult["dice6"]= $dicesThrown[5];
			$updateTurn = $curentGame["firstTurnAll"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
			$sqlupdate .= "UPDATE kivi SET firstTurnAll= '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
			$sqlupdate .= "UPDATE kivi SET gameTurn=  gameTurn + 9 WHERE gameID=" . $userSettings["ID"] . ";"; 
		}else{
			$dicesThrown = diceThrow();
			$aResult["dice1"]= $dicesThrown[0];
			$aResult["dice2"]= $dicesThrown[1];
			$aResult["dice3"]= $dicesThrown[2];
			$aResult["dice4"]= $dicesThrown[3];
			$aResult["dice5"]= $dicesThrown[4];
			$aResult["dice6"]= $dicesThrown[5];
			$updateTurn = $curentGame["firstTurnAll"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
			$sqlupdate .= "UPDATE kivi SET firstTurnAll= '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
			$sqlupdate .= "UPDATE kivi SET gameTurn=  gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";";
		}
		
	}elseif($curentGame["gameTurn"] % 16 == 9){//if it's time to re throw the dice p3
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
			
	}elseif($curentGame["gameTurn"] % 16 == 10){//if it's time for last re throw p3
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		
	}elseif($curentGame["gameTurn"] % 16 == 11){//if it's time put a marble p3
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 	
		$updateUsedPositions = $curentGame["boardUsedPositions"] . $userSettings["data"]; 
		$sqlupdate .= "UPDATE kivi SET boardUsedPositions = '" . $updateUsedPositions . "' WHERE gameID=" . $userSettings["ID"] . ";";
		
	}elseif($curentGame["gameTurn"] % 16 == 12){//if it's time to throw the dice p4 or p1 of it's 3p game
		if($curentGame["playerCount"] == 3){
			$dicesThrown = diceThrow();
			$aResult["dice1"]= $dicesThrown[0];
			$aResult["dice2"]= $dicesThrown[1];
			$aResult["dice3"]= $dicesThrown[2];
			$aResult["dice4"]= $dicesThrown[3];
			$aResult["dice5"]= $dicesThrown[4];
			$aResult["dice6"]= $dicesThrown[5];
			$updateTurn = $curentGame["firstTurnAll"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
			$sqlupdate .= "UPDATE kivi SET firstTurnAll= '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
			$sqlupdate .= "UPDATE kivi SET gameTurn=  gameTurn + 5 WHERE gameID=" . $userSettings["ID"] . ";"; 
		}else{
			$dicesThrown = diceThrow();
			$aResult["dice1"]= $dicesThrown[0];
			$aResult["dice2"]= $dicesThrown[1];
			$aResult["dice3"]= $dicesThrown[2];
			$aResult["dice4"]= $dicesThrown[3];
			$aResult["dice5"]= $dicesThrown[4];
			$aResult["dice6"]= $dicesThrown[5];
			$updateTurn = $curentGame["firstTurnAll"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
			$sqlupdate .= "UPDATE kivi SET firstTurnAll= '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
			$sqlupdate .= "UPDATE kivi SET gameTurn=  gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";";
		}
		
	}elseif($curentGame["gameTurn"] % 16 == 13){//if it's time to re throw the dice p4
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
			
	}elseif($curentGame["gameTurn"] % 16 == 14){//if it's time for last re throw p4
		$dicesThrown = diceReThrow();
		$aResult["dice1"]= $dicesThrown[0];
		$aResult["dice2"]= $dicesThrown[1];
		$aResult["dice3"]= $dicesThrown[2];
		$aResult["dice4"]= $dicesThrown[3];
		$aResult["dice5"]= $dicesThrown[4];
		$aResult["dice6"]= $dicesThrown[5];
		
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"] . $aResult["dice1"] . $aResult["dice2"] . $aResult["dice3"] . $aResult["dice4"] . $aResult["dice5"] . $aResult["dice6"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 
		
	}elseif($curentGame["gameTurn"] % 16 == 15){//if it's time put a marble p4
		$updateTurn = $curentGame["firstTurnAll"] . $userSettings["data"];
		$sqlupdate .= "UPDATE kivi SET firstTurnAll = '" . $updateTurn . "' WHERE gameID=" . $userSettings["ID"] . ";";
		$sqlupdate .= "UPDATE kivi SET gameTurn = gameTurn + 1 WHERE gameID=" . $userSettings["ID"] . ";"; 	
		$updateUsedPositions = $curentGame["boardUsedPositions"] . $userSettings["data"]; 
		$sqlupdate .= "UPDATE kivi SET boardUsedPositions = '" . $updateUsedPositions . "' WHERE gameID=" . $userSettings["ID"] . ";";
		
	}else{//error, script is not working
		
	}
}else{//if the game is not found
	$aResult['errors'] = true;
	$aResult['gameFound'] = false;
}



//all game actions in functions.
//roll takes no parameter,  the outcome is 6 numbers with values between 1-6.
// returns 6 random numbers between 1-6
function diceThrow() {
  $dices = array(rand(1,6), rand(1,6), rand(1,6), rand(1,6), rand(1,6), rand(1,6));
  $aResult['dicesInfunc'] = $dices;
  return $dices;
}


//reroll  takes two parameter, the dices and which ones will be re thrown
// returns 6 random numbers between 1-6
// All rerolled numbrs will be changed
//returns all 6 dices, do not check the valid numbers after this function
function diceReThrow() {
	$dices = array("3", "3", "3", "3", "3", "3");
	
	$firstDice = $GLOBALS["aResult"]["dice1Reroll"];
	$secondDice = $GLOBALS["aResult"]["dice2Reroll"];
	$thirdDice = $GLOBALS["aResult"]["dice3Reroll"];
	$fourthDice = $GLOBALS["aResult"]["dice4Reroll"];
	$fifthDice = $GLOBALS["aResult"]["dice5Reroll"];
	$sixtDice = $GLOBALS["aResult"]["dice6Reroll"];
	
	
	$dices[0] = strval($firstDice);
	$dices[1] = strval($secondDice);
	$dices[2] = strval($thirdDice);
	$dices[3] = strval($fourthDice);
	$dices[4] = strval($fifthDice);
	$dices[5] = strval($sixtDice);
	

	$n1 = 0;
	$n2 = 0;
	$n3 = 0;
	$n4 = 0;
	$n5 = 0;
	$n6 = 0;
	
	if(substr( $GLOBALS["userSettings"]["data"],0,1) == "1"){
		do{
			$n1 = rand(1,6);
		} 
		while($n1 == $firstDice);
		$dices[0] = $n1;
	}else{
		 $dices[0] = $firstDice;
	}
	
	if(substr($GLOBALS["userSettings"]["data"],1,1) == "1"){
		do{
			$n2 = rand(1,6);
		} 
		while($n2 == $secondDice);
		$dices[1] = $n2;
	}else{
		$dices[1] = $secondDice;
	}
	
	if(substr($GLOBALS["userSettings"]["data"],2,1) == "1"){
		do{
			$n3 = rand(1,6);
		} 
		while($n3 == $thirdDice);
		$dices[2] = $n3;
	}else{
		$dices[2] = $thirdDice;
	}
	
	if(substr($GLOBALS["userSettings"]["data"],3,1) == "1"){
		do{
			$n4 = rand(1,6);
		} 
		while($n4 == $fourthDice);
		$dices[3] = $n4;
	}else{
		$dices[3] = $fourthDice;
	}
	
	if(substr($GLOBALS["userSettings"]["data"],4,1) == "1"){
		do{
			$n5 = rand(1,6);
		} 
		while($n5 == $fifthDice);
		$dices[4] = $n5;
	}else{
		$dices[4] = $fifthDice;
	}
	
	if(substr($GLOBALS["userSettings"]["data"],5,1) == "1"){
		do{
			$n6 = rand(1,6);
		} 
		while($n6 == $sixtDice);
		$dices[5] = $n6;
	}else{
		$dices[5] = $sixtDice;
	}

	return $dices;
}

//<< doing borad check takes too much resources delaying the game too much. Trusting the client is good enough >>
//check all 49 board slots to see if any is a match
//gets 6 dice numbers as a parameters
//returns 49 true/false statements for each board slot

//uses boardState and boardUsedPositions to see all available slots
/*
 first one is to check if the boardUsedPositions holds flase (not used) value for the current board slot.
  If it does then check to see if dice number allows the usage. 
   If they do return true
   All other cases return false
 After all 49 cases return the values to user
*/



//update the databese with the stats
/*
 gets all the sql changes that will be made
  removes the last character (;) from that string
   updates the SQL database
*/
if($aResult['errors'] == false){
	$aResult['sqhInsert'] = $sqlupdate;
	$sqlupdate = substr($sqlupdate, 0, -1);
	$updatingSQL = mysqli_multi_query($conn, $sqlupdate);
	if($updatingSQL){
		
	}
}

//send info to the user, this info gives them a succes/fileure statment given the user a chance to re upload their data if something went wrong
$aResult2 = array();
 $aResult2["errors"] = $aResult["errors"];
echo json_encode($aResult2, JSON_FORCE_OBJECT);
//echo json_encode($aResult, JSON_FORCE_OBJECT);

?>
