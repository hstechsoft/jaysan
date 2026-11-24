<?php
include 'db_head.php';

$part_id = test_input($_GET['part_id']);
$process_id = test_input($_GET['process_id']);

$part_id = sql_nullable($part_id);
$process_id = sql_nullable($process_id);

// if part id is not null set process id as null
if ($part_id !== 'NULL' && $part_id > 0) {
    $process_id = 'NULL';
}

function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);

    return $data;
}




$sql = "select
JSON_ARRAYAGG(JSON_OBJECT(
    'dc_no', dt.dc_no,
    'qty', dt.qty,
    'source', tdc.source_godown,
    'des', tdc.des_godown,
    'source_name', sourceg.creditor_name,
    'des_name', desg.creditor_name

)) as dc_details,
sum(dt.qty) as total_qty,
tp.part_id,tp.process_id,tdc.source_godown,tdc.des_godown,
wo.work_order_id
 from dc_tracking dt
inner join transport_parts tp on tp.transport_id = dt.transport_part_id
inner join transport_dc tdc on tp.transport_dc_id = tdc.transport_dc_id
left join work_order wo on wo.work_order_id = dt.work_order_id
left join creditors sourceg on sourceg.creditor_id = tdc.source_godown
left join creditors desg on desg.creditor_id = tdc.des_godown
where wo.pending_qty > 0 and tp.part_id = $part_id and tp.process_id = $process_id
group by tp.part_id,tp.process_id,dt.work_order_id";

//  echo "sql: " . $sql . "<br>";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while ($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
    echo "0 result";
}
$conn->close();
