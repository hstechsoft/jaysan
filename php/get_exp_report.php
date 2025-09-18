<?php
 include 'db_head.php';

 $date_query_start = ($_GET['date_query_start']);
 $date_query_end = ($_GET['date_query_end']);
 $emp_id_query = ($_GET['emp_id_query']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




//report for web lead only
 $sql = "SELECT expense.*, employee.emp_name FROM expense inner join employee on expense.exp_emp_id = employee.emp_id WHERE exp_approve = 'yes' and exp_date BETWEEN $date_query_start AND $date_query_end and $emp_id_query order by exp_date";
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


