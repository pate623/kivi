<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "dbname"; //kiviQueue as table

$conn = mysqli_connect($servername, $username, $password, $dbname);

$aResult = array();

//Raw input read, can't use POST read with json as of php 7
//this file is written with Procedural coding
$jsonRecived = file_get_contents('php://input');
$dirtyText = json_decode($jsonRecived, true);

$userSettings = array();
foreach( $dirtyText as $key => $value ) {
	$userSettings[$key] = filter_var( $value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
}

//check the users game
$checkForMatch = strval("SELECT * FROM kiviQueue WHERE ID=" . $userSettings["ID"] . " AND password='" . $userSettings["password"] . "'");
$aResult['sentSQLString'] = $checkForMatch;
$lookMatches = mysqli_query($conn, $checkForMatch);

if (mysqli_num_rows($lookMatches) == 1) { //if user is found in queue
	$row = mysqli_fetch_array($lookMatches);
	$aResult["gameID"] = $row['transferredGameID'];
	$aResult["playerNumber"] = $row['playerNumber'];
	$aResult['playerFound'] = true;
	$aResult['errors'] = false;
	if($aResult["gameID"]){ //if there is a game for the player
		$aResult['gameFound'] = true;
	}else{ //if there is no game for the player
		$aResult['gameFound'] = false;
		$refreshTimer = "UPDATE kiviQueue SET activeTimer=4 WHERE ID=" . $userSettings["ID"];
		$aResult['refreshSQL'] = $refreshTimer;
		if(mysqli_query($conn, $refreshTimer)){ //update timer
			$aResult['errors'] = false;
		}else{ //failed to update timer
			$aResult['errors'] = true;
		}
	}
}else{
	$aResult['errors'] = true;
	$aResult['playerFound'] = false;
}

//send with debugging information
//echo json_encode($aResult, JSON_FORCE_OBJECT);

//send without debugging information
$aResult2 = array();
 $aResult2['gameID'] = $aResult['gameID'];
 $aResult2['playerNumber'] = $aResult['playerNumber'];
 $aResult2['errors'] = $aResult['errors'];
 $aResult2['gameFound'] = $aResult['gameFound'];
echo json_encode($aResult2, JSON_FORCE_OBJECT);
?>