<?php
 include 'db_head.php';




$sts = isset($_GET['sts']) ? ($_GET['sts']) : 'all';
$emp_id = isset($_GET['emp_id']) ? ($_GET['emp_id']) : 'all';
 $emp_query = 1;
  $sts_query = 1;
  
 if($emp_id != "all")
 {
 $emp_query = "employee.emp_id=".$emp_id ;
 }
  if($sts != "all")
 {
 $sts_query = "dcf.cn_sts='".$sts."'" ;
 }
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "with dcf_details as(SELECT  assign_product.opid,dcf.dcf_id,dcf.invoice_no,dcf.credit_note_no,dcf.credit_note_accept,dcf.credit_note_date,dcf.cn_sts FROM dcf inner JOIN assign_product on dcf.dcf_id = assign_product.dcf_id WHERE dcf.sts = 'delivery' and $sts_query),
sop_details as(SELECT dcf_details.*,sop.billing_amount,sum(sop.price)as total_dealer_amount,sum(billing_amount)as total_billing_amount,(SELECT sales_order_form.customer_id from sales_order_form WHERE sales_order_form.oid = sop.oid) as cus_id,(SELECT sales_order_form.emp_id from sales_order_form WHERE sales_order_form.oid = sop.oid) as emp_id from dcf_details INNER join sales_order_product sop on dcf_details.opid = sop.opid GROUP by dcf_id)

SELECT sop_details.*,customer.cus_name,customer.cus_phone,employee.emp_name, total_billing_amount-total_dealer_amount as cn_amount from sop_details inner join customer on sop_details.cus_id = customer.cus_id
 inner join employee on sop_details.emp_id = employee.emp_id where  $emp_query ";

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


