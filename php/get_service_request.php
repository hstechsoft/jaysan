<?php
 include 'db_head.php';

 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "select dsid,cus_name,cus_phone,cus_addr,chasis_no,simage,implement,model,remark,complaint,dealer_service.did,DATE_FORMAT(sdate, '%d-%m-%Y %h:%i %p') as sdate ,work_id,cus_id,dname from dealer_service inner join dealer on dealer_service.did = dealer.did where work_id = 0";

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


