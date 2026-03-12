<?php
 include 'db_head.php';

 

 $part_id = test_input($_GET['part_id']);
 $component_cat = test_input($_GET['component_cat']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
  
$sql = <<<SQL
SELECT * FROM `process_wel_tbl` pwt

inner join jaysan_process jp  on pwt.process = jp.process_id  WHERE pwt.output_part = $part_id and pwt.component_cat = $component_cat

SQL;


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


