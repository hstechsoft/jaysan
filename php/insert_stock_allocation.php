<?php
 include 'db_head.php';


$allocation_json = json_decode($_POST['allocation_json'], true);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

 
if(count($allocation_json) > 0) {
   
    foreach ($allocation_json as $allocate) {
       $part_id = test_input($allocate['part_id']);
$from_place_id = test_input($allocate['from_place_id']);
$from_place_type = test_input($allocate['from_place_type']);
$to_palce_id = test_input($allocate['to_palce_id']);
$to_place_type = test_input($allocate['to_place_type']);
$qty = test_input($allocate['qty']);
$req_no = ($allocate['req_no']);
$allocation_cat = test_input($allocate['allocation_cat']);
$created_by = test_input($allocate['created_by']);

$req_no = sql_nullable($req_no);

 $sql = "INSERT INTO stock_allocation ( part_id,from_place_id,from_place_type,to_palce_id,to_place_type,qty,req_no,allocation_cat,created_by) VALUES ($part_id,$from_place_id,$from_place_type,$to_palce_id,$to_place_type,$qty,$req_no,$allocation_cat,$created_by)";

  if ($conn->query($sql) === TRUE) {
  if($req_no != 'NULL')
  {
    $sql_update_req = "UPDATE emp_material_request SET req_status = 'allocated' WHERE emp_material_request_id = $req_no";
    if ($conn->query($sql_update_req) === TRUE) {
    }
    else {
    echo "Error: " . $sql_update_req . "<br>" . $conn->error;
    }

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
    }
  }
 
echo "ok";

}
 


$conn->close();

 ?>


