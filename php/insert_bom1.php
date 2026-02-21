    <?php
    include 'db_head.php';


    $inputPartsData = $_POST['inputPartsData']; // This should be an array of data for input_parts
    $output_part = $_POST['output_part']; 
    $bom_list = $_POST['bom_list'];

    $bom_id = 0; // Initialize bom_id variable

      $sql_process = "INSERT  INTO   bom_output (part_id,component_cat)
      VALUES ('$output_part','$bom_list')";
    
    if ($conn->query($sql_process) === TRUE) {
        $bom_id = $conn->insert_id;
    
      
        foreach ($inputPartsData as $input)
        { 
          
            $input_part = $input['part_id']; 
            $input_qty = $input['part_qty']; 

            $sql_input= "INSERT INTO  bom_input  (bom_id,part_id,qty)
            VALUES ('$bom_id','$input_part','$input_qty')";
            
              
              if ($conn->query($sql_input) === TRUE) {
              } 
              else {
                echo "Error: " . $sql_input . "<br>" . $conn->error;
              }
        }

        
      
    } else {
      echo "Error: " . $sql_process . "<br>" . $conn->error;
    }

// check outpart is sub assembly or not
$sql_check_sub_ass = "SELECT 1 from parts_tbl where part_id = $output_part and sub_ass = 1";
$result_sub_ass = $conn->query($sql_check_sub_ass);
$is_sub_ass = ($result_sub_ass && $result_sub_ass->num_rows > 0) ? true : false;
if($is_sub_ass)
  {
    echo "ok";
     $conn->close();
     exit();

  }

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

     $conn->query(  "UPDATE bom_input bi
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


       





    $sql_check_excess_qty = "select bom_input.part_id,parts_tbl.part_name, bom_input.sub_ass_qty, bom_input.qty ,bom_input.qty-bom_input.sub_ass_qty as excess_qty from bom_input inner join parts_tbl on bom_input.part_id = parts_tbl.part_id where bom_input.sub_ass_qty > bom_input.qty and bom_input.bom_id = $bom_id";
   
        $result = $conn->query($sql_check_excess_qty);
        if ($result && $result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            echo "Part: " . $row['part_name'] . " (ID: " . $row['part_id'] . ")".
                 
                 "Excess Qty: " . $row['excess_qty'] . "<br><br>";
          }
        } else {
          echo "ok";
        }
      

    $conn->close();
    ?>
