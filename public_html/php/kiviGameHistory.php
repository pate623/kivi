<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //kiviFinishedCorrectly as table

$conn = mysqli_connect($servername, $username, $password, $dbname);

$sqlString = "SELECT ID, startTime, endTime, playerCount, p1Name, p2Name, p3Name, p4Name, p1Score, p2Score, p3Score, p4Score, winner, highScore  FROM kiviFinishedCorrectly ";

$results = array();
//chech what setting user sent
//pAmount: "all", gamesShown: 25, orderedBy: "TimeDescending", page: 1

//determine which game types will be searched for
if($_GET['pAmount'] == "2p"){
	$sqlString .= "WHERE playerCount = 2 ";
}elseif($_GET['pAmount'] == "3p"){
	$sqlString .= "WHERE playerCount = 3 ";
}elseif($_GET['pAmount'] == "4p"){
	$sqlString .= "WHERE playerCount = 4 ";
}

//determine which order the data is sent back to the user
//orderedBy: TimeDescending, TimeAscending, highLow, lowHigh
if($_GET['orderedBy'] == "TimeDescending"){
	$sqlString .= "ORDER BY startTime DESC ";
}elseif($_GET['orderedBy'] == "TimeAscending"){
	$sqlString .= "ORDER BY startTime ASC ";
}elseif($_GET['orderedBy'] == "highLow"){
	$sqlString .= "ORDER BY highScore DESC ";
}elseif($_GET['orderedBy'] == "lowHigh"){
	$sqlString .= "ORDER BY highScore ASC ";
}else{
	$sqlString .= "ORDER BY startTime DESC ";
}

//limit the data to be sent in here with   LIMIT and OFFSET
//SELECT * FROM Orders LIMIT 10 OFFSET 15";
$sqlString .= "LIMIT " . $_GET['gamesShown'] . " ";
if($_GET['page'] != 1){ //if ther needs to be an offset
	$offset = ($_GET['page'] - 1) * $_GET['gamesShown'];
	$sqlString .= " OFFSET " . $offset;
}


//do the SQL querry
$numOfShowingGames = 0;
$result = mysqli_query($conn, $sqlString);
if (mysqli_num_rows($result) > 0) {
	while($row = mysqli_fetch_assoc($result)) {
		//save the data in the $results array
		$results["game"][$numOfShowingGames]["ID"] = $row["ID"];
		$results["game"][$numOfShowingGames]["startTime"] = $row["startTime"];
		$results["game"][$numOfShowingGames]["endTime"] = $row["endTime"];
		$results["game"][$numOfShowingGames]["playerCount"] = $row["playerCount"];
		//$results["game"][$numOfShowingGames]["boardUsedPositions"] = $row["boardUsedPositions"];
		//$results["game"][$numOfShowingGames]["firstTurnAll"] = $row["firstTurnAll"];
		$results["game"][$numOfShowingGames]["p1Name"] = $row["p1Name"];
		$results["game"][$numOfShowingGames]["p2Name"] = $row["p2Name"];
		$results["game"][$numOfShowingGames]["p3Name"] = $row["p3Name"];
		$results["game"][$numOfShowingGames]["p4Name"] = $row["p4Name"];
		$results["game"][$numOfShowingGames]["p1Score"] = $row["p1Score"];
		//$results["game"][$numOfShowingGames]["p1ConScore"] = $row["p1ConScore"];
		$results["game"][$numOfShowingGames]["p2Score"] = $row["p2Score"];
		//$results["game"][$numOfShowingGames]["p2ConScore"] = $row["p2ConScore"];
		$results["game"][$numOfShowingGames]["p3Score"] = $row["p3Score"];
		//$results["game"][$numOfShowingGames]["p3ConScore"] = $row["p3ConScore"];
		$results["game"][$numOfShowingGames]["p4Score"] = $row["p4Score"];
		//$results["game"][$numOfShowingGames]["p4ConScore"] = $row["p4ConScore"];
		$results["game"][$numOfShowingGames]["winner"] = $row["winner"];
		$results["game"][$numOfShowingGames]["highScore"] = $row["highScore"];
		
		$numOfShowingGames++;
	}
}

// send back the setting to see if they were the correct ones
$results["yourSettings"]["pAmount"] = $_GET['pAmount'];
$results["yourSettings"]["gamesShown"] = $_GET['gamesShown'];
$results["yourSettings"]["orderedBy"] = $_GET['orderedBy'];
$results["yourSettings"]["page"] = $_GET['page'];

//send the total number od games available (used to set some UI elements)
//take it from an other table called kiviTotalGames
$numOfgames = 0;
$sqlTotalGames = "SELECT * FROM kiviTotalGames";
$sqlTotalGamesTaken = mysqli_query($conn, $sqlTotalGames);
if (mysqli_num_rows($sqlTotalGamesTaken) > 0) {
	while($row = mysqli_fetch_assoc($sqlTotalGamesTaken)) {
		if($_GET['pAmount'] == "2p"){
			$numOfgames	= $row["PlayerAmount2p"];
		}elseif($_GET['pAmount'] == "3p"){
			$numOfgames	= $row["PlayerAmount3p"];
		}elseif($_GET['pAmount'] == "4p"){
			$numOfgames	= $row["PlayerAmount4p"];
		}else{
			$numOfgames	= $row["PlayerAmountAll"];
		}
	}
}

$results["numOfgames"] = $numOfgames;
$results["numOfShowingGames"] = $numOfShowingGames;

echo json_encode($results, JSON_FORCE_OBJECT);
?>
