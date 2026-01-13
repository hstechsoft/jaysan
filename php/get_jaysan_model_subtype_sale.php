<?php
 include 'db_head.php';

 $mtid = test_input($_GET['mtid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "   SELECT ifnull(subtype_group_id, 0) as subtype_group_id,dep_section.sec_name,JSON_ARRAYAGG(JSON_OBJECT('msid',msid,'mtid',mtid,'subtype_name',subtype_name,'price',price,'is_reduce',is_reduce,'subtype_group_id',subtype_group_id,'is_default',is_default,'bom_id',bom_id,'discount',discount,'alias_name',alias_name)) as price_details FROM jaysan_model_subtype
    left join dep_section on jaysan_model_subtype.subtype_group_id = dep_section.dep_sec_id   WHERE mtid =  $mtid
     GROUP BY subtype_group_id ORDER BY subtype_group_id
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


