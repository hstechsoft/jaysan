<?php
 include 'db_head.php';


 $work_id_p =test_input($_GET['work_id_p']);
 $last_att_p =test_input($_GET['last_att_p']);
 $work_date_p =test_input($_GET['work_date_p']);
 $work_com_status =test_input($_GET['work_com_status']);
 $work_assign_status =test_input($_GET['work_assign_status']);

 $his_comment =($_GET['his_comment']);
 $his_status =test_input($_GET['his_status']);
 $his_emp_id =test_input($_GET['his_emp_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE work SET  work_status = $his_status,work_assign_status = $work_assign_status,work_date = $work_date_p, work_com_status = $work_com_status,last_att =  $last_att_p WHERE work_id= $work_id_p";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  
$sqlhis = "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES ($work_id_p,$last_att_p,'$his_comment','', $his_emp_id , $his_status);";
 
  
  
   
    if ($conn->query($sqlhis) === TRUE) {
    } 
    else {
      echo "Error: " . $sqlhis . "<br>" . $conn->error;
    }


$conn->close();

 ?>


