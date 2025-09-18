<?php
 include 'db_head.php';

 
 $emp_id =test_input($_GET['emp_id']);
 $start_date =test_input($_GET['start_date']);
 $end_date =test_input($_GET['end_date']);
 
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT customer.cus_name,work_history.cus_id,work_history.his_date,work_history.his_status,work_history.comments from customer INNER JOIN work_history ON customer.cus_id = work_history.cus_id WHERE work_history.his_date between  $start_date AND  $end_date  AND work_history.emp_id =   $emp_id ORDER BY work_history.his_date"; 

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


