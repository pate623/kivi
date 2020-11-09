<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

//not sure if this should be inside or outside of the loop
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "dbname"; //kivi and kiviRunningGames table

$conn = mysqli_connect($servername, $username, $password, $dbname);

while(true){
	$kiviRunningGames = array();
	
	$getRunningGames = "SELECT gameID, gameTurn, firstTurnAll FROM kivi";
	$running = mysqli_query($conn, $getRunningGames);
	
	if (mysqli_num_rows($running) > 0) {//if at least one game is running
		
		//get and save the running games as assoc array  id => turn
		while($row = mysqli_fetch_assoc($running)) {
			$kiviRunningGames[$row["gameID"]] = $row["gameTurn"];
			if(strlen($row["firstTurnAll"]) > 5){
				$kiviRunningGames["fta".$row["gameID"]] = substr($row["firstTurnAll"], -6);
			}
		}
		
		$aResultSend = json_encode($kiviRunningGames, JSON_FORCE_OBJECT);
		echo "event: status\n";
		echo "data: {$aResultSend} \n\n";
		ob_flush();
		flush();
		sleep(1);
	}else{ //if no games running
		$noChanges = "ngr";
		$aResultSend = json_encode($noChanges, JSON_FORCE_OBJECT);
		echo "event: changes\n";
		echo "data: {$aResultSend} \n\n";
		ob_flush();
		flush();
		sleep(1);
	}
}
?>
