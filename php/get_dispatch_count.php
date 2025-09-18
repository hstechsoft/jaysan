<?php
 include 'db_head.php';

 $oid = test_input($_GET['oid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


//  $sql = "SELECT COUNT(sop.opid)as count from assign_product ap INNER join sales_order_product sop on ap.opid = sop.opid WHERE ap.assign_type = 'Finshed' and ap.dcf_id = 0 and sop.oid =  $oid ";


 $sql = "SELECT COUNT(sop.opid)as count from assign_product ap INNER join sales_order_product sop on ap.opid = sop.opid WHERE  ap.dcf_id = 0 and sop.oid =  $oid ";
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


