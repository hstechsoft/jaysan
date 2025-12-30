
<?php
 include 'php/db_head.php';
 $work_id = $_POST['work_id'];
 $file_name = $_POST['file_name'];
if($_FILES['file']['name'] != ''){
  
  
    $dirname = $work_id;
    $target_path = "attachment/work/site_visit/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path . $file_name; 
 
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo $target_path;
           
        } else{
           
        }

        
}

$conn->close();

 
?>
