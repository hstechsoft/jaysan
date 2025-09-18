<?php
 include 'db_head.php';

 $emp_id =test_input($_GET['emp_id']);


 function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = "'".$data."'";
    return $data;
    }

 $sql = "SELECT * from (SELECT  IFNULL(sum(exp_amount),0)as unapproved  FROM `expense` WHERE exp_approve = 'no' and exp_emp_id = $emp_id) as u , (SELECT  IFNULL(sum(exp_amount),0)as decline  FROM `expense` WHERE exp_approve = 'decline' and exp_emp_id = $emp_id) as decline ";

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


