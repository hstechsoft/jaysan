<?php
 include 'db_head.php';

 
 $oid =test_input($_GET['oid']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
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
    $title = "Sales Order deleted";
    // Notification body for FCM add emp,customer,order no dated
    $body = "Sales order number $order_no has been deleted by $emp_name for customer $cus_name on $dated.";
    $url = "https://jaysan.cloud/sales_order_report.html";






$sql = "DELETE from sales_order_form WHERE oid = $oid" ;


log_delete_query($sql);

if ($conn->query($sql) === TRUE) {
  send_fcm($admin_firebase_uids, $title, $body, $url);
    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


