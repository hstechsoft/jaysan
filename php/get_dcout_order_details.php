<?php
 include 'db_head.php';

 
 $transport_dc_id = test_input($_GET['transport_dc_id']);



function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);

  return $data;
}

$sql = "SELECT tp.*,pwt.process,if(tp.part_id IS not NULL, concat(pt.part_name,'(',jp.process_name,')'), concat('Semi-finished part(', final_part.part_name, jp.process_name)) as part, FROM `transport_parts` tp
left join parts_tbl pt on tp.part_id = pt.part_id
left join process_wel_tbl pwt on tp.process_id = pwt.process_id
left join jaysan_process jp on pwt.process = jp.process_id
left join process_wel_tbl pwt_final on pwt.final_process_id = pwt_final.process_id
left join parts_tbl final_part on final_part.part_id = pwt_final.output_part  WHERE tp.transport_dc_id = $transport_dc_id";

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


