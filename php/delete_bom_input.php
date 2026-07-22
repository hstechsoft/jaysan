<?php
 include 'db_head.php';

 $bom_in_id = test_input($_POST['bom_in_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$result_json = array();
$part_array = array();

$ori_bom_id = 0;
try 
{
  $conn->begin_transaction();
// get bom_id from bom_input table
$sql_get_bom_id = "select bom_id from bom_input where bom_in_id = $bom_in_id";
$result = $conn->query($sql_get_bom_id);
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $ori_bom_id = $row['bom_id'];
  }
} else {
  $ori_bom_id = 0;
}


// get bom id from bom_input table
$sql_get_bom_id = "select group_concat(bom_output.bom_id) as bom_id from bom_input
   inner join  bom_output on bom_input.part_id = bom_output.part_id
   inner join parts_tbl on bom_output.part_id = parts_tbl.part_id
    WHERE bom_in_id = $bom_in_id and parts_tbl.sub_ass = 1 group by bom_input.part_id;";
    $result = $conn->query($sql_get_bom_id);
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $bom_id = $row['bom_id'];
    $result_json['deleted_bom_id'] = $bom_id;
  }
} else {
  $bom_id = 0;
  $result_json['deleted_bom_id'] = $bom_id;
}

if($bom_id > 0)
{



$sql_get_sub_parts = " WITH RECURSIVE bom_hi AS (

        /* ========= Anchor ========= */
        SELECT
        bo.bom_id,
       
            bi.part_id AS input_part,
            bi.qty - bi.sub_ass_qty AS qty,
          in_part.sub_ass,
            0 AS level
          
        FROM bom_output bo
          inner join parts_tbl out_part
            ON bo.part_id = out_part.part_id
        JOIN bom_input bi ON bo.bom_id = bi.bom_id
      INNER JOIN parts_tbl in_part
    
    ON in_part.part_id = bi.part_id
        WHERE bo.bom_id  = $bom_id and out_part.sub_ass = 1 
 
        UNION ALL

        /* ========= Recursive ========= */
        SELECT
        boc.bom_id,
      
            bi.part_id AS input_part,
          
            bi.qty -  bi.sub_ass_qty as qty,
          
           in_part.sub_ass,
            h.level + 1
        


        FROM bom_output boc
        JOIN bom_hi h
            ON boc.part_id = h.input_part and h.sub_ass = 1
       
        JOIN bom_input bi ON boc.bom_id = bi.bom_id
       join parts_tbl in_part
    ON in_part.part_id = bi.part_id
        WHERE boc.component_cat <> 'Process' 
       
   )

   SELECT bom_hi.*,parts_tbl.part_name from bom_hi
   inner join parts_tbl on bom_hi.input_part = parts_tbl.part_id group by bom_hi.input_part
   ";



$result = $conn->query($sql_get_sub_parts);
if ($result->num_rows > 0) {
  $result_json['sub_bom_parts'] = true;
  while($row = $result->fetch_assoc()) {
    $part_array[] = $row;
  }
} else {
  $part_array = array();
}

if(count($part_array) > 0)
{
//  reduce part qty in bom_input table
  foreach($part_array as $part)
  {
    $input_part_id = $part['input_part'];
    $qty = $part['qty'];
    $sql_update_qty = "update bom_input set sub_ass_qty = sub_ass_qty - $qty where part_id = $input_part_id and bom_id = $ori_bom_id";
    if ($conn->query($sql_update_qty) === TRUE) {
      // qty updated successfully
    } else {
      // error updating qty
      $result_json['success'] = false;
      $result_json['message'] = "Error updating qty for part_id: " . $input_part_id . " in bom_id: " . $bom_id;
      echo json_encode($result_json);
      $conn->close();
      exit();
    }
  }
}



}



 $sql =  "DELETE  FROM bom_input WHERE bom_in_id =  $bom_in_id";

  if ($conn->query($sql) === TRUE) {
   $conn->commit();
    $result_json['success'] = true;
    $result_json['message'] = "BOM input deleted successfully";
    echo json_encode($result_json);
  } else {
    throw new Exception("Error deleting bom_input: " . $conn->error);
  }
  $conn->close();
} catch (Exception $e) {
  $conn->rollback();
  $result_json['success'] = false;
  $result_json['message'] = $e->getMessage();
  echo json_encode($result_json);
  $conn->close();
  exit();
}

 ?>


