<?php





function modify_payment(mysqli $conn, int $oid, int $customer_id)
{
  


$credit = 0;
$debit = 0;
// get full info
$sql_full_info = "select * from sale_order_payment_full where oid = $oid ";

$result_full_info = $conn->query($sql_full_info);
if ($result_full_info->num_rows > 0) {
  while($row = $result_full_info->fetch_assoc()) {
    $debit = $row['debit'];
    $credit = $row['credit'];
 
   
  }
}

if($debit >= $credit)
{
 
  $conn->close();
  exit();
}
$remaining_debit = $debit;
//get received amount
$sql_amount_received = "select * from  jaysan_payment where oid = $oid ";
$result_amount_received = $conn->query($sql_amount_received);
$total_received = 0;
if ($result_amount_received->num_rows > 0) {
  while($row = $result_amount_received->fetch_assoc()) {
   $payment_id = $row['payment_id'];
   $amount = $row['amount'];


    $remaining_advance = $row['amount'] - $remaining_debit;
    if($remaining_advance > 0)
  {
    // insert advance
      $sql_insert_advance = "INSERT INTO sale_payment_advance (payment_id,amount,oid,cus_id,advance_ref_id) VALUES ($payment_id,$remaining_advance,$oid,$customer_id,null)";

      if ($conn->query($sql_insert_advance) === TRUE) {
          
      } else {
          echo "Error: " . $sql_insert_advance . "<br>" . $conn->error;
      }

  }

  $remaining_debit = $row['amount'] >= $remaining_debit ? 0 : $remaining_debit - $row['amount'];
  }
}
$sale_advance_array = array();
// get advance payment used
$sql_advance_used = "select * from sale_payment_advance where oid = $oid and advance_ref_id is not null ";
$result_advance_used = $conn->query($sql_advance_used);
if ($result_advance_used->num_rows > 0) {
  while($row = $result_advance_used->fetch_assoc()) {
    $amount = $row['amount'];
    $advance_ref_id = $row['advance_ref_id'];
    $advance_id = $row['advance_id'];
    $sale_advance_array[] = array( 'amount' => $amount, 'advance_ref_id' => $advance_ref_id, 'advance_id' => $advance_id );
 
   
  
  }
}

foreach($sale_advance_array as $advance_payment)
{
  $amount = $advance_payment['amount'];
  $advance_ref_id = $advance_payment['advance_ref_id'];
  $advance_id = $advance_payment['advance_id'];
  $remaining_advance = $amount - $remaining_debit;
    if($remaining_advance > 0)
  {
//   update advance if any remaining else delete it
if($amount - $remaining_advance > 0)
{
      $sql_update_advance = "UPDATE sale_payment_advance SET amount = amount -   $remaining_advance WHERE advance_id = $advance_id";

      if ($conn->query($sql_update_advance) === TRUE) {
          
      } else {
          echo "Error: " . $sql_update_advance . "<br>" . $conn->error;
      }

  }
  else
  {
    // delete advance
      $sql_delete_advance = "DELETE FROM sale_payment_advance WHERE advance_id = $advance_id ";

      if ($conn->query($sql_delete_advance) === TRUE) {
          
      } else {
          echo "Error: " . $sql_delete_advance . "<br>" . $conn->error;
      }

  }

  }

  $remaining_debit = $amount >= $remaining_debit ? 0 : $remaining_debit - $amount;

}

echo "done";

}

 ?>


