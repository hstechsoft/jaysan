<?php
include 'php/db_head.php';

$date = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
$text = $date->format('d-m-Y H:i:s');
echo $text;
?>
