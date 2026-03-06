<?php
 include 'db_head.php';

 
 $p_uid_p =test_input($_GET['p_uid_p']);
 $p_cur_time_p1 = test_input($_GET['p_cur_time_p1']);
 $today_start_p = test_input($_GET['today_start_p']);
 $today_end_p = test_input($_GET['today_end_p']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$result = $conn->query("CALL `get_today_status`($p_uid_p,$p_cur_time_p1, $today_end_p, $today_start_p);");

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


