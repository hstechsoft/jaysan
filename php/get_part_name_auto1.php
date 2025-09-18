<?php
 include 'db_head.php';


 $part = ($_GET['part']);
 $term = ($_GET['term']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$part  = "%" .  $part ."%";


if($term == 'no')

$sql = "SELECT part_name,part_no,part_id,part_image FROM `parts_tbl` WHERE part_no LIKE  '$part'";
else 

 $sql = "SELECT part_name,part_no,part_id,part_image FROM parts_tbl WHERE part_name LIKE  '$part'";

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


