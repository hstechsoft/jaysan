<?php
 include 'db_head.php';

 $unique_part_id = test_input($_POST['unique_part_id']);
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


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO parts_tbl ( unique_part_id,part_name,part_no,des,part_image,sub_ass,reorder_qty,min_order_qty,Parent,category,baseunits,gstrate,tally_part,alias_name,is_sale_item,item_grade,preference,is_godown_available,under_partid,alternate_unit,base_value,is_bom,alter_std_rate,is_gst_appicable,hsn_code,hsn_des,gstdetails,type_of_supply) VALUES ($unique_part_id,$part_name,$part_no,$des,$part_image,$sub_ass,$reorder_qty,$min_order_qty,$Parent,$category,$baseunits,$gstrate,$tally_part,$alias_name,$is_sale_item,$item_grade,$preference,$is_godown_available,$under_partid,$alternate_unit,$base_value,$is_bom,$alter_std_rate,$is_gst_appicable,$hsn_code,$hsn_des,$gstdetails,$type_of_supply)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


