<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //kiviQueue as table

$conn = mysqli_connect($servername, $username, $password, $dbname);

$aResult = array();  //results sent back to the user
$sqlInsert; //updating th sql tables all at once

//Raw input read, can't use POST read with json as of php 7
//this file is written with Procedural coding
$jsonRecived = file_get_contents('php://input');
$dirtyText = json_decode($jsonRecived, true);

$userSettings = array();
foreach( $dirtyText as $key => $value ) {
	$userSettings[$key] = filter_var( $value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
}
$aResult['filteredUserName'] = $userSettings["userName"];
$aResult['filteredPassword'] = $userSettings["password"];
$aResult['filteredQueueue'] = $userSettings["queue"];

/*
  First check if there is a match for the player.
   an other 1-3 players already waiting (based on queue)
	If so crete a game for all the players into the "kivi" table 
	Add the player with the "transferredGameID" and "playerNumber" into the "kiviQueue" 
	Update the other 1-3 users "transferredGameID" and "playerNumber" status
  
  if there is no match then just add the player into the queue
*/

//test to see if the connection works
if (!$conn) {
	$aResult['connection'] = "No connection";
	$aResult ['errors'] = true;
	$aResult ['enoughUsers'] = "failed";
	$aResult ['gameTypeCreated'] = "failed";
	$aResult ['gameCreated'] = "failed";
	$aResult ['usersUpdated '] = "failed";
}else{
	$aResult['connection'] = "Connected to database";
	$aResult ['errors'] = false;
	//checks on to see if  users can be paired with someone else.
	$checkForMatch = strval("SELECT * FROM kiviQueue WHERE playerCount=" . $userSettings["queue"] . " AND active=1");
	$matchFound = "";
	$matchableUsersID = array("a", "b", "c", "d"); //has index:value pairs.
	$matchableUsersName = array("a", "b", "c", "d"); 
	$matchableUsersPassword = array("a", "b", "c", "d"); 
	$matchableUsersPlayerNumber = array("a", "b", "c", "d"); 

	$lookMatches = mysqli_query($conn, $checkForMatch);	
	if (mysqli_num_rows($lookMatches) >= $userSettings["queue"]-1) {  // if there is enough users in the queue
		$aResult['enoughUsers'] = "yes";
		
		//put the user in to the database
		$resultString = "INSERT INTO kiviQueue (active, activeTimer, userName, password, playerCount) VALUES (1, 4, '" . $userSettings['userName'] . "' , '" . $userSettings['password'] . "' ," . $userSettings['queue'] . ")";
		if (mysqli_query($conn, $resultString)) {
			$aResult['usersUpdated'] = "added before creating game";
			$aResult['queueID'] = mysqli_insert_id($conn);
		}
		
		//get the ID of users which will be transferred into the new game
		$addid = mysqli_query($conn, $checkForMatch);
		for($i = 0; $i <= $userSettings["queue"]; $i++){
			$row = mysqli_fetch_array($addid);
			$matchableUsersID[$i] = $row['ID'];
			$matchableUsersName[$i] = $row['userName'];
			$matchableUsersPassword[$i] = $row['password'];
			$matchableUsersPlayerNumber[$i] = $i + 1;
		}
		
		//if users can be paired then do a new game for the users. And do a kiviRunnigGames string also.
		if($userSettings["queue"] == 4){
			$createGame ="INSERT INTO kivi (gameTurn, gameState, playerCount, p1Name, p1Password, p2Name, p2Password, p3Name, p3Password, p4Name, p4Password) VALUES (1, 1, 4, '" . $matchableUsersName[0] ."' ,'" . $matchableUsersPassword[0] . "' ,'"  . $matchableUsersName[1] ."' ,'" . $matchableUsersPassword[1] . "' ,'" . $matchableUsersName[2] ."' ,'" . $matchableUsersPassword[2] . "' ,'" . $matchableUsersName[3] ."' ,'" . $matchableUsersPassword[3] . "')";
			$aResult['gameTypeCreated'] = "4players";
		}else if($userSettings["queue"] == 3){
			$createGame ="INSERT INTO kivi (gameTurn, gameState, playerCount, p1Name, p1Password, p2Name, p2Password, p3Name, p3Password) VALUES (1, 1, 3, '" . $matchableUsersName[0] ."' ,'" . $matchableUsersPassword[0] . "' ,'"  . $matchableUsersName[1] ."' ,'" . $matchableUsersPassword[1] . "' ,'" . $matchableUsersName[2] ."' ,'" . $matchableUsersPassword[2] . "')";
			$aResult['gameTypeCreated'] = "3players";
		}else if($userSettings["queue"] == 2){
			$createGame ="INSERT INTO kivi (gameTurn, gameState, playerCount, p1Name, p1Password, p2Name, p2Password) VALUES (1, 1, 2, '" . $matchableUsersName[0] ."' ,'" . $matchableUsersPassword[0] . "' ,'"  . $matchableUsersName[1] ."' ,'" . $matchableUsersPassword[1] . "')";
			$aResult['gameTypeCreated'] = "2players";
		}
		//send user info for bug check
		$aResult['user1Name'] = $matchableUsersName[0];
		$aResult['user1Password'] = $matchableUsersPassword[0];
		$aResult['user1PlayerNumber'] = $matchableUsersPlayerNumber[0];
		$aResult['user2Name'] = $matchableUsersName[1];
		$aResult['user2Password'] = $matchableUsersPassword[1];
		
		$createdGame = strval($createGame);
		$aResult['createdGame'] = $createdGame; //check to see if the SQL insertion statement is correct
		
		if(mysqli_query($conn, $createdGame)){
			$aResult['gameCreated'] = "New game created";
			$newRoomID = mysqli_insert_id($conn); //get the ID of newly created game
			
			//set runningGames information
			$statusCheck ="INSERT INTO kiviRunningGames (gameID, gameTurn, p1Active, p2Active, p3Active, p4Active, playerCount, finished)  VALUES (". $newRoomID . ", 1, 5, 5, 5, 5, " . $userSettings["queue"] . ", 0)";
			if(mysqli_multi_query($conn, $statusCheck)){
				$aResult['statusUpdated'] = "user update succesfull";
			}else{
				$aResult['statusUpdated'] = "user update failed";
			}
			
			//updates the new game info to all users
			$matchFound;
			for($x = 1; $x <= $userSettings["queue"]; $x++){
				 $matchFound .= "UPDATE kiviQueue SET active = 0, transferredGameID = " . $newRoomID . ", playerNumber = " . $x . " WHERE ID = " . $matchableUsersID[$x-1] ."; ";
			}
			$aResult['usersUpdatedQeurry'] = $matchFound;
			
			if(mysqli_multi_query($conn, $matchFound)){
				$aResult['usersUpdated'] = "user update succesfull";
			}else{
				$aResult['usersUpdated'] = "user update failed";
			}
			
		}else{
			$aResult['gameCreated'] = "failed to create new game";	
		}
		//get the stirng from game creation and update the kiviRunningGames table with the new game info.
		
		
	}else{ //if no game was found
		$aResult['enoughUsers'] = "no";
		$aResult['gameTypeCreated'] = "no";
		$aResult['gameCreated'] = "no";
		$aResult['usersUpdated '] = "no";
		
		$resultString = "INSERT INTO kiviQueue (active, activeTimer, userName, password, playerCount) VALUES (1, 4, '" . $userSettings['userName'] . "' , '" . $userSettings['password'] . "' ," . $userSettings['queue'] . ")";
		if (mysqli_query($conn, $resultString)) { //puts user in the queue
			$aResult['connection'] = "Data inserted into the table";
			$aResult['errors'] = false;
			// get the users queue ID (used bu user to poll the server for a queue status)
			$aResult['queueID'] = mysqli_insert_id($conn);
		}else{
			$aResult['sqlInsertion'] = "Connected to SQL server, but no data inserted";
			$aResult['connection'] = "No access to queue";
			$aResult['errors'] = true;
		}
	}
}

//send with debugging information
echo json_encode($aResult, JSON_FORCE_OBJECT);

//send without debugging information
$aResult2 = array();
 $aResult2['errors'] = $aResult['errors'];
 $aResult2['queueID'] = $aResult['queueID'];
//echo json_encode($aResult2, JSON_FORCE_OBJECT);


/*
 Create cron/php script that will decrease the active timer of "kiviQueue" users and removes the users below 1 activity score.
  This script runs once a second.
*/
?>
