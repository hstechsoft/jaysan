<?php
 include 'db_head.php';


$emp_id = isset($_POST['emp_id']) ? test_input($_POST['emp_id']) : "'all'";
$tally_emp_id = isset($_POST['tally_emp_id']) ? test_input($_POST['tally_emp_id']) : 'all';
$md_emp_id = isset($_POST['md_emp_id']) ? test_input($_POST['md_emp_id']) : 'all';

$md_emp_query = "1";

if($md_emp_id != 'all') {
    $md_emp_query = "mrf_purchase.purchase_approved_by = $md_emp_id";
}

$tally_emp_query = "1";
 if($tally_emp_id != 'all') {
$tally_emp_query = "mrf.tally_stock_approved_by = $tally_emp_id";
 }

$status = json_decode($_POST['status'], true);
$mrf_purchase_by = isset($_POST['mrf_purchase_by']) ? ($_POST['mrf_purchase_by']) : 'all';
$mrf_purchase_query = "1";
 if($mrf_purchase_by != 'all') {
$mrf_purchase_query = "mrf_purchase.purchase_requested_by = $mrf_purchase_by";
 }
$mrf_receive_query = "1";
 $receive_filter = isset($_POST['receive_filter']) ? ($_POST['receive_filter']) : 'all';
 if($receive_filter == 'pending') {
    $mrf_receive_query = "(ifnull(mrf_details_view.mrf_batch_qty, 0) > ifnull(mrf_details_view.mrf_receive_qty, 0))";
 } else if($receive_filter == 'received') {
    $mrf_receive_query = "(ifnull(mrf_details_view.mrf_batch_qty, 0) <= ifnull(mrf_details_view.mrf_receive_qty, 0))";
 }


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";

$sql .= "SELECT 
    mrf.mrf_id,
    mrf_details_view.*,
    (select count(material_request_form.mrf_id) from material_request_form where material_request_form.part_id = mrf.part_id) as total_part_count,
    mrf.*,
    emp_tally_stock.emp_name as tally_stock_approved_by_name,
    emp_purchase_requested.emp_name as purchase_requested_by_name,
    emp_purchase_verified.emp_name as purchase_verified_by_name,
    emp_purchase_approved.emp_name as purchase_approved_by_name,
    mrf_purchase.purchase_requested_by,
    mrf_purchase.mrf_purchase_id,
    purchase_verified_by,
    purchase_approved_by,
    DATE_FORMAT(dated, '%d-%m %Y %h:%i %p') AS dated_format,
    DATE_FORMAT(req_date, '%d-%m %Y') AS req_date_format,
    emp.emp_name,
    parts_tbl.part_name
FROM
    material_request_form mrf
left JOIN employee emp ON
    mrf.emp_id = emp.emp_id
INNER JOIN parts_tbl ON mrf.part_id = parts_tbl.part_id
LEFT JOIN mrf_purchase ON mrf.mrf_id = mrf_purchase.mrf_id
LEFT JOIN employee emp_tally_stock on mrf.tally_stock_approved_by = emp_tally_stock.emp_id
LEFT JOIN employee emp_purchase_requested ON mrf_purchase.purchase_requested_by = emp_purchase_requested.emp_id
LEFT JOIN employee emp_purchase_verified ON mrf_purchase.purchase_verified_by = emp_purchase_verified.emp_id
LEFT JOIN employee emp_purchase_approved ON mrf_purchase.purchase_approved_by = emp_purchase_approved.emp_id
LEFT JOIN mrf_details_view ON mrf.mrf_id = mrf_details_view.mrf_id
WHERE ";

if(count($status) > 0) {
    $sts = "";
    foreach ($status as $row) {
        $row = test_input($row);
        if ($sts != "") {
            $sts .= " OR ";
        }
        $sts .= "mrf.status = $row";

        
    }
    $sql =  $sql. "(" . $sts . ") AND ";
  
}

if($emp_id != "'all'") {
   $sql =  $sql. "emp.emp_id = $emp_id";
} else {
   $sql =  $sql. "1=1";
}

$sql  = $sql . " AND " . $tally_emp_query;
$sql  = $sql . " AND " . $md_emp_query;
$sql  = $sql . " AND " . $mrf_purchase_query;
$sql  = $sql . " AND " . $mrf_receive_query;
$sql = $sql . " ORDER BY mrf.mrf_id DESC";
// echo $sql;
if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            if ($result->num_rows > 0) {
                $rows = array();
                while ($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                echo json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error: " . $conn->error;
}
$conn->close();




 ?>


