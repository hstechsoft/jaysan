<?php
 include 'db_head.php';


 $nesting_name = ($_GET['nesting_name']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$nesting_name  = "%" .  $nesting_name ."%";




$sql = "select * from  nesting_master WHERE nesting_id LIKE  '$nesting_name'";


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


