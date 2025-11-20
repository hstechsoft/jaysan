<?php
 include 'db_head.php';


//  $customer_query = ($_GET['customer']) == '' ? 1 : "cus.cus_id  = " . ($_GET['customer']);
//  $dcrf_sts_query = ($_GET['dcf_sts']) == '' ? 1 : "dcf1.sts  = '" . ($_GET['dcf_sts']) . "'";
// $sof_query = ($_GET['order_no']) == '' ? 1 : "sof.order_no  = " . ($_GET['order_no']);

$assign_type_query = ($_GET['assign_type']) == '' ? 1 : "ap.assign_type  = " . test_input($_GET['assign_type']);
$unassigned_qty_query = ($_GET['unassigned_qty']) == '' ? 1 : "unassigned_qty  > " . test_input($_GET['unassigned_qty']);
$godown_query = ($_GET['godown']) == '' ? 1 : "godown  = " . test_input($_GET['godown']) . " and assign_type = 'Finshed'";
$production_date_query  = ($_GET['production_date']) == '' ? 1 : "dated  between " . ($_GET['production_date']) . " and assign_type = 'Production'";

// $dcf_sts_query = ($_GET['dcf_sts']) == '' ? 1 : "dcf_sts  = " . test_input($_GET['dcf_sts']);


$product_id_query = ($_GET['product_id']) == '' ? 1 : "product_id  = " . test_input($_GET['product_id']);
$order_no_query = ($_GET['order_no']) == '' ? 1 : "order_no  = " . test_input($_GET['order_no']);
$type_id_query = ($_GET['type_id']) == '' ? 1 : "type_id  = " . test_input($_GET['type_id']);
$model_id_query = ($_GET['model_id']) == '' ? 1 : "model_id  = " . test_input($_GET['model_id']);
$sub_type_query = ($_GET['sub_type']) == '' ? 1 : "sub_type  = " . test_input($_GET['sub_type']);


$customer_id_query = ($_GET['customer_id']) == '' ? 1 : "customer_id  = " . test_input($_GET['customer_id']);
$sale_order_date_query = ($_GET['sale_order_date']) == '' ? 1 : "sale_order_date  between " . ($_GET['sale_order_date']); 
$order_category_query = ($_GET['order_category']) == '' ? 1 : "order_category  = " . test_input($_GET['order_category']);
$remain_dcf_query = ($_GET['remain_dcf']) == '' ? 1 : " required_qty - dcf_count  > " . test_input($_GET['remain_dcf']);




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = <<<SQL
with ass_info as(SELECT
  
  
    IFNULL(ap.qty, 0) AS qty,
    ap.dated,
    ap.assign_type,

    ap.godown,
   
    sop.opid,
    godown.godown_name,
    IFNULL(
        SUM(qty) OVER(
    PARTITION BY sop.opid
    ),
    0
    ) AS assigned_qty, 
   sop.required_qty,
    sop.required_qty -(SUM(IFNULL(qty, 0)) OVER(PARTITION BY sop.opid)) AS unassigned_qty,
   SUM(ifnull(qty,0)) over (PARTITION by ap.opid order by ap.assign_type) as assigntype_total_count,


 sum(IFNULL(qty, 0)) over ( PARTITION BY ap.opid,ap.assign_type,ap.godown ) as finished_godown_count,
                  sum(IFNULL(qty, 0)) over ( PARTITION BY ap.opid,ap.assign_type,ap.dated ) as production_date_count
 
                 
                 
      

   
FROM
    assign_product ap

LEFT JOIN godown ON ap.godown = godown.gid
RIGHT JOIN sales_order_product sop ON
    ap.opid = sop.opid 
),

assign_product_details as(select opid,assign_type,qty,godown,
dated as production_date,godown_name,assigned_qty,required_qty,unassigned_qty,assigntype_total_count,finished_godown_count,production_date_count from ass_info WHERE 1 
and $assign_type_query and $unassigned_qty_query and $godown_query and $production_date_query  

-- AND assign_type in ("Waiting") and unassigned_qty > 1 and godown = 0 and dated BETWEEN '2025-05-10' and '2025-12-10' 

 GROUP by opid,assign_type,production_date,godown),
dcf_info as(SELECT ap.ass_id,ap.opid,ap.qty,ap.dcf_id ,dcf.sts as dcf_sts,
sum(qty) over (PARTITION by opid,dcf_id) as dcf_count,
sum(qty) over (PARTITION by opid) as total_dcf_count
FROM assign_product ap INNER join dcf on ap.dcf_id = dcf.dcf_id ),

dcf_details as (SELECT opid,dcf_id,dcf_sts,dcf_count,total_dcf_count from dcf_info where 1
-- WHERE opid = 687 and dcf_sts = 'HOD'
GROUP by opid,dcf_id order by opid )
,
ap_opid as(SELECT opid,assign_type, assigntype_total_count,JSON_ARRAYAGG(
        JSON_OBJECT('godown_name',godown_name,'production_date' ,production_date , 'finished_godown_count', finished_godown_count, 'production_date_count',production_date_count)) as assign_details,required_qty,assigned_qty,unassigned_qty  from assign_product_details  GROUP by opid,assign_type),
        
assign_final as( SELECT opid,required_qty,assigned_qty,unassigned_qty,JSON_ARRAYAGG(
        JSON_OBJECT('assign_type',assign_type,'assigntype_total_count',assigntype_total_count,'assign_details',assign_details)) as assign_info from ap_opid GROUP by opid)
        ,
dcf_final as (SELECT opid, JSON_ARRAYAGG(
        JSON_OBJECT('dcf_id',dcf_id,'dc_sts',dcf_sts,'dcf_count',dcf_count)) as dcf_details,total_dcf_count from dcf_details GROUP by opid ),
      dcf_final1 as (SELECT sop.opid,dcf_details,ifnull(total_dcf_count,0) as dcf_count from dcf_final  right join sales_order_product sop on sop.opid = dcf_final.opid),  
        
       sop_view as(  SELECT oid,opid,order_category,customer_id,dated as sale_order_date,order_no,cus_name,cus_phone,product,model_name,type_name,sub_type from  sales_order_info_view 
        WHERE 1  and $product_id_query and $order_no_query and $type_id_query and $model_id_query and $sub_type_query
                   --  product_id = 30 and order_no = 1 and  type_id = '' and model_id = '' and sub_type in ('')
                  )           
     
        
      -- SELECT sop.opid,dcf_details,ifnull(total_dcf_count,0) as dcf_count from dcf_final  right join sales_order_product sop on sop.opid = dcf_final.opid
      
      SELECT sop_view.oid,sop_view.opid,sop_view.order_category,sop_view.customer_id,sop_view.sale_order_date,sop_view.order_no,sop_view.cus_name,sop_view.cus_phone,
       JSON_ARRAYAGG(
        JSON_OBJECT('product',product,'model_name',model_name,'type_name',type_name,'sub_type',sub_type,'dcf_details',dcf_details,'dcf_count',dcf_count,'required_qty',required_qty,'assigned_qty',assigned_qty,'unassigned_qty',unassigned_qty,'remain_dcf',required_qty - dcf_count,'assign_info',assign_info)) as product
       from sop_view inner join dcf_final1 on sop_view.opid = dcf_final1.opid inner join assign_final on assign_final.opid =  sop_view.opid  where   $customer_id_query and  $sale_order_date_query  and $order_category_query and  $remain_dcf_query GROUP by oid limit 50
      -- WHERE  customer_id = 11493 and sale_order_date BETWEEN '2025-01-12' and '2025-02-1' and order_category = 'Sales' and remain_dcf > 0 and  required_qty - dcf_count > 0
   


        

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




