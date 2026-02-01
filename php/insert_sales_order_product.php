<?php
 include 'db_head.php';

 $oid = test_input($_POST['oid']);
$type_id = test_input($_POST['type_id']);
$model_id = test_input($_POST['model_id']);
$sub_type = test_input($_POST['sub_type']);
$required_qty = test_input($_POST['required_qty']);
$price = test_input($_POST['price']);
$billing_amount = test_input($_POST['billing_amount']);
$opid = test_input($_POST['opid']);
$customer_id = test_input($_POST['customer_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO sales_order_product (oid,type_id,model_id,sub_type,required_qty,price,billing_amount) VALUES ($oid,$type_id,$model_id,$sub_type,$required_qty,$price,$billing_amount)";

  if ($conn->query($sql) === TRUE) {
        require __DIR__ . '/modify_payment.php';
        modify_payment($conn, $oid, $customer_id);
echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }


//   $sql_get_advance ="SELECT (SELECT sum(jaysan_payment.amount) from jaysan_payment WHERE jaysan_payment.oid = $oid) as payment_amount,
// (SELECT sum(sales_order_product.price) from sales_order_product WHERE sales_order_product.oid = $oid) as product_amount,
// (SELECT sum(sale_order_spares.amount) from sale_order_spares WHERE sale_order_spares.oid = $oid  ) as spares_amount";

//   $result_get_advance = $conn->query($sql_get_advance);
//   if ($result_get_advance->num_rows > 0) {
//     while($row = $result_get_advance->fetch_assoc()) {
//       $payment_amount = $row['payment_amount'];
//       $product_amount = $row['product_amount'];
//       $spares_amount = $row['spares_amount'];
//       $total_billing = $product_amount + $spares_amount;
//       $advance_payment = $payment_amount - $total_billing;
// // need to insert advance payment record beffore that need to check advance payment already exists with oid
//       if($advance_payment > 0){

//       $sql_check_advance = "SELECT * FROM sale_payment_advance WHERE sale_payment_advance.oid = $oid and sale_payment_advance.advance_ref_id is NULL";
//       $result_check_advance = $conn->query($sql_check_advance);
//       if ($result_check_advance->num_rows == 0) {

//         $sql_insert_advance = "INSERT INTO sale_payment_advance (oid,amount) VALUES ($oid,$advance_payment)";
//         if ($conn->query($sql_insert_advance) === TRUE) {
//           echo "ok";  
//         } else {
//           echo "Error: " . $sql_insert_advance . "<br>" . $conn->error;
//         } 

//       } else {
//         // there is advance payment so update if exisiting advance is less than current else delete old insert new
//         while($row_check = $result_check_advance->fetch_assoc()) {
//           $existing_advance = $row_check['amount'];
//         }
//         if($existing_advance < $advance_payment){
//           $sql_update_advance = "UPDATE sale_payment_advance SET amount = $advance_payment WHERE sale_payment_advance.oid = $oid";
//           if ($conn->query($sql_update_advance) === TRUE) {
//             echo "ok";  
//           } else {
//             echo "Error: " . $sql_update_advance . "<br>" . $conn->error;
//           }
//         } else {
//           $sql_delete_advance = "DELETE FROM sale_payment_advance WHERE sale_payment_advance.oid = $oid";
//           if ($conn->query($sql_delete_advance) === TRUE) {
//             // insert new
//             $sql_insert_advance = "INSERT INTO sale_payment_advance (oid,amount) VALUES ($oid,$advance_payment)";
//             if ($conn->query($sql_insert_advance) === TRUE) {
//               echo "ok";  
//             } else {
//               echo "Error: " . $sql_insert_advance . "<br>" . $conn ->error;
//             }
//       }

//     }
//   }
//   } else {
//     echo "0 results";
//   } 
$conn->close();

 ?>


