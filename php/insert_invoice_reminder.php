
<?php
 include 'db_head.php';

 $description =test_input($_GET['description']);
 $remind_date =test_input($_GET['remind_date']);
 $repeat_sts =test_input($_GET['repeat_sts']);
 $cus_id =test_input($_GET['cus_id']);
 $ino =test_input($_GET['ino']);
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  reminder (description,remind_date,repeat_sts,cus_id,ino)
 VALUES ($description,$remind_date,$repeat_sts,$cus_id,$ino)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





