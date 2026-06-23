<?php
 include 'db_head.php';

 
 $transport_dc_id =test_input($_GET['transport_dc_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


// get reserve id from transport_parts
$sql_reserve = "SELECT reserve_id from transport_dc
inner join transport_parts on transport_dc.transport_dc_id = transport_parts.transport_dc_id
 where transport_dc.transport_dc_id = $transport_dc_id and   transport_dc.sts = 'create' and dc_id = 0";
// get reserve id as comma separated string
$reserve_ids = array();
$result = $conn->query($sql_reserve);
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $reserve_ids[] = $row['reserve_id'];
    }
}
$reserve_ids_str = implode(',', $reserve_ids);
// if length of reserve_ids_str is 0, then do not delete from stock_reserve
if (strlen($reserve_ids_str) == 0) {
    echo "ok";
    exit();
}
$sql = "DELETE from stock_reserve WHERE stock_reserve_id IN ($reserve_ids_str)" ;

if ($conn->query($sql) === TRUE) {
    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


