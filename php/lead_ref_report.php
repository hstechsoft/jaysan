<?php
 include 'db_head.php';

 
 
 $start_date = ($_GET['date_query_start']);
 $end_date = ($_GET['date_query_end']);
 $ref_query = ($_GET['ref_query']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;

}

$sql = "SELECT count(*) as total_ref,referal.ref_cus_name,referal.ref_cus_phone , GROUP_CONCAT('Name - ',customer.cus_name ,' Phone - ',customer.cus_phone, work.work_description, 'Date - ',DATE_FORMAT(FROM_UNIXTIME((work.work_date)/1000), '%e %b %Y') SEPARATOR'<br>')as lead_details FROM `referal` INNER JOIN customer ON referal.cus_id = customer.cus_id INNER JOIN work on referal.work_id = work.work_id  WHERE referal.dated between $start_date  and  $end_date and  $ref_query GROUP by referal.ref_cus_phone;";


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


