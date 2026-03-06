
<?php
 include 'php/db_head.php';
 $file_name = $_POST['file_name'];
 $cus_id = $_POST['cus_id'];

 $sql ="SELECT max(cus_id) as insert_key FROM customer";
 $work_id = 0;
 $result = $conn->query($sql);
 
 if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
       $work_id = $row["insert_key"] ;
      }
     
 } 
 $work_id = $work_id +1;

if($_FILES['file']['name'] != ''){
  
//   echo $_FILES['file']['demo'];
    $dirname = $cus_id;
    $target_path = "attachment/policy/" . $dirname . "/" ;
    
    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path .  $file_name; 
        $FileType = strtolower(pathinfo($target_path,PATHINFO_EXTENSION));

        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo  "File Uploaded Successfully";
           
        } else{
            echo "There was an error uploading the file, please try again!";
        }

        
}

$conn->close();

 
?>
