<?php
 include 'db_head.php';


 $group_name = ($_GET['group_name']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$group_name  = "%" .  $group_name ."%";




$sql = "SELECT * FROM   customer_group_master  WHERE group_name LIKE  '$group_name'";


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


