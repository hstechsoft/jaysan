<?php
 include 'db_head.php';

 $emp_id =($_GET['emp_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT
    emp.emp_phone_id,
    a.dated,
    a.login_time,
    a.logout_time,
    IF(
        a.login_time > 0 AND a.logout_time = 0,
        'present',
        (
            IF(
                a.login_time IS NULL,
                'absent',
                'logout'
            )
        )
    ) AS
status
    ,
    emp.emp_name,
    emp.emp_phone,
    emp.emp_id
FROM
    (
    SELECT
        att.phone_id,
        att.dated,
        att.login_time,
        att.logout_time
    FROM
        attendance att
    INNER JOIN(
        SELECT
            phone_id,
            MAX(dated) AS last_dated
        FROM
            attendance
        WHERE
            dated BETWEEN UNIX_TIMESTAMP(CURDATE()) * 1000 AND UNIX_TIMESTAMP(NOW()) * 1000
        GROUP BY
            phone_id) max_dates
        ON
            att.phone_id = max_dates.phone_id AND att.dated = max_dates.last_dated) a
        RIGHT JOIN(SELECT      employee.emp_name,
                employee.emp_phone_id,
                employee.emp_phone,
                employee.emp_id FROM employee WHERE employee.emp_role IN( WITH RECURSIVE role_hierarchy AS (
    SELECT  employee_role
    FROM role_assign
    WHERE owner_role = (SELECT employee.emp_role FROM employee WHERE employee.emp_id = $emp_id)
    UNION ALL
    SELECT a.employee_role
    FROM role_assign a
    INNER JOIN role_hierarchy rh ON a.owner_role = rh.employee_role
  )
  SELECT DISTINCT employee_role
  FROM role_hierarchy
 )
            ) emp
    ON
        a.phone_id = emp.emp_phone_id
    ORDER BY
STATUS
DESC";

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


