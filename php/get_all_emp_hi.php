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

$sql = "SELECT * FROM employee WHERE employee.emp_role IN( WITH RECURSIVE role_hierarchy AS (
    SELECT  employee_role, 1 AS depth
    FROM role_assign
    WHERE owner_role = (SELECT employee.emp_role FROM employee WHERE employee.emp_id = $emp_id)
    UNION ALL
    SELECT a.employee_role, rh.depth + 1
    FROM role_assign a
    INNER JOIN role_hierarchy rh ON a.owner_role = rh.employee_role
  )
  SELECT DISTINCT employee_role
  FROM role_hierarchy
  ORDER BY depth);";

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


