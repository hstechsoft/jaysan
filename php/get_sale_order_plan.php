<?php
 include 'db_head.php';

 


 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

$sql = "select JSON_ARRAYAGG(JSON_OBJECT('oid', oid,'order_no', order_no)) as order_info,sum(required_qty) as total_required_qty,sales_order_info_view.* from sales_order_info_view WHERE 1 group by type_id,model_id,sub_type WHERE 1";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "not_login";
}
$conn->close();



 ?>


