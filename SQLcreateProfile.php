<?php

var_dump($_POST);


// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");


// stores data to be uploaded
$userName = mysqli_real_escape_string($db,$_POST["userName"]);
$password = mysqli_real_escape_string($db,$_POST["password"]);
$bio = mysqli_real_escape_string($db,$_POST["bio"]);
$profilePic = mysqli_real_escape_string($db,$_POST["profilePic"]);
$date = mysqli_real_escape_string($db,$_POST["date"]);

// hashes password with a unique salt
$password = md5($userName.$password);

// runs a query to insert new record
$query = mysqli_query($db, "INSERT INTO `tblprofiles`(`UserName`,`Password`,`ProfilePicture`,`Bio`,`DateJoined`) VALUES ('$userName','$password','$profilePic','$bio','$date')");

$ID = $db->insert_id;

exit(json_encode($ID));
