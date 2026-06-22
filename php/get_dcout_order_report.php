<?php
 include 'db_head.php';

 
 $source = test_input($_GET['source']);
 $destination = test_input($_GET['destination']);
$source_query  = 1;
$destination_query = 1;
if($destination != 'all' ) {
    $destination_query = "des_godown
  = $destination";
  }
 if($source != 'all' ) {
    $source_query = "source_godown = $source";
 }


function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);

  return $data;
}

$sql = "with transport as(SELECT  transport_dc.*,source.creditor_name as source,dest.creditor_name as destination from transport_dc
left join creditors source on transport_dc.source_godown = source.creditor_id
left join creditors dest on transport_dc.des_godown = dest.creditor_id
WHERE $source_query and $destination_query and sts = 'create')
select des_godown_name,des_godown ,JSON_ARRAYAGG(JSON_OBJECT('godown',godown,'dep',dep,'sec',sec,'creditor_name',creditor_name,'dep_name',dep_name,'sec_name',sec_name,'parts',parts)) as parts from transport";

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


