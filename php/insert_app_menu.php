<?php
 include 'db_head.php';

 

 $menu =($_GET['menu']);
 $role =test_input($_GET['role']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$menu_array = explode(',', $menu);
foreach($menu_array as $value) {
 
 $sql =  "INSERT INTO app_menu ( role,app_menu_id) VALUES ($role, (select app_menu_master.id from  app_menu_master where menu_name =   '$value'))";


  if ($conn->query($sql) === TRUE) {
  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  }
  echo "ok";
$conn->close();

 ?>


