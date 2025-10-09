<?php
 include 'db_head.php';
$part_id = test_input($_GET['part_id']);
$process_id = test_input($_GET['process_id']);
$qtype = test_input($_GET['qtype']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($qtype == "'part'")
 $sql = "SELECT sts,(select count(rqid) as qno from rate_quotation where rqpid = $part_id) as qno,(select DATE_FORMAT(max(dated), '%d-%m-%Y %r')  as dated from rate_quotation where rqpid = $part_id order by dated desc limit 1) as last_date from  rate_quotation_part WHERE part_id = $part_id";
else
   $sql = "SELECT sts,(select count(rqid) as qno from rate_quotation where process_id = $process_id) as qno,(select DATE_FORMAT(max(dated), '%d-%m-%Y %r')  as dated from rate_quotation where process_id = $process_id order by dated desc limit 1) as last_date from  rate_quotation_part WHERE process_id = $process_id";

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


