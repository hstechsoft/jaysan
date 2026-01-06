<?php
 include 'db_head.php';



$sub_group_json = $_POST['sub_group_json'];
  $sub_group = json_decode($sub_group_json, true);
 
 
function test_input($data) {


$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


foreach ($sub_group as $row) {
      $sub_group_name = test_input($row['sub_group_name']);
      $group_id = test_input($row['group_id']);

       $sql = "INSERT INTO customer_subgroup_master ( sub_group_name,group_id) VALUES ($sub_group_name,$group_id) on duplicate key update sub_group_name = $sub_group_name";

  if ($conn->query($sql) === TRUE) {
 
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
    }
  echo "ok";

$conn->close();

 ?>


