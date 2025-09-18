<?php
 include 'db_head.php';

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT id,work_type_name,work_type_status.work_status,work_type_status.status_type,work_type_status.pipeline_work from work_type INNER join work_type_status ON work_type.work_type_id = work_type_status.work_type_id";



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


