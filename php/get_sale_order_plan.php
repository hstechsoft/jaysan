<?php
 include 'db_head.php';

 


 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

// $sql = "with unassign as (
//     select opid,sum(qty) as total_qty,JSON_ARRAYAGG(JSON_OBJECT('assign_id', ass_id)) as assign_details from assign_product WHERE assign_type = 'Production' AND dcf_id = 0 and ass_id not in (select assign_id from production_planner_parts ) GROUP BY opid
// )
// select JSON_ARRAYAGG(JSON_OBJECT('oid', oid,'order_no', order_no,'required_qty', total_qty,'opid', unassign.opid,'assign_details', assign_details)) as order_info,'2796' as process_id ,sum(total_qty) as total_required_qty,sales_order_info_view.* from sales_order_info_view
// inner join unassign on sales_order_info_view.opid = unassign.opid
//  WHERE 1 group by type_id,model_id,sub_type";

$sql = "with
    unassign as (
        select
            opid,
            sum(qty) as total_qty,
            JSON_ARRAYAGG(
                JSON_OBJECT('assign_id', ass_id)
            ) as assign_details
        from assign_product
        WHERE
            assign_type = 'Production'
            AND dcf_id = 0
            and ass_id not in(
                select assign_id
                from production_planner_parts
            )
        GROUP BY
            opid
    ),
    subtype as (select opid, GROUP_CONCAT(msid) as msid from sales_order_subtype GROUP BY opid),
    product as (SELECT part_id, GROUP_CONCAT(msid) as msid from jaysan_subtype_link GROUP BY part_id ORDER BY msid),
    pwt_part as(
        select output_part,process_id from process_wel_tbl WHERE output_part is not null and is_default = 1 GROUP BY output_part
    ),
   
    plink as(
        select
            product.part_id,
            subtype.opid
        from
            product
            inner join subtype on product.msid = subtype.msid
         ),
     product_process as (
       select plink.part_id, plink.opid, pwt_part.process_id from plink  
       inner join pwt_part on plink.part_id = pwt_part.output_part
    )
select
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'oid',
            oid,
            'order_no',
            order_no,
            'required_qty',
            total_qty,
            'opid',
            unassign.opid,
            'assign_details',
            assign_details
        )
    ) as order_info,
    product_process.process_id,
    sum(total_qty) as total_required_qty,
    sales_order_info_view.*
from
    sales_order_info_view
    inner join unassign on sales_order_info_view.opid = unassign.opid
    left join product_process on sales_order_info_view.opid = product_process.opid
WHERE
    1
group by
    type_id,
    model_id,
    sub_type";

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



