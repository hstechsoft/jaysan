<?php
 include 'db_head.php';
 
 $phone_id =test_input($_GET['phone_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT app_menu_master.iswebview,app_menu_master.menu_name,app_menu_master.menu_url,app_menu_master.menu_icon,app_menu_master.menu_id FROM app_menu INNER join app_menu_master on app_menu.app_menu_id = app_menu_master.id WHERE role = (SELECT employee.emp_role FROM employee WHERE employee.emp_phone_id = $phone_id) ORDER by app_menu_master.menu_id ASC";



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


