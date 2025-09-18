<?php
 include 'db_head.php';

$status = test_input($_GET['status']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

  $sql = "SELECT material_request_form.mrf_id,material_request_form.dated,material_request_form.order_type,material_request_form.req_qty,material_request_form.req_date,parts_tbl.part_name,employee.emp_name as prepared_by  INNER JOIN parts_tbl on material_request_form.part_id = parts_tbl.part_id INNER join employee on material_request_form.prepared_by = employee.emp_id WHERE material_request_form.status = $status ORDER BY material_request_form.mrf_id DESC";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


