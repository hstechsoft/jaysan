<?php
 include 'db_head.php';


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = <<<SQL
with
    dcf_accounting1 as (
        SELECT da.dcf_accounting_id, da.dcf_id, da.invoice_no, da.dated as dcf_dated,
        dp.dcf_accounting_product_id,dp.product_id,dp.qty,
        dd.dcf_distribution_id, dd.cus_id, dd.amount, dd.billing_amount,soiv.order_no,soiv.dated as sale_order_date,sp.product,soiv.cus_name,soiv.cus_phone,cus.cus_name as parent_cus,cus.cus_phone as parent_cus_phone
        from
            dcf_accounting da
            inner join dcf_accounting_product dp on da.dcf_accounting_id = dp.dcf_accounting_id
            inner join dcf_distribution dd on dp.dcf_accounting_product_id = dd.dcf_accounting_product_id
            left join sales_order_info_view soiv on dp.product_id = soiv.opid
            left join sales_product sp on dp.product_id = sp.opid
            left join customer cus on dd.cus_id = cus.cus_id
            
        WHERE
            da.sts = "done"
    )
    SELECT dcf_accounting_id, dcf_id, invoice_no, dcf_dated,
        dcf_accounting_product_id, product_id, qty,
        dcf_distribution_id, cus_id, amount, billing_amount, order_no, sale_order_date, product, cus_name, cus_phone, parent_cus, parent_cus_phone
    from dcf_accounting1 
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




