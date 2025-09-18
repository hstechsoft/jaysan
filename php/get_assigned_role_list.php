<?php
 include 'db_head.php';

 
 $title_id = $_GET['title_id'];
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($title_id == '0')
 $sql = "SELECT DISTINCT  emp_menu.menu_id,  emp_menu.role        
   FROM  emp_menu 
          INNER JOIN att_approval_chart ON  emp_menu.menu_id = att_approval_chart.role_id";
else
$sql = "SELECT DISTINCT emp_menu.menu_id,  emp_menu.role        
FROM  emp_menu 
INNER JOIN att_approval_chart ON  emp_menu.menu_id = att_approval_chart.role_id where title_id = $title_id";
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



