<?php
include 'db_head.php';


$email = test_input($_POST['email']);


function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = "'" . $data . "'";
    return $data;
}


$sql = "SELECT emp.emp_id, emp.emp_name, emp.emp_role, emp.emp_approve, atten.id AS attendance_id, atten.status AS attendance_status, atten.start_time FROM employee AS emp LEFT JOIN attendance AS atten ON atten.emp_id = emp.emp_id AND atten.dated = CURDATE() WHERE emp.emp_email = $email ORDER BY atten.id DESC LIMIT 1;";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while ($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
        $_SESSION['user_id'] = $r['emp_id'];
        $_SESSION['role']    = $r['emp_role'];
    }
    print json_encode($rows);
} else {
    echo "0 result";
}
$conn->close();
?>