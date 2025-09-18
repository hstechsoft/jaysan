<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);;

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= "WITH RECURSIVE employee_hierarchy AS (
    -- Anchor query: Get initial set of employees with their managers
    SELECT emp_id, emp_role, owner_role 
    FROM employee 
    INNER JOIN role_assign ON employee.emp_role = role_assign.employee_role 
    WHERE role_assign.owner_role = (SELECT employee.emp_role 
                                    FROM employee 
                                    WHERE employee.emp_id =  $emp_id)

    UNION ALL

    -- Recursive query: Get subordinates of employees found in previous steps
    SELECT e.emp_id, e.emp_role, r.owner_role 
    FROM employee e
    INNER JOIN role_assign r ON e.emp_role = r.employee_role
    INNER JOIN employee_hierarchy eh ON r.owner_role = eh.emp_role
)

-- Main query: Get attendance details for employees in the hierarchy
SELECT 
    emp.emp_id,
    emp.emp_name,
    emp.emp_phone_id,
    emp.emp_phone,
    IF(att.login_time IS NULL, 'absent', IF(att.logout_time = '0', 'present', 'logout')) AS status,  dated, (select sts from att_verify WHERE emp_id = emp.emp_id AND dated >= CURDATE() AND dated < CURDATE() + INTERVAL 1 DAY) as att_verify,
 ifnull(ex.total,0) as amount
    
FROM employee as emp
LEFT JOIN (
    SELECT 
        a.phone_id,
        FROM_UNIXTIME(a.login_time / 1000) AS login_time,
        IF(a.logout_time = 0, '0', FROM_UNIXTIME(a.logout_time / 1000)) AS logout_time, 
        FROM_UNIXTIME(a.dated / 1000) AS dated
    FROM attendance a
    JOIN (
        SELECT phone_id, MAX(dated) AS max_dated
        FROM attendance
        WHERE dated BETWEEN UNIX_TIMESTAMP(CONCAT(CURDATE(), ' 00:00:00')) * 1000 
          AND UNIX_TIMESTAMP(NOW()) * 1000 
        GROUP BY phone_id
    ) AS last_record
    ON a.phone_id = last_record.phone_id AND a.dated = last_record.max_dated
) AS att
ON att.phone_id = emp.emp_phone_id  
LEFT JOIN (
    SELECT  expense.exp_emp_id,sum(expense.exp_amount) as total
    FROM expense
    WHERE  expense.exp_approve = 'no' GROUP by expense.exp_emp_id
) ex ON emp.emp_id = ex.exp_emp_id

WHERE emp.emp_id IN (SELECT emp_id FROM employee_hierarchy);";

// Execute the multi_query
if ($conn->multi_query($sql)) {
    // This loop is used to handle multiple result sets
    do {
        // Store the result set from the query
        if ($result = $conn->store_result()) {
            if ($result->num_rows > 0) {
                $rows = array();
                while($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                // Output the result as JSON
                print json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free(); // Free the result set
        }
        // Check if there are more result sets
    } while ($conn->more_results() && $conn->next_result());
} else {
    // If the multi_query fails, output the error
    echo "Error: " . $conn->error;
}
$conn->close();

 ?>


