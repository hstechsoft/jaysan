
<?php

 include 'db_head.php';
 $policy_hname = test_input($_GET['policy_hname']);
 $business_source = test_input($_GET['business_source']);
 $rm = test_input($_GET['rm']);
 $company_details = test_input($_GET['company_details']);
 $remarks = test_input($_GET['remarks']);
$department = test_input($_GET['department']);
$vehicle_no = test_input($_GET['vehicle_no']);
$make = test_input($_GET['make']);
$model = test_input($_GET['model']);
$mfy = test_input($_GET['mfy']);
$cc = test_input($_GET['cc']);
$engine_no = test_input($_GET['engine_no']);
$chassis_no = test_input($_GET['chassis_no']);
$policy_no = test_input($_GET['policy_no']);
$policy_type = test_input($_GET['policy_type']);
$sum_insured = test_input($_GET['sum_insured']);
$premium_without_gst = test_input($_GET['premium_without_gst']);
$policy_start_date = test_input($_GET['policy_start_date']);
$policy_expiry_date = test_input($_GET['policy_expiry_date']);
$cus_id = test_input($_GET['cus_id']);
$attachment = test_input($_GET['attachment']);
$insurance_type = test_input($_GET['insurance_type']);
$emp_name = test_input($_GET['emp_name']);
$dated = test_input($_GET['dated']);
 


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT INTO policy (policy_holder_name,business_source,rm,remarks,department,vehicle_no,make,model,mfy,cc,engine_no,chassis_no,policy_no,policy_type,sum_insured,premium_without_gst,policy_start_date,policy_expiry_date,cus_id,attachment,company_details,insurance_type,policy_cat,policy_exp,emp_id)
 VALUES ($policy_hname, $business_source,$rm,$remarks,$department,$vehicle_no,$make,$model,$mfy,$cc,$engine_no,$chassis_no,$policy_no,$policy_type,$sum_insured,$premium_without_gst,$policy_start_date,$policy_expiry_date,$cus_id,$attachment,$company_details,$insurance_type,'new','live',$emp_name)";
  
   if ($conn->query($sql) === TRUE) {
   
  //   $last_id_work = $conn->insert_id;
  //  $sql_insert_report = "INSERT INTO policy_report (cus_id, dated, emp_name, policy_id,status,policy_start_date) VALUES ($cus_id, $dated, $emp_name, $last_id_work,'new',$policy_start_date)";


  //  if ($conn->query($sql_insert_report) === TRUE) {
  // } 
  // else {
  //   echo "Error: " . $sql_insert_report . "<br>" . $conn->error;
  // }
   }
   else {
    echo "Error: " . $sql. "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





