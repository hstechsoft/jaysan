<?php
 include 'db_head.php';

 $order_category = test_input($_GET['order_category']);
$product_id = test_input($_GET['product_id']);
$customer_id = test_input($_GET['customer_id']);
$customer_name = test_input($_GET['customer_name']);
$customer_phone = test_input($_GET['customer_phone']);
$pincode = test_input($_GET['pincode']);
$order_type = test_input($_GET['order_type']);
$oe_supply = test_input($_GET['oe_supply']);
$commitment_date = test_input($_GET['commitment_date']);
$nex_payment_date = test_input($_GET['nex_payment_date']);
$delivery_addr = test_input($_GET['delivery_addr']);
$required_qty = test_input($_GET['required_qty']);
$color_choice = test_input($_GET['color_choice']);
$color_choice_des = test_input($_GET['color_choice_des']);
$chasis_choice = test_input($_GET['chasis_choice']);
$chasis_choice_des = test_input($_GET['chasis_choice_des']);
$any_other_spec = test_input($_GET['any_other_spec']);
$loading_type = test_input($_GET['loading_type']);
$emp_id = test_input($_GET['emp_id']);
$total_payment = test_input($_GET['total_payment']);

$order_no = 0;
$production_untill = test_input($_GET['production_untill']);


$productDetails = ($_GET['productDetails']);
$paymentDetails = isset($_GET['paymentDetails']) ? $_GET['paymentDetails'] : 0;
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// insert customer if customer_id is 0
if($customer_id == "'0'"){
  $sql_insert_customer = "INSERT  INTO customer (cus_name,cus_phone ,cus_address) VALUES($customer_name,$customer_phone,$delivery_addr) ON DUPLICATE KEY UPDATE cus_id = LAST_INSERT_ID(cus_id)";
  if ($conn->query($sql_insert_customer) === TRUE) {
    $customer_id = $conn->insert_id;
  } else {
    echo "Error: " . $sql_insert_customer . "<br>" . $conn->error;
  }
}
// if order_category is 'Sales' or 'Requirement' then get the last order_no and increment it by 1
// else set order_no to 1
if($order_category == "'Sales'")
{

  $get_sales_order_no = "SELECT order_no FROM sales_order_form WHERE order_category = 'Sales' ORDER BY order_no DESC LIMIT 1";
  $result = $conn->query($get_sales_order_no);
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $order_no = $row["order_no"];
    }
  } else {
    $order_no = 0;
  }
  $order_no = $order_no + 1;
}
else if($order_category == "'Requirement'")
{
  $get_req_order_no = "SELECT order_no FROM sales_order_form WHERE order_category = 'Requirement' ORDER BY order_no DESC LIMIT 1";
  $result = $conn->query($get_req_order_no);
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $order_no = $row["order_no"];
    }
  } else {
    $order_no = 0;
  }
  $order_no = $order_no + 1;

}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO sales_order_form (order_category, product_id, customer_id, order_type, oe_supply, commitment_date, required_qty, color_choice, color_choice_des, chasis_choice, chasis_choice_des, any_other_spec, loading_type, emp_id, pincode, delivery_addr, order_no, total_payment, production_untill,nex_payment_date) 
         VALUES ($order_category, $product_id, $customer_id, $order_type, $oe_supply, $commitment_date, $required_qty, $color_choice, $color_choice_des, $chasis_choice, $chasis_choice_des, $any_other_spec, $loading_type, $emp_id, $pincode, $delivery_addr, $order_no, $total_payment, $production_untill,$nex_payment_date)";

if ($conn->multi_query($sql)) {
    // Process the first result set (e.g., time zone set)
    do {
        // Empty the result set
        if ($result = $conn->store_result()) {
            // Process results here if needed
            $result->free();
        }
    } while ($conn->next_result());

    // Now insert the payment data
    $oid = $conn->insert_id;  // Get the ID of the inserted sales order
//  insert payment details 
if($paymentDetails != 0)
    foreach ($paymentDetails as $payment)
    {
      $ref_no = $payment['ref_no'];
      $amount = $payment['amount'];
      $payment_date = $payment['payment_date'];
    

  
      $sql_insert_payment = "INSERT INTO jaysan_payment ( amount, payment_date, oid, ref_no, sts) VALUES ( '$amount','$payment_date','$oid', '$ref_no', 'not_approve');";

      if ($conn->query($sql_insert_payment) === TRUE) {
          
      } else {
          echo "Error: " . $sql_insert_payment . "<br>" . $conn->error;
      }
    }

    foreach ($productDetails as $product)
    {
      $type = $product['type'];
      $model = $product['model'];
      $subtype = $product['subtype'];
      $qty = $product['qty']; 
      $price = $product['price']; 
  
      $sql_insert_subtype = "INSERT INTO sales_order_product (oid, type_id, model_id, sub_type, required_qty,price) VALUES ( '$oid', '$type', '$model', '$subtype', '$qty','$price');";

      if ($conn->query($sql_insert_subtype) === TRUE) {
          
      } else {
          echo "Error: " . $sql_insert_subtype . "<br>" . $conn->error;
      }
    }
  //   foreach ($sub_type_id as $stid)
  //   {
  //     $sql_insert_subtype = "INSERT INTO  sales_order_subtype (msid, oid) VALUES('$stid', '$oid')";

  //   if ($conn->query($sql_insert_subtype) === TRUE) {
        
  //   } else {
  //       echo "Error: " . $sql_insert_subtype . "<br>" . $conn->error;
  //   }
  // }
  echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

 ?>


