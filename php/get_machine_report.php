<?php
 include 'db_head.php';

$production_date_query  = ($_GET['production_date']) == '' ? 0 : "dated  =  '" . ($_GET['production_date']) . "' and assign_type = 'Production'";





function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = <<<SQL
with ap_details as( SELECT
  ap.*,
 
  godown.godown_name
FROM assign_product ap
LEFT JOIN godown ON godown.gid = ap.godown 

wHERE  $production_date_query and assign_type in ('Production') and dcf_id = 0 and finished_details = 'no_sts'
),
ap_final as ( SELECT
    ap.opid,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'line_no',(select line_no from  machine_production where ass_id = ap.ass_id),
            'ass_id', ap.ass_id,
            'opid', ap.opid,
            'dated', ap.dated,
            'assign_type', ap.assign_type,
            'godown', ap.godown,
            'dcf_id', ap.dcf_id,
            'godown_name', godown_name
        )
    ) AS assign_details
FROM ap_details ap

GROUP BY ap.opid),
    sop_view as(  SELECT emp_id,emp_name,oid,opid,order_category,customer_id,dated as sale_order_date,order_no,cus_name,cus_phone,product,model_name,type_name,sub_type from  sales_order_info_view 
        WHERE 1 
                   --  product_id = 30 and order_no = 1 and  type_id = '' and model_id = '' and sub_type in ('')
                  ),  

                       final as( SELECT ap_final.assign_details,sp.* from ap_final INNER join sop_view sp on ap_final.opid = sp.opid    GROUP by oid ) 

         select final.* from final  where 1  order by final.order_no desc


SQL;





//  $sql = "SELECT  dcf1.dcf_id,dcf1.dated,dcf1.consignee,dcf1.sts,DATE_FORMAT(dcf1.dated, '%d-%m-%Y') as dated,employee.emp_name FROM dcf dcf1 INNER join employee on dcf1.dcf_by = employee.emp_id WHERE 1 ORDER by dcf_by ";

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




