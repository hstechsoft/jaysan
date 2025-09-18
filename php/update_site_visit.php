
<?php
include 'db_head.php';

$work_id =test_input($_GET['work_id']);
$work_date =test_input($_GET['work_date']);
$work_status =test_input($_GET['work_status']);
$work_description =test_input($_GET['work_description']);
$work_location =test_input($_GET['work_location']);
$work_attachment =test_input($_GET['work_attachment']);
$work_com_status =test_input($_GET['work_com_status']);


 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = " update work set work_date ='$work_date' work_status ='$work_status' work_description ='$work_description' work_location ='$work_location' work_attachment ='$work_attachment' work_com_status ='$work_com_status' where work_id ='$work_id'";
 
if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

 




$conn->close();

?>





