<?php
 include 'db_head.php';

 

 
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT customer.*,sub_group_name  FROM customer left join customer_subgroup_master on customer.cus_type_id = customer_subgroup_master.sub_group_id where cus_type = 'dealer'" ;

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


