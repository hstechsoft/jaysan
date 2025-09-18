
<?php
 include 'db_head.php';

 $emp_id =test_input($_GET['emp_id']);
 $work_date =test_input($_GET['work_date']);
 $cus_id =test_input($_GET['cus_id']);
 $work_created_by =test_input($_GET['work_created_by']);
 $work_assign_status =test_input($_GET['work_assign_status']);
 $work_type =test_input($_GET['work_type']);
 $work_status =test_input($_GET['work_status']);
 $work_description =test_input($_GET['work_description']);
 $work_location =test_input($_GET['work_location']);
 $work_attachment =test_input($_GET['work_attachment']);
 $work_com_status =test_input($_GET['work_com_status']);
 $last_att =test_input($_GET['last_att']);
 $his_comment =test_input($_GET['his_comment']);
 $his_status =test_input($_GET['his_status']);
 $his_emp_id =test_input($_GET['his_emp_id']);
 $lead_source =test_input($_GET['lead_source']);
 $current_work_id = ($_GET['current_work_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "INSERT INTO work (emp_id,work_date,cus_id,work_created_by,work_assign_status,work_type,work_status,work_description,work_location,work_attachment,work_com_status,last_att)
 VALUES ($emp_id,$work_date,$cus_id,$work_created_by,$work_assign_status,$work_type,$work_status,$work_description,$work_location,$work_attachment,$work_com_status,$last_att)";
  
  if ($conn->query($sql) === TRUE) {
    
    $last_id_work = $conn->insert_id;
echo $last_id_work;
if($lead_source <> "''")
{
  $sql_insert_history= "INSERT INTO  lead  (cus_id,work_id,lead_des,lead_source,dated,status)
  VALUES ($cus_id,$last_id_work,'',$lead_source,UNIX_TIMESTAMP(CURRENT_TIMESTAMP())*1000,'assign')";
   
    
     if ($conn->query($sql_insert_history) === TRUE) {
     } 
     else {
       echo "Error: " . $sql_insert_history . "<br>" . $conn->error;
     }

}
    if($current_work_id  == "")
    { 
      
      $sql_get_pipeline = "SELECT count(DISTINCT trim(pipeline_work) ) as d from   work_type_status inner join work_type on work_type_status.work_type_id = work_type.work_type_id  WHERE work_type.work_type_name = $work_type and  trim(coalesce(pipeline_work, '')) <>''";

      
$result = $conn->query($sql_get_pipeline);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
   $pipeline_sts = $row["d"];
  }
} else {
  
}



if($pipeline_sts == 0)
$pipe_work_id = 0;
else
$pipe_work_id = $last_id_work;

      $sql_insert_pipeline= "UPDATE work SET pipeline_id = $last_id_work  WHERE work.work_id =  $pipe_work_id";
       
        
         if ($conn->query($sql_insert_pipeline) === TRUE) {
         } 
         else {
           echo "Error: " . $sql_insert_pipeline . "<br>" . $conn->error;
         }
    }

    else{
      $sql_insert_pipeline= "UPDATE work SET pipeline_id = (SELECT pipeline_id FROM `work` WHERE work.work_id = $current_work_id) WHERE work.work_id = $last_id_work";
       
        
         if ($conn->query($sql_insert_pipeline) === TRUE) {
         } 
         else {
           echo "Error: " . $sql_insert_pipeline . "<br>" . $conn->error;
         }

    }

  

    $sql_insert_history= "INSERT INTO  work_history  ( work_id,his_date,comments,cus_id,emp_id,his_status)
    VALUES ($last_id_work ,$last_att ,$his_comment ,$cus_id,$his_emp_id,$his_status)";
     
      
       if ($conn->query($sql_insert_history) === TRUE) {
       } 
       else {
         echo "Error: " . $sql_insert_history . "<br>" . $conn->error;
       }


           
       
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





