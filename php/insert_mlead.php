
<?php
 include 'db_head.php';

 $cus_name = test_input($_GET['cus_name']);
 $company_name = test_input($_GET['company_name']);
 $address = test_input($_GET['address']);
 $phone = test_input($_GET['phone']);
 $description = test_input($_GET['description']);
 $dated = test_input($_GET['dated']);
 $emp_id = test_input($_GET['emp_id']);
 $attach_id = test_input($_GET['attach_id']);
 $latti = test_input($_GET['latti']);
 $longi = test_input($_GET['longi']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  marketing_lead (cus_name,phone,description,dated,emp_id,attach_id,latti,longi,company_name,address)
 VALUES ($cus_name,$phone,$description,$dated,$emp_id,$attach_id,$latti,$longi,$company_name,$address)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





