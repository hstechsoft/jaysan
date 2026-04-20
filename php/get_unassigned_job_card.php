<?php
 include 'db_head.php';

 $show_all = test_input($_GET['show_all']);
 $show_all_query = '';
 if($show_all != "true") {
    $show_all_query = "having nesting_details.material_qty - COUNT(ifnull(laser_job_card.job_card_id,0)) > 0";
 }

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "SELECT nesting_details.*,employee.emp_name,parts_tbl.part_name as material_name,nesting_details.material_qty - COUNT(ifnull(laser_job_card.job_card_id,0)) as remaining_qty FROM `nesting_details`
left join laser_job_card on nesting_details.nesting_id = laser_job_card.nesting_id
inner join employee on nesting_details.created_by = employee.emp_id
inner join parts_tbl on nesting_details.material_id = parts_tbl.part_id
GROUP by nesting_details.nesting_id  $show_all_query";

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


