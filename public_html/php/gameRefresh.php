<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //kiviRunningGames as table

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

//reset timer for a specific player
$checkForMatch = strval("SELECT * FROM kiviRunningGames WHERE gameID=" . $userSettings["ID"] );
$aResult['sentSQLString'] = $checkForMatch;
$lookMatches = mysqli_query($conn, $checkForMatch);

if (mysqli_num_rows($lookMatches) == 1) { //if user is found the game
	$row = mysqli_fetch_array($lookMatches);
	$aResult['gameStilActive'] = true;
	$aResult['errors'] = false;
	
	$refreshTimer = "UPDATE kiviRunningGames SET " ."p" . $userSettings["user"] . "Active" . "=5 WHERE gameID=" . $userSettings["ID"];
	$aResult['refreshSQL'] = $refreshTimer;
	if(mysqli_query($conn, $refreshTimer)){ //update timer
		$aResult['errors'] = false;
	}else{ //failed to update timer
		$aResult['errors'] = true;
	}
}else{
	$aResult['errors'] = true;
	$aResult['gameStilActive'] = false;
}

//send with debugging information
echo json_encode($aResult, JSON_FORCE_OBJECT);

//send without debugging information
$aResult2 = array();
 $aResult2['gameStilActive'] = $aResult['gameStilActive'];
 $aResult2['errors'] = $aResult['errors'];
//echo json_encode($aResult2, JSON_FORCE_OBJECT);
?>