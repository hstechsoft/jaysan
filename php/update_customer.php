<?php
 include 'db_head.php';


 $cus_name =test_input($_GET['cus_name']);
 $cus_phone =test_input($_GET['cus_phone']);
 $cus_address =test_input($_GET['cus_address']);

 $cus_location =test_input($_GET['cus_location']);

 $cus_id =test_input($_GET['cus_id']);
 $cus_gst =test_input($_GET['cus_gst']);


 $cus_lead_source =test_input($_GET['cus_lead_source']);


 $cus_aphone =test_input($_GET['cus_aphone']);
 $cus_state =test_input($_GET['cus_state']);
 
 $cus_exp =test_input($_GET['cus_exp']);
 $cus_tmodel =test_input($_GET['cus_tmodel']);
 $cus_imp =test_input($_GET['cus_imp']);

 $cus_oproduct =test_input($_GET['cus_oproduct']);

 $cus_place =test_input($_GET['cus_place']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE customer SET cus_gst = $cus_gst, cus_name = $cus_name, cus_phone = $cus_phone , cus_address =$cus_address ,cus_location = $cus_location ,cus_aphone = $cus_aphone,cus_state = $cus_state,cus_exp = $cus_exp,cus_tmodel = $cus_tmodel,cus_imp = $cus_imp,cus_oproduct = $cus_oproduct,cus_place = $cus_place WHERE cus_id= $cus_id";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  

  

$conn->close();

 ?>


