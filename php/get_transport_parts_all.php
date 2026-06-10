<?php
 include 'db_head.php';

 
 $transport_godown = test_input($_GET['transport_godown']);


 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

$sql = "with transport as(SELECT sr.reserve_type,sr.reserve_type_id,dc.bill_to,dc.ship_to,js.godown,js.dep,js.sec,creditor_name,dep.dep_name,ds.sec_name, JSON_ARRAYAGG(JSON_OBJECT('part_id',js.part_id,'process_id',js.process_id,'part_name',ifnull(pt.part_name, CONCAT('semi finished part (', jp.process_name, ')')) ,'process_name', jp.process_name,'qty',sr.reserve_qty,'stock_id',sr.stock_id,'godown',js.godown)) as parts from  transport_parts tp
inner join stock_reserve sr on tp.reserve_id = sr.stock_reserve_id
inner join jaysan_stock js on sr.stock_id = js.stock_id
left join parts_tbl pt on js.part_id = pt.part_id
left join process_wel_tbl pwt on js.process_id = pwt.process_id
left join jaysan_process jp on pwt.process = jp.process_id
left join delivery_challan dc on sr.reserve_type_id = dc.dc_id
left JOIN creditors on js.godown = creditors.creditor_id
left join dep_section ds on js.sec = ds.dep_sec_id 
left join department dep on js.dep = dep.dep_id 

 WHERE tp.current_transport = $transport_godown and tp.sts <> 'create' and tp.sts = 'transport' 
group by sr.reserve_type,sr.reserve_type_id,js.godown,js.dep,js.sec)

SELECT reserve_type,reserve_type_id,bill_to,ship_to,JSON_ARRAYAGG(JSON_OBJECT('godown',godown,'dep',dep,'sec',sec,'creditor_name',creditor_name,'dep_name',dep_name,'sec_name',sec_name,'parts',parts)) as parts from transport
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


