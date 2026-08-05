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
 $sql = "SELECT ifnull( sum(ifnull(expense.exp_amount, 0)) - sum(ifnull(expense_payment.paid_amount, 0)),0 )as total_due FROM expense inner join expense_payment on expense.exp_emp_id = expense_payment.emp_id where expense.exp_approve = 'yes' and expense.exp_emp_id = $emp_id";
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


