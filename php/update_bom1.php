<?php
include 'db_head.php';



$input_part = $_POST['input_part']; 
$input_qty = $_POST['input_qty']; 
$bom_id = $_POST['bom_id']; 


$parent_main_bom = 0;
$bom_list = "";

// insert or update on duplicate key



        $sql_input= "INSERT INTO  bom_input  (bom_id,part_id,qty) VALUES ('$bom_id','$input_part','$input_qty') ON DUPLICATE KEY UPDATE qty = '$input_qty'";
         
          
           if ($conn->query($sql_input) === TRUE) {
           } 
           else {
             echo "Error: " . $sql_input . "<br>" . $conn->error;
           }

           // check outpart is sub assembly or not
$sql_check_sub_ass = "SELECT 1 from parts_tbl  inner join bom_output on parts_tbl.part_id = bom_output.part_id where bom_id = $bom_id and parts_tbl.sub_ass = 0";
$result_sub_ass = $conn->query($sql_check_sub_ass);
$is_output_not_sub_ass = ($result_sub_ass && $result_sub_ass->num_rows > 0) ? true : false;
if($is_output_not_sub_ass)
  {
    // output part not sub ass  so check input part

    $sql_check_input_sub_ass = "SELECT 1 FROM parts_tbl WHERE part_id = $input_part AND sub_ass = 0";
    $result_input_sub_ass = $conn->query($sql_check_input_sub_ass);
    $is_input_sub_ass = ($result_input_sub_ass && $result_input_sub_ass->num_rows > 0) ? true : false;
    if($is_input_sub_ass)
      {
        // input part not sub ass so give ok and exit
        echo "ok";
        $conn->close();
        exit();
      }
      else{
        // input part is sub ass so modify main bom sub qty
        // Recalculate — not increment

        $sql_update_sub_qty = "UPDATE bom_input 
SET sub_ass_qty = 0 
WHERE bom_id = $bom_id;";
        if ($conn->query($sql_update_sub_qty) === TRUE) {
        } 
        else {
          echo "Error: " . $sql_update_sub_qty . "<br>" . $conn->error;
        }

// do recursice cte update /insert

 $conn->query("DROP TEMPORARY TABLE IF EXISTS tmp_bom_result");
  $conn->query(" CREATE TEMPORARY TABLE tmp_bom_result AS
        WITH RECURSIVE bom_hi AS (       /* ========= Anchor ========= */
            SELECT
                bo.part_id AS output_part,
                bi.bom_in_id as bom_in_id,
                bi.part_id AS input_part,
                bi.qty,
                pt_hi.sub_ass,
                0 AS level,
                bo.component_cat,
            CAST((SELECT part_name FROM parts_tbl WHERE part_id = bo.part_id) AS CHAR) AS path
            FROM bom_output bo
            JOIN bom_input bi ON bo.bom_id = bi.bom_id
            JOIN parts_tbl pt_hi ON bi.part_id = pt_hi.part_id
            WHERE bo.bom_id = $bom_id
            UNION ALL

            /* ========= Recursive ========= */
            SELECT
                boc.part_id AS output_part,
                bi.bom_in_id as bom_in_id,  
                bi.part_id AS input_part,
                bi.qty,
                pt.sub_ass,
                h.level + 1,
                boc.component_cat,
            CAST(CONCAT(h.path, '>', (SELECT part_name FROM parts_tbl WHERE part_id = boc.part_id)) AS VARCHAR(500))


            FROM bom_output boc
            JOIN bom_hi h
                ON boc.part_id = h.input_part
            AND h.sub_ass = 1
            JOIN bom_input bi ON boc.bom_id = bi.bom_id
            JOIN parts_tbl pt ON bi.part_id = pt.part_id
            WHERE boc.component_cat <> 'Process'
            AND boc.part_id <> h.output_part
        ),
        parent_part AS (
        SELECT bom_hi.*,
        outpart.part_name AS outpart_name,
        inpart.part_name AS inpart_name 
        FROM bom_hi 
        inner join parts_tbl inpart on bom_hi.input_part = inpart.part_id
        inner join parts_tbl outpart on bom_hi.output_part = outpart.part_id
        WHERE level = 0 ORDER BY bom_hi.sub_ass DESC
    ),

    child_part AS (
      SELECT bom_hi.*,
    outpart.part_name AS outpart_name,
    inpart.part_name AS inpart_name
        FROM bom_hi 
        inner join parts_tbl inpart on bom_hi.input_part = inpart.part_id
        inner join parts_tbl outpart on bom_hi.output_part = outpart.part_id
        WHERE level > 0
    ),

      tb AS (
        /* LEFT side */
        SELECT
        p.outpart_name as parent_outpart_name,
        p.inpart_name as parent_inpart_name,
        c.outpart_name as child_outpart_name,
        c.inpart_name as child_inpart_name,
        p.input_part AS parent_input_part,
            
          
            c.inpart_name as child_part_name,
            p.bom_in_id AS parent_bom_in_id,
            p.qty        AS parent_qty,
            c.input_part AS child_input_part,
            c.qty        AS child_qty,
            c.path
        FROM parent_part p
        LEFT JOIN child_part c
            ON p.input_part = c.input_part

        UNION 

        /* RIGHT side unmatched */
        SELECT
          p.outpart_name as parent_outpart_name,
        p.inpart_name as parent_inpart_name,
        c.outpart_name as child_outpart_name,
        c.inpart_name as child_inpart_name,
            p.input_part,
        
            c.inpart_name as child_part_name,
            p.bom_in_id ,
            p.qty,
            c.input_part,
            c.qty,
            c.path
        FROM parent_part p
        RIGHT JOIN child_part c
            ON p.input_part = c.input_part

    )

    SELECT IFNULL(parent_bom_in_id, 0) AS parent_bom_in_id,
          child_qty,
        
          child_input_part
    FROM tb
    WHERE child_input_part IS NOT NULL
    ORDER BY parent_bom_in_id");

     $conn->query( "UPDATE bom_input bi
JOIN (
    SELECT parent_bom_in_id, SUM(child_qty) AS total_child_qty
    FROM tmp_bom_result
    GROUP BY parent_bom_in_id
) t 
ON bi.bom_in_id = t.parent_bom_in_id
SET bi.sub_ass_qty = bi.sub_ass_qty + t.total_child_qty");
     $conn->query("INSERT INTO bom_input (bom_id, part_id, qty, bom_source, sub_ass_qty)
SELECT 
    $bom_id,
    child_input_part,
    0,
    'MANUAL',
    SUM(child_qty)
FROM tmp_bom_result
WHERE parent_bom_in_id = 0
GROUP BY child_input_part
ON DUPLICATE KEY UPDATE 
sub_ass_qty = VALUES(sub_ass_qty)");


       





    $sql_check_excess_qty = "select bom_input.part_id,parts_tbl.part_name, bom_input.sub_ass_qty, bom_input.qty ,bom_input.sub_ass_qty-bom_input.qty as excess_qty from bom_input inner join parts_tbl on bom_input.part_id = parts_tbl.part_id where bom_input.sub_ass_qty > bom_input.qty and bom_input.bom_id = $bom_id";
   
        $result = $conn->query($sql_check_excess_qty);
        if ($result && $result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            echo "Part: " . $row['part_name'] . " (ID: " . $row['part_id'] . ")".
                 
                 "Excess Qty: " . $row['excess_qty'] . "<br><br>";
          }
        } else {
          echo "ok";
        }

      }

  }

  else{
    // output part is sub ass so find main bom via recursive cte and update sub qty

    // 1st find main bom list
$sql_get_all_list = "WITH RECURSIVE parent_chain AS (

    -- 🔹 Start from the edited BOM
    SELECT 
        bo.bom_id,
        bo.part_id,
        pt.sub_ass
    FROM bom_output bo
    JOIN parts_tbl pt ON pt.part_id = bo.part_id
    WHERE bo.bom_id = $bom_id

    UNION ALL

    -- 🔹 Move upward through parents
    SELECT 
        bo_parent.bom_id,
        bo_parent.part_id,
        pt_parent.sub_ass
    FROM parent_chain pc
    JOIN bom_input bi 
        ON bi.part_id = pc.part_id
    JOIN bom_output bo_parent 
        ON bo_parent.bom_id = bi.bom_id
    JOIN parts_tbl pt_parent 
        ON pt_parent.part_id = bo_parent.part_id

    -- 🛑 stop climbing once MAIN BOM is reached
    WHERE pc.sub_ass = 1
)

SELECT DISTINCT bom_id
FROM parent_chain
WHERE sub_ass = 0";
   $result = $conn->query($sql_get_all_list);
  if ($result && $result->num_rows > 0) {
        $boms = [];
while ($row = $result->fetch_assoc()) {
    $boms[] = $row['bom_id'];
}
$bom_list = implode(',', $boms);
        } 

        // set all sub ass 0 in $bom_list 

        $sql_update_bom_empty = "UPDATE bom_input  SET sub_ass_qty = 0 WHERE bom_id IN ($bom_list)";
        
          if ($conn->query($sql_update_bom_empty) === TRUE) {
        } 
        else {
          echo "Error: " . $sql_update_bom_empty . "<br>" . $conn->error;
        }

        // recompute all bom list

         $conn->query("DROP TEMPORARY TABLE IF EXISTS tmp_bom_result1;");
  $conn->query(" CREATE TEMPORARY TABLE tmp_bom_result1 AS

WITH RECURSIVE bom_hi AS (

    /* 🔹 ANCHOR — start from ALL affected main BOMs */
    SELECT
        bo.bom_id AS root_bom_id,
        bo.part_id AS output_part,
        bi.bom_in_id,
        bi.part_id AS input_part,
        bi.qty,
        pt.sub_ass,
        0 AS level
    FROM bom_output bo
    JOIN bom_input bi  ON bo.bom_id = bi.bom_id
    JOIN parts_tbl pt  ON pt.part_id = bi.part_id
    WHERE bo.bom_id IN ($bom_list)

    UNION ALL

    /* 🔹 RECURSION */
    SELECT
        h.root_bom_id,
        boc.part_id,
        bi.bom_in_id,
        bi.part_id,
        bi.qty,
        pt.sub_ass,
        h.level + 1
    FROM bom_hi h
    JOIN bom_output boc ON boc.part_id = h.input_part
    JOIN bom_input bi   ON bi.bom_id = boc.bom_id
    JOIN parts_tbl pt   ON pt.part_id = bi.part_id
    WHERE h.sub_ass = 1
)

SELECT
    root_bom_id,
    IFNULL(bom_in_id,0) AS parent_bom_in_id,
    input_part AS child_input_part,
    qty AS child_qty
FROM bom_hi;");

     $conn->query(  "UPDATE bom_input
SET sub_ass_qty = 0
WHERE bom_id IN ($bom_list);");

     $conn->query(  "UPDATE bom_input bi
JOIN (
    SELECT root_bom_id, parent_bom_in_id, SUM(child_qty) AS total_qty
    FROM tmp_bom_result1
    WHERE parent_bom_in_id <> 0
    GROUP BY root_bom_id, parent_bom_in_id
) t
ON  bi.bom_id   = t.root_bom_id
AND bi.bom_in_id = t.parent_bom_in_id
SET bi.sub_ass_qty = t.total_qty;");
     $conn->query("INSERT INTO bom_input (bom_id, part_id, qty, bom_source, sub_ass_qty)

SELECT
    root_bom_id,
    child_input_part,
    0,
    'MANUAL',
    SUM(child_qty)

FROM tmp_bom_result1
WHERE parent_bom_in_id = 0
GROUP BY root_bom_id, child_input_part

ON DUPLICATE KEY UPDATE
sub_ass_qty = VALUES(sub_ass_qty);");


       





   $sql_check_excess_qty = "
SELECT
    bi.bom_id,
    bi.part_id,
    pt.part_name,
    bi.sub_ass_qty,
    bi.qty,
    (bi.sub_ass_qty - bi.qty) * $input_qty AS excess_qty
FROM bom_input bi
JOIN parts_tbl pt 
    ON pt.part_id = bi.part_id
WHERE pt.sub_ass = 0
AND bi.sub_ass_qty > bi.qty
AND bi.bom_id IN ($bom_list)";
   
        $result = $conn->query($sql_check_excess_qty);
        if ($result && $result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {

    echo "BOM: " . $row['bom_id'] .
         " → Part: " . $row['part_name'] .
         " (ID: " . $row['part_id'] . ")" .
         " → Excess Qty: " . $row['excess_qty'] .
         "<br><br>";
}
        } else {
          echo "ok";
        }

  }



$conn->close();
?>
