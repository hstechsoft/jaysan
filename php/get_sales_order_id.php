<?php
 include 'db_head.php';

 $order_category = test_input($_GET['order_category']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql =  "SELECT sales_order_form.order_no FROM sales_order_form WHERE sales_order_form.order_category =  $order_category  and approve_sts =0";

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


