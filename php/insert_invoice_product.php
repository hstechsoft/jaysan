
<?php
 include 'db_head.php';

 $qno =test_input($_GET['qno']);
 $des =test_input($_GET['des']);
 $hsn =test_input($_GET['hsn']);
 $gst =test_input($_GET['gst']);
 $price =test_input($_GET['price']);
 $qty =test_input($_GET['qty']);
 $total =test_input($_GET['total']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  invoice_product (ino,des,hsn,gst,price,qty,total)
 VALUES ($qno,$des,$hsn,$gst,$price,$qty,$total)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





