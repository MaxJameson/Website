<?php

// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");

$userName = mysqli_real_escape_string($db,$_POST["userName"]);
$password = mysqli_real_escape_string($db,$_POST['pass']);

// hashes password with a unique salt
$password = md5($userName.$password);

$query = mysqli_query($db, "SELECT * FROM `tblprofiles` WHERE `UserName` = BINARY '$userName' AND `Password` = BINARY '$password'");

// stores the query result
$result = mysqli_fetch_all($query, MYSQLI_ASSOC);

// returns the result
exit(json_encode($result));