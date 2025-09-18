<?php
 include 'db_head.php';

 
  $cus_id =test_input($_GET['cus_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT customer.*,work.work_date,work.work_status,work.work_id FROM customer INNER JOIN work ON customer.cus_id = work.cus_id WHERE customer.cus_id = $cus_id ORDER BY work.work_date ASC LIMIT 1";


$result = $conn->query($sql);
// $result = $conn->query("CALL `get_today_call`($p_uid_p , $p_cur_time_p1);");

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


