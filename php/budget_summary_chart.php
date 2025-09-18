<?php
 include 'db_head.php';

 $pbid = ($_GET['pbid']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

//select from two table and join together

$sql = "SELECT * FROM (SELECT SUM(yearly) as 'total_savings' from budget_savings WHERE pbid = $pbid) as total_save ,(SELECT SUM(yearly) as 'total_income' from budget_income WHERE pbid = $pbid) as total_income, (SELECT SUM(budget_child_exp.total)+ SUM(budget_festival_exp.total) + SUM(budget_health_exp.total)+ SUM(budget_holiday_exp.total)+ SUM(budget_insurance_exp.total)+ SUM(budget_loan_exp.total)+ SUM(budget_misc.total)+ SUM(budget_movies_exp.total)+ SUM(budget_home_exp.total) as 'total_expenses' from (SELECT sum(yearly) as total FROM budget_child_exp WHERE pbid = $pbid) as budget_child_exp , (SELECT sum(yearly) as total FROM budget_festival_exp WHERE pbid = $pbid) as budget_festival_exp , (SELECT sum(yearly) as total FROM budget_tax_exp WHERE pbid = $pbid) as budget_tax_exp,(SELECT sum(yearly) as total FROM budget_health_exp WHERE pbid = $pbid) as budget_health_exp ,(SELECT sum(yearly) as total FROM budget_holiday_exp WHERE pbid = $pbid) as budget_holiday_exp ,(SELECT sum(yearly) as total FROM budget_home_exp WHERE pbid = $pbid) as budget_home_exp ,(SELECT sum(yearly) as total FROM budget_insurance_exp WHERE pbid = $pbid) as budget_insurance_exp ,(SELECT sum(yearly) as total FROM budget_loan_exp WHERE pbid = $pbid) as budget_loan_exp  ,(SELECT sum(yearly) as total FROM budget_misc WHERE pbid = $pbid) as budget_misc ,(SELECT sum(yearly) as total FROM budget_movies_exp WHERE pbid = $pbid) as budget_movies_exp ) as total_exp"   ;

// $sql = "SELECT work.work_type,work_history.his_status,COUNT(work_history.his_status) as total FROM work_history left JOIN work ON work_history.work_id = work.work_id WHERE  work_history.emp_id = $emp_id and work_history.his_date between  $start_date and  $end_date GROUP BY work_type,his_status ORDER by work.work_type ";




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


