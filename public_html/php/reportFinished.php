<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //kiviRunningGames as table

$conn = mysqli_connect($servername, $username, $password, $dbname);

$aResult = array();  //results sent back to the user

$jsonRecived = file_get_contents('php://input');
$dirtyText = json_decode($jsonRecived, true);

$userSettings = array();
foreach( $dirtyText as $key => $value ) {
	$userSettings[$key] = filter_var( $value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
}

//decrease the requirement for game stop by 1
$refreshTimer = "UPDATE kiviRunningGames SET finished= finished +1 WHERE gameID=" . $userSettings["ID"];
if(mysqli_query($conn, $refreshTimer)){ //inc finished by 1
	$aResult['errors'] = false;
}else{ //failed to update timer
	$aResult['errors'] = true;
}

echo json_encode($aResult, JSON_FORCE_OBJECT);
?>