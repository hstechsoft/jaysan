<?php
 include 'db_head.php';

 $created_by = test_input($_POST['created_by']);

$nesting_name = test_input($_POST['nesting_name']);
$material_id = test_input($_POST['material_id']);
$material_qty = test_input($_POST['material_qty']);
$run_time = test_input($_POST['run_time']);
$product = test_input($_POST['product']);

$nesting_parts = json_decode($_POST['nesting_parts'], true);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$response = array();
try {
    $conn->begin_transaction();
// accept only pdf files


$target_path = null; // initialize target path variable
 



 $sql = "INSERT INTO nesting_details ( created_by,path,nesting_name,material_id,material_qty,run_time,product) VALUES ($created_by,'',$nesting_name,$material_id,$material_qty,$run_time,$product)";

  if ($conn->query($sql) === TRUE) {
  // get inserted id
  $last_id = $conn->insert_id;
  foreach($nesting_parts as $part) {
    $part_id = $part['part_id'];
    $quantity = $part['quantity'];
    $sql_part = "INSERT INTO nesting_parts (nesting_id, part_id, qty) VALUES ($last_id, $part_id, $quantity) on duplicate key update qty = qty + $quantity";
    if ($conn->query($sql_part) !== TRUE) {
        throw new Exception("Error inserting nesting part: " . $conn->error);
    }
  }
} else {
  throw new Exception("Error: " . $sql . "<br>" . $conn->error);
  }
// remove '' from $nesting_name for file name
$nesting_name = str_replace("'", "", $nesting_name);

$file_name = $nesting_name . "_" . $last_id . ".pdf";

// store directly in folder (not folder inside folder)
$target_dir = __DIR__ . "/../nesting/";

if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$target_path = $target_dir . $file_name;

if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
    $response['upload-status'] = 'success';
    $response['file_name'] = $file_name;
  
} else {
 throw new Exception("Error uploading file.");
}

// update path in database
$update_sql = "UPDATE nesting_details SET path ='$target_path' WHERE nesting_id=$last_id";
if ($conn->query($update_sql) === TRUE) {
$response['status'] = 'success';
    
} else {
    throw new Exception("Error updating record: " . $conn->error);
}

$conn->commit();
echo json_encode($response);
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
    $conn->rollback();
    echo json_encode($response);
}
$conn->close();

 ?>


