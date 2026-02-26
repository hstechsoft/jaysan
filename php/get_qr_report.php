<?php
 include 'db_head.php';


$qr_code = test_input($_GET['qr_code']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



 $sql = "
with qr_report as( SELECT JSON_ARRAYAGG (JSON_OBJECT(
  'start_time', date_time_only(qr_work_entry.start_time),
  'production_id', qr_work_entry.production_id,
  'qr_work_id', qr_work_entry.qr_work_id,
  'ass_id', CONVERT(machine_production_taken.ass_id USING utf8mb4) COLLATE utf8mb4_unicode_ci,
  'emp_name', CONVERT(employee.emp_name USING utf8mb4) COLLATE utf8mb4_unicode_ci
)) as qr_details,ass_id,emp_name

FROM qr_work_entry  
INNER JOIN machine_production_taken ON qr_work_entry.production_id = machine_production_taken.production_id 
inner JOIN employee on qr_work_entry.emp_id = employee.emp_id
WHERE qr_work_entry.production_id = 2 GROUP BY machine_production_taken.production_id),
ass_details as (
    SELECT qr_report.*,assign_product.opid,assign_product.assign_type,date_only(assign_product.dated) as production_date,assign_product.emergency_order FROM assign_product inner join qr_report on assign_product.ass_id = qr_report.ass_id
)
SELECT * FROM ass_details  inner join sales_order_info_view on ass_details.opid = sales_order_info_view.opid
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


