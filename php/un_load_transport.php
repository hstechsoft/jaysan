<?php
 include 'db_head.php';
$des_godown = test_input($_GET['des_godown']);
$stock_json = json_decode($_GET['stock_json'], true);

// unload transport parts from transport godown to destination godown
 
 
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
        $part_id = sql_nullable($row_stock['part_id']);
        $process_id = sql_nullable($row_stock['process_id']);
        $batch_id = $row_stock['batch_id'];
// reduce stock qty from stock id(reduce from transport godown stock)
         $sql_reserve_update = "UPDATE jaysan_stock SET qty = qty - $qty WHERE stock_id = $stock_id";
        if (!$conn->query($sql_reserve_update)) {
            throw new Exception("Error updating stock reserve id $stock_reserve_id: " . $conn->error);
        }

      // check if stock with same part id, process id, godown and batch id exists in transport godown
        $sql_check_stock = "SELECT stock_id FROM jaysan_stock WHERE part_id <=> $part_id AND process_id <=> $process_id AND godown = $des_godown AND batch_id = '$batch_id'";
        echo $sql_check_stock;
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
        }
        else {



        
        // insert new stock in transport godown with quantity and get new stock id
        $sql_insert_stock = "INSERT INTO jaysan_stock (part_id, process_id, godown, qty,batch_id) VALUES ($part_id, $process_id, $des_godown, $qty, '$batch_id')";
        if ($conn->query($sql_insert_stock) === TRUE) {
            $new_stock_id = $conn->insert_id;
        } else {
            throw new Exception("Error inserting new stock in transport godown for part id $part_id and process id $process_id: " . $conn->error);
        }   


        
 

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

// reduce stock reserve qty
$update_reserve = "UPDATE stock_reserve SET reserve_qty = reserve_qty - $qty WHERE stock_reserve_id = $stock_reserve_id";
if (!$conn->query($update_reserve)) {
    throw new Exception("Error reducing reserve qty for stock reserve id $stock_reserve_id: " . $conn->error);
}

// if reserve qty is 0 then delete it
$delete_reserve = "DELETE FROM stock_reserve WHERE stock_reserve_id = $stock_reserve_id AND reserve_qty <= 0";
if (!$conn->query($delete_reserve)) {
    throw new Exception("Error deleting stock reserve id $stock_reserve_id: " . $conn->error);
}


// // insert on duplicate key update stock reserve with typr = work_order
// $update_reserve_qty = "INSERT INTO stock_reserve (stock_id, reserve_type, reserve_type_id, reserve_qty) VALUES ($new_stock_id, 'work_order', $transport_dc_id, $qty) ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $qty";
// if (!$conn->query($update_reserve_qty)) {
//     throw new Exception("Error updating stock reserve for new stock id $new_stock_id: " . $conn->error);
// }

//             // using that new_stock_id update stock reserve with new stock id and reserve qty
//                 $sql_update_reserve = "UPDATE stock_reserve SET stock_id = $new_stock_id, reserve_qty = $qty WHERE stock_reserve_id = $stock_reserve_id";
//                 if (!$conn->query($sql_update_reserve)) {
//                     throw new Exception("Error updating stock reserve id $stock_reserve_id with new stock id $new_stock_id: " . $conn->error);
//                 }




     

    // check destination godown if it transport then change current transport to $transport and sts = transport else change sts = finished

    $sql_check_des_godown = "select creditor_group from creditors where creditor_id = $des_godown";
    $result_check_des_godown = $conn->query($sql_check_des_godown);
    if ($result_check_des_godown->num_rows > 0) {
        $row_check_des_godown = $result_check_des_godown->fetch_assoc();
        $creditor_group = $row_check_des_godown['creditor_group'];
    } else {
        throw new Exception("Error checking destination godown for id $des_godown: " . $conn->error);
    }

     
// UPDATE transport_dc SET current_transport = $des_godown, sts = 'transport' WHERE transport_dc_id = $transport_dc_id

    if($creditor_group == 'transport') {
        // update current transport in transport parts with $transport_godown and sts as transport
        $sql_update_transport = "UPDATE transport_dc SET current_transport = $des_godown, sts = 'transport' WHERE transport_dc_id = $transport_dc_id";
        if (!$conn->query($sql_update_transport)) {
            throw new Exception("Error updating transport parts for stock reserve id $stock_reserve_id: " . $conn->error);
        }
    } else {
        // update current transport in transport parts with $transport_godown and sts as finished
        $sql_update_transport = "UPDATE transport_dc SET  sts = 'finished' WHERE transport_dc_id = $transport_dc_id";
        if (!$conn->query($sql_update_transport)) {
            throw new Exception("Error updating transport parts for stock reserve id $stock_reserve_id: " . $conn->error);
        }
    }

 
} 

  // get  input demand array where transport_dc_id,cat as dc,part_id,process_id matches
  $dc_demand_array = array();
$sql = "SELECT * FROM input_demand WHERE godown = $des_godown AND cat = 'transport' AND part_id <=> $part_id AND process_id <=> $process_id";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $dc_demand_array[] = $row;
    }
}


$demand_insert_qty = $qty;
foreach($dc_demand_array as $dc_demand) {
    // process each dc_demand here
    $input_demand_id = $dc_demand['input_demand_id'];
    $demand_qty = $dc_demand['qty'];
    $work_process_id = $dc_demand['work_process_id'];
    $dep = $dc_demand['dep'];
    $sec = $dc_demand['sec'];
    $part_id = sql_nullable($dc_demand['part_id']);
    $process_id = sql_nullable($dc_demand['process_id']);
    $reduce_qty = min($demand_qty,$demand_insert_qty);
// update input_demand table to reduce the qty by $reduce_qty
    $sql_update_input_demand = "UPDATE input_demand SET qty = qty - $reduce_qty WHERE input_demand_id = $input_demand_id";
    if (!$conn->query($sql_update_input_demand)) {
        throw new Exception("Error updating input demand id $input_demand_id: " . $conn->error);
    }

  
    
      $demand_insert_qty -= $reduce_qty;

    // if qty is reduced to zero, break the loop
    if ($demand_insert_qty <= 0) {
        break;
    }
  


}

// delete input_demand rows where qty is zero
$sql_delete_input_demand = "DELETE FROM input_demand WHERE qty = 0";
$conn->query($sql_delete_input_demand);
require_once 'stock_distribution.php';
stock_distribution($conn, $existing_stock_id, $qty);

}
$conn->commit();
echo "ok";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
    $conn->rollback();
}
$conn->close();

 ?>


