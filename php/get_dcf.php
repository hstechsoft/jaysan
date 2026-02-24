<?php
 include 'db_head.php';

 $sts = test_input($_GET['sts']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT (SELECT sales_order_form.order_no from dcf as dcf1 
inner join assign_product on dcf1.dcf_id = assign_product.dcf_id 
inner join sales_order_product on assign_product.opid = sales_order_product.opid
inner join sales_order_form on sales_order_product.oid = sales_order_form.oid
WHERE dcf1.dcf_id = dcf.dcf_id limit 1)as order_no, dcf.dcf_id, dcf.dated, dcf.consignee, DATE_FORMAT(dcf.dated, '%d-%m-%Y') as dated, employee.emp_name FROM dcf INNER join employee on dcf.dcf_by = employee.emp_id WHERE dcf.sts = $sts  ORDER by dcf_by ";

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


