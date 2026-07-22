<?php
include 'db_head.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$part_id = (int)$_GET['part_id'];   // Since it's an ID, cast to integer

// Find all foreign keys referencing parts_tbl.part_id
$fk_sql = "
SELECT
    TABLE_NAME,
    COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
AND REFERENCED_TABLE_NAME = 'parts_tbl'
AND REFERENCED_COLUMN_NAME = 'part_id'
";

$fk_result = $conn->query($fk_sql);

while ($fk = $fk_result->fetch_assoc()) {

    $table  = $fk['TABLE_NAME'];
    $column = $fk['COLUMN_NAME'];

    $check = $conn->query("
        SELECT COUNT(*) AS cnt
        FROM `$table`
        WHERE `$column` = $part_id
    ");

    $row = $check->fetch_assoc();

    if ($row['cnt'] > 0) {
      echo "Cannot delete. Used in table <b>$table</b>, column <b>$column</b> ({$row['cnt']} record(s)).";
        die("Cannot delete. Used in table <b>$table</b>, column <b>$column</b> ({$row['cnt']} record(s)).");
    }
}

// No references found, delete it
$sql = "DELETE FROM parts_tbl WHERE part_id = $part_id";

if ($conn->query($sql)) {
    echo "ok";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>