
<?php
 include 'php/db_head.php';
 

 $file_name = $_POST['file_name'];

if($_FILES['file']['name'] != ''){
  
  
    
    $target_path = "company/"  ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path . $file_name; 
 
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo   $target_path;
        } else{
           
        }

        
}

$conn->close();

 
?>
