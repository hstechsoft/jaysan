
<?php
 include 'db_head.php';

 $reminder_days =test_input($_GET['reminder_days']);
 $reminder_name =test_input($_GET['reminder_name']);
 $reminder_before =test_input($_GET['reminder_before']);
 $repeat_sts =test_input($_GET['repeat_sts']);

  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 
$sql = "INSERT IGNORE  INTO  reminder_master (reminder_days,remind_name,remind_before,repeat_sts)
VALUES ($reminder_days,$reminder_name,$reminder_before,$repeat_sts)";


   if ($conn->query($sql) === TRUE) {
   } 
   else {
     echo "Error: " . $sql . "<br>" . $conn->error;
   }


$conn->close();

 ?>





