<?php
 include 'db_head.php';

 $pgid = test_input($_GET['pgid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT nesting_details.nsid,nesting_details.material_qty, nesting_details.nesting_name,(SELECT jaysan_raw_material.material_name from jaysan_raw_material WHERE jaysan_raw_material.rmid = nesting_details.rmid) as raw_material,nesting_details.run_time ,nesting_details.buffer_time,nesting_details.attachment,nesting_output_part.part_id,GROUP_CONCAT((SELECT parts_tbl.part_no  from parts_tbl WHERE parts_tbl.part_id = nesting_output_part.part_id) SEPARATOR ',') as part FROM `nesting_details` inner join nesting_output_part on nesting_details.nsid = nesting_output_part.nsid WHERE nesting_details.pgid = pgid GROUP by nesting_details.nsid

";

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


