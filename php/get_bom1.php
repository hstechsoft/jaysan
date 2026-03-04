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



 $sql = "
   WITH RECURSIVE bom_hi AS (

        /* ========= Anchor ========= */
        SELECT
        bo.bom_id,
        pt_hi.part_name as inpart_name,
            bo.part_id AS output_part,
            part_out.part_name AS output_part_name,
            bi.bom_in_id as bom_in_id,
            bi.part_id AS input_part,
            bi.qty,
            bi.sub_ass_qty,
            pt_hi.sub_ass,
            0 AS level,
            bo.component_cat,
         CAST((SELECT part_name FROM parts_tbl WHERE part_id = bo.part_id) AS CHAR) AS path
        FROM bom_output bo
        JOIN bom_input bi ON bo.bom_id = bi.bom_id
        inner join parts_tbl part_out on bo.part_id = part_out.part_id
        JOIN parts_tbl pt_hi ON bi.part_id = pt_hi.part_id
        WHERE bo.bom_id  = (SELECT bo_get.bom_id from bom_output bo_get WHERE bo_get.part_id = $part_id and bo_get.component_cat = $component_cat and bo_get.component_cat <> 'Process' )
        UNION ALL

        /* ========= Recursive ========= */
        SELECT
        boc.bom_id,
         pt.part_name as inpart_name,
            boc.part_id AS output_part,
            part_out.part_name AS output_part_name,
            bi.bom_in_id as bom_in_id,  
            bi.part_id AS input_part,
            bi.qty*h.qty AS qty,
             bi.sub_ass_qty,
            pt.sub_ass,
           
            h.level + 1,
            boc.component_cat,
        CAST(CONCAT(h.path, '>', (SELECT part_name FROM parts_tbl WHERE part_id = boc.part_id)) AS VARCHAR(500))


        FROM bom_output boc
        JOIN bom_hi h
            ON boc.part_id = h.input_part
        AND h.sub_ass = 1
        JOIN bom_input bi ON boc.bom_id = bi.bom_id
        inner join parts_tbl part_out on boc.part_id = part_out.part_id
        JOIN parts_tbl pt ON bi.part_id = pt.part_id
        WHERE boc.component_cat <> 'Process'
        AND boc.part_id <> h.output_part
   )
   SELECT JSON_ARRAYAGG(JSON_OBJECT(
       'output_part', output_part,
       'inpart_name', inpart_name,
       'bom_in_id', bom_in_id,
       'input_part', input_part,
       'qty', qty,
       'sub_ass_qty', sub_ass_qty,
       'sub_ass', sub_ass,
       'level', level,
       'component_cat', component_cat,
       'path', path,
       'corrected_qty', qty - sub_ass_qty
   )) AS bom_data,
   output_part,
   output_part_name,
   bom_id,
   level
   FROM bom_hi
   GROUP BY level, output_part;";

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

$sql = <<<SQL
WITH RECURSIVE bom_hi AS (

        /* ========= Anchor ========= */
        SELECT
        bo.bom_id,
        pt_hi.part_name as inpart_name,
            bo.part_id AS output_part,
            part_out.part_name AS output_part_name,
            bi.bom_in_id as bom_in_id,
            bi.part_id AS input_part,
            bi.qty,
            bi.sub_ass_qty,
            pt_hi.sub_ass,
            0 AS level,
            bo.component_cat,
         CAST((SELECT part_name FROM parts_tbl WHERE part_id = bo.part_id) AS CHAR) AS path
        FROM bom_output bo
        JOIN bom_input bi ON bo.bom_id = bi.bom_id
        inner join parts_tbl part_out on bo.part_id = part_out.part_id
        JOIN parts_tbl pt_hi ON bi.part_id = pt_hi.part_id
        WHERE bo.bom_id  = (SELECT bo_get.bom_id from bom_output bo_get WHERE bo_get.part_id =   16287 and bo_get.component_cat = "sub assembly" and bo_get.component_cat <> 'Process' )
        UNION ALL

        /* ========= Recursive ========= */
        SELECT
        boc.bom_id,
         ptc.part_name as inpart_name,
            boc.part_id AS output_part,
            part_out.part_name AS output_part_name,
            bic.bom_in_id as bom_in_id,  
            bic.part_id AS input_part,
            bic.qty*h.qty AS qty,
            bic.sub_ass_qty,
            bic.sub_ass,
            
            h.level + 1,
            boc.component_cat,
        CAST(CONCAT(h.path, '>', (SELECT part_name FROM parts_tbl WHERE part_id = boc.part_id)) AS VARCHAR(500))


        FROM bom_output boc
        inner JOIN bom_hi h
            ON boc.part_id = h.input_part
        AND h.sub_ass = 1
        inner JOIN bom_input bic ON boc.bom_id = bic.bom_id
        inner join parts_tbl part_out on boc.part_id = part_out.part_id
        inner JOIN parts_tbl ptc ON bic.part_id = ptc.part_id
        WHERE boc.component_cat <> 'Process'
        AND boc.part_id <> h.output_part
   )
   SELECT
      output_part,
        inpart_name,
     bom_in_id,
    input_part,
      qty,
        sub_ass_qty,
        sub_ass,
        level,
        component_cat,
        path,
      qty - sub_ass_qty
   
   output_part,
   output_part_name,
   bom_id,
   level
   FROM bom_hi
  ;
SQL;

 ?>


