 <?php
 include 'db_head.php';


$material_qty = test_input($_POST['material_qty']);
 $created_by = test_input($_POST['created_by']);

$nesting_name = test_input($_POST['nesting_name']);
$material_id = test_input($_POST['material_id']);
$nesting_type = test_input($_POST['nesting_type']);
$std_length = test_input($_POST['std_length']);
$run_time = test_input($_POST['run_time']);


$laser_parts = json_decode($_POST['laser_parts'], true);

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


// get nesting id from nesting_master table if exists else insert new record in nesting_master table and get id
$nesting_id = 0;
$sql_check_nesting = "SELECT nes_master_id FROM nesting_master WHERE nesting_name = $nesting_name";
 $result_check_nesting = $conn->query($sql_check_nesting);
if ($result_check_nesting->num_rows > 0) {
    $row = $result_check_nesting->fetch_assoc();
    $nesting_id = $row['nes_master_id'];
} 

 

// if no nesting id found then insert new record in nesting_master table and get id
if($nesting_id == 0) {



 $sql_insert_master = "INSERT INTO nesting_master ( created_by,path,nesting_name,material_id,nesting_type,std_length,run_time) VALUES ($created_by,'',$nesting_name,$material_id,$nesting_type,$std_length,$run_time)";

  if ($conn->query($sql_insert_master) === TRUE) {
// get inserted id 
$nesting_id  = $conn->insert_id;
  } else {
    throw new Exception("Error: " . $sql_insert_master . "<br>" . $conn->error);  
  }
// insert parts
foreach ($laser_parts as $parts) {
      $part_id = $parts['part_id'];
      $qty = $parts['qty'];

      $sql_insert_parts = "INSERT INTO nesting_parts (nesting_id, part_id, qty) VALUES ($nesting_id, $part_id, $qty)";
     
      if ($conn->query($sql_insert_parts) === TRUE) {
      } else {
        throw new Exception("Error: " . $sql_insert_parts . "<br>" . $conn->error);
      }

}

  // insert attachment  

  // allow only pdf


  if($_FILES['file']['name'] != ''){
  
//   echo $_FILES['file']['demo'];
        $FileType = strtolower(pathinfo($_FILES['file']['name'],PATHINFO_EXTENSION));
        if($FileType != "pdf" && $FileType != "jpg" && $FileType != "jpeg" && $FileType != "png" && $FileType != "gif" && $FileType != "bmp" && $FileType != "mp4" && $FileType != "mov" && $FileType != "wmv" && $FileType != "avi" && $FileType != "mkv" && $FileType != "webm") {
            echo "Sorry, only PDF, JPG, JPEG, PNG, GIF, BMP, MP4, MOV, WMV, AVI, MKV & WEBM files are allowed.";
            $conn->close();
            exit;
        }

  
    $target_path = "../attachment/laser/nesting/";
   
    

     
    if (!file_exists($target_path)) {
        mkdir($target_path, 0755, true);
    }
$target_path = $target_path . "laser_" . $nesting_id . "." . $FileType;



        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
          
            // update path in db
            $sql_update_master = "UPDATE nesting_master SET path = 'attachment/laser/nesting/laser_" . $nesting_id . "." . $FileType . "' WHERE nes_master_id = $nesting_id";
  
  if ($conn->query($sql_update_master) === TRUE) {
   
  } else {
   throw new Exception("Error: " . $sql_update_master . "<br>" . $conn->error);
  }
        } else{
            echo "There was an error uploading the file, please try again!";
        }

        
}
}


 $sql = "INSERT INTO nesting_details ( created_by,material_qty,nesting_id) VALUES ($created_by,$material_qty,$nesting_id)";

  if ($conn->query($sql) === TRUE) {
  // get inserted id
  $last_id = $conn->insert_id;

} else {
  throw new Exception("Error: " . $sql . "<br>" . $conn->error);
  }


// remove '' from $nesting_name for file name
// $nesting_name = str_replace("'", "", $nesting_name);

// $file_name = $nesting_name . "_" . $last_id . ".pdf";

// // store directly in folder (not folder inside folder)
// $target_dir = __DIR__ . "/../nesting/";

// if (!is_dir($target_dir)) {
//     mkdir($target_dir, 0777, true);
// }

// $target_path = $target_dir . $file_name;

// if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
//     $response['upload-status'] = 'success';
//     $response['file_name'] = $file_name;
  
// } else {
//  throw new Exception("Error uploading file.");
// }
// $save_path = "nesting/" . $file_name;

// // update path in database
// $update_sql = "UPDATE nesting_details SET path ='$save_path' WHERE nesting_id=$last_id";
// if ($conn->query($update_sql) === TRUE) {
// $response['status'] = 'success';
    
// } else {
//     throw new Exception("Error updating record: " . $conn->error);
// }

$response['status'] = 'success';

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


