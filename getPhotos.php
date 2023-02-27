<?php 

// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");

// runs a query to select images
$query = mysqli_query($db, "SELECT tblphotos.PhotoName, tblphotos.StoragePath, tblphotos.Date, tblphotos.Lat, tblphotos.Long, tblprofiles.UserName FROM tblphotos INNER JOIN tblprofiles ON tblphotos.UserID = tblprofiles.UserID");

// stores the query result
$result = mysqli_fetch_all($query, MYSQLI_ASSOC);

// returns the result
exit(json_encode($result));