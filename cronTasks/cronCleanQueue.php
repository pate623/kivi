<?php
/*
 This file is for cron
 it's job iis to celan inactive users from the "kivi" queue
 The cron is schedueld to run tyhis scipr once a minute.
 
 This file will loop 60 times per minute.
*/

$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "dbname"; //kiviQueue

$conn = mysqli_connect($servername, $username, $password, $dbname);

for($i = 0; $i < 60; $i++){
	$removeInactives = "DELETE FROM kiviQueue WHERE activeTimer <= 0";
	$lookMatches = mysqli_query($conn, $removeInactives);	
	if($lookMatches){}
	
	$reduceTimer = "UPDATE kiviQueue SET activeTimer = activeTimer - 1";
	$reduceTimers = mysqli_query($conn, $reduceTimer);	
	if($reduceTimers){}
	
	sleep(1);
}
?>
