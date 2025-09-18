<?php
 include 'db_head.php';

 $nsid = test_input($_GET['nsid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT nesting_output_part.*,parts_tbl.part_no FROM nesting_output_part INNER join parts_tbl on nesting_output_part.part_id = parts_tbl.part_id WHERE nesting_output_part.nsid = $nsid

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


