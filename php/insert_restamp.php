
<?php
 include 'db_head.php';

 $cus_id =test_input($_GET['cus_id']);
 $emp_id =test_input($_GET['emp_id']);
 $machine_type =test_input($_GET['machine_type']);
 $platform_size =test_input($_GET['platform_size']);
 $capcity =test_input($_GET['capcity']);
 $brand_name =test_input($_GET['brand_name']);
 $stamp_cer =test_input($_GET['stamp_cer']);
 $stamp_plate =test_input($_GET['stamp_plate']);
 $stamp_date =test_input($_GET['stamp_date']);
 $amount =test_input($_GET['amount']);
 $remark =test_input($_GET['remark']);
 $restamp_attachment =test_input($_GET['restamp_attachment']);
 $dated =test_input($_GET['cur_time']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  restamping (cus_id,emp_id,machine_type,platform_size,capcity,brand_name,stamp_cer,stamp_plate,stamp_date,amount,remark,restamp_attachment,dated)
 VALUES ($cus_id,$emp_id,$machine_type,$platform_size,$capcity,$brand_name,$stamp_cer,$stamp_plate,$stamp_date,$amount,$remark,$restamp_attachment,$dated)";
  
  if ($conn->query($sql) === TRUE) {
    $last_id_work = $conn->insert_id;
    echo $last_id_work;
  } else {
    
  }
  
 



$conn->close();

 ?>





