
<?php
 include 'db_head.php';
 $candidate_name =test_input($_GET['candidate_name']);
 $candidate_phone =test_input($_GET['candidate_phone']);
 $qualification =test_input($_GET['qualification']);
 $experience =test_input($_GET['experience']);
 $address =test_input($_GET['address']);
 $email =test_input($_GET['email']);
 $tech_skills =test_input($_GET['tech_skills']);
 $exp_salary =test_input($_GET['exp_salary']);
 $cur_working_in =test_input($_GET['cur_working_in']);
 $aoi =test_input($_GET['aoi']);
 $gender  =test_input($_GET['gender']);
 



 
 

 $his_comment =test_input($_GET['his_comment']);
 $his_time =test_input($_GET['his_time']);
 $his_status =test_input($_GET['his_status']);
 $his_emp_id =test_input($_GET['his_emp_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "INSERT IGNORE INTO candidate(candidate_name,candidate_phone,qualification,experience,address,email,tech_skills,exp_salary,cur_working_in,aoi,gender)
VALUES ($candidate_name,$candidate_phone,$qualification,$experience,$address,$email,$tech_skills,$exp_salary,$cur_working_in,$aoi,$gender)";
 
  if ($conn->query($sql) === TRUE) {
   
    $last_id_work = $conn->insert_id;
    $sql_insert_history= "INSERT INTO  work_history  ( work_id,his_date,comments,cus_id,emp_id,his_status)
    VALUES (    '0' ,$his_time ,$his_comment ,$last_id_work,$his_emp_id,$his_status)";
     
      
       if ($conn->query($sql_insert_history) === TRUE) {
        echo $last_id_work;
       } 
       else {
         echo "Error: " . $sql . "<br>" . $conn->error;
       }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





