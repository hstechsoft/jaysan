<?php
 include 'db_head.php';


 $part_name = ($_GET['part_name']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$part_name  = "%" .  $part_name ."%";




$sql = "SELECT pwl.process_id,pt.part_name from process_wel_tbl pwl inner join parts_tbl pt on pwl.output_part = pt.part_id WHERE pwl.cat = \"out\" and pt.part_name like '$part_name'";


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


