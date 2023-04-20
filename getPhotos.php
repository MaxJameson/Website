<?php 

// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");

// stores name of the image
$id = $_POST["id"];

// checks if a value has been submitted for an ID
if($id == " "){
    // runs a query to select all images
    $query = mysqli_query($db, "SELECT tblphotos.PhotoName, tblphotos.StoragePath, tblphotos.Date, tblphotos.Lat, tblphotos.Long, tblprofiles.UserName FROM tblphotos INNER JOIN tblprofiles ON tblphotos.UserID = tblprofiles.UserID");
}
else{
    // runs a query to select profile specific images
    $query = mysqli_query($db, "SELECT tblphotos.PhotoName, tblphotos.StoragePath, tblphotos.Date, tblphotos.Lat, tblphotos.Long, tblprofiles.UserName FROM tblphotos INNER JOIN tblprofiles ON tblphotos.UserID = tblprofiles.UserID WHERE tblprofiles.UserID = '$id'");
}

// stores the query result
$result = mysqli_fetch_all($query, MYSQLI_ASSOC);

// returns the result
exit(json_encode($result));