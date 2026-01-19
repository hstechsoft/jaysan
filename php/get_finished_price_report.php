<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "with summary_all as(SELECT subgroup.sub_group_name,cgroup.group_name,mtype.type_name,model.model_name,pro.product_name,pro.product_id,model.model_id,mtype.mtid,cgroup.group_id,subgroup.sub_group_id FROM subgroup_type_price sub_price
LEFT JOIN customer_subgroup_master subgroup on sub_price.sub_group_id = subgroup.sub_group_id
LEFT join customer_group_master cgroup on subgroup.group_id = cgroup.group_id
LEFT JOIN jaysan_model_type mtype on mtype.mtid = sub_price.mtid
LEFT join jaysan_product_model model on mtype.pid = model.model_id
LEFT join jaysan_final_product pro on model.product_id = pro.product_id
GROUP BY pro.product_id,model.model_id,mtype.mtid,group_id,subgroup.sub_group_id ORDER BY subgroup.sub_group_name,cgroup.group_name,mtype.type_name,model.model_name,pro.product_name),

sub_group_summary as(SELECT JSON_ARRAYAGG(JSON_OBJECT('sub_group_name',sub_group_name,'sub_group_id',sub_group_id)) as sub_group_details,group_name,type_name,model_name,product_name,product_id,model_id,mtid,group_id FROM summary_all GROUP BY product_id,model_id,mtid,group_id ORDER BY sub_group_name,group_name,type_name,model_name,product_name)

SELECT JSON_ARRAYAGG(JSON_OBJECT('group_id',group_id,'group_name',group_name,'sub_group_details',sub_group_details)) as group_details,type_name,model_name,product_name,product_id,model_id,mtid,group_id FROM sub_group_summary GROUP BY product_id,model_id,mtid ORDER BY group_name,type_name,model_name,product_name;
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


