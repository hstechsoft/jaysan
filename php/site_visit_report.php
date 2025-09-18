<?php
 include 'db_head.php';

 
 $work_id = test_input($_GET['work_id']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// $sql = " SELECT *  FROM site_survey    WHERE work_id =  $work_id ";

$sql =  "SELECT site_survey.* ,(SELECT employee.emp_name from employee inner join work on work.emp_id = employee.emp_id WHERE work.work_id = $work_id )as emp_name,(SELECT customer.cus_name from work inner join customer on customer.cus_id = work.cus_id WHERE work.work_id = $work_id )as cus_name ,(SELECT customer.cus_address from work inner join customer on customer.cus_id = work.cus_id WHERE work.work_id = $work_id )as cus_addr , (SELECT customer.cus_phone from work inner join customer on customer.cus_id = work.cus_id WHERE work.work_id = $work_id )as cus_phone , (SELECT customer.cus_location from work inner join customer on customer.cus_id = work.cus_id WHERE work.work_id = $work_id )as cus_location FROM site_survey WHERE work_id =  $work_id";

// $sql = "SELECT work_description,work_date,work_type,work.emp_id,work_id,emp_name FROM work INNER JOIN employee ON employee.emp_id = work.emp_id where work.work_created_by = $emp_id and work.work_assign_status ='accept' and work.work_com_status = 'incomplete' and work.emp_id != $emp_id ORDER BY work_date";

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


