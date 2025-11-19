<?php
 include 'db_head.php';


 $emp_name = ($_GET['emp_name']);
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$emp_name = "%".$emp_name."%";

$sql = "SELECT emp_name,emp_id FROM employee WHERE emp_name LIKE '$emp_name' " ;


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


