<?php
include 'db_head.php';

$sql = "SELECT process_id, process_name FROM jaysan_process ORDER BY process_name";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
$conn->close();

header('Content-Type: application/json');
echo json_encode($data);
?>
