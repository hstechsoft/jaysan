<?php
 include 'db_head.php';

 $godown_id = test_input($_GET['godown_id']);
 
 $transport_dc_id = test_input($_GET['transport_dc_id']);
$transport_dc_query = 1;
if($transport_dc_id > 0)
{
  $transport_dc_query = "tdc.transport_dc_id = $transport_dc_id";
}
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
return $data;
}


 $sql = "select if(tp.part_id is null, concat('semi finished part of ', pt.part_name ,'( from - ',jp.process_name,')'), pt2.part_name) as output_part,jp.process_name,tp.qty,creditors.creditor_name,tp.transport_id,tp.part_id,tp.process_id from transport_parts tp
 inner join transport_dc tdc on tp.transport_dc_id = tdc.transport_dc_id
left join process_wel_tbl pwt on tp.process_id = pwt.process_id
left join process_wel_tbl pwt2 on pwt.final_process_id = pwt2.process_id
left join parts_tbl pt on pwt2.output_part = pt.part_id
left join parts_tbl pt2 on tp.part_id = pt2.part_id
left join jaysan_process jp on pwt.process = jp.process_id 
left join creditors on tdc.source_godown = creditors.creditor_id 
where tdc.source_godown = $godown_id  and $transport_dc_query and tp.dc_check = 0";


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


