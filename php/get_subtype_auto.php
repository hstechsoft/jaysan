<?php
 include 'db_head.php';


 $subtype_name = ($_GET['subtype_name']);
  $mtid = test_input($_GET['mtid']);
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$subtype_name = "%".$subtype_name."%";

$sql = "SELECT * FROM jaysan_model_subtype WHERE subtype_name LIKE '$subtype_name' and mtid = $mtid " ;


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


