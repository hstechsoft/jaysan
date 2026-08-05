<?php
 include 'db_head.php';


 $emp_id =test_input($_GET['emp_id']);
 $paid_amount =test_input($_GET['paid_amount']);
 $paid_date =test_input($_GET['paid_date']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "INSERT INTO expense_payment (paid_amount,paid_date,emp_id)
 VALUES ($paid_amount,$paid_date,$emp_id)";


  if ( $conn->query($sql) === TRUE) {

  // get  firebase tokens from database
  $sql_get_tokens = "SELECT firebase_uid FROM employee WHERE emp_id = $emp_id";
  $result = $conn->query($sql_get_tokens);
  $firebase_uids = array();
  if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
          $firebase_uids[] = $row['firebase_uid'];
      }
  }
  // remove '' in paid_amount and paid_date
  $paid_amount = str_replace("'", "", $paid_amount);
  $paid_date = str_replace("'", "", $paid_date);

  // convert milliseconds to date format
$paid_date = date('d-m-Y H:i:s', $paid_date / 1000);
// 

    
 require __DIR__ . '/send_fcm.php';
    $title = "Advance Paid: $paid_amount";
    $body = "Your advance payment of $paid_amount has been processed on $paid_date. Please check your account for details.";
    $url = "https://jaysan.cloud/emp_expense_single.html";
  
  send_fcm($firebase_uids, $title, $body, $url);
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

$conn->close();

 ?>


