<?php
 include 'db_head.php';


 $role = test_input($_GET['role_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}






$sql = "SELECT  GROUP_CONCAT('<li class=\"list-group-item d-flex justify-content-between align-items-center\" data-id =',a_role_id,'> <span class=\"d-flex align-items-center flex-grow-1\">',role, '</span> <button type=\"button\" class=\"btn btn-outline-danger border-0\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button></li>' SEPARATOR  '\n')as rules, att_approval_chart.role_id,emp_menu.role,att_approval_chart.eag,att_approval_chart.role_id FROM att_approval_chart INNER JOIN emp_menu on emp_menu.menu_id = att_approval_chart.a_role_id WHERE role_id= $role GROUP by eag ";

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


