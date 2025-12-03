<?php
// ---- CONFIGURE (replace with your actual credentials, but don't keep this file public) ----
$host = "srv841.hstgr.io";
 $user = "u211327498_jaysan_user"; 
 $pass = "Admin@123"; 
 $db = "u211327498_jaysan";
$backupDir = "C:\\db_backups";  
 
// allow long-running exports
set_time_limit(0);
// Create folder if not exists
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}
// connect
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

// filename
$backupFile = $backupDir . DIRECTORY_SEPARATOR . 
              "backup_" . $db . "_" . date("Y-m-d_H-i-s") . ".sql";
$sql = "-- Backup for `$db` on " . date("Y-m-d H:i:s") . "\n\n";

// get tables
$tablesResult = $conn->query("SHOW TABLES");
if (!$tablesResult) {
    die("SHOW TABLES failed: " . $conn->error);
}

while ($row = $tablesResult->fetch_row()) {
    $table = $row[0];

    // add DROP TABLE
    $sql .= "-- -----------------------------\n";
    $sql .= "-- Table structure for `$table`\n";
    $sql .= "-- -----------------------------\n";
    $sql .= "DROP TABLE IF EXISTS `$table`;\n";

    // use numeric index to avoid undefined associative key
    $createResult = $conn->query("SHOW CREATE TABLE `$table`");
    if (!$createResult) {
        die("SHOW CREATE TABLE failed for `$table`: " . $conn->error);
    }
    $createRow = $createResult->fetch_array(MYSQLI_NUM);
    if (!isset($createRow[1])) {
        die("Unexpected SHOW CREATE TABLE result for `$table`.");
    }
    $sql .= $createRow[1] . ";\n\n";

    // dump data
    $sql .= "-- -----------------------------\n";
    $sql .= "-- Data for table `$table`\n";
    $sql .= "-- -----------------------------\n";

    $dataResult = $conn->query("SELECT * FROM `$table`");
    if (!$dataResult) {
        die("SELECT failed for `$table`: " . $conn->error);
    }

    while ($rowData = $dataResult->fetch_assoc()) {
        // handle NULLs properly and escape values
        $values = [];
        foreach ($rowData as $val) {
            if (is_null($val)) {
                $values[] = "NULL";
            } else {
                $values[] = "'" . $conn->real_escape_string($val) . "'";
            }
        }
        $sql .= "INSERT INTO `$table` VALUES(" . implode(", ", $values) . ");\n";
    }
    $sql .= "\n";
}

// save file
if (file_put_contents($backupFile, $sql) === false) {
    die("Failed to write backup file to disk.");
}

// OPTIONAL: force download in browser (uncomment if desired)
// header('Content-Type: application/sql');
// header('Content-disposition: attachment; filename=' . basename($backupFile));
// readfile($backupFile);
// exit;

echo "Backup saved: $backupFile\n";

$conn->close();
?>
