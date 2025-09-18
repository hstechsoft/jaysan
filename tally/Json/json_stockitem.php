<?php
include 'db_head.php'; // Including your MySQL database connection

// Query to get all tables in the current database
$tables = $conn->query("SHOW TABLES");

while ($table = $tables->fetch_array()) {
    $tableName = $table[0];
    echo "Table: " . $tableName . "<br>";

    // Query to get the structure of the table
    $structure = $conn->query("SHOW COLUMNS FROM $tableName");
    while ($column = $structure->fetch_assoc()) {
        echo $column['Field'] . " - " . $column['Type'] . " - " . $column['Null'] . " - " . $column['Key'] . " - " . $column['Default'] . " - " . $column['Extra'] . "<br>";
    }
    echo "<br>";
}
?>
