<?php
 include 'db_head.php';

 
 $work_id = test_input($_GET['work_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "SELECT COUNT(work_attachment.work_id)as attach,work_description,work_date,work.work_id,work_type,work.emp_id,work_com_status,emp_name,work_status  FROM work INNER JOIN employee ON employee.emp_id = work.emp_id LEFT join work_attachment  on work.work_id  = work_attachment.work_id where work.work_id = $work_id and work.work_assign_status = 'accept' GROUP by work.work_id  ORDER BY work_date";

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


