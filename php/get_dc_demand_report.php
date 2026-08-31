<?php
 include 'db_head.php';

 $des_godown = test_input($_GET['des_godown']);
 $source_godown = test_input($_GET['source_godown']);
 $process_id = test_input($_GET['process_id']);
 $process_query =1;
$godown_query =1;
 if($process_id > 0){
  $process_query = "iv.work_process_id = $process_id";
 }


 if($des_godown > 0){
  $godown_query = "iv.godown = $des_godown";
 }



 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


  

 $sql = "with iv_deatils as(select iv.work_process_id,iv.work_orders,iv.pending_process_qty,iv.input_part_id, 
if(iv.input_part_id is null,concat('semi finished part (',pt_final.part_name,')'),pt.part_name) as input_part_name,
iv.previous_process_id,iv.required_qty,iv.godown,iv.dep,iv.sec,iv.total_reserve_qty,iv.needed,iv.dc_qty,iv.transport_qty from input_part_demand_view iv 

 left join parts_tbl pt on iv.input_part_id <=> pt.part_id
 left join process_wel_tbl pwt on iv.previous_process_id <=> pwt.process_id
 left join process_wel_tbl pwt_final on pwt.final_process_id <=> pwt_final.process_id
 left join parts_tbl pt_final on pwt_final.output_part <=> pt_final.part_id),
 job_work_reserved as (
    select sv.part_id, sv.process_id, sum(sv.reserve_qty) as total_reserve_qty, JSON_ARRAYAGG(JSON_OBJECT(
        'same_godown', if(sv.godown = '$source_godown',true,false),
        'godown', sv.godown,
        'godown_name', creditors.creditor_name,
        'dep', sv.dep,
        'dep_name', department.dep_name,
        'sec', sv.sec,
        'sec_name', dep_section.sec_name,
        'reserve_qty', sv.reserve_qty,
        'stock_reserve_id', sv.stock_reserve_id,
        'stock_id', sv.stock_id
    )) as stock_reserve_details from stock_view sv 
    left join creditors on sv.godown <=> creditors.creditor_id
 left join department on sv.dep <=> department.dep_id
 left join dep_section on sv.sec <=> dep_section.dep_sec_id 
    WHERE sv.reserve_type =\"job_work_order\" and sv.part_id is null
    group by sv.process_id

    union all

    select sv.part_id, sv.process_id, sum(sv.reserve_qty) as total_reserve_qty, JSON_ARRAYAGG(JSON_OBJECT(
        'same_godown', if(sv.godown = '$source_godown',true,false),
        'godown', sv.godown,
        'godown_name', creditors.creditor_name,
        'dep', sv.dep,
        'dep_name', department.dep_name,
        'sec', sv.sec,
        'sec_name', dep_section.sec_name,
        'reserve_qty', sv.reserve_qty,
        'stock_reserve_id', sv.stock_reserve_id,
        'stock_id', sv.stock_id
    )) as stock_reserve_details from stock_view sv 
     left join creditors on sv.godown <=> creditors.creditor_id
 left join department on sv.dep <=> department.dep_id
 left join dep_section on sv.sec <=> dep_section.dep_sec_id
    WHERE sv.reserve_type =\"job_work_order\" and sv.part_id is not null
    group by sv.part_id
 )
 select iv.work_process_id,iv.work_orders,iv.pending_process_qty,iv.godown,creditors.creditor_name ,department.dep_name,dep_section.sec_name,iv.dep,iv.sec,
 JSON_ARRAYAGG(JSON_OBJECT(
     'input_part_id', iv.input_part_id,
     'input_part_name', iv.input_part_name,
     'previous_process_id', iv.previous_process_id,
        'required_qty', iv.required_qty,
        'total_reserve_qty', iv.total_reserve_qty,
        'needed', iv.needed,
        'dc_qty', iv.dc_qty,
        'transport_qty', iv.transport_qty,
        'job_work_qty', jwr.total_reserve_qty,
        'stock_reserve_details', jwr.stock_reserve_details
 )) as input_parts_demand, 
 jpv.final_part,
 jpv.process_name,
 jpv.input_parts
 from iv_deatils iv  
 left join creditors on iv.godown <=> creditors.creditor_id
 left join department on iv.dep <=> department.dep_id
 left join dep_section on iv.sec <=> dep_section.dep_sec_id
 left join jaysan_process_view jpv on iv.work_process_id <=> jpv.process_id
 left join job_work_reserved jwr on iv.input_part_id <=> jwr.part_id
  and iv.previous_process_id <=> jwr.process_id 
  where $process_query and $godown_query GROUP BY iv.work_process_id,iv.godown";
 
//  echo "sql: " . $sql . "<br>";

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


