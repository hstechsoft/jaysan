
<?php
 include 'php/db_head.php';
 $did = $_POST['did'];
 $chasis_no = $_POST['chasis_no'];
 $file_name = $_POST['file_name'];
  $file_extension = $_POST['file_extension'];
if($_FILES['file']['name'] != ''){
  
  
    $dirname = $did;
    $target_path = "attachment/service/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path . $file_name."_".date('dmY_Hi').$file_extension; 
 
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo $target_path;
           
        } else{
           
        }

        
}

$conn->close();

 
?>
