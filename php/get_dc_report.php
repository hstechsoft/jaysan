<?php
 include 'db_head.php';

 $current_godown = test_input($_GET['current_godown']);
 $godown = test_input($_GET['godown']);
 $part_id = test_input($_GET['part_id']);
 $process_id = test_input($_GET['process_id']);
 $sec = test_input($_GET['sec']);
 $dc_sts = test_input($_GET['dc_sts']);

 $godown_query = 1;
 $part_query = 1;
 $sts_query = 1;
 $process_id1 = 0;
 if( $godown > 0)
  {
$godown_query = "source_godown = $godown or des_godown = $godown";
  }
  if( $part_id > 0 || $process_id > 0)
  {
    $part_id = sql_nullable($part_id);
    $process_id = sql_nullable($process_id);
   
  }

  if( $dc_sts != 'all')
  {
    $sts_query = "tdc.sts = '$dc_sts'";
  }


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
if( $part_id > 0 )
  {
// get process_id
$sql_get_ids = "select if(pwt.output_part is null, concat('semi finished part of ', pt.part_name ,'( from - ',jp.process_name,')'), pt.part_name) as output_part,pwt.process_id,pwt.output_part,pwt2.process_title from process_wel_tbl pwt
left join process_wel_tbl pwt2 on pwt.final_process_id = pwt2.process_id
left join parts_tbl pt on pwt2.output_part = pt.part_id
left join jaysan_process jp on pwt.process = jp.process_id where pt.part_id =  $part_id";
// get process_id1 as comma separated string
$process_id1  = [];
$result_get_ids = $conn->query($sql_get_ids);
while ($row_get_ids = mysqli_fetch_assoc($result_get_ids)) {
    $process_id1[] = $row_get_ids['process_id'];
   
}

// comma separated process_id
$process_id1 = implode(',', $process_id1);
  }
if( $part_id > 0 || $process_id > 0)
  {

// check length of process_id1
if(strlen($process_id1) > 0)
 $part_query = "tp.part_id <=> $part_id and tp.process_id in ($process_id1)";
else
  $part_query = "tp.part_id <=> $part_id and tp.process_id <=> $process_id";

  }




  

 $sql = "with transport_dc as (select date_time_only(tdc.dated) as dated,tdc.source_godown,tdc.des_godown,tdc.dc_id,tdc.sts,tdc.current_transport,if(source_godown = $current_godown,'dc out','dc in') as dc_type,tp.transport_dc_id,sum(ifnull(tp.dc_check,0)) as in_dc_chk,sum(ifnull(tp.out_dc,0)) as out_dc,count(ifnull(tp.transport_id,0)) as total_count from transport_dc tdc
inner join transport_parts tp on tdc.transport_dc_id = tp.transport_dc_id


 where (source_godown = $current_godown or des_godown = $current_godown ) and ($godown_query) and ($sts_query) and ($part_query) GROUP BY tdc.transport_dc_id )

 select source.creditor_name as source, dest.creditor_name as destination, tdc.dated,tdc.source_godown,tdc.des_godown,tdc.dc_id,tdc.sts,tdc.current_transport,tdc.dc_type,tdc.transport_dc_id,tdc.in_dc_chk,tdc.out_dc,tdc.total_count,if(dc_type = 'dc out',if(total_count>out_dc,'dc_out','ok'),if(total_count>in_dc_chk,'dc_in','ok')) as dc_inout_sts from  transport_dc tdc
 inner join creditors source on tdc.source_godown = source.creditor_id
 inner join creditors dest on tdc.des_godown = dest.creditor_id
 order by dated desc";
 
// echo "sql: " . $sql . "<br>";

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


