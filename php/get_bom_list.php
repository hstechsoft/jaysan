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



 $sql = "SELECT bom_output.*,
       (SELECT 1
        FROM process_wel_tbl pwl
        WHERE pwl.output_part COLLATE utf8mb4_unicode_ci = 
              bom_output.part_id COLLATE utf8mb4_unicode_ci
          AND pwl.component_cat COLLATE utf8mb4_unicode_ci = 
              bom_output.component_cat COLLATE utf8mb4_unicode_ci group by pwl.output_part, pwl.component_cat
       ) AS process
FROM bom_output
WHERE bom_output.part_id = $part_id ";

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


