
<?php
 include 'db_head.php';

 $shift = isset($_POST['shift']) ? test_input($_POST['shift']) : '';
 $laser_machine_id  = isset($_POST['laser_machine_id ']) ? test_input($_POST['laser_machine_id ']) : '';
 $assign_date = isset($_POST['assign_date']) ? test_input($_POST['assign_date']) : '';
 $job_card_id =  test_input($_POST['job_card_id']);

if($job_card_id == ''){
    echo "Job card ID is required";
    exit;
}
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
$update_query = array();
if($shift != ''){
    $update_query[] = "shift = '$shift'";
}

if($laser_machine_id != ''){
    $update_query[] = "laser_machine_id = '$laser_machine_id'";
}

if($assign_date != ''){
    $update_query[] = "assign_date = '$assign_date'";
}

if(empty($update_query)){
    echo "No fields to update";
    exit;
}

$sql = "UPDATE laser_job_card SET ".implode(", ", $update_query)." WHERE job_card_id = $job_card_id";
 
  if ($conn->query($sql) === TRUE) {
   
echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





