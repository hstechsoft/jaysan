<?php
 include 'db_head.php';

 $newPartName = test_input($_GET['newPartName']);
$newPartNo = test_input($_GET['newPartNo']);
$bom_id = test_input($_GET['bom_id']);
$bom_cat = test_input($_GET['bom_cat']);
$qty = test_input($_GET['bom_qty']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "INSERT INTO parts_tbl (part_name, part_no, sub_ass) VALUES ($newPartName, $newPartNo, true)";


  if ($conn->query($sql) === TRUE) {
   
   $part_id = $conn->insert_id;
 

   $sql = "INSERT INTO bom_input (part_id, qty, bom_id) VALUES ('$part_id', $qty, $bom_id)";


   if ($conn->query($sql) === TRUE) {
    
   
    echo $part_id;
   } else {
     echo "Error: " . $sql . "<br>" . $conn->error;
   }

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>

