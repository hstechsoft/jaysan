<?php
 include 'db_head.php';

 
 $part_id =test_input($_GET['part_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "SELECT 

ifnull(count(pwt.process_id),0) as process_availble,
 JSON_ARRAYAGG(JSON_OBJECT('process',jp.process_name,'process_id',pwt.process_id)) as process_details
FROM process_wel_tbl pwt

LEFT join jaysan_process jp on pwt.process = jp.process_name

WHERE pwt.cat = 'out' and pwt.output_part = $part_id GROUP by pwt.output_part";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 results";
}
$conn->close();

 ?>


