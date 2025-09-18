<?php
 include 'db_head.php';

 

 
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT policy.*,customer.cus_phone,customer.cus_name FROM `policy` INNER join customer on customer.cus_id = policy.cus_id  WHERE policy.policy_cat = '' order by policy.policy_id asc" ;

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


