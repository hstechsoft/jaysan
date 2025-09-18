<?php
 include 'db_head.php';

 $type_id = test_input($_GET['type_id']);
$group_name = test_input($_GET['group_name']);
$sample_sts = test_input($_GET['sample_sts']);
$process_qty = test_input($_GET['process_qty']);
$model_id = test_input($_GET['model_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO process_group ( type_id,group_name,sample_sts,process_qty,model_id) VALUES ($type_id,$group_name,$sample_sts,$process_qty,$model_id)";

  if ($conn->query($sql) === TRUE) {
   echo $last_id_work = $conn->insert_id;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


