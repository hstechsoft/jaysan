<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

    $sql = "SELECT
        material_request_form.*,
        parts_tbl.part_name,
        pre_emp.emp_name as prepared_by_name,
        pre_emp.emp_role as desgn,
        tally_emp.emp_name as tally_stock_approved_by_name
        
        FROM material_request_form
    LEFT JOIN parts_tbl ON material_request_form.part_id = parts_tbl.part_id
    LEFT JOIN employee pre_emp ON material_request_form.prepared_by = pre_emp.emp_id
    LEFT JOIN employee tally_emp ON material_request_form.tally_stock_approved_by = tally_emp.emp_id 
    WHERE
        material_request_form.mrf_id  =  $mrf_id";  
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