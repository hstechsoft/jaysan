<?php
include 'db_head.php';  // Ensure this line includes your database connection

$query = "SELECT prs_id AS id, prs_name AS name FROM prs_title";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $titles = array();
    while($row = $result->fetch_assoc()) {
        $titles[] = $row;
    }
    echo json_encode($titles);
} else {
    echo json_encode([]);  // Return an empty JSON array if no results
}

$result->free();
$conn->close();
?>
