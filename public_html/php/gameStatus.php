<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //civPick as table

$conn = mysqli_connect($servername, $username, $password, $dbname);


$jsonRecived = file_get_contents('php://input');
$dirtyText = json_decode($jsonRecived, true);

$userSettings = array();
foreach( $dirtyText as $key => $value ) {
	$userSettings[$key] = filter_var( $value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
}

$aResult = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	
	$getGame = 'SELECT * FROM kivi WHERE gameID =' . $userSettings["ID"];
	$yourGame = mysqli_query($conn, $getGame);
	while($row = mysqli_fetch_assoc($yourGame)) {
		//incoming info includes: gameTurn [gt], firstTurnAll [fta], boardUsedPositions [bup], boardState [bs]
		$aResult["gt"] = $row["gameTurn"];
		$aResult["fta"] = $row["firstTurnAll"];
		$aResult["bup"] = $row["boardUsedPositions"];
		$aResult["bs"] = $row["boardState"];
	}
	/*
	$charsToSend;
	if($aResult["fta"] % 16 == 1){ //if it has been thrown, keep 6
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 2){ //if it's rethrow, keep the last 6
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 3){ //if it's last throw, keep the last 6
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 4){ //if it's time to place the marble, keep the last 2
		$charsToSend = -2;
	}elseif($aResult["fta"] % 16 == 5){ 
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 6){ 
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 7){
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 8){
		$charsToSend = -2;
	}elseif($aResult["fta"] % 16 == 9){
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 10){
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 11){
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 12){
		$charsToSend = -2;
	}elseif($aResult["fta"] % 16 == 13){
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 14){
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 15){
		$charsToSend = -6;
	}elseif($aResult["fta"] % 16 == 0){
		$charsToSend = -2;
	}
	*/
	
	//reduce the string size to last new characters	
	$aResult["fta"] = substr($aResult["fta"], -6);
}
echo json_encode($aResult);
?>
