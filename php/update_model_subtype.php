<?php
 include 'db_head.php';

 $mtid = test_input($_POST['mtid']);
$mrp = test_input($_POST['mrp']);
$min_price = test_input($_POST['min_price']);
$max_price = test_input($_POST['max_price']);
$sub_type_price_json = $_POST['sub_type_price'];

$msid = test_input($_POST['msid']);
$subtype_name = test_input($_POST['subtype_name']);
$subtype_group_id = test_input($_POST['subtype_group_id']);
$is_default = test_input($_POST['is_default']);
$bom_id = test_input($_POST['bom_id']);
$discount = test_input($_POST['discount']);
$alias_name = test_input($_POST['alias_name']);
$price = test_input($_POST['price']);
$is_reduce = test_input($_POST['is_reduce']);




       
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


