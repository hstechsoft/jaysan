<?php
 include 'db_head.php';



$jaysan_po_material_id = ($_POST['jaysan_po_material_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
 foreach ($jaysan_po_material_id as $jaysan_po_material_id)
    {
      

 $sql =  "UPDATE  jaysan_po_material SET is_approved =  '1' WHERE jaysan_po_material_id =  $jaysan_po_material_id";

  if ($conn->query($sql) === TRUE) {
 
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
  echo "ok";
$conn->close();

 ?>


