<?php
 include 'db_head.php';

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
$nes_master_id = 0;
try
{
 $sql_insert_master = "INSERT INTO nesting_master ( created_by,path,nesting_name,material_id,nesting_type,std_length,run_time) VALUES ($created_by,'',$nesting_name,$material_id,$nesting_type,$std_length,$run_time)";

  if ($conn->query($sql_insert_master) === TRUE) {
// get inserted id 
$nes_master_id  = $conn->insert_id;
  } else {
    throw new Exception("Error: " . $sql_insert_master . "<br>" . $conn->error);  
  }
// insert parts
foreach ($laser_parts as $parts) {
      $part_id = $parts['part_id'];
      $qty = $parts['qty'];

      $sql_insert_parts = "INSERT INTO nesting_parts (nesting_id, part_id, qty) VALUES ($nes_master_id, $part_id, $qty)";
     
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
$target_path = $target_path . "laser_" . $nes_master_id . "." . $FileType;



        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo  "File Uploaded Successfully";
            // update path in db
            $sql_update_master = "UPDATE nesting_master SET path = 'attachment/laser/nesting/laser_" . $nes_master_id . "." . $FileType . "' WHERE nes_master_id = $nes_master_id";
  
  if ($conn->query($sql_update_master) === TRUE) {
   
  } else {
   throw new Exception("Error: " . $sql_update_master . "<br>" . $conn->error);
  }
        } else{
            echo "There was an error uploading the file, please try again!";
        }

        
}

// commint transaction
$conn->commit();

}
catch(Exception $e)
{
   echo 'Message: ' .$e->getMessage();
  //  rollback transaction
  $conn->rollback();
}
$conn->close();

 ?>


