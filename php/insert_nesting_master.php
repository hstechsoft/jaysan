<?php
 include 'db_head.php';

 $created_by = test_input($_POST['created_by']);

$nesting_name = test_input($_POST['nesting_name']);
$material_id = test_input($_POST['material_id']);
$nesting_type = test_input($_POST['nesting_type']);
$std_length = test_input($_POST['std_length']);
$run_time = test_input($_POST['run_time']);
$weight = test_input($_POST['weight']);
$scarp_weight = test_input($_POST['scarp_weight']);


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
 $sql_insert_master = "INSERT INTO nesting_master ( created_by,path,nesting_name,material_id,nesting_type,std_length,run_time,weight,scarp_weight) VALUES ($created_by,'',$nesting_name,$material_id,$nesting_type,$std_length,$run_time,$weight,$scarp_weight)";

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
      $out_weight = $parts['weight'];
 

      $sql_insert_parts = "INSERT INTO nesting_parts (nesting_id, part_id, qty, weight) VALUES ($nes_master_id, $part_id, $qty, $weight)";
     
      if ($conn->query($sql_insert_parts) === TRUE) {
      } else {
        throw new Exception("Error: " . $sql_insert_parts . "<br>" . $conn->error);
      }


      // create process_wel_tbl 
      // get process_id from process_wel_tbl where process_title = 'laser cutting' and output_part = $part_id
      $process_id = 0;
      $sql_get_process_id = "SELECT process_wel_tbl.process_id FROM process_wel_tbl 
      inner join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
      WHERE process_title = 'laser cutting' AND output_part = $part_id AND process_name = 'laser cutting'";
      $result_get_process_id = $conn->query($sql_get_process_id);
      if ($result_get_process_id->num_rows > 0) {
          $row = $result_get_process_id->fetch_assoc();
          $process_id = $row['process_id'];
      }

      if($process_id == 0){
        // get process_id from jaysan_process where process_title = 'laser cutting'
        $sql_get_process_id = "SELECT process_id FROM jaysan_process WHERE process_name = 'laser cutting'";
        $result_get_process_id = $conn->query($sql_get_process_id);
        if ($result_get_process_id->num_rows > 0) {
            $row = $result_get_process_id->fetch_assoc();
            $process = $row['process_id'];
        }

        // insert new record in process_wel_tbl with process_id, output_part = $part_id, process_name = 'laser cutting'
        $sql_insert_process_wel_tbl = "INSERT INTO process_wel_tbl (process, output_part, component_cat, process_title) VALUES ($process, $part_id, 'laser cutting', 'laser cutting')";
        if ($conn->query($sql_insert_process_wel_tbl) === TRUE) {
        $new_process_id = $conn->insert_id;
        } else {
          throw new Exception("Error: " . $sql_insert_process_wel_tbl . "<br>" . $conn->error);
        }


        

            $new_process_id_display =$new_process_id;
            include_once 'update_final_process_id.php';
            update_final_id($conn, $new_process_id);

        



        // insert input_wel_parts for new process id
        $insert_input_wel_parts_sql = "insert into input_wel_parts (process_id, input_part_id, qty) values ($new_process_id, $material_id,$out_weight);";
        if ($conn->query($insert_input_wel_parts_sql) !== TRUE) {
            throw new Exception("Error: " . $insert_input_wel_parts_sql . "<br>" . $conn->error);
        }
   
      }

}

  // insert attachment  

  // allow only pdf

// check if file is uploaded  if not then skip this step
echo 'file: ' . ($_FILES['file']['name'] ?? 'No file');
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
echo "ok";
}
catch(Exception $e)
{
   echo 'Message: ' .$e->getMessage();
  //  rollback transaction
  $conn->rollback();
}
$conn->close();

 ?>


