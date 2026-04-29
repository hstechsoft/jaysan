<?php
// Location: jaysanERP/php/app_upload.php

// 1. Define the destination folder (going up one level to app_photo)
$target_dir = "../app_photo/";

// 2. Create the folder if it doesn't exist
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// 3. Get the file name from the request
$target_file = $target_dir . basename($_FILES["file"]["name"]);

// 4. Move the uploaded file from temporary storage to the target folder
if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    echo "Success";
} else {
    // If it fails, send an error code
    header('HTTP/1.1 500 Internal Server Error');
    echo "Upload failed. Check folder permissions.";
}
?>