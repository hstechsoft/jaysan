
<?php
 include 'db_head.php';

 $work_type_name =test_input($_GET['work_type_name']);
 $work_status =test_input($_GET['work_status']);
 $status_type =test_input($_GET['status_type']);
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT IGNORE INTO work_type (work_type_name)
 VALUES ($work_type_name)";
  
  if ($conn->query($sql) === TRUE) {
    
    $last_id_work = $conn->insert_id;
    echo "inserted id - ". $last_id_work;
    if($last_id_work > 0 )
    {
    $sql_insert_history= "INSERT INTO  work_type_status(work_status,status_type,work_type_id)
    VALUES ($work_status ,$status_type,$last_id_work)";
     
      
       if ($conn->query($sql_insert_history) === TRUE) {
       } 
       else {
         echo "Error: " . $sql_insert_history . "<br>" . $conn->error;
       }
    }

else{
    $work_type_id = 0;

    $sql = "SELECT work_type_id FROM work_type  where work_type_name =  $work_type_name ";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    if($row = $result->fetch_assoc()) {
        $work_type_id=  $row["work_type_id"];
      }
  
}


$sql_insert_type= "INSERT INTO  work_type_status(work_status,status_type,work_type_id)
VALUES ($work_status ,$status_type,$work_type_id)";
 
  
   if ($conn->query($sql_insert_type) === TRUE) {
   } 
   else {
     echo "Error: " . $sql_insert_type . "<br>" . $conn->error;
   }

}

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





