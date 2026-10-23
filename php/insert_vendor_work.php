<?php
 include 'db_head.php';

 $godown_id = test_input($_POST['godown_id']);
 $dep_id = test_input($_POST['dep_id']);
 $sec_id = test_input($_POST['sec_id']);
$processed_id = test_input($_POST['process_id']);
$processed_qty = test_input($_POST['qty']);



 $godown_id = sql_nullable($godown_id);
 $dep_id = sql_nullable($dep_id);
 $sec_id = sql_nullable($sec_id);

// stock_master=[{"min_qty":"10","max_qty":"100","store_type":"warehouse"}]

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

echo "Starting process...\n";
echo "Godown ID: $godown_id, Dep ID: $dep_id, Sec ID: $sec_id, Processed ID: $processed_id, Processed Qty: $processed_qty\n";
$result_json = array();

try
{

$conn->begin_transaction();
$consumption = [];
 $sql_check_stock = "select iwp.qty,iwp.previous_process_id,iwp.input_part_id from process_wel_tbl pwt
inner join input_wel_parts iwp on iwp.process_id = pwt.process_id where pwt.process_id = $processed_id ";

    $result_check_stock = $conn->query($sql_check_stock);
    if ($result_check_stock->num_rows > 0) {


      
        while($row = $result_check_stock->fetch_assoc()){
          
            $consume_qty = $row['qty'] * $processed_qty;
            // $remaining = $row['total_stock_qty'] - $consume_qty;
       $consumption[] = [
        "part_id" => $row['input_part_id'],
        "previous_process_id" => $row['previous_process_id'],
        "qty" => $consume_qty,
        "work_process_id" => $processed_id
       
    ];



        }


    }


    // reduce input_demand with consumption
   foreach ($consumption as $consume) {
    // first  reduce stock on same section,then same dep the same godown

  $part_id = sql_nullable($consume['part_id']);
 $qty_to_consume = $consume['qty'];
 $process_id = sql_nullable($consume['previous_process_id']);
 $work_process_id = sql_nullable($consume['work_process_id']);


 if($qty_to_consume > 0) {
$sql_get_sec_stock = "select  input_demand_id,qty from  input_demand WHERE process_id <=> $process_id and godown <=> $godown_id and dep <=> $dep_id and sec <=> $sec_id and cat = 'work_order' and work_process_id = $work_process_id order by input_demand_id ";

if($part_id != 'NULL') {
   $sql_get_sec_stock = "select  input_demand_id,qty from  input_demand WHERE part_id <=> $part_id and godown <=> $godown_id and dep <=> $dep_id and sec <=> $sec_id and cat = 'work_order' and work_process_id = $work_process_id order by input_demand_id";
}

$result_sec_stock = $conn->query($sql_get_sec_stock);
if($result_sec_stock->num_rows > 0) {
    while($row = $result_sec_stock->fetch_assoc()) {
        if($qty_to_consume <= 0) break;

        $input_demand_id = $row['input_demand_id'];
        $qty = $row['qty'];
        $available = $qty;
        $take_qty = min($available, $qty_to_consume);

  

        // reduce reserve stock
        $sql_update_reserve = "update input_demand set qty = qty - $take_qty where input_demand_id = $input_demand_id";
        if ($conn->query($sql_update_reserve) !== TRUE) {
            $result_json['message'] = "Error updating input demand: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

        // delete reserve stock if reserve_qty is 0
        $sql_delete_reserve = "delete from input_demand where  qty <= 0";
        if ($conn->query($sql_delete_reserve) !== TRUE) {
            $result_json['message'] = "Error deleting input demand: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

    }
    }

}
   }



   
//    reduce stock_reserve based on consumption
   foreach ($consumption as $consume) {
    // first  reduce stock on same section,then same dep the same godown

  $part_id = sql_nullable($consume['part_id']);
 $qty_to_consume = $consume['qty'];
 $process_id = sql_nullable($consume['previous_process_id']);
 $work_process_id = sql_nullable($consume['work_process_id']);


 if($qty_to_consume > 0) {
$sql_get_sec_stock = "select stock_reserve_id,godown,dep,sec,reserve_qty as avail_qty,stock_id from stock_view WHERE process_id <=> $process_id and godown <=> $godown_id and dep <=> $dep_id and sec <=> $sec_id and reserve_type = 'work_order'   order by stock_id ";

if($part_id != 'NULL') {
   $sql_get_sec_stock = "select stock_reserve_id, godown,dep,sec,reserve_qty as avail_qty,stock_id from stock_view WHERE part_id <=> $part_id and godown <=> $godown_id and dep <=> $dep_id and sec <=> $sec_id and reserve_type = 'work_order'  order by stock_id";
}

$result_sec_stock = $conn->query($sql_get_sec_stock);
if($result_sec_stock->num_rows > 0) {
    while($row = $result_sec_stock->fetch_assoc()) {
        if($qty_to_consume <= 0) break;

        $stock_id = $row['stock_id'];
        $stock_reserve_id = $row['stock_reserve_id'];
        $available = $row['avail_qty'];
        $take_qty = min($available, $qty_to_consume);



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




            // reduce real consumption from stock

foreach($consumption as $consume) {
    $stock_id = 0;
  $part_id = sql_nullable($consume['part_id']);
 $qty_to_consume = $consume['qty'];
 $process_id = sql_nullable($consume['previous_process_id']);
 $work_process_id = sql_nullable($consume['work_process_id']);

// get stock_id from jaysan_stock for the consumed part and location
$sql_get_stock_id = "select stock_id from jaysan_stock where part_id <=> $part_id and process_id <=> $process_id and godown <=> $godown_id and dep <=> $dep_id and sec <=> $sec_id";
$result_get_stock_id = $conn->query($sql_get_stock_id);
$stock_id = 0;
if($result_get_stock_id->num_rows > 0) {
    $row = $result_get_stock_id->fetch_assoc();
    $stock_id = $row['stock_id'];
}

if($stock_id > 0) {
        // 🔥 reduce stock (insert negative entry with SAME section)
        $sql_update_stock = "update jaysan_stock set qty = qty - $qty_to_consume,remark='stock_consumed by vendor' where stock_id = $stock_id";

        if ($conn->query($sql_update_stock) === TRUE) {
            // reduce 
            
           
        } else {
            $result_json['message'] = "Error updating stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }
}
else
    {

if($part_id !="NULL")
    {
        $process_id = "NULL";
    }
        // insert 0-qty for the stock if it doesn't exist
        $sql_insert_stock = "insert into jaysan_stock (part_id, process_id, godown, dep, sec, qty,remark) values ($part_id, $process_id, $godown_id, $dep_id, $sec_id, 0-$qty_to_consume,'stock_consumed by vendor') on duplicate key update qty = qty -$qty_to_consume";

        echo $sql_insert_stock;
    
        if ($conn->query($sql_insert_stock) !== TRUE) {
            $result_json['message'] = "Error inserting stock: " . $conn->error;
            echo json_encode($result_json);
            $conn->rollback();
            $conn->close();
            exit;
        }

    }
}

$part_id = "NULL";
  
        $required_qty = $processed_qty;

        $production_qty = $required_qty;
       $insert_process_id = "NULL";
// get process_id,output_part from process_wel_tbl
$sql_get_proces_details = "SELECT  output_part FROM process_wel_tbl WHERE process_id = $processed_id";
$result_proces_details = $conn->query($sql_get_proces_details);
if ($result_proces_details->num_rows > 0) {
    $row_proces_details = $result_proces_details->fetch_assoc();
   
    $part_id = sql_nullable($row_proces_details['output_part']);
}

if($part_id != "NULL"  )
    {
        $process_id = "NULL";
    }
    else
        {
            $process_id = $processed_id;
        }


$batch_id = "null";
$dstock_id = 0;
    // insert output stock for the process part
    $sql_insert_output = "INSERT INTO jaysan_stock (part_id, process_id, godown, dep, sec, qty, batch_id,remark) VALUES ($part_id, $process_id , $godown_id, $dep_id, $sec_id, $required_qty, '$batch_id','stock_added by vendor ') ON DUPLICATE KEY UPDATE qty = qty + $required_qty";
    echo $sql_insert_output;

    if ($conn->query($sql_insert_output) === TRUE) {
// get stock_id
$stock_id = $conn->insert_id;
$dstock_id = $stock_id;



    } else {
        $result_json['message'] = "Error inserting output stock: " . $conn->error;
        echo json_encode($result_json);
        $conn->rollback();
        $conn->close();
        exit;
        
    

    }
$work_order_array = [];
if($production_qty > 0 )
    {
//    get work_order_id to update 
$sql_get_work_order_id = "select wo.work_order_id,pending_qty from demand 
inner join work_order wo on demand.demand_id = wo.demand_id
where wo.godown <=> $godown_id and wo.dep <=> $dep_id and wo.sec <=> $sec_id and demand.process_id <=> $processed_id";
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
    $reduce_qty = min($production_qty, $pending_qty);
    $production_qty -= $reduce_qty;
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

    require_once 'stock_distribution.php';
stock_distribution($conn, $dstock_id, $required_qty);

 $conn->commit();

$result_json['success'] = true;
$result_json['message'] = "Work successfully inserted and stock updated.";
echo json_encode($result_json);


}
catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}



$conn->close();

 ?>


