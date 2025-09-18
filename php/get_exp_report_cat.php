<?php
 include 'db_head.php';

 $date_query_start = ($_GET['date_query_start']);
 $date_query_end = ($_GET['date_query_end']);
 $emp_id = test_input($_GET['emp_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




//report for web lead only
 $sql = "SELECT exp_cat , sum(exp_amount)as amount FROM expense WHERE exp_approve = 'yes' and exp_date BETWEEN $date_query_start AND $date_query_end and exp_emp_id = $emp_id  GROUP by exp_cat";
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


