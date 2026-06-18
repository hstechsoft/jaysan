<?php
 include 'db_head.php';

 
 $godown = test_input($_GET['godown']);
 $transport_godown = test_input($_GET['transport_godown']);

 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

$sql = "SELECT tdc.source_godown,tdc.des_godown, JSON_ARRAYAGG(JSON_OBJECT('transport_dc_id',tp.transport_id,'part_id',js.part_id,'process_id',js.process_id,'part_name',ifnull(pt.part_name, CONCAT('semi finished part (', jp.process_name, ')')) ,'process_name', jp.process_name,'qty',sr.reserve_qty)) as parts from  transport_dc tdc
inner join transport_parts tp on tdc.transport_dc_id = tp.transport_dc_id
inner join stock_reserve sr on tp.reserve_id = sr.stock_reserve_id
inner join jaysan_stock js on sr.stock_id = js.stock_id
left join parts_tbl pt on js.part_id = pt.part_id
left join process_wel_tbl pwt on js.process_id = pwt.process_id
left join jaysan_process jp on pwt.process = jp.process_id
left join creditors source_godown on tdc.source_godown = source_godown.creditor_id
left join creditors des_godown on tdc.des_godown = des_godown.creditor_id
 
 
 WHERE tdc.source_godown = $godown and tdc.sts = 'transport' and tdc.current_transport = $transport_godown
group by tdc.des_godown";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 results";
}
$conn->close();



 ?>


