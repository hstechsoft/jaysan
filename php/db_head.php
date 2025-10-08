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


// ✅ Add this function once — it works for all your PHP files
function sql_nullable($value) {
    // If value is null, 'null', or empty, return SQL NULL (unquoted)
    if ($value === 'null' || $value === '' || is_null($value)) {
        return "NULL";
    }

    // Detect numeric (int or float) and return as-is (unquoted)
    if (is_numeric($value)) {
        return $value;
    }

    // Detect date format YYYY-MM-DD or YYYY-MM-DD HH:MM:SS → quote it
    if (preg_match('/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/', $value)) {
        return "'$value'";
    }

    // Default case: treat as string and escape properly
    global $conn;
    return "'" . $conn->real_escape_string($value) . "'";
  }

// UPDATE policy set cus_id = 16 WHERE cus_id = 320 or cus_id = 188 or cus_id = 189 or cus_id = 191 or cus_id = 192 or cus_id = 193 or cus_id = 194 or cus_id = 195 or cus_id = 196 or cus_id = 205 or cus_id = 206 or cus_id = 207 or cus_id = 209 or cus_id = 210 or cus_id = 212
?>