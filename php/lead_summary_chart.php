<?php
 include 'db_head.php';

 $start_date = ($_GET['start_date']);
 $end_date = ($_GET['end_date']);
 $lead_source = ($_GET['lead_source']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

//select from two table and join together

$sql = "SELECT 'total_lead' as sts,  sum(api_count+mlead_count+lead_count) as total_lead FROM ( SELECT COUNT(api.lead_id)as api_count from  api WHERE api.dated BETWEEN FROM_UNIXTIME( $start_date/1000,'%Y-%m-%d') and FROM_UNIXTIME($end_date/1000,'%Y-%m-%d') and $lead_source ) as api_t , ( SELECT COUNT(marketing_lead.lead_id)as mlead_count from  marketing_lead WHERE marketing_lead.dated BETWEEN ( $start_date) and ($end_date) and $lead_source) as mlead_t,(SELECT count(lead.lead_id)as lead_count from lead WHERE lead.dated BETWEEN  $start_date and $end_date and $lead_source  AND lead.work_id NOT in (SELECT api.work_id from api) and lead.work_id NOT in (SELECT marketing_lead.work_id from marketing_lead)) as lead_t UNION
SELECT 'invalid' as sts, sum(api_counti+mlead_counti) as count FROM ( SELECT COUNT(api.lead_id)as api_counti from  api WHERE api.dated BETWEEN FROM_UNIXTIME( $start_date/1000,'%Y-%m-%d') and FROM_UNIXTIME($end_date/1000,'%Y-%m-%d') and status = 'invalid' and $lead_source) as api_ti , ( SELECT COUNT(marketing_lead.lead_id)as mlead_counti from  marketing_lead WHERE marketing_lead.dated BETWEEN ( $start_date) and ($end_date) and status = 'invalid' and $lead_source ) as mlead_ti
 UNION

SELECT sts, count(sts)as count from (SELECT  (SELECT report_master.report_cat from report_master WHERE concat(report_master.work_type, ' - ', report_master.work_status) = max(CONCAT(work.work_type, ' - ', work.work_status)) )  as sts  FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id  WHERE pipeline_id   in (SELECT lead.work_id from lead where lead.work_id > 0 and lead.dated between   $start_date  and   $end_date  and $lead_source )  GROUP BY pipeline_id) as f GROUP by sts

union
SELECT 'not_attend' as sts,sum( mlead_na+api_na)as count from (SELECT count(marketing_lead.lead_id) as mlead_na  from marketing_lead WHERE dated BETWEEN  $start_date and $end_date and marketing_lead.status = 'new'and $lead_source ) as mlead_nat,(SELECT count(api.lead_id) as api_na  from api WHERE dated BETWEEN FROM_UNIXTIME( $start_date/1000,'%Y-%m-%d') and FROM_UNIXTIME($end_date/1000,'%Y-%m-%d') and api.status = 'new' and $lead_source ) as api_nat"   ;

// $sql = "SELECT work.work_type,work_history.his_status,COUNT(work_history.his_status) as total FROM work_history left JOIN work ON work_history.work_id = work.work_id WHERE  work_history.emp_id = $emp_id and work_history.his_date between  $start_date and  $end_date GROUP BY work_type,his_status ORDER by work.work_type ";




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


