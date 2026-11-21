
<?php

include 'db_head.php';

header('Content-Type: application/json');

// IMPORTANT:
// Verify authenticated HR/admin session and permission here.

$emp_id = $_POST['emp_id'] ?? '';
$from_date = $_POST['from_date'] ?? '';
$to_date = $_POST['to_date'] ?? '';

if (!filter_var($emp_id, FILTER_VALIDATE_INT)) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid employee ID."
    ]);
    exit;
}

$datePattern = '/^\d{4}-\d{2}-\d{2}$/';

if (
    !preg_match($datePattern, $from_date) ||
    !preg_match($datePattern, $to_date)
) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid date range."
    ]);
    exit;
}

$from = DateTime::createFromFormat('!Y-m-d', $from_date);
$to = DateTime::createFromFormat('!Y-m-d', $to_date);

if (
    !$from || !$to ||
    $from->format('Y-m-d') !== $from_date ||
    $to->format('Y-m-d') !== $to_date ||
    $from_date > $to_date ||
    $to_date > date('Y-m-d')
) {
    echo json_encode([
        "status" => "error",
        "message" => "Please select a valid date range."
    ]);
    exit;
}

try {

    // Employee details
    $employeeQuery = $conn->prepare("
        SELECT
            emp_id,
            emp_name,
            emp_role,
            emp_email,
            emp_code,
            emp_phone_id
        FROM employee
        WHERE emp_id = ?
        LIMIT 1
    ");

    if (!$employeeQuery) {
        throw new Exception($conn->error);
    }

    $employeeQuery->bind_param("i", $emp_id);
    $employeeQuery->execute();

    $employeeResult = $employeeQuery->get_result();

    if ($employeeResult->num_rows === 0) {
        throw new Exception("Employee not found.");
    }

    $employee = $employeeResult->fetch_assoc();

    // Attendance records
    $attendanceQuery = $conn->prepare("
        SELECT
            id,
            dated,
            emp_id,
            phone_id,
            start_time,
            start_latitude,
            start_longitude,
            end_time,
            end_latitude,
            end_longitude,
            status
        FROM attendance
        WHERE emp_id = ?
          AND dated BETWEEN ? AND ?
        ORDER BY dated DESC, id DESC
    ");

    if (!$attendanceQuery) {
        throw new Exception($conn->error);
    }

    $attendanceQuery->bind_param(
        "iss",
        $emp_id,
        $from_date,
        $to_date
    );

    $attendanceQuery->execute();

    $attendanceResult = $attendanceQuery->get_result();

    $data = [];

    while ($record = $attendanceResult->fetch_assoc()) {
        $data[] = $record;
    }

    echo json_encode([
        "status" => "success",
        "employee" => $employee,
        "data" => $data
    ]);

    $employeeQuery->close();
    $attendanceQuery->close();

} catch (Throwable $e) {

    http_response_code(400);

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);

}

$conn->close();

?>
