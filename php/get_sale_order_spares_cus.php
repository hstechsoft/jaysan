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


 $sql = "SELECT sale_order_spares.* from sales_order_form inner join sale_order_spares on sales_order_form.oid = sale_order_spares.oid and sale_order_spares.dcf_no is null WHERE customer_id = (SELECT customer_id from sales_order_form WHERE oid = (SELECT oid FROM sale_order_spares WHERE oid = $oid and dcf_no is NULL LIMIT 1))";

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


