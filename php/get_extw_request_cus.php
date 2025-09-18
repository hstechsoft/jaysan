<?php
 include 'db_head.php';

 $cus_id = test_input($_GET['cus_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SELECT chasis_no,dimage,implement,model,DATE_FORMAT(ddate, '%d-%m-%Y %h:%i %p') as ddate ,work_id,cus_id,dname , IFNULL((SELECT concat (work_type, '-',work_status) as work from work WHERE work_id =  (SELECT MAX(work_id)as work_id from work WHERE pipeline_id = ( SELECT pipeline_id FROM work WHERE work_id = dealer_delivery.work_id))), 'Requseted') as sts FROM dealer_delivery  inner join dealer on dealer_delivery.did = dealer.did  WHERE cus_id = $cus_id and ext_warranty = 'yes'";




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


