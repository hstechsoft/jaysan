<?php
 include 'db_head.php';

 $bom_id = test_input($_POST['bom_id']);

if($bom_id == "''")
{
  http_response_code(400);
  echo "bom_id is required";
  $conn->close();
  exit();
}
 $result_json = array();
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// get bom_input of bom id and get part id
$sql_get_part_id = "select bo.part_id,bi.bom_id,parts_tbl.part_name
from bom_output bo
left join bom_input bi on bo.part_id = bi.part_id
left join bom_output bo_i on bi.bom_id = bo_i.bom_id
left join parts_tbl on bi.part_id = parts_tbl.part_id
WHERE bo.bom_id = $bom_id;";

$result = $conn->query($sql_get_part_id);
if ($result->num_rows > 0) {
  
  while($row = $result->fetch_assoc()) {
    $result_json[] = $row;
    

  }
  
// if there is record exit and show error message
  http_response_code(400);
  echo "Cannot delete BOM because it is used in part: " . $result_json[0]['part_name'] . " (ID: " . $result_json[0]['part_id'] . ")";
  $conn->close();
  exit();

}



 $sql =  "delete from bom_output where bom_id = $bom_id;";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


