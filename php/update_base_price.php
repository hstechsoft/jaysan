<?php
 include 'db_head.php';

 $mtid = test_input($_POST['mtid']);
$mrp = test_input($_POST['mrp']);
$min_price = test_input($_POST['min_price']);
$max_price = test_input($_POST['max_price']);
$sub_type_price_json = $_POST['sub_type_price'];



 $sub_type_price = json_decode($sub_type_price_json, true);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  jaysan_model_type SET  mrp =  $mrp,min_price =  $min_price,max_price =  $max_price WHERE mtid =  $mtid";

  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }



  
   foreach ($sub_type_price as $row) {
        $msid = $row['msid'];
        $subtype_name = $row['subtype_name'];
        $subtype_group_id = $row['subtype_group_id'];
        $is_default = $row['is_default'];
        $bom_id = $row['bom_id'];
        $discount = $row['discount'];
        $alias_name = $row['alias_name'];

        $price = $row['price'];
        $is_reduce = $row['is_reduce'];
        $conn->query("UPDATE  jaysan_model_subtype SET mtid =  '$mtid',subtype_name =  '$subtype_name',price =  '$price',is_reduce =  '$is_reduce',subtype_group_id =  '$subtype_group_id',is_default =  '$is_default',bom_id =  '$bom_id',discount =  '$discount',alias_name =  '$alias_name' WHERE msid =  '$msid'");
    }

echo "ok";

$conn->close();

 ?>


