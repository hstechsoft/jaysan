<?php
 include 'db_head.php';





 $file_location =($_GET['file_location']);
 $sel_user =test_input($_GET['sel_user']);
 $sel_user_name =test_input($_GET['sel_user_name']);
 $cur_time =test_input($_GET['cur_time']);

 date_default_timezone_set('Asia/Kolkata');


 




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$csv = array();
$lines = file( $file_location, FILE_IGNORE_NEW_LINES);

foreach ($lines as $key => $value)
{

    $csv[$key] = str_getcsv($value);

  


   

    foreach ($csv[$key] as $key1 => $value1)
    {
     

      $csv1[$key1] = ($value1);
    }
    
  




if( $csv1[0] == "")
{
  $milliseconds = (strtotime('now') ) ;
}
else
{
  $milliseconds = (strtotime( $csv1[0])*1000)  ;
}


echo  $milliseconds;






 $lead_att_on_p1 = "'". ($csv1[2])."'" ;
 $lead_source_p =  "'".$csv1[3]."'";
 $lead_att_by_p = "'".$csv1[4]."'";
 $cus_name_p =  "'".$csv1[5]."'";
 $company_name_p   =  "'". $csv1[6]."'";
 $cus_phone_p =  "'".$csv1[7]."'";
 $location_p = "'". $csv1[8]."'";
 $segment_p = "'". $csv1[9]."'";
 $followed_by_p  =  "'".$csv1[10]."'";
 $ss_assigned_to_p =  "'".$csv1[11]."'";
 $appoinment_date_p1 =  "'".($csv1[1])."'" ;
 $status_p =  "'". $csv1[12]."'";
 $gst =  "'". $csv1[13]."'";

    
      
 $sql = "INSERT ignore INTO customer (cus_name,cus_address,cus_lead_source,cus_location,cus_phone,cus_company_name,cus_email,cus_type,cus_need,cus_gst)
 VALUES ($cus_name,$cus_address,$cus_lead_source,$cus_location,$cus_phone,$cus_company_name,$cus_email,$cus_type,$cus_need,$cus_gst)";
     




//  $sql = "INSERT IGNORE INTO customer ( `cus_lead_source`, `cus_lead_by`, `cus_name`,  `cus_phone`,`cus_address`, `cus_segment`, `cus_location`, `cus_id`, cus_lead_on)
//  VALUES ( $lead_source_p,$lead_att_by_p,$cus_name_p,$cus_phone_p,$location_p,$segment_p ,$ss_assigned_to_p , 0, $lead_att_on_p1)";
 
 if ($conn->query($sql) === TRUE) {
   $last_id = $conn->insert_id;
  
 }
  else {
   echo "Error: " . $sql . "<br>" . $conn->error;
 }






    }


$conn->close();

 ?>


