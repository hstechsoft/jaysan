<?php
 include 'db_head.php';

  $emp_query = isset($_GET['emp_query']) ? $_GET['emp_query'] : '';
    $emp_query = ($emp_query == '') ? "1" :  "emp.emp_id  = '$emp_query'";
 
 
 

    $part_query = isset($_GET['part_query']) ? $_GET['part_query'] : '';
    $part_query = ($part_query == '') ? "1" :  "parts_tbl.part_id  = '$part_query'";

  

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SELECT log.*,emp.emp_name,creditors.creditor_name as godown,dep.dep_name,sec.sec_name,parts_tbl.part_name  FROM `jaysan_stock_log` log 
INNER join employee emp on log.emp_id = emp.emp_id
inner join parts parts_tbl on log.part_id = parts_tbl.part_id
LEFT join creditors on log.godown = creditors.creditor_id
LEFT join department dep on log.dep = dep.dep_id
LEFT join dep_section sec on log.sec = sec.dep_sec_id WHERE $emp_query AND $part_query ORDER BY log.log_id DESC";

 

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


