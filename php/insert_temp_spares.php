
<?php
 include 'db_head.php';

$customer_id = test_input($_POST['customer_id']);
$amount = test_input($_POST['amount']);
 
  if($amount <= 0){
    echo "Amount must be greater than zero.";
    $conn->close();
    exit;
  }
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


// check customer has dcf
   $last_dcf_id = 0;
    $last_order_id = 0;
$sql_last_dcf = "SELECT dcf.dcf_id,sof.oid FROM dcf 
inner join assign_product ap on dcf.dcf_id = ap.dcf_id
inner join sales_order_product sop on sop.opid = ap.opid
inner join sales_order_form sof on sof.oid = sop.oid WHERE sof.customer_id =  $customer_id order by dcf.dcf_id desc LIMIT 1";
$result_last_dcf = $conn->query($sql_last_dcf);
$last_dcf_id = 0;
if ($result_last_dcf->num_rows > 0) {
    $row = $result_last_dcf->fetch_assoc();
    $last_dcf_id = $row['dcf_id'];
    $last_order_id = $row['oid'];
} else {
    echo "No DCF found for the customer.";
     $conn->close();
    exit;
}





$sql_insert_spares = "nsert into sale_order_spares (qno, amount, oid, dcf_no,remark) values ('qno', $amount, '$last_order_id', '$last_dcf_id', 'inserted for customer $customer_id');";
  
  if ($conn->query($sql_insert_spares) === TRUE) {
    
    echo "ok";
  } else {
    echo "Error: " . $sql_insert_spares . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





