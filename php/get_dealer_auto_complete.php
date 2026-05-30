<?php
include "db_head.php";

$dealer_name = $_GET['dealer_name'] ?? '';

$sql = "SELECT did, dname 
        FROM dealer 
        WHERE dname LIKE ?";

$stmt = $conn->prepare($sql);

$search = "%" . $dealer_name . "%";
$stmt->bind_param("s", $search);

$stmt->execute();

$result = $stmt->get_result();

$dealers = [];

while ($row = $result->fetch_assoc()) {
    $dealers[] = $row;
}

echo json_encode($dealers);

$stmt->close();
$conn->close();
?>