<?php
include 'db_head.php';

$query = "SELECT * FROM parts_tbl";
$result = mysqli_query($conn, $query);

$parts = array();
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $parts[] = $row;
    }
}

// Output the parts array as JSON
header('Content-Type: application/json');
echo json_encode($parts);
?>
