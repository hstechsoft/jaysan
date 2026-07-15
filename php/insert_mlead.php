
<?php
 include 'db_head.php';

 $cus_name = test_input($_POST['cus_name']);
 $company_name = test_input($_POST['company_name']);
 $address = test_input($_POST['address']);
 $phone = test_input($_POST['phone']);
 $description = test_input($_POST['description']);
 $dated = test_input($_POST['dated']);
//  $phone_id = test_input($_POST['phone_id']);
 $emp_id = test_input($_POST['emp_id']);
 $attach_id = test_input($_POST['attach_id']);
 $latti = test_input($_POST['latti']);
 $longi = test_input($_POST['longi']);
 
echo $emp_id;

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// // get emp_id from phone_id
// $sql = "SELECT emp_id FROM employee WHERE emp_phone_id = $phone_id";
// $result = $conn->query($sql);
// if ($result->num_rows > 0) {
//     $row = $result->fetch_assoc();
//     $emp_id = $row['emp_id'];
// } else {
//     echo "Error: Employee not found";
//     exit;
// }

// insert current timestamp in milliseconds
$dated = time() * 1000;
$sql = "INSERT  INTO  marketing_lead (cus_name,phone,description,dated,emp_id,attach_id,latti,longi,company_name,address)
 VALUES ($cus_name,$phone,$description,$dated,$emp_id,$attach_id,$latti,$longi,$company_name,$address)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





