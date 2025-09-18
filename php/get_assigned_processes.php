<?php
include 'db_head.php';

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return "'" . $data . "'";
}

$emp_id = isset($_GET['emp_id']) ? test_input($_GET['emp_id']) : '';

if ($emp_id == '') {
  echo "<li class='list-group-item text-danger'>Invalid employee</li>";
  exit;
}

$sql = "SELECT ep.id, jp.process_name, jm.machine_name
        FROM employee_process ep
        INNER JOIN jaysan_process jp ON ep.process_id = jp.process_id
        INNER JOIN jaysan_machine jm ON ep.machine_id = jm.jmid
        WHERE ep.emp_id = $emp_id
        ORDER BY jp.process_name";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $label = htmlentities($row['process_name']) . " - " . htmlentities($row['machine_name']);
    echo "<li class='list-group-item d-flex justify-content-between align-items-center'>";
    echo $label;
    echo "<button class='btn btn-sm btn-danger delete-process' data-id='{$row['id']}'><i class='fa fa-trash'></i></button>";
    echo "</li>";
  }
} else {
  echo "<li class='list-group-item text-muted'>No processes assigned</li>";
}

$conn->close();
?>
