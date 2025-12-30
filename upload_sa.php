
<?php
 include 'php/db_head.php';
 
 $service_id = 0;
 $ref = $_POST['pid'];
if ($ref == "null")
{

    $sql ="SELECT max(service_id) as insert_key FROM service";
    $result = $conn->query($sql);
 $result_sts = array();
 if ($result->num_rows > 0) {
    $rows = array();
    while($row = $result->fetch_assoc()) {
       $service_id = $row["insert_key"] ;
       $rows[] = $row;
             }    
 } 
 $service_id = $service_id +1;
}
else{
    $service_id = $_POST['pid'];
    
}
 


 

 
 $result_sts['insert_key'] =  $service_id;
 print json_encode($result_sts);  

 $file_name = $_POST['file_name'];

if($_FILES['file']['name'] != ''){
  
  
    $dirname = $service_id;
    $target_path = "service/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path . $file_name; 
 
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            
        } else{
           
        }

        
}

$conn->close();

 
?>
