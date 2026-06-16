<?php
 include 'db_head.php';
$transport_godown = test_input($_GET['transport_godown']);
$stock_json = json_decode($_GET['stock_json'], true);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

try {

  $conn->begin_transaction();


foreach ($stock_json as $stock) {
 
    $stock_reserve_id = $stock['stock_reserve_id'];
    $qty = $stock['qty'];
// get stock id from stock reserve id
    $sql_stock = "SELECT js.stock_id,js.qty as stock_qty,js.part_id,js.process_id,js.batch_id  FROM stock_reserve
    inner join jaysan_stock js on stock_reserve.stock_id = js.stock_id
     WHERE stock_reserve_id = $stock_reserve_id";
    $result_stock = $conn->query($sql_stock);
    if ($result_stock->num_rows > 0) {
        $row_stock = $result_stock->fetch_assoc();
        $stock_id = $row_stock['stock_id'];
        $stock_qty = $row_stock['stock_qty'];
        $part_id = $row_stock['part_id'];
        $process_id = $row_stock['process_id'];
        $batch_id = $row_stock['batch_id'];
if ($qty > $stock_qty) {
  throw new Exception("Quantity to transport cannot be greater than stock quantity for stock id $stock_id");
           
        }
         $sql_reserve_update = "UPDATE jaysan_stock SET qty = qty - $qty WHERE stock_id = $stock_id";
        if (!$conn->query($sql_reserve_update)) {
            throw new Exception("Error updating stock reserve id $stock_reserve_id: " . $conn->error);
        }

        // check if stock with same part id, process id, godown and batch id exists in transport godown
        $sql_check_stock = "SELECT stock_id FROM jaysan_stock WHERE part_id = $part_id AND process_id = $process_id AND godown = $transport_godown AND batch_id = '$batch_id'";
        $result_check_stock = $conn->query($sql_check_stock);
        if ($result_check_stock->num_rows > 0) {
            // stock exists in transport godown, update quantity
            $row_check_stock = $result_check_stock->fetch_assoc();
            $existing_stock_id = $row_check_stock['stock_id'];
        } else {
            $existing_stock_id = null;
        }


        // if stock exists in transport godown update stock with new quantity else insert new stock with quantity
        if($existing_stock_id) {
            $sql_update_stock = "UPDATE jaysan_stock SET qty = qty + $qty WHERE stock_id = $existing_stock_id";
            if (!$conn->query($sql_update_stock)) {
                throw new Exception("Error updating stock id $existing_stock_id in transport godown: " . $conn->error);
            }
            $new_stock_id = $existing_stock_id;
        } else {


        // insert new stock in transport godown with quantity and get new stock id
        $sql_insert_stock = "INSERT INTO jaysan_stock (part_id, process_id, godown, qty,batch_id) VALUES ($part_id, $process_id, $transport_godown, $qty, '$batch_id')";
        if ($conn->query($sql_insert_stock) === TRUE) {
            $new_stock_id = $conn->insert_id;
        } else {
            throw new Exception("Error inserting new stock in transport godown for part id $part_id and process id $process_id: " .$sql_insert_stock. $conn->error);
        }   


        
 

        }   
        
        
        // using that new_stock_id update stock reserve with new stock id and reserve qty
                $sql_update_reserve = "UPDATE stock_reserve SET stock_id = $new_stock_id, reserve_qty = $qty WHERE stock_reserve_id = $stock_reserve_id";
                if (!$conn->query($sql_update_reserve)) {
                    throw new Exception("Error updating stock reserve id $stock_reserve_id with new stock id $new_stock_id: " . $conn->error);
                }

         $transport_dc_id = 0;
// get transport_dc_id 
$sql_check_transport = "SELECT transport_dc_id from transport_parts WHERE reserve_id = $stock_reserve_id";
$result_check_transport = $conn->query($sql_check_transport);
        if ($result_check_transport->num_rows > 0) {
            // stock exists in transport godown, update quantity
            $row_check_transport = $result_check_transport->fetch_assoc();
            $transport_dc_id = $row_check_transport['transport_dc_id'];
        } else {
            throw new Exception("Error inserting new stock in transport godown for part id $part_id and process id $process_id: ".$sql_check_transport . $conn->error);
        }   

echo   $sql_check_transport;

    // update current transport in transport parts with $transport_godown and sts as transport
    $sql_update_transport = "UPDATE transport_dc SET current_transport = $transport_godown, sts = 'transport' WHERE transport_dc_id = $transport_dc_id";
    if (!$conn->query($sql_update_transport)) {
        throw new Exception("Error updating transport parts for stock reserve id $stock_reserve_id: " . $conn->error);
    }

} 

  


}
$conn->commit();
echo "ok";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
    $conn->rollback();
}
$conn->close();

 ?>


