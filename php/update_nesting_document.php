<?php
 include 'db_head.php';

$nesting_id = test_input($_POST['nesting_id']);
$nesting_name = test_input($_POST['nesting_name']);
 
 
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
$save_path = "nesting/" . $file_name;

// update path in database
$update_sql = "UPDATE nesting_details SET path ='$save_path', nesting_name = $nesting_name WHERE nesting_id=$nesting_id";
if ($conn->query($update_sql) === TRUE) {
$response['status'] = 'success';
    
} else {
    throw new Exception("Error updating record: " . $conn->error);
}

$conn->commit();
echo json_encode($response);

} catch (Exception $e) {
    $conn->rollback();
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
}
$conn->close();

 ?>


