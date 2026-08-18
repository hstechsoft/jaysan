<?php
 include 'db_head.php';

$machine_id = test_input($_POST['machine_id']);
$shift = test_input($_POST['shift']);
$assign_date = test_input($_POST['assign_date']);
$assigned_by = test_input($_POST['assigned_by']);

$nesting_details_id = test_input($_POST['nesting_details_id']);
$qty = test_input($_POST['qty']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
// check qty available
$sql_check = "SELECT material_qty - (COUNT(ifnull(laser_job_card.job_card_id,0)) - 1)as remaining_qty FROM nesting_details
left join laser_job_card on nesting_details.nesting_details_id = laser_job_card.nesting_details_id
where nesting_details.nesting_details_id = $nesting_details_id
group by nesting_details.nesting_details_id";
$result_check = $conn->query($sql_check);
if ($result_check->num_rows > 0) {
    $row = mysqli_fetch_assoc($result_check);
    if($row['remaining_qty'] < $qty) {
        echo "Not enough quantity available. Remaining quantity: " . $row['remaining_qty'];
        $conn->close();
        exit;
    }
} else {
  echo "0 result";
  $conn->close();
  exit;
}

if($qty <= 0) {
    echo "Quantity must be greater than zero.";
    $conn->close();
    exit;
}

for($i = 0; $i < $qty; $i++) {
 $sql = "INSERT INTO laser_job_card ( machine_id,shift,assign_date,assigned_by,status,nesting_details_id,qty) VALUES ($machine_id,'$shift','$assign_date','$assigned_by','created',$nesting_details_id,$qty)";

  if ($conn->query($sql) === TRUE) {
  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

 echo "ok";
$conn->close();

 ?>


