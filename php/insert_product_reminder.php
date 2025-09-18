
<?php
 include 'db_head.php';

 $remind_id =test_input($_GET['remind_id']);
 $pid =($_GET['pid']);
 echo $pid;
 $pid1 = 0;

if ($pid == '')
{

    $sql ="SELECT max(pid) as insert_key FROM product";
    $result = $conn->query($sql);
 $result_sts = array();
 if ($result->num_rows > 0) {
    $rows = array();
    while($row = $result->fetch_assoc()) {
       $pid1 = $row["insert_key"] ;
       $rows[] = $row;
             }    
 } 
 $pid1 = $pid1;
}
else{
    $pid1 = $pid;
    
}
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  product_reminder_master (remind_id,pid)
 VALUES ($remind_id,$pid1)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





