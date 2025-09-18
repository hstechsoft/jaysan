<?php
 include 'db_head.php';

 
 $work_type = test_input($_GET['work_type']);


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT work_type_status.work_status from work_type_status INNER JOIN work_type ON work_type_status.work_type_id = work_type.work_type_id where work_type.work_type_name = $work_type";

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


