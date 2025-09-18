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




 $sql = "SELECT * from product_reminder_master INNER join reminder_master ON product_reminder_master.remind_id = reminder_master.remind_id WHERE product_reminder_master.pid = $pid";

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


