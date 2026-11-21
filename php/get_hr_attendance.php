
<?php

include 'db_head.php';

header('Content-Type: application/json');

$dated = $_POST['dated'] ?? date('Y-m-d');
$filter_emp_id = $_POST['emp_id'] ?? '';

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dated)) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid attendance date"
    ]);
    exit;
}

// TODO: Verify HR/admin permission using your PHP session.

$employees = [];

$employeeQuery = $conn->query("
    SELECT emp_id, emp_name
    FROM employee
    ORDER BY emp_name ASC
");

while ($employee = $employeeQuery->fetch_assoc()) {
    $employees[] = $employee;
}

$sql = "
    SELECT
        emp.emp_id,
        emp.emp_name,
        emp.emp_role,
        emp.emp_email,
        emp.emp_code,

        atten.id AS attendance_id,
        atten.dated,
        atten.start_time,
        atten.end_time,
        atten.start_latitude,
        atten.start_longitude,
        atten.end_latitude,
        atten.end_longitude,
        atten.status

    FROM employee AS emp

    LEFT JOIN attendance AS atten
        ON atten.id = (
            SELECT MAX(a2.id)
            FROM attendance AS a2
            WHERE a2.emp_id = emp.emp_id
            AND a2.dated = ?
        )

    WHERE 1 = 1
";

if ($filter_emp_id !== '') {
    $sql .= " AND emp.emp_id = ? ";
}

$sql .= " ORDER BY emp.emp_name ASC ";

$stmt = $conn->prepare($sql);

if ($filter_emp_id !== '') {
    $stmt->bind_param("si", $dated, $filter_emp_id);
} else {
    $stmt->bind_param("s", $dated);
}

$stmt->execute();

$result = $stmt->get_result();

$data = [];

$total = 0;
$present = 0;
$absent = 0;
$completed = 0;

while ($row = $result->fetch_assoc()) {

    $total++;

    if (empty($row['attendance_id'])) {

        $absent++;
    } else {

        $present++;

        if ($row['status'] === 'completed') {
            $completed++;
        }
    }

    $data[] = $row;
}

echo json_encode([

    "status" => "success",

    "summary" => [
        "total" => $total,
        "present" => $present,
        "absent" => $absent,
        "completed" => $completed
    ],

    "employees" => $employees,

    "data" => $data

]);

$conn->close();

?>
