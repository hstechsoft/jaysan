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


