<?php
 include 'db_head.php';

 $term = ($_GET['term']);
 $godown_id = ($_GET['godown_id']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$term = "%".$term."%";

 $sql = "SELECT * FROM department left join  sec_stock_master on  department.dep_id =  sec_stock_master.store_id and sec_stock_master.store_type = 'dep' WHERE dep_name like  '$term' and godown_id =  '$godown_id'";

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


