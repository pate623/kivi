<?php header("Content-Type: text/html"); ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="style/kiviPastGame.css"/>
	<script src="https://code.jquery.com/jquery-3.4.1.js"></script>
	<script src="script/kiviPastGame.js"></script>
	<script>
		var gameInfoFromServer = '<?php
			//header("Content-Type: application/json");
			$servername = "localhost";
			$username = "username";
			$password = "password";
			$dbname = "dbname"; //kiviFinishedCorrectly as table
			
			$conn = mysqli_connect($servername, $username, $password, $dbname);
			
			$sqlString = "SELECT * FROM kiviFinishedCorrectly WHERE ID=" . $_GET['ID'];
			
			$result = mysqli_query($conn, $sqlString);
			if (mysqli_num_rows($result) > 0) {
				while($row = mysqli_fetch_assoc($result)) {
					$severGameInfo = array("ID" => $row["ID"], "startTime" => $row["startTime"], "playerCount" => $row["playerCount"], "boardUsedPositions" => $row["boardUsedPositions"], "firstTurnAll" => $row["firstTurnAll"], "p1Name" => $row["p1Name"], "p2Name" => $row["p2Name"], "p3Name" => $row["p3Name"], "p4Name" => $row["p4Name"], "p1Score" => $row["p1Score"], "p1ConScore" => $row["p1ConScore"], "p2Score" => $row["p2Score"], "p2ConScore" => $row["p2ConScore"], "p3Score" => $row["p3Score"], "p3ConScore" => $row["p3ConScore"], "p4Score" => $row["p4Score"] , "p4ConScore" => $row["p4ConScore"] , "winner" => $row["winner"], "highScore" => $row["highScore"]);
					$severGameInfo["gameFound"] = true;
					$thisGamesID = $row["ID"];
				}
			}else{
				$severGameInfo["gameFound"] = false;
			}
			
			echo json_encode($severGameInfo, JSON_FORCE_OBJECT);
		?>';
	</script>
	<link rel="shortcut icon" href="pictures/favicon/kivi.png" />
	<title>Game history</title>
</head>
<body>	
<div id="cookieConsent">
	<div id="cookieConsent__hideButton">OK</div>
	<div id="cookieConsent__text">This website uses<br> cookies to work</div>
</div>

<div id="board">
	<div id="playersNames">
		<div id="playersName__player1" class="playersName__tags">
			<span id="playersName__player1__name">p1</span>
		</div>
		<div id="playersName__player2" class="playersName__tags">
			<span id="playersName__player2__name">p2</span>
		</div>
		<div id="playersName__player3" class="playersName__tags">
			<span id="playersName__player3__name">p3</span>
		</div>
		<div id="playersName__player4" class="playersName__tags">
			<span id="playersName__player4__name">p4</span>
		</div>
	</div>
	<div id="a1-slot" class="slot"></div>
	<div id="a2-slot" class="slot"></div>
	<div id="a3-slot" class="slot"></div>
	<div id="a4-slot" class="slot"></div>
	<div id="a5-slot" class="slot"></div>
	<div id="a6-slot" class="slot"></div>
	<div id="a7-slot" class="slot"></div>
	
	<div id="b1-slot" class="slot"></div>
	<div id="b2-slot" class="slot"></div>
	<div id="b3-slot" class="slot"></div>
	<div id="b4-slot" class="slot"></div>
	<div id="b5-slot" class="slot"></div>
	<div id="b6-slot" class="slot"></div>
	<div id="b7-slot" class="slot"></div>
	
	<div id="c1-slot" class="slot"></div>
	<div id="c2-slot" class="slot"></div>
	<div id="c3-slot" class="slot"></div>
	<div id="c4-slot" class="slot"></div>
	<div id="c5-slot" class="slot"></div>
	<div id="c6-slot" class="slot"></div>
	<div id="c7-slot" class="slot"></div>
	
	<div id="d1-slot" class="slot"></div>
	<div id="d2-slot" class="slot"></div>
	<div id="d3-slot" class="slot"></div>
	<div id="d4-slot" class="slot"></div>
	<div id="d5-slot" class="slot"></div>
	<div id="d6-slot" class="slot"></div>
	<div id="d7-slot" class="slot"></div>
	
	<div id="e1-slot" class="slot"></div>
	<div id="e2-slot" class="slot"></div>
	<div id="e3-slot" class="slot"></div>
	<div id="e4-slot" class="slot"></div>
	<div id="e5-slot" class="slot"></div>
	<div id="e6-slot" class="slot"></div>
	<div id="e7-slot" class="slot"></div>
	
	<div id="f1-slot" class="slot"></div>
	<div id="f2-slot" class="slot"></div>
	<div id="f3-slot" class="slot"></div>
	<div id="f4-slot" class="slot"></div>
	<div id="f5-slot" class="slot"></div>
	<div id="f6-slot" class="slot"></div>
	<div id="f7-slot" class="slot"></div>
	
	<div id="g1-slot" class="slot"></div>
	<div id="g2-slot" class="slot"></div>
	<div id="g3-slot" class="slot"></div>
	<div id="g4-slot" class="slot"></div>
	<div id="g5-slot" class="slot"></div>
	<div id="g6-slot" class="slot"></div>
	<div id="g7-slot" class="slot"></div>
</div>

<div id="postGameInfo" >
	<table>
		<tr>
			<th id="boldTable">Name</th>
			<th id="boldTable">Score</th>
			<th id="boldTable">Connection Score</th>
		</tr>
		<tr>
			<th style="background-image: url(http://rmbrawl.net/pictures/kivi/medal/medal.png)"><span class="p1Color"> pate ff</span></th>
			<th><span class="p1Color">2</span></th>
			<th><span class="p1Color">1</span></th>
		</tr>
		<tr>
			<th><span class="p2Color"> pate crom</span></th>
			<th><span class="p2Color">2</span></th>
			<th><span class="p2Color">1</span></th>
		</tr>
		<tr>
			<th><span class="p3Color"> pate 623</span></th>
			<th><span class="p3Color"> 2</span></th>
			<th><span class="p3Color"> 1</span></th>
		</tr>
		<tr>
			<th><span class="p4Color"> pate edg</span></th>
			<th><span class="p4Color"> 2</span></th>
			<th><span class="p4Color"> 1</span></th>
		</tr>
	</table>
</div>

</body>
</html>



