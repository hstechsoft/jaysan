<?php
 include 'db_head.php';


$part_id = test_input($_GET['part_id']);
$component_cat = test_input($_GET['component_cat']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


// get_bom id form part id
$sql_get_bom = "select bom_id from bom_output where part_id = $part_id and component_cat = $component_cat and component_cat <> 'Process' and component_cat <> 'Porcess' LIMIT 1";
$result = $conn->query($sql_get_bom);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $bom_id = $row['bom_id'];
} else {
    echo "0 result";
    exit(0);
}


//  $sql = "SELECT (SELECT 1 FROM process_wel_tbl WHERE process_wel_tbl.output_part =  parts_tbl.part_id   and cat = 'out')  as process_availble, (select part_name from parts_tbl where part_id = $part_id) as out_part_name,(select sub_ass from parts_tbl where part_id = bom_input.part_id) as sub_ass, bom_input.part_id,bom_input.qty,parts_tbl.part_name,bom_input.bom_id,parts_tbl.part_no from bom_input INNER JOIN bom_output on bom_input.bom_id = bom_output.bom_id INNER JOIN parts_tbl on bom_input.part_id = parts_tbl.part_id WHERE bom_output.part_id =$part_id and bom_output.component_cat = $component_cat";

// $result = $conn->query($sql);

// if ($result->num_rows > 0) {
//     $rows = array();
//     while($r = mysqli_fetch_assoc($result)) {
//         $rows[] = $r;
//     }
//     print json_encode($rows);
// } else {
//   echo "0 result";
// }


require __DIR__ . '/bom_correction_check.php';
if(correction_check_fn($conn, (int)str_replace("'", "", $bom_id))) {
    $conn->close();
    echo "Correction needed";
    exit(0);

} 


$sql_get_all_bom =  "
with RECURSIVE bom_hi as(SELECT
    bom_output.bom_id AS parent_bom_id,
    bom_output.component_cat,
    bom_output.part_id AS output_part_id,
    bom_input.part_id AS input_part_id,
    bom_input.qty,
    bom_input.sub_ass_qty,
    out_part.part_name AS output_part_name,
    in_part.part_name AS input_part_name,
   ifnull(bom_correction.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input.part_id and bolist.component_cat <> 'Process' and  component_cat <> 'Porcess' LIMIT 1)) as bomlist_id,


       0 as level,
       CAST(bom_output.part_id AS CHAR(2000)) AS path,
       CAST(out_part.part_name  AS CHAR(2000)) AS part_path
    



FROM bom_output
INNER JOIN bom_input
    ON bom_output.bom_id = bom_input.bom_id
INNER JOIN parts_tbl out_part
    ON out_part.part_id = bom_output.part_id
INNER JOIN parts_tbl in_part
    ON in_part.part_id = bom_input.part_id
LEFT JOIN bom_correction
    ON bom_input.part_id = bom_correction.part_id
   AND bom_correction.outpart_bom_id = $bom_id and bom_correction.bom_output_id = bom_output.bom_id
  

WHERE bom_output.bom_id = $bom_id and in_part.sub_ass = 0
UNION ALL
SELECT 
 bom_output_child.bom_id AS parent_bom_id,
    bom_output_child.component_cat,
    bom_output_child.part_id AS output_part_id,
    bom_input_child.part_id AS input_part_id,
    bom_input_child.qty * bom_hi.qty AS qty,
    bom_input_child.sub_ass_qty * bom_hi.qty AS sub_ass_qty,
    out_part_child.part_name AS output_part_name,
    in_part_child.part_name AS input_part_name,
    ifnull(bom_correction_child.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input_child.part_id and bolist.component_cat <> 'Process' and component_cat <> 'Porcess' LIMIT 1)) as bomlist_id,
--    ifnull(bom_correction.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input.part_id and bolist.component_cat <> 'Process' and  component_cat <> 'Porcess' LIMIT 1)) as bomlist_id
 
       level +1 as level,
    CONCAT(bom_hi.path, ',', bom_output_child.part_id) AS path,
    CONCAT(bom_hi.part_path, '->', out_part_child.part_name) AS part_path



FROM bom_output bom_output_child
inner join bom_hi on bom_hi.bomlist_id = bom_output_child.bom_id
INNER JOIN bom_input bom_input_child
    ON  bom_output_child.bom_id = bom_input_child.bom_id
INNER JOIN parts_tbl out_part_child
    ON out_part_child.part_id = bom_output_child.part_id
INNER JOIN parts_tbl in_part_child
    ON in_part_child.part_id = bom_input_child.part_id
LEFT JOIN bom_correction bom_correction_child
    ON bom_input_child.part_id = bom_correction_child.part_id
   AND bom_correction_child.outpart_bom_id = $bom_id and bom_correction_child.bom_output_id = bom_output_child.bom_id
  
   WHERE in_part_child.sub_ass = 0)
   SELECT bom_hi.* FROM bom_hi WHERE 1 order by level;";
$result = $conn->query($sql_get_all_bom);

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


