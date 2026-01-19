<?php
 include 'db_head.php';

 $mtid = test_input($_POST['mtid']);
$subtype_name = test_input($_POST['subtype_name']);
$price = test_input($_POST['price']);
$is_reduce = test_input($_POST['is_reduce']);
$subtype_group_id = ($_POST['subtype_group_id']);
$is_default = ($_POST['is_default']);
$bom_id = ($_POST['bom_id']);
$discount = test_input($_POST['discount']);
$alias_name = test_input($_POST['alias_name']);

$subtype_group_id = sql_nullable($subtype_group_id);
$bom_id = sql_nullable($bom_id);
$is_default = sql_nullable($is_default);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($is_default and $subtype_group_id != 'NULL')
  {
    $sql_update = "UPDATE jaysan_model_subtype SET is_default = NULL WHERE subtype_group_id = $subtype_group_id";
    $conn->query($sql_update);
  }
 $sql = "INSERT INTO jaysan_model_subtype ( mtid,subtype_name,price,is_reduce,subtype_group_id,is_default,bom_id,discount,alias_name) VALUES ($mtid,$subtype_name,$price,$is_reduce,$subtype_group_id,$is_default,$bom_id,$discount,$alias_name)";

  if ($conn->query($sql) === TRUE) {
    http_response_code(200);
   echo "ok";

  } else {
    http_response_code(500);
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


