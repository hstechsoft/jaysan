<?php
include 'db_head.php';


$response = array(); 
$input_part = $_POST['input_part']; 
$input_qty = $_POST['input_qty']; 
$bom_id = $_POST['bom_id']; 

 echo "Received - BOM ID: $bom_id, Input Part: $input_part, Input Qty: $input_qty<br>";
$parent_main_bom = 0;
$bom_list = "";

// insert or update on duplicate key



        $sql_input= "INSERT INTO  bom_input  (bom_id,part_id,qty) VALUES ('$bom_id','$input_part','$input_qty') ON DUPLICATE KEY UPDATE qty = '$input_qty'";
         
          
           if ($conn->query($sql_input) === TRUE) {
            $response['general_bom_update'] = "BOM  updated successfully.";
            // echo "BOM input updated successfully.<br>\n";
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
    echo "output part not sub ass";
    // output part not sub ass  so check input part

    $sql_check_input_sub_ass = "SELECT 1 FROM parts_tbl WHERE part_id = $input_part AND sub_ass = 0";
    $result_input_sub_ass = $conn->query($sql_check_input_sub_ass);
    $is_input_not_sub_ass = ($result_input_sub_ass && $result_input_sub_ass->num_rows > 0) ? true : false;
    if($is_input_not_sub_ass)
      {
        echo "input part not sub ass";
        // input part not sub ass so check any insufficent qty
        $sql_check_insufficient_qty = "SELECT 1 FROM bom_input WHERE bom_id = $bom_id AND part_id = $input_part AND sub_ass_qty > qty";
        $result_insufficient_qty = $conn->query($sql_check_insufficient_qty);
        $has_insufficient_qty = ($result_insufficient_qty && $result_insufficient_qty->num_rows > 0) ? true : false;
        if($has_insufficient_qty)
        {
            $response['bom_qty_check'] = "Input part has insufficient quantity";
           echo "Input part has insufficient quantity.<br>\n";
      
          $conn->close();
          exit();
        }
      }
      else{
        $response['bom_sub_ass_check'] = "Input part is sub-assembly";
        // echo "Input part is sub-assembly.<br>\n";
        // input part is sub ass so modify main bom sub qty
        // Recalculate — not increment

        $sql_update_sub_qty = "UPDATE bom_input 
SET sub_ass_qty = 0 
WHERE bom_id = $bom_id;";
        if ($conn->query($sql_update_sub_qty) === TRUE) {
        //   echo "BOM sub-assembly quantity 0 updated successfully.<br>\n";
        } 
        else {
          echo "Error: " . $sql_update_sub_qty . "<br>" . $conn->error;
        }

        $response['results'] = [];

// do recursice cte update /insert
$response['parent_bom_id'] = $bom_id;
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
               
                 h.qty * bi.qty AS qty,
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

                  $response['results'][] = [
    'bom_qty_check' => "Excess quantity found",
    'parent_excess_part' => $row['part_name'],
    'parent_excess_part_id' => $row['part_id'],
    'parent_excess_qty' => $row['excess_qty']
];
            // echo "Part: " . $row['part_name'] . " (ID: " . $row['part_id'] . ")".
                 
            //      "Excess Qty: " . $row['excess_qty'] . "<br><br>";
          }
        } else {
            $response['bom_qty_check'] = "No excess quantity found";
        //   echo "ok";
        }

      }

  }

  else{
       // output part is sub assembly so do following
    //  1.find the main bom used this sub assembly
    //  2.store it in array
    //  3.reset sub aty to 0 to all  main bom 
    //  4.recompute one by one
       $boms = [];
$response['bom_sub_ass_check'] = "Input part is sub-assembly";
   
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
     
while ($row = $result->fetch_assoc()) {
    $boms[] = $row['bom_id'];
}
// $bom_list = implode(',', $boms);
        } 
        

        // set all sub ass 0 in $bom_list 
if(!empty($boms)){

    $bom_list = implode(',', $boms);

    $sql_update_bom_empty = "UPDATE bom_input 
                             SET sub_ass_qty = 0 
                             WHERE bom_id IN ($bom_list)";

    if ($conn->query($sql_update_bom_empty) !== TRUE) {
        echo "Error: " . $sql_update_bom_empty . "<br>" . $conn->error;
    }

}
      
$response['results'] = [];

foreach ($boms as $main_bom_id) {

    // recompute bom one by one
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
            WHERE bo.bom_id = $main_bom_id
            UNION ALL

            /* ========= Recursive ========= */
            SELECT
                boc.part_id AS output_part,
                bi.bom_in_id as bom_in_id,  
                bi.part_id AS input_part,
               
                 h.qty * bi.qty AS qty,
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
    $main_bom_id,
    child_input_part,
    0,
    'MANUAL',
    SUM(child_qty)
FROM tmp_bom_result
WHERE parent_bom_in_id = 0
GROUP BY child_input_part
ON DUPLICATE KEY UPDATE 
sub_ass_qty = VALUES(sub_ass_qty)");


       





    $sql_check_excess_qty = "select bom_input.part_id,parts_tbl.part_name, bom_input.sub_ass_qty, bom_input.qty ,bom_input.sub_ass_qty-bom_input.qty as excess_qty from bom_input inner join parts_tbl on bom_input.part_id = parts_tbl.part_id where bom_input.sub_ass_qty > bom_input.qty and bom_input.bom_id = $main_bom_id";
   
        $result = $conn->query($sql_check_excess_qty);
        if ($result && $result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
          
        $response['results'][] = [
    'parent_bom_id' => $main_bom_id,
    'bom_qty_check' => "Excess quantity found",
    'parent_excess_part' => $row['part_name'],
    'parent_excess_part_id' => $row['part_id'],
    'parent_excess_qty' => $row['excess_qty']
];
          }
        } else {
         $response['bom_qty_check'] = "No excess quantity found";
        }

      
}
  }

print json_encode($response);

$conn->close();
?>










