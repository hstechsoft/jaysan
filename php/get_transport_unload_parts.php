<?php
 include 'db_head.php';

 
 $des_godown = test_input($_GET['des_godown']);
 $transport_godown = test_input($_GET['transport_godown']);


 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

$sql = "SELECT dc.*,JSON_ARRAYAGG(JSON_OBJECT('stock_reserve_id',tp.reserve_id,'part_id',tp.part_id,'process_id',tp.process_id,'part_name',ifnull(pt.part_name, CONCAT('semi finished part (', jp.process_name, ')')) ,'process_name', jp.process_name,'qty',tp.qty)) as parts from   transport_dc tdc
inner join transport_parts tp on tdc.transport_dc_id = tp.transport_dc_id

left join parts_tbl pt on tp.part_id = pt.part_id
left join process_wel_tbl pwt on tp.process_id = pwt.process_id
left join jaysan_process jp on pwt.process = jp.process_id
left join delivery_challan dc on tdc.dc_id = dc.dc_id


 WHERE tdc.current_transport = $transport_godown and tdc.sts <> 'create' and tdc.sts = 'transport' and tdc.des_godown = $des_godown and tdc.dc_id > 0
group by tdc.dc_id";
 


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


