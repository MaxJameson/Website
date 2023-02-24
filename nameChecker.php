<?php

// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");

// stores name of the image
$photoName = $_POST["Name"];

$tblName = $_POST["table"];

// searches for photo name
if ($tblName == 1){
    $tblName = `tblphotos`;
    $search = "PhotoName";
    // runs a query to check if a photo exists under the current name
    $query = mysqli_query($db, "SELECT * FROM `tblphotos` WHERE PhotoName = '$photoName'");
}

// searches for username
else{
    $tblName = `tblprofiles`;
    $search = "UserName";
    // runs a query to check if a username exists under the current name
    $query = mysqli_query($db, "SELECT * FROM `tblprofiles` WHERE UserName = '$photoName'");
}


// stores the query result
$result = mysqli_fetch_all($query, MYSQLI_ASSOC);

// returns the result
exit(json_encode($result));