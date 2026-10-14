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

$subtype_details = isset($_POST['subtype_details']) ? $_POST['subtype_details'] : 0;
if($subtype_details == 0)
{
  echo "Please select at least one subtype.";
  exit();
}
else
{
  $subtype_details = explode(',', $subtype_details);
}



function test_input($data)
{
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}
// get uid for admin,marketing manager,production manager
  $sql_get_admin_firebase_uid = "SELECT firebase_uid FROM employee WHERE emp_role = 'admin' OR emp_role = 'marketing_head' OR emp_role = 'production head'";
    $result = $conn->query($sql_get_admin_firebase_uid);
    $admin_firebase_uids = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $admin_firebase_uids[] = $row["firebase_uid"];
        }
    }



// get order no employee customer details
$sql_order_details = "SELECT order_no, cus_name,date_time_only(dated) as dated,emp_name FROM sales_order_info_view WHERE oid = $oid";
$result_order_details = $conn->query($sql_order_details);
if ($result_order_details->num_rows > 0) {
    $row_order_details = $result_order_details->fetch_assoc();
   $order_no = $row_order_details['order_no'];
   $cus_name = $row_order_details['cus_name'];
   $dated = $row_order_details['dated'];
   $emp_name = $row_order_details['emp_name'];
} else {
    echo "Error: Order details not found for oid $oid";
    exit();
}

 require_once  __DIR__ . '/send_fcm.php';
    $title = "Product Added";
    // Notification body for FCM add emp,customer,order no dated
    $body = "A new product has been added to order number $order_no by $emp_name for customer $cus_name on $dated.";
    $url = "https://jaysan.cloud/sales_order_report.html";





$sql = "INSERT INTO sales_order_product (oid,type_id,model_id,sub_type,required_qty,price,billing_amount) VALUES ($oid,$type_id,$model_id,$sub_type,$required_qty,$price,$billing_amount)";

if ($conn->query($sql) === TRUE) {
// get the last inserted opid and insert into sales_order_subtype table
 send_fcm($admin_firebase_uids, $title, $body, $url);
  $last_opid = $conn->insert_id;
  foreach ($subtype_details as $subtype_id) {
    $sql_insert_subtype_details = "INSERT INTO sales_order_subtype (opid, msid) VALUES ('$last_opid', '$subtype_id');";
    if ($conn->query($sql_insert_subtype_details) === TRUE) {
        // Successfully inserted subtype details
    } else {
        echo "Error: " . $sql_insert_subtype_details . "<br>" . $conn->error;
    }
  }

  require_once __DIR__ . '/modify_payment.php';
  modify_payment($conn, (int)str_replace("'", "", $oid), (int)str_replace("'", "", $customer_id));

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
