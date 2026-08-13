<?php
 include 'db_head.php';

 $godown = test_input($_GET['godown']);
$dep = test_input($_GET['dep']);
$sec = test_input($_GET['sec']);
$qty = test_input($_GET['qty']);
$part_id = test_input($_GET['part_id']);
$emp_id = test_input($_GET['emp_id']);
$process_id = test_input($_GET['process_id']);


$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);

$part_id = sql_nullable($part_id);
$process_id = sql_nullable($process_id);

$godown_query = 1;
$dep_query = 1;
$sec_query = 1;

$part_query = 1;
$process_query = 1;


if($godown != 'NULL') {
    $godown_query = "godown = $godown";
}

if($dep != 'NULL') {
    $dep_query = "dep = $dep";
}

if($sec != 'NULL') {
    $sec_query = "sec = $sec";
}

if($part_id != 'NULL') {
    $part_query = "phy.part_id = $part_id";
}
if($process_id != 'NULL') {
    $process_query = "phy.process_id = $process_id";
}
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "with stock_con  as (
    select
        phy.part_id,
        phy.process_id,
        phy.godown,
        phy.dep,
        phy.sec,
        phy.qty,
        phy.stock_id,
        cred.creditor_name,
        dept.dep_name,
        sec.sec_name,
        if(
            parts_tbl.part_name is null,
            jpv.final_part,
            parts_tbl.part_name
        ) as part_name
    from
        jaysan_physical_stock phy
        left join creditors cred on phy.godown = cred.creditor_id
        left join department dept on phy.dep = dept.dep_id
        left join dep_section sec on phy.sec = sec.dep_sec_id
        left join parts_tbl on phy.part_id = parts_tbl.part_id
        left join jaysan_process_view jpv on phy.process_id = jpv.process_id
   where 
        $godown_query and $dep_query and $sec_query and $part_query and $process_query

),
stock as (
    select
       part_id,
       process_id,
       godown,
       dep,
       sec,
       qty,
       stock_id,
        creditor_name,
       dep_name,
       sec_name,
      part_name
    from
        stock_con 
    group by
        part_id,
        process_id,
        godown,
        dep,
        sec
),
sec_wise as (
    SELECT
    part_id,
    process_id,
    godown,
    dep,
    sec,
    sum(qty) as qty,
    stock_id,
    creditor_name,
    dep_name,
    sec_name,
    part_name,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'sec',
            sec,
            'qty',
            qty,
            'stock_id',
            stock_id,
            'sec_name',
            sec_name
        )
    ) as stock_details
    from stock
    group by
        part_id,
        process_id,
        godown,
        dep
),
dep_wise as (
    select 
    part_id,
    part_name,
    process_id,
    godown,
    sum(qty) as qty,
    creditor_name,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'dep',
            dep,
            'qty',
            qty,
            'dep_name',
            dep_name,
            'stock_details',
            stock_details
        )
    ) as stock_details
    from sec_wise
    group by
        part_id,
        process_id,
        godown
)
select 
part_id,
process_id,
part_name,
sum(qty) as qty,
JSON_ARRAYAGG(
    JSON_OBJECT(
        'godown',
        godown,
        'qty',
        qty,
        'stock_details',
        stock_details
    )
) as stock_details
from dep_wise
group by
    part_id,
    process_id";

 

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


