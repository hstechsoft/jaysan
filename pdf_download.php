<?php
$file = $_GET['file'] ?? '';
$path = realpath($file);

if (!$path || !is_file($path)) {
    http_response_code(404);
    exit('File not found');
}

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="'.basename($path).'"'); // inline → opens in tab
header('Content-Length: '.filesize($path));
readfile($path);
