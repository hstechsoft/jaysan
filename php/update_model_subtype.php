<?php
 include 'db_head.php';

 $mtid = test_input($_POST['mtid']);




$msid = test_input($_POST['msid']);
$subtype_name = test_input($_POST['subtype_name']);
$subtype_group_id = ($_POST['subtype_group_id']);
$is_default = test_input($_POST['is_default']);
$bom_id = ($_POST['bom_id']);
$discount = test_input($_POST['discount']);
$alias_name = test_input($_POST['alias_name']);
$price = test_input($_POST['price']);
$is_reduce = test_input($_POST['is_reduce']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$bom_id = sql_nullable($bom_id);
$subtype_group_id = sql_nullable($subtype_group_id);



       
      $sql_up = "UPDATE  jaysan_model_subtype SET mtid =  $mtid,subtype_name =  $subtype_name,price =  $price,is_reduce =  $is_reduce,subtype_group_id =  $subtype_group_id,is_default =  $is_default,bom_id =  $bom_id,discount =  $discount,alias_name =  $alias_name WHERE msid =  $msid";
    

      // echo $sql_up;
      // echo "\n";
    if ($conn->query($sql_up) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql_up . "<br>" . $conn->error;
  }
       



$conn->close();

 ?>


