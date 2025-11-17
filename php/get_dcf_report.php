<?php
 include 'db_head.php';


 $customer_query = ($_GET['customer']) == '' ? 1 : "cus.cus_id  = " . ($_GET['customer']);
 $dcrf_sts_query = ($_GET['dcf_sts']) == '' ? 1 : "dcf1.sts  = " . ($_GET['dcf_sts']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = <<<SQL
WITH
    dcf_opid AS(
    SELECT DISTINCT
        opid,
        dcf.dcf_id
    FROM
        assign_product ap
    INNER JOIN dcf ON ap.dcf_id = dcf.dcf_id
    WHERE
        1
),
sop_details AS(
    SELECT
        dcf_opid.*,
        oid
    FROM
        dcf_opid
    INNER JOIN sales_order_product sop ON
        dcf_opid.opid = sop.opid
    ORDER BY
        dcf_id
),
sof_details AS(
    SELECT
        sop_details.*,
        sof.customer_id,
        sof.order_no,
        sof.emp_id,
    sp.product
    
    FROM
        sop_details
    INNER JOIN sales_order_form sof ON
        sof.oid = sop_details.oid
       INNER JOIN sales_product sp ON
        sp.opid = sop_details.opid
),
final AS(
    SELECT
        sd.*,
        cus.cus_name,
        emp.emp_name
    FROM
        sof_details sd
    INNER JOIN customer cus ON
        cus.cus_id = sd.customer_id
    INNER JOIN employee emp ON
        emp.emp_id = sd.emp_id  where $customer_query
),
dcf_final as (SELECT
    dcf_id,    JSON_ARRAYAGG(
        JSON_OBJECT('order_no',order_no,'cus_name',cus_name,'product',product,'emp','emp_name')) as sale_order
FROM
    final GROUP by dcf_id)
    
    SELECT dcf_final.sale_order, dcf1.dcf_id,dcf1.dated,dcf1.consignee,dcf1.sts,DATE_FORMAT(dcf1.dated, '%d-%m-%Y') as dated,(SELECT employee.emp_name from employee WHERE employee.emp_id = dcf1.dcf_by) as emp_name  from dcf_final inner join dcf dcf1 on dcf_final.dcf_id = dcf1.dcf_id WHERE  $dcrf_sts_query ORDER by dcf1.dcf_id DESC
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




