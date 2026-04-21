<?php
 include 'db_head.php';

$machine_id = test_input($_GET['machine_id']);
$shift = test_input($_GET['shift']);
$assign_date = test_input($_GET['assign_date']);
$assigned_by = test_input($_GET['assigned_by']);

$nesting_id = test_input($_GET['nesting_id']);
$qty = test_input($_GET['qty']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
// check qty available
$sql_check = "SELECT material_qty - COUNT(ifnull(laser_job_card.job_card_id,0)) as remaining_qty FROM nesting_details
left join laser_job_card on nesting_details.nesting_id = laser_job_card.nesting_id
where nesting_details.nesting_id = $nesting_id
group by nesting_details.nesting_id";
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
 $sql = "INSERT INTO laser_job_card ( machine_id,shift,assign_date,assigned_by,status,nesting_id) VALUES ($machine_id,'$shift','$assign_date','$assigned_by','created',$nesting_id)";

  if ($conn->query($sql) === TRUE) {
  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

 echo "ok";
$conn->close();

 ?>


