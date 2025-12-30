<?php
 include 'db_head.php';





 $call_status_p =test_input($_GET['call_status_p']);
 $cus_id_p =test_input($_GET['cus_id_p']);
 $his_date_p =test_input($_GET['his_date_p']);
 $last_att_p =test_input($_GET['last_att_p']);
 $user_id_p =test_input($_GET['user_id_p']);
 $remark_p =test_input($_GET['remark_p']);


 echo  $call_status_p . " ". $cus_id_p. " ".$his_date_p . " " . $last_att_p . " " . $user_id_p;

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


echo $user_id_p . "<br>";



$sql_update = "CALL `update_mcall`($call_status_p,$his_date_p,$last_att_p,$user_id_p,$cus_id_p);";
$sql_insert_ch = "CALL `insert_call_history`($cus_id_p, $remark_p,$last_att_p);";




  if ( $conn->query($sql_update) === TRUE) {
    echo "New record Updated successfully";
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }


  if ( $conn->query($sql_insert_ch) === TRUE) {
    echo "New record Updated successfully";
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
 
 



$conn->close();

 ?>


