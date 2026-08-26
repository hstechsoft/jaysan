<?php
 include 'db_head.php';
$job_card_id = test_input($_POST['job_card_id']);
$opertor_id = test_input($_POST['operator_id']);
$scarp_weight = test_input($_POST['scarp_weight']);
$scarp_qty = test_input($_POST['scarp_qty']);
$remark = test_input($_POST['remark']);
$godown = test_input($_POST['godown']);
$dep = test_input($_POST['dep']);
$sec= test_input($_POST['sec']);
$material_weight = test_input($_POST['material_weight']);

$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);

$produced_parts = json_decode($_POST['produced_parts'], true);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

try{
    $conn->begin_transaction();
// get the material_id from the job_card_id
$sql_material = "select nm.material_id from laser_job_card lcard
inner join nesting_details nd on lcard.nesting_details_id = nd.nesting_details_id
inner join nesting_master nm on nd.nesting_id = nm.nes_master_id where lcard.job_card_id = '$job_card_id'";
$result_material = $conn->query($sql_material);
if ($result_material->num_rows > 0) {
    $row_material = $result_material->fetch_assoc();
    $material_id = $row_material['material_id'];
} else {
    throw new Exception("Material not found for job card: " . $job_card_id);
}

// get

// insert laser_produced_parts 
foreach ($produced_parts as $part) {
    $part_id = $part['part_id'];
    $quantity = $part['quantity'];
    $scarp_qty = $part['scarp_qty'];
  
    $produced_qty = $quantity - $scarp_qty;

    $sql = "INSERT INTO laser_produced_parts (job_card_id, part_id, produced_qty, scarp_qty) VALUES ('$job_card_id', '$part_id', '$produced_qty', '$scarp_qty')";
    if ($conn->query($sql) === TRUE) {
        
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }

    // get process id 
    $is_final_output = 'no';
    $process_sql = "select jpv.process_id, jpv.output_part, if(jpv.final_part_id = jpv.output_part,'yes','no') as is_final_output from  jaysan_process_view jpv
 WHERE jpv.process_name = 'laser cutting' and jpv.final_part_id = '$part_id' limit 1";
    $process_result = $conn->query($process_sql);
    if ($process_result->num_rows > 0) {
        $process_row = $process_result->fetch_assoc();
        $process_id = $process_row['process_id'];
        $is_final_output = $process_row['is_final_output'];
    } else {
        throw new Exception("Process not found for part: " . $part_id . " and material: " . $material_id);
    }
    $batch_id = "l".$job_card_id;
// insert into stock
  $sql_insert_output = "INSERT INTO jaysan_stock (process_id, godown, dep, sec, qty, batch_id) VALUES ($process_id, $godown, $dep, $sec, $produced_qty, '$batch_id') ON DUPLICATE KEY UPDATE qty = qty + $produced_qty";
if($is_final_output == 'no') {
      $sql_insert_output = "INSERT INTO jaysan_stock (part_id, godown, dep, sec, qty, batch_id) VALUES ($part_id, $godown, $dep, $sec, $produced_qty, '$batch_id') ON DUPLICATE KEY UPDATE qty = qty + $produced_qty";
} 


  if ($conn->query($sql_insert_output) === TRUE) {
      $stock_id = $conn->insert_id;
  } else {
      throw new Exception("Error inserting into stock: " . $conn->error);
  }

  require_once 'stock_distribution.php';
stock_distribution($conn, $stock_id, $produced_qty);


$work_order_array = [];
if($produced_qty > 0 )
    {
//    get work_order_id to update 
$sql_get_work_order_id = "select wo.work_order_id,pending_qty from demand 
inner join work_order wo on demand.demand_id = wo.demand_id
where wo.godown <=> $godown and wo.dep <=> $dep and wo.sec <=> $sec and demand.process_id <=> $process_id";
$result_work_order = $conn->query($sql_get_work_order_id);
if ($result_work_order->num_rows > 0) {
    while($row_work_order = $result_work_order->fetch_assoc()) {
        $work_order_id = $row_work_order['work_order_id'];
        $pending_qty = $row_work_order['pending_qty'];
        // update work order here if needed
        $work_order_array[] = [
            'work_order_id' => $work_order_id,
            'pending_qty' => $pending_qty
        ];
    }
}

foreach($work_order_array as $work_order) {
    $work_order_id = $work_order['work_order_id'];
    $pending_qty = $work_order['pending_qty'];
    $reduce_qty = min($produced_qty, $pending_qty);
    $produced_qty -= $reduce_qty;
    // update work order in the database
    $sql_update_work_order = "UPDATE work_order SET completed_qty = completed_qty + $reduce_qty WHERE work_order_id = $work_order_id";
    if ($conn->query($sql_update_work_order) !== TRUE) {
        $result_json['message'] = "Error updating work order: " . $conn->error;
        echo json_encode($result_json);
        $conn->rollback();
        $conn->close();
        exit;
    }
}
    }

}

$remaining_consume_qty = 0;

    {
    // first  reduce stock on same section,then same dep the same godown

  $part_id = $material_id;
 $qty_to_consume = $material_weight;



 if($qty_to_consume > 0) {
$sql_get_sec_stock = "select stock_reserve_id,godown,dep,sec,reserve_qty as avail_qty,stock_id from stock_view WHERE part_id <=> $part_id and godown <=> $godown and dep <=> $dep and sec <=> $sec and reserve_type = 'work_order'   order by stock_id ";



$result_sec_stock = $conn->query($sql_get_sec_stock);
if($result_sec_stock->num_rows > 0) {
    while($row = $result_sec_stock->fetch_assoc()) {
        if($qty_to_consume <= 0) break;

        $stock_id = $row['stock_id'];
        $stock_reserve_id = $row['stock_reserve_id'];
        $available = $row['avail_qty'];
        $take_qty = min($available, $qty_to_consume);

        // 🔥 reduce stock (insert negative entry with SAME section)
        $sql_update_stock = "update jaysan_stock set qty = qty - $take_qty where stock_id = $stock_id";

        if ($conn->query($sql_update_stock) === TRUE) {
            $qty_to_consume -= $take_qty; 
        } else {
            $result_json['message'] = "Error updating stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }


        // reduce reserve stock
        $sql_update_reserve = "update stock_reserve set reserve_qty = reserve_qty - $take_qty where stock_reserve_id = $stock_reserve_id";
        if ($conn->query($sql_update_reserve) !== TRUE) {
            $result_json['message'] = "Error updating reserve stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

        // delete reserve stock if reserve_qty is 0
        $sql_delete_reserve = "delete from stock_reserve where  reserve_qty <= 0";
        if ($conn->query($sql_delete_reserve) !== TRUE) {
            $result_json['message'] = "Error deleting reserve stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

    }
    }

}
 



//  if  consume still available then check same dep 

 if($qty_to_consume > 0) {

   $sql_get_sec_stock = "select stock_reserve_id, godown,dep,sec,reserve_qty as avail_qty,stock_id from stock_view WHERE part_id <=> $part_id and godown <=> $godown and dep <=> $dep  and reserve_type = 'work_order'  order by stock_id";


$result_sec_stock = $conn->query($sql_get_sec_stock);
if($result_sec_stock->num_rows > 0) {
    while($row = $result_sec_stock->fetch_assoc()) {
        if($qty_to_consume <= 0) break;

        $stock_id = $row['stock_id'];
        $stock_reserve_id = $row['stock_reserve_id'];
        $available = $row['avail_qty'];
        $take_qty = min($available, $qty_to_consume);

        // 🔥 reduce stock (insert negative entry with SAME section)
        $sql_update_stock = "update jaysan_stock set qty = qty - $take_qty where stock_id = $stock_id";

        if ($conn->query($sql_update_stock) === TRUE) {
            $qty_to_consume -= $take_qty; 
        } else {
            $result_json['message'] = "Error updating stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }


        // reduce reserve stock
        $sql_update_reserve = "update stock_reserve set reserve_qty = reserve_qty - $take_qty where stock_reserve_id = $stock_reserve_id";
        if ($conn->query($sql_update_reserve) !== TRUE) {
            $result_json['message'] = "Error updating reserve stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

        // delete reserve stock if reserve_qty is 0
        $sql_delete_reserve = "delete from stock_reserve where  reserve_qty <= 0";
        if ($conn->query($sql_delete_reserve) !== TRUE) {
            $result_json['message'] = "Error deleting reserve stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

    }
    }

}

//  if  consume still available then check same godown
 


 if($qty_to_consume > 0) {

   $sql_get_sec_stock = "select stock_reserve_id, godown,dep,sec,reserve_qty as avail_qty,stock_id from stock_view WHERE part_id <=> $part_id and godown <=> $godown  and reserve_type = 'work_order'  order by stock_id";


$result_sec_stock = $conn->query($sql_get_sec_stock);
if($result_sec_stock->num_rows > 0) {
    while($row = $result_sec_stock->fetch_assoc()) {
        if($qty_to_consume <= 0) break;

        $stock_id = $row['stock_id'];
        $stock_reserve_id = $row['stock_reserve_id'];
        $available = $row['avail_qty'];
        $take_qty = min($available, $qty_to_consume);

        // 🔥 reduce stock (insert negative entry with SAME section)
        $sql_update_stock = "update jaysan_stock set qty = qty - $take_qty where stock_id = $stock_id";

        if ($conn->query($sql_update_stock) === TRUE) {
            $qty_to_consume -= $take_qty; 
        } else {
            $result_json['message'] = "Error updating stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }


        // reduce reserve stock
        $sql_update_reserve = "update stock_reserve set reserve_qty = reserve_qty - $take_qty where stock_reserve_id = $stock_reserve_id";
        if ($conn->query($sql_update_reserve) !== TRUE) {
            $result_json['message'] = "Error updating reserve stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

        // delete reserve stock if reserve_qty is 0
        $sql_delete_reserve = "delete from stock_reserve where  reserve_qty <= 0";
        if ($conn->query($sql_delete_reserve) !== TRUE) {
            $result_json['message'] = "Error deleting reserve stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

    } 
    }

}



    }

// updated job_card table
$sql = "UPDATE  laser_job_card SET operator_id='$opertor_id', status='finished', scarp_weight='$scarp_weight', scarp_qty='$scarp_qty', remark='$remark' WHERE job_card_id='$job_card_id'";
if ($conn->query($sql) === TRUE) {
    echo "ok";
} else {
    throw new Exception("Error updating job card: " . $conn->error);
}
$conn->commit();
}catch(Exception $e){
    $conn->rollback();
    echo "Error: " . $e->getMessage();
}

$conn->close();

 ?>


