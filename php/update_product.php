
<?php
 include 'db_head.php';

 $pname =test_input($_GET['pname']);
 $pid =test_input($_GET['pid']);
 $des =test_input($_GET['des']);
 $price =test_input($_GET['price']);
 $qty =test_input($_GET['qty']);
 $hsn_code =test_input($_GET['hsn_code']);
 $tax_rate =test_input($_GET['tax_rate']);
 $image1 =test_input($_GET['image1']);
 $image2 =test_input($_GET['image2']);
 $image3 =test_input($_GET['image3']);
 $restamping =test_input($_GET['restamping']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "UPDATE product SET  pname = $pname,des = $des,price = $price,qty = $qty,hsn_code = $hsn_code,tax_rate = $tax_rate,image1 = $image1,image2 = $image2,image3 = $image3,restamping = $restamping WHERE pid= $pid";


  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





