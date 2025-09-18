<?php
 include 'db_head.php';

 
 $pid = test_input($_GET['pid']);
 
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT reminder_master.*  FROM product_reminder_master INNER JOIN reminder_master on reminder_master.remind_id = product_reminder_master.remind_id  where pid = $pid GROUP by 
reminder_master.remind_id";

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


