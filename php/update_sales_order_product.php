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
    $title = "Product Updated";
    // Notification body for FCM add emp,customer,order no dated
    $body = "A product has been updated in order number $order_no by $emp_name for customer $cus_name on $dated.";
    $url = "https://jaysan.cloud/sales_order_report.html";





// delete sales_order_subtype record
$sql_delete_subtype = "DELETE FROM sales_order_subtype WHERE opid =  $opid";
if($conn->query($sql_delete_subtype) === TRUE){
  // echo "subtype deleted";
} else {
  echo "Error deleting subtype record: " . $conn->error;
  exit();
}


$sql =  "UPDATE  sales_order_product SET oid =  $oid,type_id =  $type_id,model_id =  $model_id,sub_type =  $sub_type,required_qty =  $required_qty,price =  $price,billing_amount =  $billing_amount WHERE opid =  $opid";

if ($conn->query($sql) === TRUE) {

 send_fcm($admin_firebase_uids, $title, $body, $url);
  $last_opid = $opid;
  foreach ($subtype_details as $subtype_id) {
    $sql_insert_subtype_details = "INSERT INTO sales_order_subtype (opid, msid) VALUES ($last_opid, '$subtype_id');";
   
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
$conn->close();
