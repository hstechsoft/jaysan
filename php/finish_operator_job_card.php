<?php
 include 'db_head.php';
$job_card_id = test_input($_POST['job_card_id']);
$opertor_id = test_input($_POST['operator_id']);
$scarp_weight = test_input($_POST['scarp_weight']);
$scarp_qty = test_input($_POST['scarp_qty']);
$remark = test_input($_POST['remark']);

$produced_parts = json_decode($_POST['produced_parts'], true);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

try{
    $conn->begin_transaction();

// insert laser_produced_parts 
foreach ($produced_parts as $part) {
    $part_id = $part['part_id'];
    $quantity = $part['quantity'];
    $scarp_qty = $part['scarp_qty'];
  
    $produced_qty = $quantity - $scarp_qty;

    $sql = "INSERT INTO laser_produced_parts (job_card_id, part_id, produced_qty, scarp_qty) VALUES ('$job_card_id', '$part_id', '$produced_qty', '$scarp_qty')";
    if ($conn->query($sql) === TRUE) {
        
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
}

// updated job_card table
$sql = "UPDATE  laser_job_card SET operator_id='$opertor_id', status='finished', scarp_weight='$scarp_weight', scarp_qty='$scarp_qty', remark='$remark' WHERE job_card_id='$job_card_id'";
if ($conn->query($sql) === TRUE) {
    echo "Job card updated successfully";
} else {
    throw new Exception("Error updating job card: " . $conn->error);
}
$conn->commit();
}catch(Exception $e){
    $conn->rollback();
    echo "Error: " . $e->getMessage();
}

$conn->close();

 ?>


