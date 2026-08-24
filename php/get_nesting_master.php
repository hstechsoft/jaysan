<?php
 include 'db_head.php';

 $nes_master_id = isset($_GET['nes_master_id']) ? $_GET['nes_master_id'] : 0;

$master_query = 1;


if($nes_master_id > 0){
    $master_query = "nesting_master.nes_master_id = $nes_master_id";
}


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "with nesting_parts as(select nesting_id,JSON_ARRAYAGG(JSON_OBJECT(
   'nes_part_id', nesting_parts.nes_part_id,
    'part_id', nesting_parts.part_id,
    'qty', nesting_parts.qty,
    'part_name', parts_tbl.part_name,
    'weight', nesting_parts.weight,
    'scarp_weight', nesting_parts.scarp_weight
)) as nesting_parts from nesting_parts
inner join parts_tbl on nesting_parts.part_id = parts_tbl.part_id GROUP BY nesting_parts.nesting_id
)
select nesting_parts.*,nes_part.part_name as nesting_material ,nesting_master.created_by,
nesting_master.material_id,
nesting_master.nesting_name,
nesting_master.path,
nesting_master.run_time,
nesting_master.nesting_type,
nesting_master.std_length,
employee.emp_name as created_by_name,
JSON_ARRAYAGG(JSON_OBJECT(
  
    'godown_name', stock_full_view.godown_name,
    'dep_name', stock_full_view.dep_name,
    'sec_name', stock_full_view.sec_name,
    'available_qty', stock_full_view.available_qty,
    'reserves', stock_full_view.reserves
)) as stock_info

 from nesting_parts
left join nesting_master on nesting_parts.nesting_id = nesting_master.nes_master_id
left join parts_tbl nes_part on nes_part.part_id = nesting_master.material_id
LEFT join employee on nesting_master.created_by = employee.emp_id
left join stock_full_view on nesting_master.material_id = stock_full_view.part_id
where $master_query
group by nesting_parts.nesting_id
";

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


