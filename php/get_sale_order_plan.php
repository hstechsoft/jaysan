<?php
 include 'db_head.php';

 


 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

$sql = "with unassign as (
    select opid,sum(qty) as total_qty,JSON_ARRAYAGG(JSON_OBJECT('assign_id', ass_id)) as assign_details from assign_product WHERE assign_type = 'Production' AND dcf_id = 0 and ass_id not in (select assign_id from production_planner_parts ) GROUP BY opid
)
select JSON_ARRAYAGG(JSON_OBJECT('oid', oid,'order_no', order_no,'required_qty', total_qty,'opid', unassign.opid,'assign_details', assign_details)) as order_info,'2796' as process_id ,sum(total_qty) as total_required_qty,sales_order_info_view.* from sales_order_info_view
inner join unassign on sales_order_info_view.opid = unassign.opid
 WHERE 1 group by type_id,model_id,sub_type";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "not_login";
}
$conn->close();



 ?>


