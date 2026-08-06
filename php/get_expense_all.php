<?php
 include 'db_head.php';

 

 $sql = " with approved_exp as (select sum(exp_amount) as total_amount,exp_emp_id from expense WHERE exp_approve = 'yes' GROUP BY exp_emp_id),
    declined_exp as (select sum(exp_amount) as total_declined,exp_emp_id from expense WHERE exp_approve = 'decline' GROUP BY exp_emp_id),
    unapproved_exp as (select sum(exp_amount) as total_unapproved,exp_emp_id from expense WHERE exp_approve = 'no' GROUP BY exp_emp_id),
    paid_exp as (SELECT sum(ep.paid_amount) as total_paid,ep.emp_id from expense_payment ep GROUP BY ep.emp_id)
    SELECT
        ifnull(total_amount,0) as approve,
        ifnull(total_declined,0) as decline,
        ifnull(total_unapproved,0) as un_approve,
        ifnull(total_paid,0) as amount_paid,
        emp.emp_id,
        emp.emp_name,
    FROM
        employee emp
        LEFT JOIN approved_exp on emp.emp_id = approved_exp.exp_emp_id
        LEFT JOIN declined_exp on emp.emp_id = declined_exp.exp_emp_id
        LEFT JOIN unapproved_exp on emp.emp_id = unapproved_exp.exp_emp_id
        LEFT JOIN paid_exp on emp.emp_id = paid_exp.emp_id";

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


