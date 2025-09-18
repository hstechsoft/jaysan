<?php
 include 'db_head.php';

 
 $process_id = test_input($_GET['process_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "SELECT CASE 
 WHEN EXISTS (SELECT 1 FROM process_tbl WHERE output_part =  $process_id AND cat ='out') 
        THEN 'invalid' 
        ELSE 'valid' 
    END AS status;";

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


