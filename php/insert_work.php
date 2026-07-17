
<?php
// error _reporting(E_ALL);

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_head.php';

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

$emp_id = test_input($_GET['emp_id'] ?? '');
$work_date = test_input($_GET['work_date'] ?? '');
$cus_id = test_input($_GET['cus_id'] ?? '');
$work_created_by = test_input($_GET['work_created_by'] ?? '');
$work_assign_status = test_input($_GET['work_assign_status'] ?? '');
$work_type = test_input($_GET['work_type'] ?? '');
$work_status = test_input($_GET['work_status'] ?? '');
$work_description = test_input($_GET['work_description'] ?? '');
$work_location = test_input($_GET['work_location'] ?? '');
$work_attachment = test_input($_GET['work_attachment'] ?? '');
$work_com_status = test_input($_GET['work_com_status'] ?? '');
$last_att = test_input($_GET['last_att'] ?? '');
$his_comment = test_input($_GET['his_comment'] ?? '');
$his_status = test_input($_GET['his_status'] ?? '');
$his_emp_id = test_input($_GET['his_emp_id'] ?? '');
$lead_source = test_input($_GET['lead_source'] ?? '');
$current_work_id = test_input($_GET['current_work_id'] ?? '');
try
{
  // begin transaction
  $conn->begin_transaction();
 

$sql = "INSERT INTO work (emp_id,work_date,cus_id,work_created_by,work_assign_status,work_type,work_status,work_description,work_location,work_attachment,work_com_status,last_att) VALUES ('$emp_id','$work_date','$cus_id','$work_created_by','$work_assign_status','$work_type','$work_status','$work_description','$work_location','$work_attachment','$work_com_status','$last_att')";

// $stmt = $conn->prepare("INSERT INTO work (emp_id,work_date,cus_id,work_created_by,work_assign_status,work_type,work_status,work_description,work_location,work_attachment,work_com_status,last_att) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
// $stmt->bind_param("ssssssssssss", $emp_id, $work_date, $cus_id, $work_created_by, $work_assign_status, $work_type, $work_status, $work_description, $work_location, $work_attachment, $work_com_status, $last_att);

if ($conn->query($sql) === TRUE) {


// if ($stmt->execute()) {
    
$last_id_work = $conn->insert_id;


if($lead_source != "")
{
  $sql_insert_lead = "INSERT INTO `lead` (`cus_id`,`work_id`,`lead_des`,`lead_source`,`dated`,`status`) VALUES ('$cus_id','$last_id_work','','$lead_source',UNIX_TIMESTAMP(CURRENT_TIMESTAMP())*1000,'assign')";
  // echo $sql_insert_lead;
  if ($conn->query($sql_insert_lead) === TRUE) {
  } else {
    throw new Exception("Lead insert failed: " . $conn->error);
  }
  // $stmt_lead = $conn->prepare("INSERT INTO lead (cus_id,work_id,lead_des,lead_source,dated,status) VALUES (?,?,'',?,UNIX_TIMESTAMP(CURRENT_TIMESTAMP())*1000,'assign')");
  // $stmt_lead->bind_param("sss", $cus_id, $last_id_work, $lead_source);
  
  // if (!$stmt_lead->execute()) {
  //   echo json_encode(['error' => 'Lead insert failed: ' . $stmt_lead->error]);
  // }
  // $stmt_lead->close();

  // update customer cus_lead_source

  $sql_update_cus = "UPDATE customer SET cus_lead_source = '$lead_source' WHERE cus_id = '$cus_id'";
  if ($conn->query($sql_update_cus) === TRUE) {
  } else {
    throw new Exception("Customer update failed: " . $conn->error);
  }

}
    if($current_work_id  == "")
    { 
      
      $sql_get_pipeline = "SELECT count(DISTINCT trim(pipeline_work) ) as d from   work_type_status inner join work_type on work_type_status.work_type_id = work_type.work_type_id  WHERE work_type.work_type_name = '$work_type' and  trim(coalesce(pipeline_work, '')) <>''";

      
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
           throw new Exception("Pipeline update failed: " . $conn->error);
         }
    }

    else{
      $sql_insert_pipeline= "UPDATE work SET pipeline_id = (SELECT pipeline_id FROM `work` WHERE work.work_id = $current_work_id) WHERE work.work_id = $last_id_work";
       
        
         if ($conn->query($sql_insert_pipeline) === TRUE) {
         } 
         else {
           throw new Exception("Pipeline update failed: " . $conn->error);
         }

    }

  

    $sql_insert_history= "INSERT INTO  work_history  ( work_id,his_date,comments,cus_id,emp_id,his_status)
    VALUES ($last_id_work ,'$last_att','$his_comment',$cus_id,$his_emp_id,'$his_status')";
     
      
       if ($conn->query($sql_insert_history) === TRUE) {
       } 
       else {
         throw new Exception("History insert failed: " . $conn->error);
       }

$conn->commit();
         echo json_encode(['success' => true, 'work_id' => $last_id_work]);   
       
  } else {
    throw new Exception("Work insert failed: " . $conn->error);
  }
  
}
catch (Exception $e) {
  // Rollback the transaction if any error occurs
  $conn->rollback();
  echo json_encode(['error' => $e->getMessage()]);
}
 



$conn->close();

 ?>





