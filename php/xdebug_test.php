<?php
// xdebug_test.php
include 'db_head.php'; // just to follow your project structure, but optional

$greeting = "Hello from PHP!";
$number = 42;

for ($i = 1; $i <= 3; $i++) {
    $message = $greeting . " Loop iteration: " . $i;
    echo $message . "<br>";
}

echo "Test complete.";
