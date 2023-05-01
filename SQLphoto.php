<?php

var_dump($_POST);


// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");


// stores data to be uploaded
$userID = $_POST["userID"];
$name = mysqli_real_escape_string($db,$_POST["name"]);
$storage = $_POST["storage"];
$date = $_POST["date"];
$lat = $_POST["lat"];
$long = $_POST["long"];


// runs a query to insert new record
$query = mysqli_query($db, "INSERT INTO `tblPhotos`(`UserID`,`PhotoName`,`StoragePath`,`Date`,`Lat`,`Long`) VALUES ('$userID','$name','$storage','$date','$lat','$long')");
