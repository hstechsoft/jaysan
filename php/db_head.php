<?php
$servername = "srv841.hstgr.io";
$username = "u211327498_jaysan_user";
$password = "Admin@123";
$dbname = "u211327498_jaysan";


// $servername = "localhost";
// $username = "u211327498_jaysan_user";
// $password = "Admin@123";
// $dbname = "u211327498_jaysan";


// $servername = "localhost";
// $username = "root";
// $password = "";
// $dbname = "u211327498_jaysan";


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


// UPDATE policy set cus_id = 16 WHERE cus_id = 320 or cus_id = 188 or cus_id = 189 or cus_id = 191 or cus_id = 192 or cus_id = 193 or cus_id = 194 or cus_id = 195 or cus_id = 196 or cus_id = 205 or cus_id = 206 or cus_id = 207 or cus_id = 209 or cus_id = 210 or cus_id = 212
?>