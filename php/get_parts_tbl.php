<?php
 include 'db_head.php';

 

 $part_id = test_input($_GET['part_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT parts_tbl.*,JSON_ARRAYAGG(JSON_OBJECT('master_id', sec_stock_master.master_id,'min_qty', sec_stock_master.min_qty,'max_qty', sec_stock_master.max_qty,'rack', sec_stock_master.rack,'bin', sec_stock_master.bin,'store_id', sec_stock_master.store_id,'store_type', sec_stock_master.store_type,'store_name', COALESCE(creditors.creditor_name, department.dep_name, dep_section.sec_name))) as stock_master FROM parts_tbl
 inner join sec_stock_master on sec_stock_master.part_id = parts_tbl.part_id 
 -- Join godown table only if store_type = 'godown'
LEFT JOIN creditors 
    ON sec_stock_master.store_id = creditors.creditor_id 
    AND sec_stock_master.store_type = 'godown' 


-- Join department table only if store_type = 'dep'
LEFT JOIN department
    ON sec_stock_master.store_id = department.dep_id 
    AND sec_stock_master.store_type = 'dep'

-- Join section table only if store_type = 'sec'
LEFT JOIN dep_section
    ON sec_stock_master.store_id = dep_section.dep_sec_id 
    AND sec_stock_master.store_type = 'sec'
  WHERE parts_tbl.part_id = $part_id group by parts_tbl.part_id"; 

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


