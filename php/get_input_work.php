<?php
 include 'db_head.php';
 $wid = test_input($_GET['wid']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT work_input.*,parts_tbl.part_name,parts_tbl.part_no FROM `work_input` inner join parts_tbl on work_input.part_id = parts_tbl.part_id WHERE wid =  $wid  ";


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


