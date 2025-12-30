
<?php
 include 'php/db_head.php';

 $sql ="SELECT max(work_id) as insert_key FROM work";
 $work_id = 0;
 $result = $conn->query($sql);
 
 if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
       $work_id = $row["insert_key"] ;
      }
     
 } 
 $work_id = $work_id +1;
 $sessionID = $_POST['work_id'];

 echo $sessionID;
if($_FILES['file']['name'] != ''){
  
  
    $dirname = $work_id;
    $target_path = "attachment/work/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path . basename( $_FILES['file']['name']); 
 
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo  "File Uploaded Successfully";
            $sql = "INSERT IGNORE INTO  work_attachment (work_id,attach_location) VALUES ('$work_id','$target_path')";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
        } else{
            echo "There was an error uploading the file, please try again!";
        }

        
}

$conn->close();

 
?>
