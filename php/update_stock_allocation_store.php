
<?php
 include 'db_head.php';

 $allocation_id =test_input($_GET['allocation_id']);
 $allocation_qty =test_input($_GET['allocation_qty']);
 $allocated_by =test_input($_GET['allocated_by']);
 $allocation_remark =test_input($_GET['allocation_remark']);
$req_no = null;
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE stock_allocation SET allocation_qty = $allocation_qty, allocated_by = $allocated_by, allocation_remark = $allocation_remark ,allocation_status = 'allocated' WHERE allocation_id = $allocation_id";
  
  if ($conn->query($sql) === TRUE) {
    $sql_get_allocation = "SELECT  req_no FROM stock_allocation WHERE allocation_id = $allocation_id";
$result = $conn->query($sql_get_allocation);
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
 $req_no = $row['req_no'];

  }
    $sql_update_req = "UPDATE emp_material_request SET req_status = 'delivered' WHERE emp_material_request_id = $req_no";
    if ($conn->query($sql_update_req) === TRUE) {
    }
    else {
    echo "Error: " . $sql_update_req . "<br>" . $conn->error;
    }
   

}




echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





