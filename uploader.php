<?php

$path = $_POST["path"];

// create storage path
$targetPath = $path . basename($_FILES["images"]["name"]);

// uploads image to files
move_uploaded_file($_FILES["images"]["tmp_name"], $targetPath);