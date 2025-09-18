
<?php
 include 'db_head.php';

 $coupen_code = test_input($_GET['coupen_code']);
$validity = test_input($_GET['validity']);
$used_sts = test_input($_GET['used_sts']);
$discount = test_input($_GET['discount']);
$cus_id = test_input($_GET['cus_id']);
$coupen_type = test_input($_GET['coupen_type']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT IGNORE  INTO  coupen (coupen_code,validity,used_sts,discount,cus_id,coupen_type)
 VALUES ($coupen_code,$validity,$used_sts,$discount,$cus_id,$coupen_type)";
  
  if ($conn->query($sql) === TRUE) {
    $last_id = $conn->insert_id;

   if($last_id == 0)
   echo "Error: "  ."already added-not Valid";
   else
   echo "Added Successfully";
  } else {
    echo "Error: " .  "<br>" ."not Valid";
  }
  
 



$conn->close();

 ?>





