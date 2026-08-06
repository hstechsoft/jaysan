<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




//report for web lead only
 $sql = "with exp as (select sum(exp_amount) as total_amount,exp_emp_id from expense WHERE exp_emp_id = $emp_id and exp_approve = 'yes'),
exp_payment as (SELECT sum(ep.paid_amount) as total_paid,ep.emp_id from expense_payment ep WHERE ep.emp_id = $emp_id)


SELECT ifnull(total_paid,0) - ifnull(total_amount,0)  as total_due  FROM exp left JOIN  exp_payment on exp.exp_emp_id = exp_payment.emp_id
";
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


