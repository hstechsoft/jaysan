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

$sql = "with transport as(SELECT dc.dc_no, sr.reserve_type,sr.reserve_type_id,dc.bill_to,dc.ship_to,js.godown,js.dep,js.sec,creditor_name,dep.dep_name,ds.sec_name, JSON_ARRAYAGG(JSON_OBJECT('stock_reserve_id',sr.stock_reserve_id,'part_id',js.part_id,'process_id',js.process_id,'part_name',ifnull(pt.part_name, CONCAT('semi finished part (', jp.process_name, ')')) ,'process_name', jp.process_name,'qty',sr.reserve_qty,'stock_id',sr.stock_id,'godown',js.godown)) as parts from   transport_dc tdc
inner join transport_parts tp on tdc.transport_dc_id = tp.transport_dc_id
inner join stock_reserve sr on tp.reserve_id = sr.stock_reserve_id
inner join jaysan_stock js on sr.stock_id = js.stock_id
left join parts_tbl pt on js.part_id = pt.part_id
left join process_wel_tbl pwt on js.process_id = pwt.process_id
left join jaysan_process jp on pwt.process = jp.process_id
left join delivery_challan dc on sr.reserve_type_id = dc.dc_id
left JOIN creditors on js.godown = creditors.creditor_id
left join dep_section ds on js.sec = ds.dep_sec_id 
left join department dep on js.dep = dep.dep_id 

 WHERE tdc.current_transport = $transport_godown and tdc.sts <> 'create' and tdc.sts = 'transport' and tdc.des_godown = $des_godown and tdc.dc_id > 0
group by sr.reserve_type,sr.reserve_type_id,js.godown,js.dep,js.sec)

SELECT dc_no, reserve_type,reserve_type_id,bill_to,ship_to,JSON_ARRAYAGG(JSON_OBJECT('godown',godown,'dep',dep,'sec',sec,'creditor_name',creditor_name,'dep_name',dep_name,'sec_name',sec_name,'parts',parts)) as parts from transport
group by reserve_type,reserve_type_id";
 


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


