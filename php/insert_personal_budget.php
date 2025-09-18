
<?php
 include 'db_head.php';



 $dated =test_input($_GET['dated']);
 $phone1 =test_input($_GET['phone1']);
 $phone2 =test_input($_GET['phone2']);
 $email = test_input($_GET['email']);
 $status = test_input($_GET['status']);
 $cus_name = test_input($_GET['cus_name']);
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO personal_budget (phone1,phone2,dated,email,status,cus_name)
 VALUES ($phone1,$phone2,$dated,$email,$status,$cus_name)";
  
  if ($conn->query($sql) === TRUE) {
    $last_id_work = $conn->insert_id;
echo $last_id_work;
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





