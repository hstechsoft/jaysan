<?php
include("db_head.php");
$ex_name = isset($_GET['ex_name']) ? $_GET['ex_name'] : '';


$ex_name  = "%" .  $ex_name ."%";


$sql = "SELECT * FROM extra_time_master WHERE ex_name LIKE '$ex_name' ORDER BY ext_id DESC";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
?>
