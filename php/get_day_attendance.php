
<?php
include 'db_head.php';

header('Content-Type: application/json');

$emp_id = $_POST['emp_id'] ?? '';
$phone_id = $_POST['phone_id'] ?? null;
$dated = $_POST['dated'] ?? '';

if (!$emp_id || !$dated) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit;
}

$sql = $conn->prepare("
    SELECT *
    FROM attendance
    WHERE emp_id = ?
    AND dated = ?
    ORDER BY id DESC
    LIMIT 1
");

$sql->bind_param("is", $emp_id, $dated);
$sql->execute();

$result = $sql->get_result();

if ($row = $result->fetch_assoc()) {

    echo json_encode([
        "status" => "success",
        "data" => $row
    ]);
} else {

    echo json_encode([
        "status" => "empty",
        "message" => "No attendance found"
    ]);
}

$conn->close();
?>
