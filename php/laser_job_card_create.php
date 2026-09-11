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
// $nesting_id = 0;
// // get nes_master_id from nesting_master based on nesting_details_id
// $sql_nes_master = "SELECT nesting_id FROM nesting_details WHERE nesting_details_id = $nesting_details_id";
// $result_nes_master = $conn->query($sql_nes_master);
// if ($result_nes_master->num_rows > 0) {
//     $row_nes_master = mysqli_fetch_assoc($result_nes_master);
//     $nesting_id = $row_nes_master['nesting_id'];
// } else {
//     echo "Nesting master not found for the given nesting details ID.";
//     $conn->close();
//     exit;
// }

// get laser_machine_id from laser_machine table based on nesting_id 



$laser_machine_id = $machine_id;
// $sql_laser_machine = "SELECT laser_machine_id FROM laser_machine WHERE nes_master_id = $nesting_id";
// $result_laser_machine = $conn->query($sql_laser_machine);
// if ($result_laser_machine->num_rows > 0) {
//     $row_laser_machine = mysqli_fetch_assoc($result_laser_machine);
//     $laser_machine_id = $row_laser_machine['laser_machine_id'];
// } else {
//     echo "Laser machine not found for the given nesting ID.";
//     $conn->close();
//     exit;
// }
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
 $sql = "INSERT INTO laser_job_card ( machine_id,shift,assign_date,assigned_by,status,nesting_details_id,qty) VALUES ($  $laser_machine_id ,'$shift','$assign_date','$assigned_by','created',$nesting_details_id,1)";

  if ($conn->query($sql) === TRUE) {
  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

 echo "ok";
$conn->close();

 ?>


