<?php

// create storage path
$targetPath = "uploads/" . basename($_FILES["images"]["name"]);

// uploads image to files
move_uploaded_file($_FILES["images"]["tmp_name"], $targetPath);