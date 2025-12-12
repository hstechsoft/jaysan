<?php
 include 'db_head.php';

 $term = ($_GET['term']);




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

 $sql = "SELECT ds.*,dep.dep_id,dep.godown_id FROM `dep_section` ds inner join department dep on ds.dep_id = dep.dep_id WHERE sec_name like  '$term'";

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


