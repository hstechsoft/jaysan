<?php
 include 'db_head.php';

  
 $cus_id_p =test_input($_GET['cus_id_p']);
 $start =$_GET['start'];
 $end =$_GET['end'];
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT* FROM location where phone_id =  $cus_id_p  && cur_time between  $start and  $end";


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


