<?php
 include 'db_head.php';



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



 $sql = "with qr_report as(SELECT  json_arrayagg(JSON_OBJECT('sec_name', dep_section.sec_name, 'emp_name', employee.emp_name, 'emp_id', qr_work_entry.emp_id, 'start_time', date_time_only(qr_work_entry.start_time),'end_time', date_time_only(qr_work_entry.end_time), 'production_id', qr_work_entry.production_id, 'qr_work_id', qr_work_entry.qr_work_id, 'ass_id', machine_production_taken.ass_id)) as qr_details, date_time_only(qr_work_entry.start_time) as start_time, qr_work_entry.production_id, qr_work_entry.qr_work_id, machine_production_taken.ass_id  
FROM qr_work_entry  
INNER JOIN machine_production_taken ON qr_work_entry.production_id = machine_production_taken.production_id
inner join employee on qr_work_entry.emp_id = employee.emp_id
left join dep_section on qr_work_entry.sec_id = dep_section.dep_sec_id
GROUP BY qr_work_entry.production_id),
ass_details as (
    SELECT qr_report.*,,assign_product.chasis_no,assign_product.opid,assign_product.assign_type,date_only(assign_product.dated) as production_date,assign_product.emergency_order FROM assign_product inner join qr_report on assign_product.ass_id = qr_report.ass_id
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


