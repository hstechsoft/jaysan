<?php
 include 'db_head.php';



 $fid = test_input($_GET['fid']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}





$sql = "SELECT * FROM `part_custom_spec` inner join custom_field_master on part_custom_spec.fid = custom_field_master.fid WHERE part_custom_spec.part_id =  $part_id and custom_field_master.flabel like '$spec'";


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


