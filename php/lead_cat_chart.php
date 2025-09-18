<?php
 include 'db_head.php';

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

$sql = "SELECT count(*)as count ,lead_source FROM lead WHERE  lead.dated BETWEEN  $start_date and $end_date and lead.work_id NOT in (SELECT api.work_id from api) and lead.work_id NOT in (SELECT marketing_lead.work_id from marketing_lead) GROUP BY lead_source UNION SELECT count(*)as count ,lead_source FROM api WHERE api.dated BETWEEN FROM_UNIXTIME( $start_date/1000,'%Y-%m-%d') and FROM_UNIXTIME($end_date/1000,'%Y-%m-%d') GROUP BY lead_source UNION SELECT count(*)as count ,lead_source FROM marketing_lead WHERE  marketing_lead.dated BETWEEN ( $start_date) and ($end_date) GROUP BY lead_source "   ;

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


