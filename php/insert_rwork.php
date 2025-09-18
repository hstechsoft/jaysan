
<?php
 include 'db_head.php';

 $work_type =test_input($_GET['work_type']);
 $work_status =test_input($_GET['work_status']);
 $report_cat =test_input($_GET['report_cat']);
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "INSERT  INTO  report_master (work_type	,work_status,report_cat)
 VALUES ($work_type	,$work_status,$report_cat)";
 
  
   if ($conn->query($sql) === TRUE) {
   } 
   else {
     echo "Error: " . $sql . "<br>" . $conn->error;
   }


$conn->close();

 ?>





