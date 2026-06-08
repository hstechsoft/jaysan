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

        // update stock to transport godown on duplicate key update
         $sql_update_stock = "INSERT INTO jaysan_stock (part_id, process_id, godown, qty,batch_id) VALUES ($part_id, $process_id, $transport_godown, $qty, '$batch_id') ON DUPLICATE KEY UPDATE qty = qty + $qty";
      //  get updated stock id
        if ($conn->query($sql_update_stock) === TRUE) {
            $new_stock_id = $conn->insert_id;
            if ($new_stock_id == 0) {
                // if duplicate key update happened get stock id of transport godown
                $sql_get_stock_id = "SELECT stock_id FROM jaysan_stock WHERE part_id = $part_id AND process_id = $process_id AND godown = $transport_godown AND batch_id = $batch_id";
                $result_get_stock_id = $conn->query($sql_get_stock_id);
                if ($result_get_stock_id->num_rows > 0) {
                    $row_get_stock_id = $result_get_stock_id->fetch_assoc();
                    $new_stock_id = $row_get_stock_id['stock_id'];
                } else {
                    throw new Exception("Error getting new stock id for part id $part_id and process id $process_id in transport godown: " . $conn->error);
                }


          
        } 


        // using that new_stock_id update stock reserve with new stock id and reserve qty
                $sql_update_reserve = "UPDATE stock_reserve SET stock_id = $new_stock_id, reserve_qty = $qty WHERE stock_reserve_id = $stock_reserve_id";
                if (!$conn->query($sql_update_reserve)) {
                    throw new Exception("Error updating stock reserve id $stock_reserve_id with new stock id $new_stock_id: " . $conn->error);
                }

       
    } else {
        throw new Exception("Error getting stock details for stock reserve id $stock_reserve_id: " . $conn->error.$sql_update_stock);
    }

    // update current transport in transport parts with $transport_godown and sts as transport
    $sql_update_transport = "UPDATE transport_parts SET current_godown = $transport_godown, sts = 'transport' WHERE reserve_id = $stock_reserve_id";
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


