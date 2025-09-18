
<?php
 include 'db_head.php';

 $eno =test_input($_GET['eno']);
 $des =test_input($_GET['des']);
 $hsn =test_input($_GET['hsn']);
 $gst =test_input($_GET['gst']);
 $price =test_input($_GET['price']);
 $qty =test_input($_GET['qty']);
 $total =test_input($_GET['total']);
 $img_addr1 =test_input($_GET['img_addr1']);
 $img_addr2 =test_input($_GET['img_addr2']);
 $img_addr3 =test_input($_GET['img_addr3']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  estimation_product (eno,des,hsn,gst,price,qty,total,image1_addr,image2_addr,image3_addr)
 VALUES ($eno,$des,$hsn,$gst,$price,$qty,$total,$img_addr1,$img_addr2,$img_addr3)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





