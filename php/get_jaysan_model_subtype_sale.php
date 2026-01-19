<?php
 include 'db_head.php';

 $mtid = test_input($_GET['mtid']);
 $subgroup_id = test_input($_GET['subgroup_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT subtype_group_id,ifnull(group_type_price.max_price,0) as max_price,ifnull(group_type_price.min_price,0) as min_price,ifnull(group_type_price.mrp,0) as mrp,(select dep_section.sec_name from dep_section WHERE dep_section.dep_sec_id = subtype_group_id)as sec_name, JSON_ARRAYAGG(JSON_OBJECT('msid',jaysan_model_subtype.msid,'subtype_name',subtype_name,'is_default',is_default,'is_reduce',is_reduce,'max_price',ifnull(group_type_price.max_price,0),'min_price',ifnull(group_type_price.min_price,0),'mrp',ifnull(group_type_price.mrp,0),'price',ifnull(subgroup_subtype_price.price,0),'discount',ifnull(subgroup_subtype_price.discount,0))) as price_details FROM jaysan_model_subtype
left join group_type_price on jaysan_model_subtype.mtid=group_type_price.mtid and group_type_price.group_id =  (select group_id from customer_subgroup_master where sub_group_id =$subgroup_id)
left join subgroup_subtype_price on jaysan_model_subtype.msid=subgroup_subtype_price.msid and subgroup_subtype_price.sub_group_id=$subgroup_id
 WHERE jaysan_model_subtype.mtid =$mtid group by subtype_group_id ORDER BY subtype_group_id DESC
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


