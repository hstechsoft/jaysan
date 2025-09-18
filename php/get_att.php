<?php
 include 'db_head.php';

 
 $phone_id = test_input($_GET['phone_id']);

 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

$sql = "SELECT if(attendance.login_time>0 and attendance.logout_time=0,'login','logout')as sts FROM attendance WHERE attendance.phone_id =  $phone_id AND dated BETWEEN UNIX_TIMESTAMP(CURDATE())*1000 AND UNIX_TIMESTAMP( NOW())*1000 ORDER BY attendance.id DESC LIMIT 1";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "not_login";
}
$conn->close();



 ?>


