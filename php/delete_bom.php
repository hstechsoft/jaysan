<?php
 include 'db_head.php';

 $bom_id = test_input($_POST['bom_id']);
//  convert bom_id to numeric value
 $bom_id = intval($bom_id);

if($bom_id <= 0)
{
 
  echo "bom_id is required";
  $conn->close();
  exit();
}
 $result_json = array();
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
// $part_array = array();

// // get bom_input of bom id and get part id
// $sql_get_part_id = "select bo.part_id,bi.bom_id,parts_tbl.part_name
// from bom_output bo
// inner join bom_input bi on bo.part_id = bi.part_id
// inner join bom_output bo_i on bi.bom_id = bo_i.bom_id
// inner join parts_tbl on bo_i.part_id = parts_tbl.part_id
// WHERE bo.bom_id = $bom_id;";

// $result = $conn->query($sql_get_part_id);
// if ($result->num_rows > 0) {
  
//   while($row = $result->fetch_assoc()) {
//     $part_array[] = $row;
    

//   }
  
// // if there is record exit and show error message
// $result_json['success'] = false;
// $result_json['message'] = "BOM cannot be deleted because it is used in other BOMs";
// $result_json['data'] = $part_array;
//   echo json_encode($result_json);
//   $conn->close();
//   exit();

// }

// get part_id ,component_cat  from bom_output before deleting
$sql_get_bom_output = "SELECT part_id, component_cat FROM bom_output WHERE bom_id = $bom_id";
$result_get_bom_output = $conn->query($sql_get_bom_output);
$component_cat = "";
$output_part = "";

if ($result_get_bom_output && $result_get_bom_output->num_rows > 0) {
    while ($row = $result_get_bom_output->fetch_assoc()) {
        $component_cat = $row['component_cat'];
        $output_part = $row['part_id'];
    }
}

// check if there is data in process_wel_tbl for the output part before deleting BOM
$sql_check_process = "SELECT * FROM process_wel_tbl WHERE output_part = $output_part and component_cat = '$component_cat'";
$result_check_process = $conn->query($sql_check_process);
if ($result_check_process && $result_check_process->num_rows > 0) {
    $result_json['success'] = false;
    $result_json['message'] = "BOM cannot be deleted because the output part is used in processes";
   
    $conn->close();
    exit();
}

 $sql =  "delete from bom_output where bom_id = $bom_id;";

  if ($conn->query($sql) === TRUE) {
   
    $result_json['success'] = true;
    $result_json['message'] = "BOM deleted successfully";
    echo json_encode($result_json);
  } else {
    $result_json['success'] = false;
    $result_json['message'] = "Error: " . $sql . "<br>" . $conn->error;
    echo json_encode($result_json);
  }
$conn->close();

 ?>


