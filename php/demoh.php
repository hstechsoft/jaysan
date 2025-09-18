<?php
include 'db_head.php';
// Query to get table information

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get table information
$sql = "SELECT 
            TABLE_NAME AS table_name,
            COLUMN_NAME AS column_name,
            DATA_TYPE AS data_type,
            IS_NULLABLE AS is_nullable,
            COLUMN_DEFAULT AS column_default,
            COLUMN_KEY AS column_key,
            EXTRA AS extra
        FROM 
            INFORMATION_SCHEMA.COLUMNS
        WHERE 
            TABLE_SCHEMA = '$dbname'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Open a file in write mode
    $csvFile = 'database_tables_info.csv';
    $handle = fopen($csvFile, 'w');

    // Write column headers to the file
    fputcsv($handle, array('Table Name', 'Column Name', 'Data Type', 'Is Nullable', 'Default', 'Key', 'Extra'));

    // Fetch each row and write to the CSV file
    while($row = $result->fetch_assoc()) {
        fputcsv($handle, $row);
    }

    fclose($handle); // Close the file
    echo "Table information has been written to: " . $csvFile;
} else {
    echo "No table information found.";
}

$conn->close(); // Close the database connection
?>