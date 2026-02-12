<?php
 include 'db_head.php';

 $bom_id = test_input($_GET['bom_id']);


 
 
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
   ifnull(bom_correction.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input.part_id and bolist.component_cat <> \"Process\" and  component_cat <> \"Porcess\" LIMIT 1)) as bomlist_id,IF(
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
       (SELECT JSON_ARRAYAGG(JSON_OBJECT('bom_id',bo1.bom_id,'component_cat',bo1.component_cat)) from bom_output bo1 WHERE bo1.part_id = bom_input.part_id and bo1.component_cat <> \"Process\" GROUP BY bo1.part_id having count(bo1.part_id)>1) as bom_list,
       0 as level

FROM bom_output
INNER JOIN bom_input
    ON bom_output.bom_id = bom_input.bom_id
INNER JOIN parts_tbl out_part
    ON out_part.part_id = bom_output.part_id
INNER JOIN parts_tbl in_part
    ON in_part.part_id = bom_input.part_id
LEFT JOIN bom_correction
    ON bom_input.part_id = bom_correction.part_id
   AND bom_correction.outpart_bom_id = 570

WHERE bom_output.bom_id = 570
UNION ALL
SELECT 
 bom_output_child.bom_id AS parent_bom_id,
    bom_output_child.component_cat,
    bom_output_child.part_id AS output_part_id,
    bom_input_child.part_id AS input_part_id,
    bom_input_child.qty,
    out_part_child.part_name AS output_part_name,
    in_part_child.part_name AS input_part_name,
    ifnull(bom_correction_child.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input_child.part_id and bolist.component_cat <> \"Process\" and component_cat <> \"Porcess\" LIMIT 1)) as bomlist_id,

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
       (SELECT JSON_ARRAYAGG(JSON_OBJECT('bom_id',bo1.bom_id,'component_cat',bo1.component_cat)) from bom_output bo1 WHERE bo1.part_id = bom_input_child.part_id and bo1.component_cat <> \"Process\" GROUP BY bo1.part_id having count(bo1.part_id)>1) as bom_list,
       level +1 as level



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
   AND bom_correction_child.outpart_bom_id = 570 
   WHERE bom_output_child.component_cat <> \"Process\" AND  bom_hi.correction_status = 'valid')
   SELECT * FROM bom_hi order by level";

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


