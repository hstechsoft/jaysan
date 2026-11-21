
<?php
include 'db_head.php';

header('Content-Type: application/json');

$end_time = $_POST['end_time'] ?? '';
$end_latitude = $_POST['end_latitude'] ?? null;
$end_longitude = $_POST['end_longitude'] ?? null;

$emp_id = $_POST['emp_id'] ?? '';
$phone_id = $_POST['phone_id'] ?? '';
$attendance_id = $_POST['attendance_id'] ?? '';

if (
    !$end_time ||
    !is_numeric($end_latitude) ||
    !is_numeric($end_longitude) ||
    !is_numeric($emp_id) ||
    !$phone_id ||
    !filter_var($attendance_id, FILTER_VALIDATE_INT)
) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing or invalid required fields"
    ]);
    exit;
}

$status = 'completed';

$sql = $conn->prepare("
    UPDATE attendance
    SET
        end_time = ?,
        end_latitude = ?,
        end_longitude = ?,
        status = ?
    WHERE
        id = ?
        AND emp_id = ?
        AND phone_id = ?
        AND status = 'started'
");

$sql->bind_param(
    "sddsiis",
    $end_time,
    $end_latitude,
    $end_longitude,
    $status,
    $attendance_id,
    $emp_id,
    $phone_id
);

if ($sql->execute() && $sql->affected_rows > 0) {

    echo json_encode([
        "status" => "success",
        "message" => "Your day completed successfully"
    ]);
} else {

    echo json_encode([
        "status" => "error",
        "message" => "Attendance record not found or already completed"
    ]);
}

$conn->close();
?>
