
<?php
 include 'php/db_head.php';
 
 $work_id = 0;
 $ref = $_POST['pid'];
if ($ref == "null")
{

    $sql ="SELECT max(pid) as insert_key FROM product";
    $result = $conn->query($sql);
 $result_sts = array();
 if ($result->num_rows > 0) {
    $rows = array();
    while($row = $result->fetch_assoc()) {
       $work_id = $row["insert_key"] ;
       $rows[] = $row;
             }    
 } 
 $work_id = $work_id +1;
}
else{
    $work_id = $_POST['pid'];
    
}
 


 

 


 $file_name = $_POST['file_name'];

if($_FILES['file']['name'] != ''){
  
  
    $dirname = $work_id;
    $target_path = "product/" . $dirname . "/" ;

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
