<?php
 include 'db_head.php';

 
 $emp_id = test_input($_GET['emp_id']);
 $today_end = test_input($_GET['today_end']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT COUNT(work_attachment.work_id)as attach, work_description,work_date,work_type,work.emp_id,work.cus_id,work.work_id,emp_name FROM work INNER JOIN employee ON employee.emp_id = work.emp_id LEFT join work_attachment  on work.work_id  = work_attachment.work_id where work.emp_id = $emp_id and work.work_assign_status ='accept' and work.work_com_status = 'incomplete' and work.work_date < $today_end  GROUP by work.work_id   ORDER BY work_date";

// $sql = "SELECT COUNT(work_attachment.work_id)as attach,work_description,work_date,work_type,work.emp_id,work.work_id,work_com_status,emp_name,work_status  FROM work INNER JOIN employee ON employee.emp_id = work.emp_id LEFT join work_attachment  on work.work_id  = work_attachment.work_id where work.cus_id = $cus_id and work.work_assign_status = 'accept' GROUP by work.work_id  ORDER BY work_date";

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


