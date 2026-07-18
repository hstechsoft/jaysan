<?php
 include 'db_head.php';

 $godown = test_input($_GET['godown']);
 $dep = test_input($_GET['dep']);
 $sec = test_input($_GET['sec']);


 $godown = sql_nullable($godown);
 $dep = sql_nullable($dep);
    $sec = sql_nullable($sec);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}



//  $sql = "SELECT (SELECT 1 FROM process_wel_tbl WHERE process_wel_tbl.output_part =  parts_tbl.part_id   and cat = 'out')  as process_availble, (select part_name from parts_tbl where part_id = $part_id) as out_part_name,(select sub_ass from parts_tbl where part_id = bom_input.part_id) as sub_ass, bom_input.part_id,bom_input.qty,parts_tbl.part_name,bom_input.bom_id,parts_tbl.part_no from bom_input INNER JOIN bom_output on bom_input.bom_id = bom_output.bom_id INNER JOIN parts_tbl on bom_input.part_id = parts_tbl.part_id WHERE bom_output.part_id =$part_id and bom_output.component_cat = $component_cat";

 $sql = "  with stock as(select js.stock_id,stock_reserve_id,sum(sr.reserve_qty) as reserve_qty,sum(js.qty) as qty,js.part_id,js.process_id,if(js.part_id is null,concat('semi finished part of',pt_final.part_name),parts_tbl.part_name) as part_name,process_name  from stock_reserve sr
  inner join jaysan_stock js on sr.stock_id = js.stock_id
  left join parts_tbl on js.part_id = parts_tbl.part_id
 left join process_wel_tbl on process_wel_tbl.process_id = js.process_id
 left join jaysan_process on jaysan_process.process_id = process_wel_tbl.process
left join process_wel_tbl pwt_final on process_wel_tbl.final_process_id = pwt_final.process_id
left join parts_tbl pt_final on pwt_final.output_part = pt_final.part_id

  where js.godown <=> $godown and  sr.reserve_type = 'job_work_order' GROUP BY js.stock_id),
  
transport as (select part_id,process_id,sum(qty) as qty from transport_parts inner join transport_dc on transport_parts.transport_dc_id = transport_dc.transport_dc_id WHERE transport_dc.sts <> 'finished' and transport_dc.des_godown <=> $godown GROUP BY part_id,process_id)

select (ifnull(stock.qty,0) - (ifnull(transport.qty,0) + ifnull(stock.reserve_qty,0))) as demand_qty, stock.*,ifnull(transport.qty,0) as transport_qty from stock left join transport on stock.part_id <=> transport.part_id and stock.process_id <=> transport.process_id";
 


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


