<?php

// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");

$name = $_POST['userName'];
$pass = $_POST['pass'];

$query = mysqli_query($db, "SELECT * FROM `tblprofiles` WHERE `UserName` = BINARY '$name' AND `Password` = BINARY '$pass'");

// stores the query result
$result = mysqli_fetch_all($query, MYSQLI_ASSOC);

// returns the result
exit(json_encode($result));