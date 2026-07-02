<?php
include 'db_head.php';
$final_part_id = isset($_POST['final_part_id']) ? test_input($_POST['final_part_id']) : 'all';
$process_id = isset($_POST['process_id']) ? test_input($_POST['process_id']) : 'all';
$godown_id = isset($_POST['godown_id']) ? test_input($_POST['godown_id']) : '';
$dep_id = isset($_POST['dep_id']) ? test_input($_POST['dep_id']) : '';
$dep_sec_id = isset($_POST['dep_sec_id']) ? test_input($_POST['dep_sec_id']) : '';

// echo "final_part_id: $final_part_id, process_id: $process_id, godown_id: $godown_id, dep_id: $dep_id, dep_sec_id: $dep_sec_id<br>";

$part_query = 1;
$process_query = 1;
$godown_query = 1;
$dep_query = 1;
$dep_sec_query = 1;


$godown_id = sql_nullable($godown_id);
$dep_id = sql_nullable($dep_id);
$dep_sec_id = sql_nullable($dep_sec_id);


if ($final_part_id != 'all') {
  $part_query = "final_part_id = $final_part_id";
}
if ($process_id != 'all') {
  $process_query = "process_id = $process_id";
}
if ($godown_id != 'NULL') {
  $godown_query = "godown_id <=> $godown_id";
}
if ($dep_id != 'NULL') {
  $dep_query = "dep_id <=> $dep_id";
}
if ($dep_sec_id != 'NULL') {
  $dep_sec_query = "dep_sec_id <=> $dep_sec_id";
}




function test_input($data)
{
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);

  return $data;
}

$sql = "with demand_details as (
    select demand.part_id,demand.process_id,demand.demand_id,demand.plan_id,demand.demand_qty,demand.created_by,demand.created_date,employee.emp_name ,sum(ifnull(wo.qty, 0)) as total_assigned_qty,demand.demand_qty-sum(ifnull(wo.qty, 0)) as remaining_qty from demand 
    inner join employee on demand.created_by = employee.emp_id
    left join work_order wo on demand.demand_id = wo.demand_id GROUP BY demand.demand_id,part_id,process_id
),

demand_summary as(select  part_id,demand_details.process_id,JSON_ARRAYAGG(json_object('demand_id', demand_id, 'plan_id', plan_id, 'demand_qty', demand_qty, 'created_by', created_by, 'created_date', created_date, 'emp_name', emp_name, 'qty',total_assigned_qty, 'remaining_qty', remaining_qty)) as demand_details,sum(demand_qty) as total_demand_qty,sum(ifnull(total_assigned_qty, 0)) as total_assigned_qty,sum(ifnull(remaining_qty, 0)) as total_remaining_qty from demand_details where remaining_qty>0 GROUP BY part_id,demand_details.process_id ),

final_summary as(select part_id,ds.process_id,total_demand_qty,total_assigned_qty,total_remaining_qty,demand_details ,process_name,godown_details as all_godown_details,final_part,final_part_id,wtm.godown_id,wtm.dep_id,wtm.dep_sec_id,wtm.is_default from demand_summary ds

left join jaysan_process_view jpv on ds.process_id <=> jpv.process_id and ds.part_id <=> jpv.output_part
left join work_time_master wtm on ds.process_id <=> wtm.ori_process_id WHERE $part_query and $process_query and $godown_query and $dep_query and $dep_sec_query)

select * from final_summary group by part_id,process_id";
//  echo "SQL: " . $sql . "<br>";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $rows = array();
  while ($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
  }
  print json_encode($rows);
} else {
  echo "0 results";
}
$conn->close();



?>



