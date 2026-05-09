<?php
 include 'db_head.php';


$part_name = test_input($_POST['part_name']);
$part_no = test_input($_POST['part_no']);
$des = test_input($_POST['des']);
$part_image = test_input($_POST['part_image']);
$sub_ass = test_input($_POST['sub_ass']);
$reorder_qty = test_input($_POST['reorder_qty']);
$min_order_qty = test_input($_POST['min_order_qty']);
$Parent = test_input($_POST['Parent']);
$category = test_input($_POST['category']);
$baseunits = test_input($_POST['baseunits']);
$gstrate = test_input($_POST['gstrate']);
$tally_part = test_input($_POST['tally_part']);
$alias_name = test_input($_POST['alias_name']);
$is_sale_item = test_input($_POST['is_sale_item']);
$item_grade = test_input($_POST['item_grade']);
$preference = test_input($_POST['preference']);
$is_godown_available = test_input($_POST['is_godown_available']);
$under_partid = test_input($_POST['under_partid']);
$alternate_unit = test_input($_POST['alternate_unit']);
$base_value = test_input($_POST['base_value']);
$is_bom = test_input($_POST['is_bom']);
$alter_std_rate = test_input($_POST['alter_std_rate']);
$is_gst_appicable = test_input($_POST['is_gst_appicable']);
$hsn_code = test_input($_POST['hsn_code']);
$hsn_des = test_input($_POST['hsn_des']);
$gstdetails = test_input($_POST['gstdetails']);
$type_of_supply = test_input($_POST['type_of_supply']);
$part_id = test_input($_POST['part_id']);

echo $item_grade;
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  parts_tbl SET part_name =  $part_name,part_no =  $part_no,des =  $des,part_image =  $part_image,sub_ass =  $sub_ass,reorder_qty =  $reorder_qty,min_order_qty =  $min_order_qty,Parent =  $Parent,category =  $category,baseunits =  $baseunits,gstrate =  $gstrate,tally_part =  $tally_part,alias_name =  $alias_name,is_sale_item =  $is_sale_item,item_grade =  $item_grade,preference =  $preference,is_godown_available =  $is_godown_available,under_partid =  $under_partid,alternate_unit =  $alternate_unit,base_value =  $base_value,is_bom =  $is_bom,alter_std_rate =  $alter_std_rate,is_gst_appicable =  $is_gst_appicable,hsn_code =  $hsn_code,hsn_des =  $hsn_des,gstdetails =  $gstdetails,type_of_supply =  $type_of_supply WHERE part_id =  $part_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


