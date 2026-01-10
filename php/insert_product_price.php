<?php
 include 'db_head.php';


$product_price_json = $_POST['product_price'];
$features_price_json = $_POST['features_price'];



 $product_price = json_decode($product_price_json, true);
 $features_price = json_decode($features_price_json, true);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


foreach ($product_price as $row) {
      if($row['price_type']== 'main_group_price'){
       $sql_group_type_price = "insert INTO group_type_price SET group_id = {$row['group_id']}, mtid = {$row['mtid']}, mrp = {$row['mrp']}, min_price = {$row['min_price']}, max_price = {$row['max_price']} ON DUPLICATE KEY UPDATE mrp = {$row['mrp']}, min_price = {$row['min_price']}, max_price = {$row['max_price']}";
       if($conn->query($sql_group_type_price)){

       }
       else
       {
echo "Error: " . $sql_group_type_price . "<br>" . $conn->error;
       };   

      }
      else
      {

        // insert into subgroup_type_price SET max_price='$max_price', min_price='$min_price', mrp='$mrp', mtid='$mtid';


$sql_subgroup_type_price = "insert INTO subgroup_type_price SET sub_group_id = {$row['group_id']}, mtid = {$row['mtid']}, mrp = {$row['mrp']}, min_price = {$row['min_price']}, max_price = {$row['max_price']} ON DUPLICATE KEY UPDATE mrp = {$row['mrp']}, min_price = {$row['min_price']}, max_price = {$row['max_price']}";
       if($conn->query($sql_subgroup_type_price)){

       }
       else
       {
echo "Error: " . $sql_subgroup_type_price . "<br>" . $conn->error;
       };   
      }
    }



    foreach ($features_price as $row) {
       echo "\n";
       echo $row['discount'];
        if($row['price_type']== 'main_subtype_price'){
            
            $sql_group_subtype = "insert into group_subtype_price set group_id = {$row['group_id']},msid = {$row['msid']},price = {$row['price']},discount = {$row['discount']}  on DUPLICATE key update price = {$row['price']}, discount = {$row['discount']}";
       if($conn->query($sql_group_subtype)){
        }
     
       else
       {
echo "Error: " . $sql_group_subtype . "<br>" . $conn->error;
       };   
    }
    else
    {
        $sql_subgroup_subtype = "insert into subgroup_subtype_price set sub_group_id = {$row['group_id']},msid = {$row['msid']},price = {$row['price']},discount = {$row['discount']} on DUPLICATE key update price = {$row['price']}, discount = {$row['discount']}";
       if($conn->query($sql_subgroup_subtype)){
        }
     
       else
       {
echo "Error: " . $sql_subgroup_subtype . "<br>" . $conn->error;
       };   
    }
    }

 
echo "ok";

$conn->close();

 ?>


