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
        WHERE bo.bom_id  = $bom_in_id and out_part.sub_ass = 1 
 
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
   inner join parts_tbl on bom_hi.input_part = parts_tbl.part_id
   ";

   echo $sql_get_sub_parts;

$result = $conn->query($sql_get_sub_parts);
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $part_array[] = $row;
  }
} else {
  $part_array = array();
}


$result_json['data'] = $part_array;
echo json_encode($result_json);
$conn->close();
exit();

 $sql =  "DELETE  FROM bom_input WHERE bom_in_id =  $bom_in_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


