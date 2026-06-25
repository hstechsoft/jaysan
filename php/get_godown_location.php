<?php
 include 'db_head.php';

 $latti = test_input($_GET['latti']);
$longi = test_input($_GET['longi']);
$godown =test_input($_GET['godown']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



//  $sql = "SELECT (SELECT 1 FROM process_wel_tbl WHERE process_wel_tbl.output_part =  parts_tbl.part_id   and cat = 'out')  as process_availble, (select part_name from parts_tbl where part_id = $part_id) as out_part_name,(select sub_ass from parts_tbl where part_id = bom_input.part_id) as sub_ass, bom_input.part_id,bom_input.qty,parts_tbl.part_name,bom_input.bom_id,parts_tbl.part_no from bom_input INNER JOIN bom_output on bom_input.bom_id = bom_output.bom_id INNER JOIN parts_tbl on bom_input.part_id = parts_tbl.part_id WHERE bom_output.part_id =$part_id and bom_output.component_cat = $component_cat";

 
 $sql = "with loc as(select cre.*,   get_distance_m(
            $latti,     -- current latitude
            $longi,     -- current longitude
            cre.latti,
            cre.longi
        ) AS distance_m from creditors  cre WHERE cre.latti IS NOT NULL AND cre.longi IS NOT NULL )
        select * from loc where distance_m <= 500 order by distance_m asc";


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


