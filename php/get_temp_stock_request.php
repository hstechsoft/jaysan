<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT stock_request.*,parts_tbl.part_name, jaysan_process.process_name, creditors.creditor_name, department.dep_name, dep_section.sec_name, employee.emp_name  FROM stock_request
 left join parts_tbl on parts_tbl.part_id = stock_request.part_id
 left join process_wel_tbl on process_wel_tbl.process_id = stock_request.previous_process_id
 left join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
 left join creditors on creditors.creditor_id = stock_request.godown
 left join department on department.dep_id = stock_request.dep
left join dep_section on dep_section.dep_sec_id = stock_request.sec
left join employee on employee.emp_id = stock_request.emp_id
";

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


