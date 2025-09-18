<?php
 include 'db_head.php';

 
 
 $start_date = ($_GET['start_date']);
 $end_date = ($_GET['end_date']);
 $emp_id = test_input($_GET['emp_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;

}

$sql = "SELECT (SELECT distinct lead.lead_source FROM lead WHERE lead.work_id = min(work.work_id)) as lead_source,max(work.work_id)as w ,  DATE_FORMAT(FROM_UNIXTIME(min(work.work_date)/1000), '%e %b %Y') as lead_date,customer.cus_id, customer.cus_name,min(work.work_description) as work_des, max(CONCAT(work.work_type, ' - ', work_status)) as cur_work,   GROUP_CONCAT('emp name - ',employee.emp_name,' ','Date- ',DATE_FORMAT(FROM_UNIXTIME(work.work_date/1000), '%e %b %Y'),' ',work.work_type ,' - ',work.work_status,'\n' , ' ' SEPARATOR'<br><br>') as comments ,(SELECT report_master.report_cat from report_master WHERE concat(report_master.work_type, ' - ', report_master.work_status) = max(CONCAT(work.work_type, ' - ', work.work_status)) )  as report  FROM `work` INNER JOIN customer on work.cus_id = customer.cus_id INNER JOIN employee on work.emp_id = employee.emp_id  WHERE pipeline_id   in (SELECT marketing_lead.work_id from marketing_lead where marketing_lead.work_id > 0 and marketing_lead.dated between  $start_date  and   $end_date  and marketing_lead.emp_id = $emp_id )  GROUP BY pipeline_id union 
SELECT 'marketing' as lead_source ,0 as w, DATE_FORMAT(FROM_UNIXTIME(dated/1000), '%e %b %Y') as lead_date, lead_id as cus_id,cus_name,'n/a' as work_des,'n/a' as cur_work,'n/a' as comments,status as report from marketing_lead WHERE work_id = 0 and emp_id = $emp_id and dated BETWEEN $start_date  and   $end_date";


// $sql = "SELECT lead.*,work.work_type,work.work_status ,work.work_com_status,work.work_description,work.work_id FROM `lead` INNER join work on lead.work_id = work.work_id  WHERE  lead.dated between  $start_date and  $end_date and work.emp_id = $emp_id";

// $sql = "SELECT work.work_description,work.cus_id,work_history.his_date,work_history.comments,work_history.his_status,work.work_type FROM work_history INNER JOIN work ON work_history.work_id = work.work_id WHERE work_history.emp_id = $emp_id and work_history.his_date between  $start_date and  $end_date  ORDER BY work_history.his_date ";


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


