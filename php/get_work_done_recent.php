<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
if($emp_id =="'0'")
{
  $sql =  "SELECT work_done_table.work_id, work_done_table.emp_id, 
  start_date as start_date_1,
                  end_date as end_date_1,
                  DATE_FORMAT(work_done_table.start_date, '%d-%m-%Y %r') as start_date, 
                  DATE_FORMAT(work_done_table.end_date, '%d-%m-%Y %r') as end_date, 
                  employee.emp_name 
           FROM `work_done_table` 
           INNER JOIN employee ON employee.emp_id = work_done_table.emp_id 
           ORDER BY work_done_table.start_date DESC 
           LIMIT 10";
}
else
{
 $sql =  "SELECT work_done_table.work_id, work_done_table.emp_id, 
  start_date as start_date_1,
                  end_date as end_date_1,
                  DATE_FORMAT(work_done_table.start_date, '%d-%m-%Y %r') as start_date, 
                  DATE_FORMAT(work_done_table.end_date, '%d-%m-%Y %r') as end_date, 
                  employee.emp_name 
           FROM `work_done_table` 
           INNER JOIN employee ON employee.emp_id = work_done_table.emp_id WHERE work_done_table.emp_id =  $emp_id order by work_done_table.start_date desc limit 10";
}


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


