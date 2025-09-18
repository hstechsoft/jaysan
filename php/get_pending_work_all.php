<?php
 include 'db_head.php';

 
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT GROUP_CONCAT('work - ' , work_description ,work.work_type ,' - ',work.work_status  , ' Date - ',DATE_FORMAT(FROM_UNIXTIME(work.work_date/1000), '%d-%m %Y %H:%m'),' 'SEPARATOR '<br><br>') as comments,COUNT(work.emp_id) as work_count,employee.emp_name,cus_id FROM work INNER join employee on work.emp_id = employee.emp_id WHERE work_date < UNIX_TIMESTAMP(NOW())*1000  AND work_com_status = 'incomplete' GROUP by work.emp_id";

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


