<?php





function modify_payment(mysqli $conn, int $oid, int $customer_id)
{
  

$sql = "
with RECURSIVE bom_hi as(SELECT
    bom_output.bom_id AS parent_bom_id,
    bom_output.component_cat,
    bom_output.part_id AS output_part_id,
    bom_input.part_id AS input_part_id,
    bom_input.qty,
    out_part.part_name AS output_part_name,
    in_part.part_name AS input_part_name,
   (SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input.part_id and bolist.component_cat <> 'Process' and  component_cat <> 'Porcess' LIMIT 1) as bomlist_id,

 
       0 as level,
       CAST(bom_output.part_id AS CHAR(2000)) AS path,
       CAST(out_part.part_name  AS CHAR(2000)) AS part_path,
       in_part.sub_ass



FROM bom_output
INNER JOIN bom_input
    ON bom_output.bom_id = bom_input.bom_id
INNER JOIN parts_tbl out_part
    ON out_part.part_id = bom_output.part_id
INNER JOIN parts_tbl in_part
    ON in_part.part_id = bom_input.part_id


WHERE bom_output.bom_id = 895
UNION ALL
SELECT 
 bom_output_child.bom_id AS parent_bom_id,
    bom_output_child.component_cat,
    bom_output_child.part_id AS output_part_id,
    bom_input_child.part_id AS input_part_id,
    bom_input_child.qty,
    out_part_child.part_name AS output_part_name,
    in_part_child.part_name AS input_part_name,
    (SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input_child.part_id and bolist.component_cat <> 'Process' and component_cat <> 'Porcess' LIMIT 1) as bomlist_id,
--    ifnull(bom_correction.bomlist_id,(SELECT bolist.bom_id FROM bom_output bolist WHERE bolist.part_id = bom_input.part_id and bolist.component_cat <> 'Process' and  component_cat <> 'Porcess' LIMIT 1)) as bomlist_id
 
       level +1 as level,
    CONCAT(bom_hi.path, ',', bom_output_child.part_id) AS path,
    CONCAT(bom_hi.part_path, '->', out_part_child.part_name) AS part_path,
    in_part_child.sub_ass



FROM bom_output bom_output_child
inner join bom_hi on bom_hi.bomlist_id = bom_output_child.bom_id
INNER JOIN bom_input bom_input_child
    ON  bom_output_child.bom_id = bom_input_child.bom_id
INNER JOIN parts_tbl out_part_child
    ON out_part_child.part_id = bom_output_child.part_id
INNER JOIN parts_tbl in_part_child
    ON in_part_child.part_id = bom_input_child.part_id
   WHERE bom_output_child.component_cat <> 'Process'  AND bom_hi.sub_ass = 1 AND FIND_IN_SET(bom_output_child.part_id, bom_hi.path) = 0)
   SELECT *
FROM (
    SELECT GROUP_CONCAT(part_path SEPARATOR ',') as path1, output_part_id,input_part_id,sum(qty) as qty,output_part_name,input_part_name,level,part_path,sub_ass,
           IF(FIND_IN_SET(input_part_id,path)>0,'duplicate','valid') AS duplication_status
    FROM bom_hi GROUP BY input_part_id
) AS t
WHERE NOT EXISTS (
    SELECT 1
    FROM bom_hi
    WHERE FIND_IN_SET(input_part_id,path) > 0
)";



}

 ?>


