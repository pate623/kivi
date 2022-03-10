<?php
/*
 This file is for cron
 it's job is to clean inactive users from the "kivi" queue
 The cron is schedueld to run this scipt once a minute.
 
 This file will loop twice per minute.
*/
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "draftPickResults"; //kiviRunningGames

$conn = mysqli_connect($servername, $username, $password, $dbname);

$all3scoreSlots = array("b2", "b4", "b6", "c5", "d4", "e3", "f2", "f4", "f6");
$all2scoreSlots = array("a2", "a3", "a5", "a6", "b1", "b7", "c2", "c3", "c4", "c6", "d1", "d3", "d5", "d7", "e2", "e4", "e5", "e6", "f1", "f7", "g2", "g3", "g5", "g6");
$all1scoreSlots = array("a1", "a4", "a7", "b3", "b5", "c1", "c7", "d2", "d6", "e1", "e7", "f3", "f5", "g1", "g4", "g7"); 
	
//for($iAll = 0; $iAll < 5; $iAll++){ //runs once in two minutes

	$sqlRemoveRg  = "DELETE FROM kiviRunningGames WHERE p1Active <= 0;";
	$sqlRemoveRg .= "DELETE FROM kiviRunningGames WHERE p2Active <= 0;";
	$sqlRemoveRg .= "DELETE FROM kiviRunningGames WHERE p3Active <= 0;";
	$sqlRemoveRg .= "DELETE FROM kiviRunningGames WHERE p4Active <= 0;";
	
	$sqlQuery  = "UPDATE kiviRunningGames SET p1Active = p1Active - 1;";
	$sqlQuery .= "UPDATE kiviRunningGames SET p2Active = p2Active - 1;";
	$sqlQuery .= "UPDATE kiviRunningGames SET p3Active = p3Active - 1;";
	$sqlQuery .= "UPDATE kiviRunningGames SET p4Active = p4Active - 1;";
	
	$sqlQuery .= "UPDATE kiviRunningGames SET p4Active = 5 WHERE playerCount=3;";
	
	$sqlQuery .= "UPDATE kiviRunningGames SET p3Active = 5 WHERE playerCount=2;";
	$sqlQuery .= "UPDATE kiviRunningGames SET p4Active = 5 WHERE playerCount=2;";
	
	$sql = "SELECT gameID, gameTurn, p1Active, p2Active, p3Active, p4Active, playerCount, finished FROM kiviRunningGames";
	
	$selectKiviRemovable = "";
	$sqlRemoveKivi = "";
	$updateTotalAmounts = "";
	$movedToFinished ="";

	$ToBeRemoved = array(); //all game id's which have been expired

	$result = mysqli_query($conn, $sql);
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			if($row["p1Active"] <= 1 || $row["p2Active"] <= 1 || $row["p3Active"] <= 1 || $row["p4Active"] <= 1 || $row["playerCount"] == $row["finished"] ){
				$ToBeRemoved[] = $row["gameID"];
				//array_push($ToBeRemoved, $row["gameID"]);
			}
		}
	}

	foreach ($ToBeRemoved as $removable){
		$selectKiviRemovable .= "SELECT * FROM kivi WHERE gameID=" . $removable .";";
		$sqlRemoveKivi .= "DELETE FROM kivi WHERE gameID=" . $removable .";";
		$sqlRemoveRg .= "DELETE FROM kiviRunningGames WHERE gameID=" . $removable .";";
	}
	
	//eiter move to finsihed and count score or move to unfinished without counting score
	//check if game is finsihed with gameTurn (168t for 2p, 172t for 3p and 176t for 4p)
	$moving = mysqli_query($conn, $selectKiviRemovable);
	if (mysqli_num_rows($moving) > 0) {
		while($row = mysqli_fetch_assoc($moving)) { //creat the transform querries
			if( ($row["gameTurn"] == 168 && $row["playerCount"] == 2) || ($row["gameTurn"] == 172 && $row["playerCount"] == 3) || ($row["gameTurn"] == 176 && $row["playerCount"] == 4) ){
				//count score
				//uses a similar code as the client side does
				//might take too much resources
				
				$playerCount = $row["playerCount"];
				$placedMarbles = $row["boardUsedPositions"];

				$p1Score = 0;
				$p2Score = 0;
				$p3Score = 0;
				$p4Score = 0;
	
	
				$p1Xplace = array();
				$p1Yplace = array();
	
				$p2Xplace = array();
				$p2Yplace = array();
	
				$p3Xplace = array();
				$p3Yplace = array();
	
				$p4Xplace = array();
				$p4Yplace = array();
	
	
				$p1Choces = "";
				$p2Choces = "";
				$p3Choces = "";
				$p4Choces = "";

				$p1X1 = 0;
				$p1X2 = 0;
				$p1X3 = 0;
				$p1X4 = 0;
				$p1X5 = 0;
				$p1X6 = 0;
				$p1X7 = 0;

				$p1Y1 = 0;
				$p1Y2 = 0;
				$p1Y3 = 0;
				$p1Y4 = 0;
				$p1Y5 = 0;
				$p1Y6 = 0;
				$p1Y7 = 0;

				$p2X1 = 0;
				$p2X2 = 0;
				$p2X3 = 0;
				$p2X4 = 0;
				$p2X5 = 0;
				$p2X6 = 0;
				$p2X7 = 0;

				$p2Y1 = 0;
				$p2Y2 = 0;
				$p2Y3 = 0;
				$p2Y4 = 0;
				$p2Y5 = 0;
				$p2Y6 = 0;
				$p2Y7 = 0;

				$p3X1 = 0;
				$p3X2 = 0;
				$p3X3 = 0;
				$p3X4 = 0;
				$p3X5 = 0;
				$p3X6 = 0;
				$p3X7 = 0;

				$p3Y1 = 0;
				$p3Y2 = 0;
				$p3Y3 = 0;
				$p3Y4 = 0;
				$p3Y5 = 0;
				$p3Y6 = 0;
				$p3Y7 = 0;

				$p4X1 = 0;
				$p4X2 = 0;
				$p4X3 = 0;
				$p4X4 = 0;
				$p4X5 = 0;
				$p4X6 = 0;
				$p4X7 = 0;

				$p4Y1 = 0;
				$p4Y2 = 0;
				$p4Y3 = 0;
				$p4Y4 = 0;
				$p4Y5 = 0;
				$p4Y6 = 0;
				$p4Y7 = 0;

				//$incBy1 = 0;
				//different loop for 2, 3 and 4 p games
				if ($playerCount == 2) {
					for ($i = 0; $i  < strlen($placedMarbles); $i  += 4) {
						$p1Xplace[] = substr($placedMarbles, $i , 1);
						$p1Yplace[] = substr($placedMarbles, $i +1, 1);
						$p2Xplace[] = substr($placedMarbles, $i +2, 1);
						$p2Yplace[] = substr($placedMarbles, $i +3, 1);

						$p1Choces .= substr($placedMarbles, $i , 2);
						//$p1Choces .= substr($placedMarbles, $i+1, 1);
						$p2Choces .= substr($placedMarbles, $i +2, 2);
						//$p2Choces .= substr($placedMarbles, $i+3, 1);
						//$incBy1++;
					}
				}elseif($playerCount == 3){
					for ($i = 0; $i < strlen($placedMarbles); $i += 6) {
						$p1Xplace[] = substr($placedMarbles, $i, 1);
						$p1Yplace[] = substr($placedMarbles, $i+1, 1);
						$p2Xplace[] = substr($placedMarbles, $i+2, 1);
						$p2Yplace[] = substr($placedMarbles, $i+3, 1);
						$p3Xplace[] = substr($placedMarbles, $i+4, 1);
						$p3Yplace[] = substr($placedMarbles, $i+5, 1);

						$p1Choces .= substr($placedMarbles, $i, 2);
						//$p1Choces .= substr($placedMarbles, $i+1, 1);
						$p2Choces .= substr($placedMarbles, $i+2, 2);
						//$p2Choces .= substr($placedMarbles, $i+3, 1);
						$p3Choces .= substr($placedMarbles, $i+4, 2);
						//$p3Choces .= substr($placedMarbles, $i+5, 1);
						//$incBy1++;
					}
				}elseif($playerCount == 4){
					for($i = 0; $i < strlen($placedMarbles); $i += 8) {
						$p1Xplace[] = substr($placedMarbles, $i, 1);
						$p1Yplace[] = substr($placedMarbles, $i+1, 1);
						$p2Xplace[] = substr($placedMarbles, $i+2, 1);
						$p2Yplace[] = substr($placedMarbles, $i+3, 1);
						$p3Xplace[] = substr($placedMarbles, $i+4, 1);
						$p3Yplace[] = substr($placedMarbles, $i+5, 1);
						$p4Xplace[] = substr($placedMarbles, $i+6, 1);
						$p4Yplace[] = substr($placedMarbles, $i+7, 1);

						$p1Choces .= substr($placedMarbles, $i, 1);
						$p1Choces .= substr($placedMarbles, $i+1, 1);
						$p2Choces .= substr($placedMarbles, $i+2, 1);
						$p2Choces .= substr($placedMarbles, $i+3, 1);
						$p3Choces .= substr($placedMarbles, $i+4, 1);
						$p3Choces .= substr($placedMarbles, $i+5, 1);
						$p4Choces .= substr($placedMarbles, $i+6, 1);
						$p4Choces .= substr($placedMarbles, $i+7, 1);
						//$incBy1++;
					}
				}

				for ($i = 0; $i < count($p1Xplace); $i++) {
					if ($p1Xplace[$i] == "a") {
						$p1X1++;
					} elseif ($p1Xplace[$i] == "b") {
						$p1X2++;
					} elseif ($p1Xplace[$i] == "c") {
						$p1X3++;
					} elseif ($p1Xplace[$i] == "d") {
						$p1X4++;
					} elseif ($p1Xplace[$i] == "e") {
						$p1X5++;
					} elseif ($p1Xplace[$i] == "f") {
						$p1X6++;
					} elseif ($p1Xplace[$i] == "g") {
						$p1X7++;
					}
					if ($p1Yplace[$i] == 1) {
						$p1Y1++;
					} elseif ($p1Yplace[$i] == 2) {
						$p1Y2++;
					} elseif ($p1Yplace[$i] == 3) {
						$p1Y3++;
					} elseif ($p1Yplace[$i] == 4) {
						$p1Y4++;
					} elseif ($p1Yplace[$i] == 5) {
						$p1Y5++;
					} elseif ($p1Yplace[$i] == 6) {
						$p1Y6++;
					} elseif ($p1Yplace[$i] == 7) {
						$p1Y7++;
					}
				}
				for ($i = 0; $i < count($p2Xplace); $i++) {
					if ($p2Xplace[$i] == "a") {
						$p2X1++;
					} elseif ($p2Xplace[$i] == "b") {
						$p2X2++;
					} elseif ($p2Xplace[$i] == "c") {
						$p2X3++;
					} elseif ($p2Xplace[$i] == "d") {
						$p2X4++;
					} elseif ($p2Xplace[$i] == "e") {
						$p2X5++;
					} elseif ($p2Xplace[$i] == "f") {
						$p2X6++;
					} elseif ($p2Xplace[$i] == "g") {
						$p2X7++;
					}
					if ($p2Yplace[$i] == 1) {
						$p2Y1++;
					} elseif ($p2Yplace[$i] == 2) {
						$p2Y2++;
					} elseif ($p2Yplace[$i] == 3) {
						$p2Y3++;
					} elseif ($p2Yplace[$i] == 4) {
						$p2Y4++;
					} elseif ($p2Yplace[$i] == 5) {
						$p2Y5++;
					} elseif ($p2Yplace[$i] == 6) {
						$p2Y6++;
					} elseif ($p2Yplace[$i] == 7) {
						$p2Y7++;
					}
				}
				//only run in 3 and 4p games 
				if ($playerCount == 3 || $playerCount == 4 ) {
					for ($i = 0; $i < count($p3Xplace); $i++) {
						if ($p3Xplace[$i] == "a") {
							$p3X1++;
						} elseif ($p3Xplace[$i] == "b") {
							$p3X2++;
						} elseif ($p3Xplace[$i] == "c") {
							$p3X3++;
						} elseif ($p3Xplace[$i] == "d") {
							$p3X4++;
						} elseif ($p3Xplace[$i] == "e") {
							$p3X5++;
						} elseif ($p3Xplace[$i] == "f") {
							$p3X6++;
						} elseif ($p3Xplace[$i] == "g") {
							$p3X7++;
						}
						if ($p3Yplace[$i] == 1) {
							$p3Y1++;
						} elseif ($p3Yplace[$i] == 2) {
							$p3Y2++;
						} elseif ($p3Yplace[$i] == 3) {
							$p3Y3++;
						} elseif ($p3Yplace[$i] == 4) {
							$p3Y4++;
						} elseif ($p3Yplace[$i] == 5) {
							$p3Y5++;
						} elseif ($p3Yplace[$i] == 6) {
							$p3Y6++;
						} elseif ($p3Yplace[$i] == 7) {
							$p3Y7++;
						}
					}
				}
				//only run in 4p games
				if ($playerCount == 4) {
					for ($i = 0; $i < count($p4Xplace); $i++) {
						if ($p4Xplace[$i] == "a") {
							$p4X1++;
						} elseif ($p4Xplace[$i] == "b") {
							$p4X2++;
						} elseif ($p4Xplace[$i] == "c") {
							$p4X3++;
						} elseif ($p4Xplace[$i] == "d") {
							$p4X4++;
						} elseif ($p4Xplace[$i] == "e") {
							$p4X5++;
						} elseif ($p4Xplace[$i] == "f") {
							$p4X6++;
						} elseif ($p4Xplace[$i] == "g") {
							$p4X7++;
						}
						if ($p4Xplace[$i] == 1) {
							$p4Y1++;
						} elseif ($p4Yplace[$i] == 2) {
							$p4Y2++;
						} elseif ($p4Yplace[$i] == 3) {
							$p4Y3++;
						} elseif ($p4Yplace[$i] == 4) {
							$p4Y4++;
						} elseif ($p4Yplace[$i] == 5) {
							$p4Y5++;
						} elseif ($p4Yplace[$i] == 6) {
							$p4Y6++;
						} elseif ($p4Yplace[$i] == 7) {
							$p4Y7++;
						}
					}
				}

				if ($p1Y1 > 1) {
					$p1Score += $p1Y1 - 1;
				}
				if ($p1Y2 > 1) {
					$p1Score += $p1Y2 - 1;
				}
				if ($p1Y3 > 1) {
					$p1Score += $p1Y3 - 1;
				}
				if ($p1Y4 > 1) {
					$p1Score += $p1Y4 - 1;
				}
				if ($p1Y5 > 1) {
					$p1Score += $p1Y5 - 1;
				}
				if ($p1Y6 > 1) {
					$p1Score += $p1Y6 - 1;
				}
				if ($p1Y7 > 1) {
					$p1Score += $p1Y7 - 1;
				}
				if ($p1X1 > 1) {
					$p1Score += $p1X1 - 1;
				}
				if ($p1X2 > 1) {
					$p1Score += $p1X2 - 1;
				}
				if ($p1X3 > 1) {
					$p1Score += $p1X3 - 1;
				}
				if ($p1X4 > 1) {
					$p1Score += $p1X4 - 1;
				}
				if ($p1X5 > 1) {
					$p1Score += $p1X5 - 1;
				}
				if ($p1X6 > 1) {
					$p1Score += $p1X6 - 1;
				}
				if ($p1X7 > 1) {
					$p1Score += $p1X7 - 1;
				}

				if ($p2Y1 > 1) {
					$p2Score += $p2Y1 - 1;
				}
				if ($p2Y2 > 1) {
					$p2Score += $p2Y2 - 1;
				}
				if ($p2Y3 > 1) {
					$p2Score += $p2Y3 - 1;
				}
				if ($p2Y4 > 1) {
					$p2Score += $p2Y4 - 1;
				}
				if ($p2Y5 > 1) {
					$p2Score += $p2Y5 - 1;
				}
				if ($p2Y6 > 1) {
					$p2Score += $p2Y6 - 1;
				}
				if ($p2Y7 > 1) {
					$p2Score += $p2Y7 - 1;
				}
				if ($p2X1 > 1) {
					$p2Score += $p2X1 - 1;
				}
				if ($p2X2 > 1) {
					$p2Score += $p2X2 - 1;
				}
				if ($p2X3 > 1) {
					$p2Score += $p2X3 - 1;
				}
				if ($p2X4 > 1) {
					$p2Score += $p2X4 - 1;
				}
				if ($p2X5 > 1) {
					$p2Score += $p2X5 - 1;
				}
				if ($p2X6 > 1) {
					$p2Score += $p2X6 - 1;
				}
				if ($p2X7 > 1) {
					$p2Score += $p2X7 - 1;
				}

				if ($p3Y1 > 1) {
					$p3Score += $p3Y1 - 1;
				}
				if ($p3Y2 > 1) {
					$p3Score += $p3Y2 - 1;
				}
				if ($p3Y3 > 1) {
					$p3Score += $p3Y3 - 1;
				}
				if ($p3Y4 > 1) {
					$p3Score += $p3Y4 - 1;
				}
				if ($p3Y5 > 1) {
					$p3Score += $p3Y5 - 1;
				}
				if ($p3Y6 > 1) {
					$p3Score += $p3Y6 - 1;
				}
				if ($p3Y7 > 1) {
					$p3Score += $p3Y7 - 1;
				}
				if ($p3X1 > 1) {
					$p3Score += $p3X1 - 1;
				}
				if ($p3X2 > 1) {
					$p3Score += $p3X2 - 1;
				}
				if ($p3X3 > 1) {
					$p3Score += $p3X3 - 1;
				}
				if ($p3X4 > 1) {
					$p3Score += $p3X4 - 1;
				}
				if ($p3X5 > 1) {
					$p3Score += $p3X5 - 1;
				}
				if ($p3X6 > 1) {
					$p3Score += $p3X6 - 1;
				}
				if ($p3X7 > 1) {
					$p3Score += $p3X7 - 1;
				}

				if ($p4Y1 > 1) {
					$p4Score += $p4Y1 - 1;
				}
				if ($p4Y2 > 1) {
					$p4Score += $p4Y2 - 1;
				}
				if ($p4Y3 > 1) {
					$p4Score += $p4Y3 - 1;
				}
				if ($p4Y4 > 1) {
					$p4Score += $p4Y4 - 1;
				}
				if ($p4Y5 > 1) {
					$p4Score += $p4Y5 - 1;
				}
				if ($p4Y6 > 1) {
					$p4Score += $p4Y6 - 1;
				}
				if ($p4Y7 > 1) {
					$p4Score += $p4Y7 - 1;
				}
				if ($p4X1 > 1) {
					$p4Score += $p4X1 - 1;
				}
				if ($p4X2 > 1) {
					$p4Score += $p4X2 - 1;
				}
				if ($p4X3 > 1) {
					$p4Score += $p4X3 - 1;
				}
				if ($p4X4 > 1) {
					$p4Score += $p4X4 - 1;
				}
				if ($p4X5 > 1) {
					$p4Score += $p4X5 - 1;
				}
				if ($p4X6 > 1) {
					$p4Score += $p4X6 - 1;
				}
				if ($p4X7 > 1) {
					$p4Score += $p4X7 - 1;
				}
				
				//score before slots and after the connection bonuses
				$preSlotP1Score = $p1Score;
				$preSlotP2Score = $p2Score;
				$preSlotP3Score = $p3Score;
				$preSlotP4Score = $p4Score;
				$p1Connection = $p1Score;
				$p2Connection = $p2Score;
				$p3Connection = $p3Score;
				$p4Connection = $p4Score;
				
				for ($i = 0; $i < count($all3scoreSlots); $i++) {
					if ( strpos($p1Choces, $all3scoreSlots[$i]) !== false ) {
						$p1Score += 3;
					}
				}
				for ($i = 0; $i < count($all2scoreSlots); $i++) {
					if (strpos($p1Choces, $all2scoreSlots[$i]) !== false) {
						$p1Score += 2;
					}
				}
				for ($i = 0; $i < count($all1scoreSlots); $i++) {
					if (strpos($p1Choces, $all1scoreSlots[$i]) !== false) {
						$p1Score += 1;
					}
				}

				for ($i = 0; $i < count($all3scoreSlots); $i++) {
					if (strpos($p2Choces, $all3scoreSlots[$i]) !== false) {
						$p2Score += 3;
					}
				}
				for ($i = 0; $i < count($all2scoreSlots); $i++) {
					if (strpos($p2Choces, $all2scoreSlots[$i]) !== false) {
						$p2Score += 2;
					}
				}
				for ($i = 0; $i < count($all1scoreSlots); $i++) {
					if (strpos($p2Choces, $all1scoreSlots[$i]) !== false) {
						$p2Score += 1;
					}
				}
				//only run in 3 and 4p games
				if ($playerCount == 3 || $playerCount == 4) {
					for ($i = 0; $i < count($all3scoreSlots); $i++) {
						if (strpos($p3Choces, $all3scoreSlots[$i]) !== false) {
							$p3Score += 3;
						}
					}
					for ($i = 0; $i < count($all2scoreSlots); $i++) {
						if (strpos($p3Choces, $all2scoreSlots[$i]) !== false) {
							$p3Score += 2;
						}
					}
					for ($i = 0; $i < count($all1scoreSlots); $i++) {
						if (strpos($p3Choces, $all1scoreSlots[$i]) !== false) {
							$p3Score += 1;
						}
					}
				}
				// only 4p games
				if ($playerCount == 4) {
					for ($i = 0; $i < count($all3scoreSlots); $i++) {
						if (stripos($p4Choces, $all3scoreSlots[$ija]) !== false) {
							$p4Score += 3;
						}
					}
					for ($i = 0; $i < count($all2scoreSlots); $i++) {
						if (stripos($p4Choces, $all2scoreSlots[$i]) !== false) {
							$p4Score += 2;
						}
					}
					for ($i = 0; $i < count($all1scoreSlots); $i++) {
						if (stripos($p4Choces, $all1scoreSlots[$i]) !== false) {
							$p4Score += 1;
						}
					}
				}

				//check the winner and save it into thew database
				$p1winner = false;
				$p2winner = false;
				$p3winner = false;
				$p4winner = false;

				$biggestNumber = max($p1Score, $p2Score, $p3Score, $p4Score);
				$allHighScores = array();
				if ($p1Score == $biggestNumber) {$allHighScores[] = "p1";}
				if ($p2Score == $biggestNumber) {$allHighScores[] = "p2";} 
				if ($p3Score == $biggestNumber) {$allHighScores[] = "p3";}
				if ($p4Score == $biggestNumber) {$allHighScores[] = "p4";}

				if (count($allHighScores) > 1) { //if there is a tie
					//check to see what are the connection points between all palyers
					$connectionBonuses = array();
					if (in_array("p1", $allHighScores)) { $connectionBonuses[] = $p1Connection; }
					if (in_array("p2", $allHighScores)) { $connectionBonuses[] = $p2Connection; }
					if (in_array("p3", $allHighScores)) { $connectionBonuses[] = $p3Connection; }
					if (in_array("p4", $allHighScores)) { $connectionBonuses[] = $p4Connection; }


					$biggestConnection = max($connectionBonuses);
					$highestScoreAndConnection = array();
					if ($p1Score == $biggestNumber && $p1Connection == $biggestConnection) { $highestScoreAndConnection[] = "p1";}
					if ($p2Score == $biggestNumber && $p2Connection == $biggestConnection) { $highestScoreAndConnection[] = "p2";}
					if ($p3Score == $biggestNumber && $p3Connection == $biggestConnection) { $highestScoreAndConnection[] = "p3";}
					if ($p4Score == $biggestNumber && $p4Connection == $biggestConnection) { $highestScoreAndConnection[] = "p4";}

					if (count($highestScoreAndConnection) > 1) { //if the winner is the player with bigger player number
						if (in_array("p4", $highestScoreAndConnection)) {
							$p4winner = true;
						} else if (in_array("p3", $highestScoreAndConnection)) {
							$p3winner = true;
						} else if (in_array("p2", $highestScoreAndConnection)) {
							$p2winner = true;
						} else if (in_array("p1", $highestScoreAndConnection)) {
							$p1winner = true;
						}


					} else { //if the winner is declared with bigger connection score
						if ($highestScoreAndConnection[0] == "p1") {
							$p1winner = true;
						} else if ($highestScoreAndConnection[0] == "p2") {
							$p2winner = true;
						} else if ($highestScoreAndConnection[0] == "p3") {
							$p3winner = true;
						} else if ($highestScoreAndConnection[0] == "p4") {
							$p4winner = true;
						}
					}

				} else {//if there is no tie
					if ($allHighScores[0] == "p1") {
						$p1winner = true;
					} else if ($allHighScores[0] == "p2") {
						$p2winner = true;
					} else if ($allHighScores[0] == "p3") {
						$p3winner = true;
					} else if ($allHighScores[0] == "p4") {
						$p4winner = true;
					}
				}

				$declaredWinner = 0;
				$highScore = 0;
				
				if($p1winner == true){
					$declaredWinner = 1;
					$highScore = $p1Score;
				}else if($p2winner == true){
					$declaredWinner = 2;
					$highScore = $p2Score;
				}else if($p3winner == true){
					$declaredWinner = 3;
					$highScore = $p3Score;
				}else if($p4winner == true){
					$declaredWinner = 4;
					$highScore = $p4Score;
				}


				$movedToFinished .=  'INSERT INTO kiviFinishedCorrectly (gameID, startTime, gameTurn, playerCount, boardUsedPositions, firstTurnAll, p1Name, p2Name, p3Name, p4Name, p1Score, p1ConScore, p2Score, p2ConScore, p3Score, p3ConScore, p4Score, p4ConScore, winner, highScore) VALUES (' . $row["gameID"] . ', "' . $row["playTime"] . '", ' . $row["gameTurn"] . ', ' . $row["playerCount"] . ', "' . $row["boardUsedPositions"] . '", "' . $row["firstTurnAll"] . '", "' . $row["p1Name"] . '", "' . $row["p2Name"] . '", "' . $row["p3Name"] . '", "' . $row["p4Name"] . '", ' . $p1Score .  ', ' . $preSlotP1Score . ', ' . $p2Score . ', ' . $preSlotP2Score . ', ' . $p3Score . ', ' . $preSlotP3Score . ', ' . $p4Score . ', ' . $preSlotP4Score . ', ' . $declaredWinner . ', ' . $highScore .');';
				
				//set stats   kiviTotalGames
				if($row["playerCount"] == 2){
					$updateTotalAmounts .= "UPDATE kiviTotalGames SET PlayerAmountAll = PlayerAmountAll + 1 WHERE id=1;";
					$updateTotalAmounts .= "UPDATE kiviTotalGames SET PlayerAmount2p = PlayerAmount2p + 1 WHERE id=1;";
				}else if($row["playerCount"] == 3){
					$updateTotalAmounts .= "UPDATE kiviTotalGames SET PlayerAmountAll = PlayerAmountAll + 1 WHERE id=1;";
					$updateTotalAmounts .= "UPDATE kiviTotalGames SET PlayerAmount3p = PlayerAmount3p + 1 WHERE id=1;";
				}else if($row["playerCount"] == 4){
					$updateTotalAmounts .= "UPDATE kiviTotalGames SET PlayerAmountAll = PlayerAmountAll + 1 WHERE id=1;";
					$updateTotalAmounts .= "UPDATE kiviTotalGames SET PlayerAmount4p = PlayerAmount4p + 1 WHERE id=1;";
				}
				
				
			}else{ //if the game isn't finished
				$movedToFinished .=  'INSERT INTO kiviErrorFinished (gameID, gameTurn, playerCount, p1Name, p2Name, p3Name, p4Name, boardUsedPositions, firstTurnAll, startTime) VALUES (' . $row["gameID"] . ', ' . $row["gameTurn"] . ', ' . $row["playerCount"] . ', "' . $row["p1Name"] . '", "' . $row["p2Name"] . '", "' . $row["p3Name"] . '", "' . $row["p4Name"] . '", "' . $row["boardUsedPositions"] . '", "' . $row["firstTurnAll"] . '", "' . $row["playTime"] . '");';
			}
		}
	}
	
	//need all the SQL in once piece because for some reason it can't be done seperately.
	$bigSQL = $sqlQuery . $movedToFinished . $updateTotalAmounts . $sqlRemoveKivi . $sqlRemoveRg;
	
	$allAtOnce = mysqli_multi_query($conn, $bigSQL);
	if($allAtOnce){}
	
	//sleep(120);
//}
?>