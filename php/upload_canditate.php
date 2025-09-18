<?php
 include 'db_head.php';





 $file_location =($_GET['file_location']);

 $his_comment =test_input($_GET['his_comment']);
 $his_time =test_input($_GET['his_time']);
 $his_status =test_input($_GET['his_status']);
 $his_emp_id =test_input($_GET['his_emp_id']);


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



$milliseconds = (strtotime( $csv1[0])*1000)  ;


$candidate_name = "'".$csv1[0]."'";
$candidate_phone = "'".$csv1[1]."'";
$qualification = "'".$csv1[2]."'";
$experience = "'".$csv1[3]."'";
$address = "'".$csv1[4]."'";
$email = "'".$csv1[5]."'";
$tech_skills = "'".$csv1[6]."'";
$exp_salary = "'".$csv1[7]."'";
$cur_working_in = "'".$csv1[8]."'";
$aoi = "'".$csv1[9]."'";
$gender = "'".$csv1[10]."'";


     $sql = "INSERT IGNORE INTO candidate(candidate_name,candidate_phone,qualification,experience,address,email,tech_skills,exp_salary,cur_working_in,aoi,gender)
     VALUES ($candidate_name,$candidate_phone,$qualification,$experience,$address,$email,$tech_skills,$exp_salary,$cur_working_in,$aoi,$gender)";
      
    
     
     if ($conn->query($sql) === TRUE) {
       $last_id = $conn->insert_id;
      
      
   
    
       if( $last_id > 0)
       {
        $col_upload_count = $col_upload_count +1;
        $sql_insert_history= "INSERT INTO  work_history  ( work_id,his_date,comments,cus_id,emp_id,his_status)
        VALUES (    '0' ,$his_time ,$his_comment ,$last_id,$his_emp_id,$his_status)";
         
          
           if ($conn->query($sql_insert_history) === TRUE) {
           
           } 
           else {
             echo "Error: " . $sql . "<br>" . $conn->error;
           }
       
           }

       else{
  
        $upload_error_name =  $upload_error_name. $candidate_name .'- '. ($col_count-1) . "\n";
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


