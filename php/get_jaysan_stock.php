<?php
 include 'db_head.php';

  $from_date = isset($_GET['from_date']) ? $_GET['from_date'] : '';
    $to_date = isset($_GET['to_date']) ? $_GET['to_date'] : '';
    
  $date_query = ($from_date == '' || $to_date  == '') ? "1" :  "dated between    '$from_date' and '$to_date' ";
  $creditor_query = isset($_GET['creditor_query']) ? $_GET['creditor_query'] : '';
    $creditor_query = ($creditor_query == '') ? "1" :  "godown  = '$creditor_query'";
 
 
    $dep_query = isset($_GET['dep_query']) ? $_GET['dep_query'] : '';
    $dep_query = ($dep_query == '') ? "1" :  "dep  = '$dep_query'";
 
    $sec_query = isset($_GET['sec_query']) ? $_GET['sec_query'] : '';

    $sec_query = ($sec_query == '') ? "1" :  "sec  = '$sec_query'";


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = " with stock as(SELECT js.*,
              
              creditors.creditor_name,department.dep_name,dep_section.sec_name FROM `jaysan_stock` js  
inner join process_wel_tbl pwl on js.finished_process_no = pwl.process_id
LEFT join creditors on creditors.creditor_id = js.godown
LEFT join department on department.dep_id = js.dep
LEFT join dep_section on dep_section.dep_sec_id = js.sec WHERE 1)

SELECT* from stock GROUP by dated ORDER by dated DESC limit 100";

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


