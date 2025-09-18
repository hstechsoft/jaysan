<?php
 include 'db_head.php';

 
 $emp_id = test_input($_GET['emp_id']);
 $start_date = ($_GET['start_date']);
 $end_date = ($_GET['end_date']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

//select from two table and join together

$sql = "SELECT count(report_master.report_cat) as count,report_master.report_cat from report_master WHERE concat(report_master.work_type, ' - ', report_master.work_status) in (SELECT max(CONCAT(work.work_type, ' - ', work.work_status)) FROM marketing_lead INNER JOIN work ON marketing_lead.work_id = work.pipeline_id WHERE marketing_lead.emp_id = $emp_id AND marketing_lead.dated BETWEEN $start_date and $end_date GROUP BY marketing_lead.work_id) GROUP by report_master.report_cat UNION  SELECT  COUNT(DISTINCT marketing_lead.lead_id),'invalid' from marketing_lead  WHERE marketing_lead.dated BETWEEN $start_date and $end_date and marketing_lead.emp_id = $emp_id AND status = 'invalid'  UNION SELECT  COUNT(DISTINCT marketing_lead.lead_id),'total' from marketing_lead  WHERE marketing_lead.dated BETWEEN $start_date and $end_date and marketing_lead.emp_id = $emp_id"   ;

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


