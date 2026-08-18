<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_head.php';
$nes_master_id = $_POST['nes_master_id'];


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
            echo  "ok";
  
        } else{
            echo "There was an error uploading the file, please try again!";
        }

        
}
?>
