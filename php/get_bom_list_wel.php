<?php
 include 'db_head.php';

 $part_id = test_input($_GET['part_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT bom_output.component_cat,
 bom_output.part_id,
 ifnull(COUNT(pwt.process_id),0) as process_count,
 JSON_ARRAYAGG(JSON_OBJECT(
        'process_title',process_title,
        'is_default',pwt.is_default,
            'process_name',jp.process_name,
'process_id',pwt.process_id)) as bom_list
    
FROM bom_output 
LEFT join process_wel_tbl pwt on pwt.output_part = bom_output.part_id and pwt.component_cat = bom_output.component_cat and pwt.cat = 'out'
left join jaysan_process jp on pwt.process = jp.process_id
WHERE bom_output.part_id =   $part_id  group by pwt.output_part,pwt.component_cat";

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


