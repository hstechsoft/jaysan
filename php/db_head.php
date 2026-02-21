<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));


}



$current_file = basename($_SERVER['PHP_SELF']);

/* Public files (no session required) */
$public_files = [
    'login.php',
    'logout.php',
    'csrf.js.php',
    'update_fcm.php',
    'get_email_by_phoneid.php',
    'get_dealer_login.php',
    'store_registration.php',
'get_app_version.php',
'get_employee_id.php',
'check_user_approval.php'
];

if (!in_array($current_file, $public_files)) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        exit;
    }

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     if (
//         empty($_POST['csrf_token']) ||
//         $_POST['csrf_token'] !== $_SESSION['csrf_token']
//     ) {
//         http_response_code(403);
//         exit;
//     }
// }

}




// $servername = "srv1002.hstgr.io";
// $username = "u333142350_db_user";
// $password = ":wi9x57Ci2";
// $dbname = "u333142350_jaysan";

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "u333142350_jaysan";




$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


// ✅ Add this function once — it works for all your PHP files
function sql_nullable($value) {
    // If value is null, 'null', or empty, return SQL NULL (unquoted)
    // if ($value === 'null' || $value === '' || is_null($value) || $value === NULL || strtolower($value) === 'null' || strcmp($value,'null') == 0) {
    //     return "NULL";
    // }
    if (
    is_null($value) ||
    $value === '' ||
    strtolower((string)trim($value)) === 'null'
) {
    return 'NULL';
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

  function log_delete_query($sql) {

    // Log only DELETE statements
    if (preg_match('/^\s*delete\s+/i', $sql)) {

        $logLine = sprintf(
            "[%s] | USER:%s | IP:%s | FILE:%s | SQL:%s\n",
            date('Y-m-d H:i:s'),
            $_SESSION['user_id'] ?? 'NA',
            $_SERVER['REMOTE_ADDR'] ?? 'CLI',
            $_SERVER['SCRIPT_NAME'] ?? 'UNKNOWN',
            $sql
        );

        // APPEND MODE (no overwrite)
        file_put_contents(
            __DIR__ . '/delete_sql.log',
            $logLine,
            FILE_APPEND | LOCK_EX
        );
    }
}


// UPDATE policy set cus_id = 16 WHERE cus_id = 320 or cus_id = 188 or cus_id = 189 or cus_id = 191 or cus_id = 192 or cus_id = 193 or cus_id = 194 or cus_id = 195 or cus_id = 196 or cus_id = 205 or cus_id = 206 or cus_id = 207 or cus_id = 209 or cus_id = 210 or cus_id = 212
?>