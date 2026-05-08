<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
 include 'db_head.php';

 $amount = test_input($_POST['amount']);
$payment_date = test_input($_POST['payment_date']);
$oid = test_input($_POST['oid']);
$ref_no = test_input($_POST['ref_no']);
$utr_no = test_input($_POST['utr_no']);

$customer_id = test_input($_POST['customer_id']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


// get order number from id
$sql_get_order_no = "SELECT order_no FROM sales_order_form WHERE oid = $oid";
$result = $conn->query($sql_get_order_no);
$order_no = "";
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $order_no = $row["order_no"];
    }
}




    $sql_get_admin_firebase_uid = "SELECT firebase_uid FROM employee WHERE emp_role = 'admin'";
    $result = $conn->query($sql_get_admin_firebase_uid);
    $admin_firebase_uids = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $admin_firebase_uids[] = $row["firebase_uid"];
        }
    }

echo "Admin Firebase UIDs: " . implode(", ", $admin_firebase_uids) . "<br>";
 require __DIR__ . '/send_fcm.php';

    $title = "Payment Approval: $order_no";
    $body = "A payment of amount" .$amount. "has been made for order number". $order_no. " Utr No:" . $utr_no . " Please review and approve the payment.";
    $url = "https://jaysan.cloud/sales_payment_approval.html";
 send_fcm($admin_firebase_uids, $title, $body, $url);
 $sql = "INSERT INTO jaysan_payment ( amount, payment_date, oid, ref_no, sts,utr_no) VALUES ( $amount,$payment_date,$oid, $ref_no, 'not_approve',$utr_no)";

  if ($conn->query($sql) === TRUE) {
   $payment_id = $conn->insert_id;
   require __DIR__ . '/modify_payment.php';
        modify_payment($conn, (int)str_replace("'", "", $oid), (int)str_replace("'", "", $customer_id));
        
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }


 
echo "ok";

$conn->close();

 ?>


