<?php
 include 'db_head.php';

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SELECT work.work_type,work.work_date,work.work_description,work.work_id,employee.emp_name AS 'assigned_by',CASE WHEN work.work_date BETWEEN 1674585000000 AND 1674671399000 THEN 'active' ELSE 'expired'END AS expire_status FROM work INNER JOIN employee ON work.work_created_by = employee.emp_id WHERE work.emp_id = 2 AND work.work_assign_status = 'pending' AND work.work_com_status = 'incomplete';";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 results";
}
$conn->close();

 ?>


