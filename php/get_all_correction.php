<?php
 include 'db_head.php';

 

 
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT * from(SELECT policy.policy_id, policy.attachment,policy.policy_holder_name, customer.cus_name,policy.policy_no,customer.cus_phone,customer.cus_id FROM policy INNER join customer on policy.cus_id = customer.cus_id WHERE policy.cus_id in (SELECT   policy.cus_id from policy GROUP by policy.policy_holder_name HAVING count(*) > 1)) as g WHERE policy_id not in (SELECT policy_id FROM policy_correction)" ;

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


