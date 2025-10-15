<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);
 $payment_id = test_input($_GET['payment_id']);
$pay_date = test_input($_GET['pay_date']);
$pay_sts = test_input($_GET['pay_sts']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; 
$sql .= "UPDATE jaysan_payment SET payment_date = $pay_date,  jaysan_payment.sts = $pay_sts ,jaysan_payment.approved_by = $emp_id, jaysan_payment.approved_date = current_timestamp  WHERE jaysan_payment.payment_id = $payment_id AND jaysan_payment.payment_id = $payment_id";




if ($conn->multi_query($sql)) {
  // Process the first result set (e.g., time zone set)
  do {
      // Empty the result set
      if ($result = $conn->store_result()) {
          // Process results here if needed
          $result->free();
      }
  } while ($conn->next_result());
 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$aff_row = 0;
$oid = 0;
$order_no = 0;
$sql_last_pay = "UPDATE sales_order_form  SET first_payment_date = $pay_date WHERE 
    (
        (sales_order_form.first_payment_date > $pay_date 
        AND sales_order_form.first_payment_date != '0000-00-00 00:00:00') 
        OR sales_order_form.first_payment_date = '0000-00-00 00:00:00'
    ) 
    AND sales_order_form.oid = (SELECT oid FROM jaysan_payment WHERE payment_id = $payment_id LIMIT 1);";


  
if ($conn->query($sql_last_pay) === TRUE) {
  $aff_row = $conn->affected_rows;
echo "ok";
} else {
  echo "Error: " . $sql_last_pay . "<br>" . $conn->error;
}

// echo  'chage - '.$aff_row .PHP_EOL;


// if($aff_row > 0)
// {

//   $sql_get_oid = "SELECT jaysan_payment.oid from jaysan_payment WHERE jaysan_payment.payment_id = $payment_id";

      
//   $result = $conn->query($sql_get_oid);
  
//   if ($result->num_rows > 0) {
//     // output data of each row
//     while($row = $result->fetch_assoc()) {
//       $oid = $row["oid"];
//       echo 'change order id - '. $oid.PHP_EOL;
//     }
//   } else {
    
//   }


//   $sql_get_ono = "SELECT min(sales_order_form.order_no) as order_no FROM `sales_order_form` WHERE sales_order_form.first_payment_date > $pay_date and sales_order_form.approve_sts = 0 and ifnull(sales_order_form.order_no > (SELECT max(sales_order_form.order_no) from sales_order_form WHERE sales_order_form.approve_sts != 0),1) ";

      
//   $result = $conn->query($sql_get_ono);
  
//   if ($result->num_rows > 0) {
//     // output data of each row
//     while($row = $result->fetch_assoc()) {
//       echo "order no".$row["order_no"].PHP_EOL;
//       $order_no = $row["order_no"];
//     }
//   } else {
    
//   }
  
// //    $sql_update_ono = "update sales_order_form set sales_order_form.order_no = sales_order_form.order_no + 1 WHERE sales_order_form.first_payment_date > $pay_date  and sales_order_form.approve_sts = 0 and sales_order_form.order_no >  (SELECT max(sales_order_form.order_no) from sales_order_form WHERE sales_order_form.approve_sts != 0)";



// // if ($conn->query($sql_update_ono) === TRUE) {


// // } else {
// // echo "Error: " . $sql_update_ono . "<br>" . $conn->error;
// // }

// // $sql_update_sales_form = "update sales_order_form set sales_order_form.order_no = $order_no WHERE sales_order_form.oid = $oid ";



// // if ($conn->query($sql_update_sales_form) === TRUE) {


// // } else {
// // echo "Error: " . $sql_update_sales_form . "<br>" . $conn->error;
// // }

// }

// echo "ok";
$conn->close();

 ?>


