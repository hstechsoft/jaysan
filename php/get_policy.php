<?php
 include 'db_head.php';

 
 $cus_id =test_input($_GET['cus_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT  policy.* FROM policy INNER JOIN customer ON policy.cus_id = customer.cus_id WHERE customer.cus_id = $cus_id AND policy_exp != 'old'" ;


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


