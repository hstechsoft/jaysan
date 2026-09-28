<?php
 include 'db_head.php';



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT  employee.emp_name ,employee.emp_id,
 JSON_ARRAYAGG(JSON_OBJECT('godown', godown, 'dep', dep, 'sec', sec, 'creditors_name', creditors.creditor_name, 'dep_name', department.dep_name, 'dep_sec_name', dep_section.sec_name, 'emp_place_id', emp_place.emp_place_id)) AS place_details FROM emp_place
 left join creditors on emp_place.godown = creditors.creditor_id
 left join department on emp_place.dep = department.dep_id
 left join dep_section on emp_place.sec = dep_section.dep_sec_id
 inner join employee on emp_place.emp_id = employee.emp_id
 GROUP BY  employee.emp_id";

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


