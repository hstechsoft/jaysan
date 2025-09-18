<?php
 include 'db_head.php';





 $file_location =($_GET['file_location']);
 $sel_user =test_input($_GET['sel_user']);
 $sel_user_name =test_input($_GET['sel_user_name']);
 $cur_time =test_input($_GET['cur_time']);
 $work_type =test_input($_GET['work_type']);

 date_default_timezone_set('Asia/Kolkata');


 




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$csv = array();
$col_count = 0;
$col_upload_count = 0;
$upload_error_name = "Following Contact not uploaded (excel coloumn no included)"."\n";
$lines = file( $file_location, FILE_IGNORE_NEW_LINES);

$count= 0;
foreach ($lines as $key => $value)
{
  
  $count= $count+1;
  $col_count = $col_count +1;
if($count>1){
    $csv[$key] = str_getcsv($value);
  
    foreach ($csv[$key] as $key1 => $value1)
    {
     

      $csv1[$key1] = ($value1);
    }
    
    //echo $value."<br>";

// //insert start
// $dstring =  $csv1[1]. " 00:00:00";
// // echo  $dstring . '<br>';
//  $milliseconds = (strtotime( $csv1[1])*1000)  ;



if( $csv1[0] == "")
{
  $milliseconds = (strtotime('now')*1000 ) ;
}
else
{
  $milliseconds = (strtotime( $csv1[0])*1000)  ;
}


echo  $milliseconds;



$cus_name  = "'".$csv1[1]."'";
$cus_address = "'".$csv1[4]."'";
$cus_company_name = "'".$csv1[2]."'";
$cus_email = "'".$csv1[5]."'";
$cus_address = "'".$csv1[4]."'";
$cus_lead_source = "'".$csv1[6]."'";
$cus_location = "'".$csv1[7]."'";
$cus_phone = "'".$csv1[3]."'";
$cus_type = "'".$csv1[9]."'";
$cus_need = "'".$csv1[10]."'";
$cus_gst = "'".$csv1[11]."'";
$status_p = $csv1[8];

echo $cus_name;


//echo $csv1[1];
 




//  $sql_insert_customer = "CALL `insert_customer`( $lead_source_p,$lead_att_by_p,$cus_name_p,$company_name_p,$cus_phone_p,$location_p,$segment_p ,$followed_by_p,$ss_assigned_to_p ,$appoinment_date_p1,$status_p,$lead_att_on_p1);";
 

//  if ($conn->query($sql_insert_customer) === TRUE) {
//     $last_id = $conn->insert_id;

//     echo "New record created successfully. Last inserted ID is: " . $last_id . "<br";
//       } 
//        else {
//         echo "Error: " . $sql_insert_customer . "<br>" . $conn->error;
//       }
    
    
      
     



     $sql = "INSERT IGNORE INTO customer (cus_name,cus_address,cus_lead_source,cus_location,cus_phone,cus_company_name,cus_email,cus_need,cus_type,cus_gst)
     VALUES ($cus_name,$cus_address,$cus_lead_source,$cus_location,$cus_phone,$cus_company_name,$cus_email,$cus_need,$cus_type,$cus_gst)";
      
    
     
     if ($conn->query($sql) === TRUE) {
       $last_id = $conn->insert_id;
      
       $emp_id = $sel_user;
       $work_date =$milliseconds;
       $cus_id = $last_id;
       $work_created_by = $sel_user;
       $work_assign_status ='accept';
     
       $work_status = $status_p;
       $work_description ='marketing call';
       $work_location ='';
       $work_attachment ='';
       $work_com_status ='incomplete';
   
    
       if( $last_id > 0)
       {
        
        $col_upload_count = $col_upload_count +1;

        
         
        $sql_work  = "INSERT INTO work (emp_id,work_date,cus_id,work_created_by,work_assign_status,work_type,work_status,work_description,work_location,work_attachment,work_com_status,last_att)
VALUES ($emp_id,'$work_date','$cus_id',$work_created_by,'$work_assign_status',$work_type,'create','$work_description','$work_location','$work_attachment','$work_com_status',$cur_time)";

        if ($conn->query($sql_work) === TRUE) {
            $last_id_work = $conn->insert_id;

            if($cus_lead_source <> "")
{
  $sql_insert_lead= "INSERT INTO  lead  (cus_id,work_id,lead_des,lead_source,dated,status)
  VALUES ($cus_id,$last_id_work,'',$cus_lead_source,UNIX_TIMESTAMP(CURRENT_TIMESTAMP())*1000,'assign')";
   
    
     if ($conn->query($sql_insert_lead) === TRUE) {
     } 
     else {
       echo "Error: " . $sql_insert_lead . "<br>" . $conn->error;
     }

}


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
        else {
            echo "Error: " .$sql_work . "<br>" . $conn->error;
          }
        
      
    
    
    
         $uc =  strval($sel_user_name) ;
       
    $his_s = 'uploaded by excel - ' . $work_status;
         $sql_insert_history= "INSERT INTO  work_history  ( work_id,his_date,comments,cus_id,his_status)
     VALUES ( $last_id_work ,$cur_time ,'$his_s' ,$last_id,'lead')";
      
       
        if ($conn->query($sql_insert_history) === TRUE) {
        } 
        else {
          echo "Error: " . $sql_insert_history . "<br>" . $conn->error;
        }
        
       
    
    
       }

       else{
  
        $upload_error_name =  $upload_error_name. $cus_name .'- '. ($col_count-1) . "\n";
        }
     }
      else {
       echo "Error: " . $sql . "<br>" . $conn->error;
     }


}


    }

    
echo "total column - ". ($col_count-1)."\n" ."Not  Uploaded - " .( $col_count - $col_upload_count-1)."\n\n";
 
  echo $upload_error_name;
$conn->close();

 ?>


