
<?php
 include 'db_head.php';

 $phone_id =test_input($_GET['phone_id']);
 $cur_time =test_input($_GET['cur_time']);
 $latti =test_input($_GET['latti']);
 $longi =test_input($_GET['longi']);
 $battery =test_input($_GET['battery']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  location (phone_id,cur_time,latti,longi,battery)
 VALUES ($phone_id,$cur_time,$latti,$longi,$battery)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





