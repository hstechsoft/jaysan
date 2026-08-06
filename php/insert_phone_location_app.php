
<?php
 include 'db_head.php';



 $app_phone_id =test_input($_POST['phone_id']);


 $latitude =test_input($_POST['latitude']);
 $longitude =test_input($_POST['longitude']);
 $accuracy =test_input($_POST['accuracy']);
 $speed =test_input($_POST['speed']);
 $battery_level =test_input($_POST['battery_level']);
 $is_charging =test_input($_POST['is_charging']);
 $network_type =test_input($_POST['network_type']);
 $screen_on =test_input($_POST['screen_on']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
//  cur time in millis * 1000
$cur_time = round(microtime(true) * 1000);



$sql = "INSERT  INTO  location (phone_id,cur_time,latti,longi,accuracy,speed,battery,is_charging,network_type,screen_on)
 VALUES ($app_phone_id,$cur_time,$latitude,$longitude,$accuracy,$speed,$battery_level,$is_charging,$network_type,$screen_on)";
  
  if ($conn->query($sql) === TRUE) {

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





