<?php
 include 'db_head.php';

 
 $cus_id_p =test_input($_GET['cus_id_p']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$result = $conn->query("CALL `view_call_histroy`($cus_id_p);");

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


