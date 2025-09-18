<?php
 include 'db_head.php';

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT GROUP_CONCAT(app_menu_master.menu_name SEPARATOR ',')as menu_list,role FROM `app_menu` INNER JOIN app_menu_master on app_menu.app_menu_id = app_menu_master.id GROUP by role ";



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


