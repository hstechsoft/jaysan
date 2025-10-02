<?php

if (isset($_GET['file'])) {
    $file = basename($_GET['file']); // prevent directory traversal
    if (file_exists($file)) {
        header('Content-Type: text/plain');
        echo file_get_contents($file);
    } else {
        http_response_code(404);
        echo "File not found.";
    }
    exit;
}

// List all PHP files in current directory
$files = glob("*.php");
echo json_encode($files);
