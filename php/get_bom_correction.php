<?php
 include 'db_head.php';

 $bom_id = test_input($_GET['bom_id']);
 $correction_sts = test_input($_GET['correction_sts']);
 $duplication_sts = test_input($_GET['duplication_sts']);
$correction_sts_query = "1";
$duplication_sts_query = "1";
if($correction_sts == "'invalid'")
    $correction_sts_query = "correction_status = 'invalid'";
if($duplication_sts == "'duplicate'")
    $duplication_sts_query = "if(FIND_IN_SET(bomlist_id,path)>0,'duplicate','valid') = 'duplicate'";
if($duplication_sts == "'valid'")
    $duplication_sts_query = "if(FIND_IN_SET(bomlist_id,path)>0,'duplicate','valid') = 'valid'";

if($bom_id == "''")
{
// get bom id from bom_output table using part_id and component_cat
$component_cat = test_input($_GET['component_cat']);
$part_id = test_input($_GET['part_id']);
$sql = "SELECT bom_id FROM bom_output WHERE part_id = $part_id AND component_cat = $component_cat LIMIT 1";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $bom_id = $row['bom_id'];
} else {
    echo "0 result";
    exit;
}
}
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



 $sql = "with RECURSIVE bom_hi as(SELECT
    bom_output.bom_id AS parent_bom_id,
    bom_output.component_cat,
    bom_output.part_id AS output_part_id,
    bom_input.part_id AS input_part_id,
    bom_input.qty,
    out_part.part_name AS output_part_name,
    in_part.part_name AS input_part_name,
   ifnull(bom_correction.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input.part_id and bolist.component_cat <> 'Process' and  component_cat <> 'Porcess' LIMIT 1)) as bomlist_id,

    IF(
        bom_correction.bomlist_id IS NULL,
        IF(
            (SELECT COUNT(bo.bom_id)
             FROM bom_output bo
             WHERE bo.part_id = bom_input.part_id
               AND bo.component_cat <> 'Process'
            ) > 1,
            'invalid',
            'valid'
        ),
        'valid'
    ) AS correction_status,
       (SELECT JSON_ARRAYAGG(JSON_OBJECT('bom_id',bo1.bom_id,'component_cat',bo1.component_cat)) from bom_output bo1 WHERE bo1.part_id = bom_input.part_id and bo1.component_cat <> 'Process' GROUP BY bo1.part_id having count(bo1.part_id)>1) as bom_list,
       0 as level,
       CAST(bom_output.bom_id AS CHAR(2000)) AS path,
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


WHERE bom_output.bom_id = $bom_id
UNION ALL
SELECT 
 bom_output_child.bom_id AS parent_bom_id,
    bom_output_child.component_cat,
    bom_output_child.part_id AS output_part_id,
    bom_input_child.part_id AS input_part_id,
    bom_input_child.qty,
    out_part_child.part_name AS output_part_name,
    in_part_child.part_name AS input_part_name,
    ifnull(bom_correction_child.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input_child.part_id and bolist.component_cat <> 'Process' and component_cat <> 'Porcess' LIMIT 1)) as bomlist_id,
--    ifnull(bom_correction.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input.part_id and bolist.component_cat <> 'Process' and  component_cat <> 'Porcess' LIMIT 1)) as bomlist_id
    IF(
        bom_correction_child.bomlist_id IS NULL,
        IF(
            (SELECT COUNT(bo.bom_id)
             FROM bom_output bo
             WHERE bo.part_id = bom_input_child.part_id
               AND bo.component_cat <> 'Process'
            ) > 1,
            'invalid',
            'valid'
        ),
        'valid'
    ) AS correction_status,
       (SELECT JSON_ARRAYAGG(JSON_OBJECT('bom_id',bo1.bom_id,'component_cat',bo1.component_cat)) from bom_output bo1 WHERE bo1.part_id = bom_input_child.part_id and bo1.component_cat <> 'Process' GROUP BY bo1.part_id having count(bo1.part_id)>1) as bom_list,
       level +1 as level,
    CONCAT(bom_hi.path, ',', bom_output_child.bom_id) AS path,
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
   WHERE bom_output_child.component_cat <> 'Process' AND  bom_hi.correction_status = 'valid'  AND FIND_IN_SET(bom_output_child.bom_id, bom_hi.path) = 0)
   SELECT bom_hi.*,if(FIND_IN_SET(bomlist_id,path)>0,'duplicate','valid') as duplication_status FROM bom_hi WHERE $duplication_sts_query and $correction_sts_query order by level;";

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


