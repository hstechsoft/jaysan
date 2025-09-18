<?php
 include 'db_head.php';

 

 $today_start =test_input($_GET['today_start']);
 $today_end =test_input($_GET['today_end']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT (SELECT COUNT(invoice.ino) from invoice WHERE invoice.dated BETWEEN $today_start and  $today_end ) as total_sale ,(SELECT sum(invoice.total_value) from invoice WHERE invoice.dated BETWEEN $today_start and  $today_end ) as total_sale_amount, 

(SELECT COUNT(service.service_id) from service WHERE service.dated BETWEEN $today_start and  $today_end ) as total_service ,(SELECT sum(service.amount) from service WHERE service.dated BETWEEN $today_start and  $today_end ) as total_service_amount, 

(SELECT COUNT(restamping.restamp_id) from restamping WHERE restamping.dated BETWEEN $today_start and  $today_end ) as total_restamping ,(SELECT sum(restamping.amount) from restamping WHERE restamping.dated BETWEEN $today_start and  $today_end ) as total_restamping_amount,

(SELECT COUNT(lead.lead_id) from lead WHERE lead.dated BETWEEN $today_start and  $today_end ) as total_lead;";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 results";
}
$conn->close();

 ?>


