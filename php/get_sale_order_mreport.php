<?php
 include 'db_head.php';


$assign_type_query = ($_GET['assign_type']) == '' ? 1 : "assign_type  = " . test_input($_GET['assign_type']);

$godown_query = ($_GET['godown']) == '' ? 1 : "godown  = " . test_input($_GET['godown']) . " and assign_type = 'Finshed'";
$production_date_query  = ($_GET['production_date']) == '' ? 1 : "dated  between " . ($_GET['production_date']) . " and assign_type = 'Production'";




$product_id_query = ($_GET['product_id']) == '' ? 1 : "product_id  = " . test_input($_GET['product_id']);
$order_no_query = ($_GET['order_no']) == '' ? 1 : "order_no  = " . test_input($_GET['order_no']);
$type_id_query = ($_GET['type_id']) == '' ? 1 : "type_id  = " . test_input($_GET['type_id']);
$model_id_query = ($_GET['model_id']) == '' ? 1 : "model_id  = " . test_input($_GET['model_id']);
$sub_type_query = ($_GET['sub_type']) == '' ? 1 : "sub_type  = " . test_input($_GET['sub_type']);


$customer_id_query = ($_GET['customer_id']) == '' ? 1 : "customer_id  = " . test_input($_GET['customer_id']);
$sale_order_date_query = ($_GET['sale_order_date']) == '' ? 1 : "sale_order_date  between " . ($_GET['sale_order_date']); 


$emp_id_query = ($_GET['emp_id']) == '' ? 1 : " emp_id  = " . test_input($_GET['emp_id']);



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
LEFT JOIN godown ON godown.gid = ap.godown wHERE 1 and $assign_type_query and  $godown_query and  $production_date_query and assign_type in ('Finshed','Production','Waiting')
),
ap_final as ( SELECT
    ap.opid,
    JSON_ARRAYAGG(
        JSON_OBJECT(
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
        WHERE 1  and $product_id_query and $order_no_query and $type_id_query and $model_id_query and $sub_type_query
                   --  product_id = 30 and order_no = 1 and  type_id = '' and model_id = '' and sub_type in ('')
                  ),  

                       final as( SELECT ap_final.assign_details,sp.* from ap_final INNER join sop_view sp on ap_final.opid = sp.opid where   $customer_id_query and  $sale_order_date_query      GROUP by oid ) 

         select final.* from final  where 1 and $emp_id_query order by final.order_no desc


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




