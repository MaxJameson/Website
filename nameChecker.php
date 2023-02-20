<?php

// logs into the sql database
$user = 'root';
$pass = '';
$db = 'bitmap';

// estavlishes a connection
$db = new mysqli ('localhost', $user, $pass, $db) or die("unable to connect");

// stores name of the image
$photoName = $_POST["photoName"];

// runs a query to check is a photo exists under the current name
$query = mysqli_query($db, "SELECT * FROM `tblphotos` WHERE PhotoName = '$photoName'");


// stores the query result
$result = mysqli_fetch_all($query, MYSQLI_ASSOC);

// returns the result
exit(json_encode($result));