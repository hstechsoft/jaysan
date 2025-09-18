<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT process_wel_tbl.component_cat, process_wel_tbl.process_id,parts_tbl.part_name,process_wel_tbl.output_part,parts_tbl.part_no,parts_tbl.part_id  FROM process_wel_tbl INNER join parts_tbl on process_wel_tbl.output_part = parts_tbl.part_id WHERE process_wel_tbl.cat = 'out' and  parts_tbl.sub_ass = '0' ORDER by process_wel_tbl.process_id DESC ";

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


