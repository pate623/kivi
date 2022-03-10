<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //kivi as table

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

$allNames = array();

//verify the player against their given player number, password and game id
$verifying = strval("SELECT * FROM kivi WHERE gameID=" . $userSettings["ID"] . " AND p" . $userSettings["playerNumber"] . "Password='" . $userSettings["password"] . "'");
$aResult['sentSQLString'] = $verifying;
$verified = mysqli_query($conn, $verifying);

if($verified){
	$aResult["verification"] = "success";
	
	$getAllNames = "SELECT p1Name, p2Name, p3Name, p4Name FROM kivi";
	$getTheNames = mysqli_query($conn, $getAllNames);
	while($row = mysqli_fetch_assoc($getTheNames)) {
		//save all user names
		$aResult["p1Name"] = $row["p1Name"];
		$aResult["p2Name"] = $row["p2Name"];
		$aResult["p3Name"] = $row["p3Name"];
		$aResult["p4Name"] = $row["p4Name"];
	}
	$aResult["errors"] = false;
	
}else{ //if verifying fails send error message
	$aResult["errors"] = true;
	$aResult["verification"] = "failed";
}


echo json_encode($aResult, JSON_FORCE_OBJECT);

$aResult2 = array();
 $aResult2["errors"] = $aResult["errors"];
 $aResult2["verification"] = $aResult["verification"];
 $aResult2["p1Name"] = $aResult["p1Name"];
 $aResult2["p2Name"] = $aResult["p2Name"];
 $aResult2["p3Name"] = $aResult["p3Name"];
 $aResult2["p4Name"] = $aResult["p4Name"];
//echo json_encode($aResult2, JSON_FORCE_OBJECT);

/*
 rest of the game plays out in other php scipts.
*/
?>
