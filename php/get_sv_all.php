<?php
 include 'db_head.php';

 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT site_survey.work_id, site_survey.sv_id,CONCAT(customer.cus_name , ' - ', customer.cus_phone) as cus_info ,employee.emp_name, (FROM_UNIXTIME(sv_date/1000 ,'%d-%m-%Y %H:%i')) as dated ,site_survey.remark FROM site_survey INNER join customer on customer.cus_id = (select work.cus_id from work where work.work_id = site_survey.work_id) INNER join employee ON employee.emp_id = site_survey.emp_id";

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


