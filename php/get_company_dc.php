<?php
include 'db_head.php';

$godown_id = test_input($_GET['godown_id']);




function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = "'" . $data . "'";
    return $data;
}


$sql = "with godwn as(SELECT pwt.process_id, pwt.final_process_id from process_wel_tbl pwt 
inner join work_time_master wtm on pwt.process_id= wtm.ori_process_id WHERE wtm.godown_id = $godown_id GROUP BY final_process_id)
SELECT parts_tbl.part_name,pwt.component_cat,JSON_ARRAYAGG(JSON_OBJECT('process_id', pwt.process_id, 'process_title', pwt.process_title, 'is_default', pwt.is_default)) as process_details,pwt.output_part,pwt.cat FROM godwn g 
inner join process_wel_tbl pwt on g.final_process_id = pwt.process_id
inner join parts_tbl on  pwt.output_part = parts_tbl.part_id group by output_part,component_cat";

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
