<?php
echo "Default message";
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




$result = $conn->query("CALL `get_today_call`($p_uid_p , $p_cur_time_p1);");

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


