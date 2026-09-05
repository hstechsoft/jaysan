<?php
// 
function stock_distribution(mysqli $conn,$stock_id,$qty,$process_id = null)
{
    $process_id = sql_nullable($process_id);
    $result_json = [];
try
    {
        $result_json['status'] = 'started';
// echo "<br>Starting stock distribution for stock_id: $stock_id, qty: $qty, process_id: $process_id<br>";
    // get godown, dep, sec from stock id
    $sql_stock = "SELECT * FROM jaysan_stock WHERE stock_id = $stock_id";
    $result_stock = $conn->query($sql_stock);
    if ($result_stock->num_rows > 0) {
        $row_stock = $result_stock->fetch_assoc();
        $godown = sql_nullable($row_stock['godown']);
        $dep = sql_nullable($row_stock['dep']);
        $sec = sql_nullable($row_stock['sec']);
        $in_process_id = sql_nullable($row_stock['process_id']);
        $in_part_id = sql_nullable($row_stock['part_id']);

    } else {
        throw new Exception("Stock id $stock_id not found in jaysan_stock");
    }

$result_json['stock_details'] = [
    'stock_id' => $stock_id,
    'godown' => $godown,
    'dep' => $dep,
    'sec' => $sec,
    'process_id' => $process_id,
    'part_id' => $in_part_id
];

$demand_insert_qty = $qty;
$demand_array = array();
 $sql_work_order_demand = "select * from input_part_demand_view where previous_process_id <=> $in_process_id and input_part_id <=> $in_part_id and godown <=> $godown and dep <=> $dep and sec <=> $sec  ";

$result_json['sql_work_order_demand'] = $sql_work_order_demand;


       
        $result_work_order_demand = $conn->query($sql_work_order_demand);
        if ($result_work_order_demand->num_rows > 0) {
            while ($row_work_order_demand = $result_work_order_demand->fetch_assoc()) {
          $demand_array[] = $row_work_order_demand;
            }
        }
        

        foreach($demand_array as $demand){
            // process each demand item here
           
  
    $work_process_id = $demand['work_process_id'];
    $godown = $demand['godown'];
    $dep = $demand['dep'];
    $sec = $demand['sec'];
    $input_part_id = sql_nullable($demand['input_part_id']);
    $previous_process_id = sql_nullable($demand['previous_process_id']);
    $needed = $demand['needed'];
    $reduce_qty = min($needed,$demand_insert_qty);
// insert on duplicate key update stock_reserve
$sql_reserve_work_order = "INSERT INTO stock_reserve (stock_id, reserve_qty, reserve_type) VALUES ($stock_id, $reduce_qty, 'work_order') ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $reduce_qty";
$conn->query($sql_reserve_work_order);


// insert input_demand on duplicate key update
$sql_input_demand = "INSERT INTO input_demand ( work_process_id, process_id, part_id, godown, dep, sec, cat,qty) VALUES ($work_process_id, $previous_process_id, $input_part_id, $godown, $dep, $sec, 'work_order', $reduce_qty) ON DUPLICATE KEY UPDATE qty = qty + $reduce_qty";
$conn->query($sql_input_demand);

$demand_insert_qty -= $reduce_qty;
if($demand_insert_qty <= 0){
    break;
}

        }
     
     

        // if demand_insert_qty still remains check same godown

$demand_array = array();
 $sql_work_order_demand_godown = "select * from input_part_demand_view where previous_process_id <=> $in_process_id and input_part_id <=> $in_part_id and godown <=> $godown ";
$result_json['sql_work_order_demand_godown'] = $sql_work_order_demand_godown;
        $result_work_order_demand_godown = $conn->query($sql_work_order_demand_godown);
        if ($result_work_order_demand_godown->num_rows > 0) {
            while ($row_work_order_demand_godown = $result_work_order_demand_godown->fetch_assoc()) {
                $demand_array[] = $row_work_order_demand_godown;
            }
        }


                foreach($demand_array as $demand){
            // process each demand item here
           
  
    $work_process_id = $demand['work_process_id'];
    $godown = $demand['godown'];
    $dep = $demand['dep'];
    $sec = $demand['sec'];
    $input_part_id = sql_nullable($demand['input_part_id']);
    $previous_process_id = sql_nullable($demand['previous_process_id']);
    $needed = $demand['needed'];
    $reduce_qty = min($needed,$demand_insert_qty);
// insert on duplicate key update stock_reserve
$sql_reserve_work_order = "INSERT INTO stock_reserve (stock_id, reserve_qty, reserve_type) VALUES ($stock_id, $reduce_qty, 'stock_transfer') ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $reduce_qty";
$conn->query($sql_reserve_work_order);


// insert input_demand on duplicate key update
$sql_input_demand = "INSERT INTO input_demand ( work_process_id, process_id, part_id, godown, dep, sec, cat,qty) VALUES ($work_process_id, $previous_process_id, $input_part_id, $godown, $dep, $sec, 'stock_transfer', $reduce_qty) ON DUPLICATE KEY UPDATE qty = qty + $reduce_qty";
$conn->query($sql_input_demand);

$demand_insert_qty -= $reduce_qty;
if($demand_insert_qty <= 0){
    break;
}

        }


        // if demand_insert_qty still remains then reserve it as job_work_order

$demand_array = array();
// get details where godown not equal to the current godown
 $sql_work_order_demand_outside = "select * from input_part_demand_view where previous_process_id <=> $in_process_id and input_part_id <=> $in_part_id and godown <> $godown ";
 $result_json['sql_work_order_demand_outside'] = $sql_work_order_demand_outside;
        $result_work_order_demand_outside = $conn->query($sql_work_order_demand_outside);
        if ($result_work_order_demand_outside->num_rows > 0) {
            while ($row_work_order_demand_outside = $result_work_order_demand_outside->fetch_assoc()) {
                $demand_array[] = $row_work_order_demand_outside;
            }
        }


                        foreach($demand_array as $demand){
            // process each demand item here
           
  
    $work_process_id = $demand['work_process_id'];
    $godown = $demand['godown'];
    $dep = $demand['dep'];
    $sec = $demand['sec'];
    $input_part_id = sql_nullable($demand['input_part_id']);
    $previous_process_id = sql_nullable($demand['previous_process_id']);
    $needed = $demand['needed'];
    $reduce_qty = min($needed,$demand_insert_qty);
// insert on duplicate key update stock_reserve
$sql_reserve_work_order = "INSERT INTO stock_reserve (stock_id, reserve_qty, reserve_type) VALUES ($stock_id, $reduce_qty, 'job_work_order') ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $reduce_qty";
$conn->query($sql_reserve_work_order);




$demand_insert_qty -= $reduce_qty;
if($demand_insert_qty <= 0){
    break;
}

        }


        
   

        echo json_encode($result_json);
          
return true;


    



    }
     
    catch (Exception $e) {
        // $conn->rollback();
        throw new Exception($e->getMessage());
        // echo "Transaction failed: " . $e->getMessage();
    }

}
 ?>