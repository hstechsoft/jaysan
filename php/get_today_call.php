<?php
 include 'db_head.php';

 
 $p_uid_p =test_input($_GET['p_uid_p']);
 $p_cur_time_p1 =test_input($_GET['p_cur_time_p1']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "SELECT customer.*, work.work_date,work.work_status,work.work_id,work.work_type FROM customer INNER JOIN work ON customer.cus_id = work.cus_id WHERE (work.work_date - 60000) < ($p_cur_time_p1) AND work.emp_id = $p_uid_p AND work.work_com_status = 'incomplete' ORDER BY work.work_date DESC LIMIT 1";


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


