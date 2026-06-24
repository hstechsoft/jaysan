
<?php
 include 'db_head.php';


$godown = test_input($_POST['godown']);
$dep = test_input($_POST['dep']);
$sec = test_input($_POST['sec']);
$qty = test_input($_POST['qty']);
$process_id = test_input($_POST['process_id']);

$created_by = test_input($_POST['created_by']);

$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);
$process_id = sql_nullable($process_id);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

try {
    $conn->begin_transaction();

    $sql_insert_work_order = "INSERT INTO work_order ( work_order_type,godown,dep,sec,qty,status,created_by,created_date) VALUES ('INTERNAL',$godown,$dep,$sec,$qty,'OPEN',$created_by,now())";
   

  

 //  get the last inserted id
$work_order_id  = $conn->insert_id;
//  if failed to insert, throw exception
if (!$conn->query($sql_insert_work_order)) {
    throw new Exception("Error inserting record: " . $conn->error);
}

// get parts from input_parts_tbl

$sql_get_parts = "SELECT * FROM input_wel_parts WHERE process_id = $process_id";
echo "sql_get_parts: $sql_get_parts\n";
$result = $conn->query($sql_get_parts);
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $input_part_id = $row['input_part_id '];
        $previous_process_id = $row['previous_process_id'];
        $qty = $row['qty'];

        echo "input_part_id: $input_part_id, previous_process_id: $previous_process_id, qty: $qty\n";
       
// get stock id from stock table where process_id = $previous_process_id and input_part_id = $input_part_id
        $sql_get_stock_id = "SELECT stock_id FROM jaysan_stock WHERE process_id = $previous_process_id AND part_id = $input_part_id and godown <=> $godown and dep <=> $dep and sec <=> $sec";
        $result_stock = $conn->query($sql_get_stock_id);
        if ($result_stock->num_rows > 0) {
            while($row_stock = $result_stock->fetch_assoc()) {
                $stock_id = $row_stock['stock_id'];
              
            }
        } else {
          // insert into stock table with qty = 0 and get the stock_id
          $sql_insert_stock = "INSERT INTO jaysan_stock (part_id,process_id,qty,godown,dep,sec,remark) VALUES ($input_part_id,$previous_process_id,0,$godown,$dep,$sec,'created from work order')";
          if (!$conn->query($sql_insert_stock)) {
              throw new Exception("Error inserting record: " . $conn->error);
          }
          $stock_id = $conn->insert_id;
        }


        // insert reserve record into stock_reserve table with work_order_id and stock_id and qty
        $sql_insert_stock_reserve = "INSERT INTO stock_reserve (reserve_type, reserve_type_id, emp_id,remark,stock_id,reserve_qty) VALUES ('work_order',$work_order_id,$created_by,'reserved  for work order',$stock_id,$qty)";
        if (!$conn->query($sql_insert_stock_reserve)) {
            throw new Exception("Error inserting record: " . $conn->error);
        }
    }
}




    $conn->commit();
    echo "ok";  



}
catch (Exception $e) {
    $conn->rollback();
    echo "Error: " . $e->getMessage();
    exit();
}




$conn->close();

 ?>





