
<?php
include 'db_head.php';

header('Content-Type: application/json');

$dated = $_POST['dated'] ?? '';
$start_time = $_POST['start_time'] ?? '';
$start_latitude = $_POST['start_latitude'] ?? null;
$start_longitude = $_POST['start_longitude'] ?? null;

$emp_id = $_POST['emp_id'] ?? '';
$phone_id = $_POST['phone_id'] ?? '';

if (
    !$dated ||
    !$start_time ||
    !is_numeric($start_latitude) ||
    !is_numeric($start_longitude) ||
    !is_numeric($emp_id) ||
    !$phone_id
) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing or invalid required fields"
    ]);
    exit;
}

// Check existing active attendance
$check = $conn->prepare("
    SELECT id FROM attendance
    WHERE emp_id = ?
    AND phone_id = ?
    AND dated = ?
    AND status = 'started'
    LIMIT 1
");

$check->bind_param("iis", $emp_id, $phone_id, $dated);
$check->execute();

$existing = $check->get_result();

if ($existing->num_rows > 0) {

    $row = $existing->fetch_assoc();

    echo json_encode([
        "status" => "exists",
        "attendance_id" => $row['id'],
        "message" => "Your day is already started"
    ]);

    exit;
}

$status = 'started';

$sql = $conn->prepare("
    INSERT INTO attendance
    (
        dated,
        emp_id,
        phone_id,
        start_time,
        start_latitude,
        start_longitude,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$sql->bind_param(
    "sissdds",
    $dated,
    $emp_id,
    $phone_id,
    $start_time,
    $start_latitude,
    $start_longitude,
    $status
);

if ($sql->execute()) {

    echo json_encode([
        "status" => "success",
        "attendance_id" => $conn->insert_id,
        "message" => "Your day started successfully"
    ]);
} else {

    echo json_encode([
        "status" => "error",
        "message" => $sql->error
    ]);
}

$conn->close();
?>
