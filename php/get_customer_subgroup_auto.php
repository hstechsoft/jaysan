<?php
 include 'db_head.php';


 $sub_group_name = ($_GET['sub_group_name']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sub_group_name  = "%" .  $sub_group_name ."%";




$sql = "SELECT * FROM    customer_subgroup_master  WHERE sub_group_name LIKE  '$sub_group_name'";


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


