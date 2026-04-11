<?php
 include 'db_head.php';


 $output_part =test_input($_GET['output_part']);
 $component_cat =test_input($_GET['component_cat']);
 $is_default =test_input($_GET['is_default']);
 $process_id =test_input($_GET['process_id']);

 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
$result = array();

// check changed default is 0 if yes need to update 1 to other process title if there is more then one process

if($is_default == '0'){
$sql_check_occurance = "select JSON_ARRAYAGG((JSON_OBJECT('process_id', process_id, 'process_title', process_title))) as processes, count(*) as count from process_wel_tbl where  output_part = $output_part and component_cat = $component_cat and cat = 'out';";
$result_check_occurance = $conn->query($sql_check_occurance);
$row_check_occurance = $result_check_occurance->fetch_assoc();
// there is more then one process so need to print its process id,title and ask user to select one to be default
if($row_check_occurance['count'] > 1){
  $result['processes'] = json_decode($row_check_occurance['processes']);
  $result['status'] = 'select';
  $conn->close();
  echo json_encode($result);
  exit();
}
// here there is only one process so we do not allow to update default to 0 because there must be one default process
else{
  $result['status'] = 'only_one';
  $conn->close();
  echo json_encode($result);
  exit();
}
}
else if ($is_default == '1'){
  // here we need to update all other process default to 0 because only one process can be default
  $sql_update_all = "update process_wel_tbl set is_default = '0' where output_part = $output_part and component_cat = $component_cat and cat = 'out';";
  if ($conn->query($sql_update_all) === TRUE) {
$sql_update = "update process_wel_tbl set is_default = $is_default where process_id = $process_id;";

  if ($conn->query($sql_update) === TRUE) {
     $result['status'] = 'ok';
    
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }
  } else {
    echo "Error: " . $sql_update_all . "<br>" . $conn->error;
  }


}


echo json_encode($result);
    
  



$conn->close();

 ?>


