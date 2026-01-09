<?php
 include 'db_head.php';

 $mtid = test_input($_GET['mtid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT jaysan_model_subtype.*,(SELECT sec_name FROM `dep_section` WHERE dep_section.dep_sec_id = msid)as subype_group_name,(select json_object('mrp',mrp,'min_price',min_price,'max_price',max_price)   from jaysan_model_type where mtid = $mtid limit 1) as master FROM jaysan_model_subtype WHERE mtid =  $mtid";

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


