
<?php
 include 'db_head.php';

 $cus_id =test_input($_GET['cus_id']);
 $emp_id =test_input($_GET['emp_id']);
 $complaint_type =test_input($_GET['complaint_type']);
 $brand_name =test_input($_GET['brand_name']);
 $warranty =test_input($_GET['warranty']);
 $amc =test_input($_GET['amc']);
 $service_type =test_input($_GET['service_type']);
 $amount =test_input($_GET['amount']);
 $remark =test_input($_GET['remark']);
 $service_attachment =test_input($_GET['service_attachment']);
 $dated =test_input($_GET['cur_time']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  service (cus_id,emp_id,complaint_type,brand_name,warranty,amc,service_type,amount,remark,service_attachment,dated)
 VALUES ($cus_id,$emp_id,$complaint_type,$brand_name,$warranty,$amc,$service_type,$amount,$remark,$service_attachment,$dated)";
  
  if ($conn->query($sql) === TRUE) {
    $last_id_work = $conn->insert_id;
    echo $last_id_work;
  } else {
  
  }
  
 



$conn->close();

 ?>





