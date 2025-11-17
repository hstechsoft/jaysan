
<?php
 include 'db_head.php';

 $exp_des =test_input($_GET['exp_des']);
 $exp_cat =test_input($_GET['exp_cat']);
 $exp_amount =test_input($_GET['exp_amount']);
 $exp_date =test_input($_GET['exp_date']);
 $exp_emp_id =test_input($_GET['exp_emp_id']);
 $exp_work_id =test_input($_GET['exp_work_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  expense (exp_des,exp_cat,exp_amount,exp_date,exp_emp_id,exp_work_id)
 VALUES ($exp_des,$exp_cat,$exp_amount,UNIX_TIMESTAMP($exp_date) * 1000,$exp_emp_id,$exp_work_id)";
  
  if ($conn->query($sql) === TRUE) {

    $sql_insert_exp_cat= "INSERT IGNORE INTO exp_cat (exp_cat ) VALUES ( $exp_cat)";
   
    
     if ($conn->query($sql_insert_exp_cat) === TRUE) {
     } 
     else {
       echo "Error: " . $sql_insert_exp_cat . "<br>" . $conn->error;
     }

   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





