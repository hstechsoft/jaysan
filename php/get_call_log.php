<?php
 include 'db_head.php';

 
 $emp_id_p =test_input($_GET['emp_id_p']);
 $today_start =($_GET['today_start']);
 $today_end =($_GET['today_end']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT * FROM call_log Inner join employee ON call_log.phone_id = employee.emp_phone_id LEFT JOIN customer ON call_log.phone_number LIKE CONCAT('%',  customer.cus_phone, '%') where employee.emp_id = $emp_id_p and call_log.call_date between  $today_start and  $today_end ORDER BY call_log.call_date";


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


