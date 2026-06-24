<?php
 include 'db_head.php';

 $godown = isset($_GET['godown']) ? test_input($_GET['godown']) : null;
$dep = isset($_GET['dep']) ? test_input($_GET['dep']) : null;
$sec = isset($_GET['sec']) ? test_input($_GET['sec']) : null;
$work_order_id = isset($_GET['work_order_id']) ? test_input($_GET['work_order_id']) : null;


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT * FROM work_order WHERE godown =  $godown";

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


