<?php

// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");

// stores name of the item passed into the script
$itemName = mysqli_real_escape_string($db,$_POST["Name"]);

// stores the name of the table selection 
$tblName = $_POST["table"];

// searches for photo name
if ($tblName == 1){
    $tblName = `tblphotos`;
    $search = "PhotoName";
    // saves a query to check if a photo exists under the current name
    $query =  "SELECT * FROM `tblphotos` WHERE PhotoName = '$itemName'";
}

// searches for username
else{
    $tblName = `tblprofiles`;
    $search = "UserName";
    // saves a query to check if a username exists under the current name
    $query =  "SELECT * FROM `tblprofiles` WHERE UserName = '$itemName'";
}

// runs query
$output = mysqli_query($db, $query);
// stores the query result
$result = mysqli_fetch_all($output, MYSQLI_ASSOC);

// returns the result
exit(json_encode($result));