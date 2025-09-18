<?php
 include 'db_head.php';
 $lead_source = ($_GET['lead_source']);
 $date_query_start = ($_GET['date_query_start']);
 $date_query_end = ($_GET['date_query_end']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


//report for web lead only
// $sql = "SELECT  (SELECT api.lead_source FROM api WHERE api.work_id = min(work.work_id)) as lead_source ,(SELECT api.generated_date FROM api WHERE api.work_id = min(work.work_id)) as lead_date,customer.cus_id, customer.cus_name,min(work.work_description) as work_des, CONCAT(max(work.work_type), ' - ', max(work_status), '\n') as cur_work,   GROUP_CONCAT('emp name - ',employee.emp_name,' ','Date- ',DATE_FORMAT(FROM_UNIXTIME(work.work_date/1000), '%e %b %Y'),' ',work.work_type ,' - ',work.work_status,'\n' , ' ' SEPARATOR'<br><br>') as comments ,(SELECT report_master.report_cat FROM report_master WHERE report_master.work_type = max(work.work_type) AND report_master.work_status = max(work.work_status) ) as report FROM `work` INNER JOIN customer on work.cus_id = customer.cus_id INNER JOIN employee on work.emp_id = employee.emp_id  WHERE pipeline_id in (SELECT api.work_id from api where api.work_id > 0)  GROUP BY pipeline_id";

//report for web lead only
 $sql = "SELECT (SELECT distinct lead.lead_source FROM lead WHERE lead.work_id = min(work.work_id)) as lead_source,max(work.work_id)as w ,  DATE_FORMAT(FROM_UNIXTIME(min(work.work_date)/1000), '%e %b %Y') as lead_date,customer.cus_id, customer.cus_name,min(work.work_description) as work_des, max(CONCAT(work.work_type, ' - ', work_status)) as cur_work,   GROUP_CONCAT('emp name - ',employee.emp_name,' ','Date- ',DATE_FORMAT(FROM_UNIXTIME(work.work_date/1000), '%e %b %Y'),' ',work.work_type ,' - ',work.work_status,'\n' , ' ' SEPARATOR'<br><br>') as comments ,(SELECT report_master.report_cat from report_master WHERE concat(report_master.work_type, ' - ', report_master.work_status) = max(CONCAT(work.work_type, ' - ', work.work_status)) )  as report  FROM `work` INNER JOIN customer on work.cus_id = customer.cus_id INNER JOIN employee on work.emp_id = employee.emp_id  WHERE pipeline_id   in (SELECT lead.work_id from lead where lead.work_id > 0 and lead.dated between  $date_query_start  and   $date_query_end  and $lead_source)  GROUP BY pipeline_id";
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


