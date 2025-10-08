<?php
 include 'db_head.php';

 $jaysan_po_id = ($_GET['jaysan_po_id']);
$batch_id = ($_GET['batch_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$jaysan_po_id = ($jaysan_po_id === 'null' || $jaysan_po_id === '') ? 'NULL' : "'$jaysan_po_id'";
$batch_id     = ($batch_id === 'null' || $batch_id === '') ? 'NULL' : "'$batch_id'";


 $sql = "INSERT INTO jaysan_po_material (jaysan_po_id,batch_id) VALUES ($jaysan_po_id,$batch_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


