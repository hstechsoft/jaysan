<?php
$fileId = '1jflut0ube5QYxLGwggwybZnp9Sc-uvam'; // your actual file ID
$url = "https://drive.google.com/uc?export=download&id=" . $fileId;

$json = file_get_contents($url);
$data = json_decode($json, true);

print_r($data);
?>
