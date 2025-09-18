<?php
 include 'db_head.php';


 $oid = test_input($_GET['oid']);
$pay_date = test_input($_GET['pay_date']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; 
$sql .= "UPDATE sales_order_form SET nex_payment_date = $pay_date WHERE sales_order_form.oid = $oid";




if ($conn->multi_query($sql)) {
  // Process the first result set (e.g., time zone set)
  do {
      // Empty the result set
      if ($result = $conn->store_result()) {
          // Process results here if needed
          $result->free();
      }
  } while ($conn->next_result());
 echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}



$conn->close();

 ?>


