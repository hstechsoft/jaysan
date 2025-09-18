
<?php
 include 'db_head.php';

 $col_name =test_input($_GET['col_name']);
 $monthly =test_input($_GET['monthly']);
 $yearly =test_input($_GET['yearly']);
 $table_name =($_GET['table_name']);
 $id =($_GET['id']);
 

 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO $table_name (monthly,yearly,col_name,pbid)
 VALUES ($monthly,$yearly,$col_name,$id)";
  
  if ($conn->query($sql) === TRUE) {
   
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





