<?php
 include 'db_head.php';

 $oid = test_input($_GET['oid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT concat(cus.cus_name,'\n',cus.cus_address) as cus_address,cus.cus_gst,cus.cus_phone FROM sales_order_form sof INNER join customer cus on sof.customer_id = cus.cus_id  WHERE sof.oid = $oid GROUP by sof.oid ";

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


