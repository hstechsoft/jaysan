<?php
 include 'db_head.php';

$sts = test_input($_GET['sts']);
$dcf_id = test_input($_GET['dcf_id']);
$invoice_no = test_input($_GET['invoice_no']);
$dated = test_input($_GET['dated']);
$products = ($_GET['products']);

// array structure 
// dcf details --> prodict --> distribution


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// commit
try
{
  $conn->begin_transaction();


  $dcf_accounting_id = 0;

$sql = "INSERT INTO dcf_accounting (sts, dcf_id, invoice_no, dated) VALUES ($sts, $dcf_id, $invoice_no, $dated)";
  if ($conn->query($sql) === TRUE) {
// get the last inserted id
  $dcf_accounting_id = $conn->insert_id;

  } else {
    throw new Exception("Error: " . $sql . "<br>" . $conn->error);  
  }


    foreach($products as $product) {
  //  get distribution array for the current product
  // insert distribution details for the current product into the database
  $insert_dcf_accounting_product = "INSERT INTO dcf_accounting_product (dcf_accounting_id, product_id,qty) VALUES ($dcf_accounting_id, ".$product['product_id'].", ".$product['qty'].")";
  $distribution = $product['distribution'];
  // get the last inserted id for the current product
  if ($conn->query($insert_dcf_accounting_product) !== TRUE) {
    throw new Exception("Error: " . $insert_dcf_accounting_product . "<br>" . $conn->error);
  }
  // get the last inserted id for the current product
  $dcf_accounting_product_id = $conn->insert_id;

  // insert distribution details for the current product
  foreach($distribution as $dist) {
    $insert_distribution = "INSERT INTO dcf_distribution (dcf_accounting_product_id, cus_id, amount,billing_amount,delivery_from) VALUES ($dcf_accounting_product_id, ".$dist['cus_id'].", ".$dist['amount'].", ".$dist['billing_amount'].", ".$dist['delivery_from'].")";
    if ($conn->query($insert_distribution) !== TRUE) {
      throw new Exception("Error: " . $insert_distribution . "<br>" . $conn->error);
    }
  }
}

echo "ok";

  $conn->commit();
  $conn->close();
}
catch(Exception $e)
{
  $conn->rollback();
  echo "Failed: " . $e->getMessage();
}

 ?>


