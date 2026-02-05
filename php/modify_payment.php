<?php





function modify_payment(mysqli $conn, int $oid, int $customer_id)
{
  

$emp_id = 0;
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
 echo "ok";
  $conn->close();
  exit();
}

// get customer and emp id
$sql_order_info = "select emp_id, customer_id from sales_order_form where oid = $oid "; 
$result_order_info = $conn->query($sql_order_info);
if ($result_order_info->num_rows > 0) {
  while($row = $result_order_info->fetch_assoc()) {
    $emp_id = $row['emp_id'];
    $customer_id = $row['customer_id'];
 
   
  }
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
    $advance_going_to_be_added = $remaining_advance;
    $total_advance_deposited = 0;
// get total advance deposited
  $sql_total_advance = "SELECT SUM(amount) as total_advance FROM sale_payment_advance WHERE payment_id = $payment_id and advance_ref_id is null";
  $result_total_advance = $conn->query($sql_total_advance);
 
  if ($result_total_advance->num_rows > 0) {
    while($row = $result_total_advance->fetch_assoc()) {
      $total_advance_deposited = $row['total_advance'];
     
    }
  }

  $res =  $amount - ($total_advance_deposited + $advance_going_to_be_added);
if($res > 0)
  {
// insert advance asusually
if($total_advance_deposited > 0)
  {
      $sql_update_advance = "UPDATE sale_payment_advance SET amount = amount + $remaining_advance, dated = NOW(), emp_id = $emp_id WHERE payment_id = $payment_id and advance_ref_id is null";

      if ($conn->query($sql_update_advance) === TRUE) {
          
      } else {
          echo "Error: " . $sql_update_advance . "<br>" . $conn->error;
      }
  }
  else
{
      $sql_insert_advance = "INSERT INTO sale_payment_advance (payment_id,amount,oid,cus_id,advance_ref_id,emp_id,dated) VALUES ($payment_id,$remaining_advance,$oid,$customer_id,null,$emp_id,NOW())";

      if ($conn->query($sql_insert_advance) === TRUE) {
          
      } else {
          echo "Error: " . $sql_insert_advance . "<br>" . $conn->error;
      }
  }
  }
  else
    {
      // update advance if there is already advance deposited and remaining amount is less than total advance deposited so need to re deposit into another payment entry

      // need to iterate all  payment entries except current
      
  $sql_all_payment_entries = "SELECT * FROM jaysan_payment WHERE oid = $oid ";
  $result_all_payment_entries = $conn->query($sql_all_payment_entries); 
  if ($result_all_payment_entries->num_rows > 0) {
    while($row = $result_all_payment_entries->fetch_assoc()) {
      $payment_id_other_entry = $row['payment_id'];
      $other_amount = $row['amount'];
// get advance deposited in other entry
      $sql_other_entry_advance = "SELECT SUM(amount) as total_advance FROM sale_payment_advance WHERE payment_id = $payment_id_other_entry and advance_ref_id is null and oid = $oid";
$result_other_entry_advance = $conn->query($sql_other_entry_advance);
$total_advance_deposited_other_entry = 0;

if ($result_other_entry_advance->num_rows > 0) {  
  while($row = $result_other_entry_advance->fetch_assoc()) {
    $total_advance_deposited_other_entry = $row['total_advance'];

  }
  }
$deposite_amount_to_other_entry =  ($other_amount - ($total_advance_deposited_other_entry + $advance_going_to_be_added))> 0 ? $advance_going_to_be_added : $other_amount - $total_advance_deposited_other_entry;

if($deposite_amount_to_other_entry > 0)
  {
    // insert advance
$advance_going_to_be_added = $advance_going_to_be_added - $deposite_amount_to_other_entry;
if($total_advance_deposited_other_entry > 0)
  {
    // update advance
    $sql_update_advance = "UPDATE sale_payment_advance SET amount = amount + $deposite_amount_to_other_entry, dated = NOW(), emp_id = $emp_id WHERE payment_id = $payment_id_other_entry and advance_ref_id is null and oid = $oid";
    
      if ($conn->query($sql_update_advance) === TRUE) {
          
      } else {
          echo "Error: " . $sql_update_advance . "<br>" . $conn->error;
      }

  }
  else
    {
      // insert advance
      $sql_insert_advance = "INSERT INTO sale_payment_advance (payment_id,amount,oid,cus_id,advance_ref_id,emp_id,dated) VALUES ($payment_id_other_entry,$deposite_amount_to_other_entry,$oid,$customer_id,null,$emp_id,NOW())"; 
      if ($conn->query($sql_insert_advance) === TRUE) {
          
      } else {
          echo "Error: " . $sql_insert_advance . "<br>" . $conn->error;
    }
    }
  }

    }
    }
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
      $sql_update_advance = "UPDATE sale_payment_advance SET amount = amount -   $remaining_advance, dated = NOW(), emp_id = $emp_id WHERE advance_id = $advance_id";

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



}

 ?>


