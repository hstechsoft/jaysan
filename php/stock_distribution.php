<?php
// 
function stock_distribution(mysqli $conn,$stock_id,$qty,$process_id = null)
{
    $process_id = sql_nullable($process_id);
    $result_json = [];

   
try
    {
//   $conn->begin_transaction();
// delete 0 reserve in stock_reserve table
$sql_delete_zero_reserve = "DELETE FROM stock_reserve WHERE reserve_qty = 0";
$conn->query($sql_delete_zero_reserve);
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

    $godown_reduce = $godown;
    $dep_reduce = $dep;
    $sec_reduce = $sec;

$result_json['stock_details'] = [
    'stock_id' => $stock_id,
    'godown' => $godown,
    'dep' => $dep,
    'sec' => $sec,
    'process_id' => $process_id,
    'part_id' => $in_part_id
];
// getting demand for the current stock item
$demand_insert_qty = $qty;
$demand_array = array();
 $sql_work_order_demand = "select * from input_part_demand_view where previous_process_id <=> $in_process_id and input_part_id <=> $in_part_id and godown <=> $godown and dep <=> $dep and sec <=> $sec";

$result_json['sql_work_order_demand'] = $sql_work_order_demand;


       

        $result_work_order_demand = $conn->query($sql_work_order_demand);
        if ($result_work_order_demand->num_rows > 0) {
            while ($row_work_order_demand = $result_work_order_demand->fetch_assoc()) {
                $result_json['demand_row'][] = $row_work_order_demand;
          $demand_array[] = $row_work_order_demand;
            }
        }
        
// processing each demand item and reserve it as work order if its same place
        foreach($demand_array as $demand){
            // process each demand item here
           
  
    $work_process_id = $demand['work_process_id'];
    $godown = sql_nullable($demand['godown']);
    $dep = sql_nullable($demand['dep']);
    $sec = sql_nullable($demand['sec']);
    $input_part_id = sql_nullable($demand['input_part_id']);
    $previous_process_id = sql_nullable($demand['previous_process_id']);
    $needed = $demand['needed'];
    $reduce_qty = min($needed,$demand_insert_qty);
// insert on duplicate key update stock_reserve
$sql_reserve_work_order = "INSERT INTO stock_reserve (stock_id, reserve_qty, reserve_type) VALUES ($stock_id, $reduce_qty, 'work_order') ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $reduce_qty";

$conn->query($sql_reserve_work_order);


// insert input_demand on duplicate key update
$sql_input_demand = "INSERT INTO input_demand ( work_process_id, process_id, part_id, godown, dep, sec, cat,qty) VALUES ($work_process_id, $previous_process_id, $input_part_id, $godown, $dep, $sec, 'work_order', $reduce_qty) ON DUPLICATE KEY UPDATE qty = qty + $reduce_qty";
;
$conn->query($sql_input_demand);
$demand_insert_qty = round($demand_insert_qty-$reduce_qty, 5);

// $demand_insert_qty -= $reduce_qty;
if($demand_insert_qty <= 0){
    break;
}

        }
     
     $result_json['remaining_demand_insert_qty_after_wo'] = $demand_insert_qty;

        // if demand_insert_qty still remains check same godown
          if($demand_insert_qty > 0)
{
$demand_array = array();
 $sql_work_order_demand_godown = "select * from input_part_demand_view where previous_process_id <=> $in_process_id and input_part_id <=> $in_part_id and godown <=> $godown ";

$result_json['sql_work_order_demand_samegodown'] = $sql_work_order_demand_godown;
        $result_work_order_demand_godown = $conn->query($sql_work_order_demand_godown);
        if ($result_work_order_demand_godown->num_rows > 0) {
            while ($row_work_order_demand_godown = $result_work_order_demand_godown->fetch_assoc()) {
                $result_json['demand_row_samegodown'][] = $row_work_order_demand_godown;
                $demand_array[] = $row_work_order_demand_godown;
            }
        }


                foreach($demand_array as $demand){
            // process each demand item here
           
  
    $work_process_id = $demand['work_process_id'];
    $tgodown = sql_nullable($demand['godown']);
    $tdep = sql_nullable($demand['dep']);
    $tsec = sql_nullable($demand['sec']);
    $input_part_id = sql_nullable($demand['input_part_id']);
    $previous_process_id = sql_nullable($demand['previous_process_id']);
    $needed = $demand['needed'];
       $result_json['needed'][] = $needed;
    $result_json['demand_insert_qty'][] = $demand_insert_qty;
    $reduce_qty = min($needed,$demand_insert_qty);
    $result_json['reduce_qty'][] = $reduce_qty;
    // put it in array

  
// insert on duplicate key update stock_reserve
$sql_reserve_work_order = "INSERT INTO stock_reserve (stock_id, reserve_qty, reserve_type) VALUES ($stock_id, $reduce_qty, 'stock_transfer') ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $reduce_qty";

$conn->query($sql_reserve_work_order);
$result_json['sql_reserve_work_order'][] = $sql_reserve_work_order;
$result_json['reserve_qty_stockreserve'][] = $reduce_qty;

$from_godown = ($godown);
$from_dep = ($dep);
$from_sec = ($sec);

$to_godown = sql_nullable($tgodown);
$to_dep = sql_nullable($tdep);
$to_sec = sql_nullable($tsec);

 $sql_allocation = "INSERT INTO stock_allocation ( part_id,from_sec,from_dep,from_godown,to_godown,to_dep,to_sec,qty,process_id) VALUES ($input_part_id,$from_sec,$from_dep,$from_godown,$to_godown,$to_dep,$to_sec,$reduce_qty,$previous_process_id)";

$result_json['messages']['result4'][] = "executing stock allocation query";
$result_json['messages']['result4'][] = "stock allocation query: " . $sql_allocation;
  if ($conn->query($sql_allocation) === TRUE) {
    $result_json['messages']['result4'][] = "stock allocation updated successfully";
  } else {
    throw new Exception("Error updating stock allocation: " . $conn->error);
  }


// insert input_demand on duplicate key update
$sql_input_demand = "INSERT INTO input_demand ( work_process_id, process_id, part_id, godown, dep, sec, cat,qty) VALUES ($work_process_id, $previous_process_id, $input_part_id, $to_godown, $to_dep, $to_sec, 'stock_transfer', $reduce_qty) ON DUPLICATE KEY UPDATE qty = qty + $reduce_qty";
$result_json['sql_input_demand'][] = $sql_input_demand;

$conn->query($sql_input_demand);

    $result_json['details'][] = array(
       
        'needed' => $needed,
        'demand_insert_qty' => $demand_insert_qty,
        'reduce_qty' => $reduce_qty,
        'update_summary' => $demand_insert_qty . ' - ' . $reduce_qty,
        'after_upadte_demand' => round($demand_insert_qty - $reduce_qty, 5)
    );
 
$demand_insert_qty = round($demand_insert_qty - $reduce_qty, 5);
if($demand_insert_qty <= 0){
    break;
}

        }
    }

    $result_json['remaining_demand_insert_qty_after_st'] = $demand_insert_qty;


        // if demand_insert_qty still remains then reserve it as job_work_order
          if($demand_insert_qty > 0)
{
$demand_array = array();
// get details where godown not equal to the current godown
 $sql_work_order_demand_outside = "with total_demand as(SELECT input_part_id,previous_process_id,godown,dep,sec,sum(needed) as total_needed FROM `input_part_demand_view` group by input_part_id,previous_process_id),
job_work_reserve as (
    select stock_id,part_id,process_id,sum(reserve_qty) as reserve_qty,godown,dep,sec,stock_reserve_id
    from stock_view WHERE reserve_type = 'job_work_order' GROUP BY part_id,process_id
) ,
demand_join as (
    select td.input_part_id, td.previous_process_id, td.godown, td.dep, td.sec, td.total_needed, jwr.stock_reserve_id,jwr.stock_id, jwr.reserve_qty, 
    td.total_needed-ifnull(jwr.reserve_qty,0) as needed
    from total_demand td
    left join job_work_reserve jwr
    on td.input_part_id <=> jwr.part_id
    and td.previous_process_id <=> jwr.process_id
 
)
select * from demand_join WHERE needed > 0 and input_part_id <=> $in_part_id and previous_process_id <=> $in_process_id";

 $result_json['sql_work_order_demand_outside'] = $sql_work_order_demand_outside;
        $result_work_order_demand_outside = $conn->query($sql_work_order_demand_outside);
        if ($result_work_order_demand_outside->num_rows > 0) {
            while ($row_work_order_demand_outside = $result_work_order_demand_outside->fetch_assoc()) {
                $demand_array[] = $row_work_order_demand_outside;
            }
        }


                        foreach($demand_array as $demand){
            // process each demand item here
           
  
   
    $godown = sql_nullable($demand['godown']);
    $dep = sql_nullable($demand['dep']);
    $sec = sql_nullable($demand['sec']);
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
}


$negative_demand_array = array();
    

// we reduced stock reserve based on the total reduced quantity from input_demand
// we also need to check if there are any remaining negative demands that need to be addressed and reduce jobwork_order

        // recompute stock reserve
        // check input_demand_view to see needed  less then 0
        $sql_recompute_jobwork = "with total_demand as(SELECT input_part_id,previous_process_id,godown,dep,sec,sum(needed) as total_needed FROM `input_part_demand_view` group by input_part_id,previous_process_id),
job_work_reserve as (
    select stock_id,part_id,process_id,sum(reserve_qty) as reserve_qty,godown,dep,sec,stock_reserve_id
    from stock_view WHERE reserve_type = 'job_work_order' GROUP BY part_id,process_id
) ,
demand_join as (
    select td.input_part_id, td.previous_process_id, td.godown, td.dep, td.sec, td.total_needed, jwr.stock_reserve_id,jwr.stock_id, jwr.reserve_qty, ifnull(jwr.reserve_qty,0) - td.total_needed as excess_needed
    from total_demand td
    left join job_work_reserve jwr
    on td.input_part_id <=> jwr.part_id
    and td.previous_process_id <=> jwr.process_id
 
)
select * from demand_join WHERE excess_needed > 0";
        $result_recompute_jobwork = $conn->query($sql_recompute_jobwork);
        if ($result_recompute_jobwork->num_rows > 0) {
            while ($row_recompute_jobwork = $result_recompute_jobwork->fetch_assoc()) {
                // process each row where needed < 0
                $negative_demand_array[] = $row_recompute_jobwork;
                $excess_needed = $row_recompute_jobwork['excess_needed'];
                $stock_reserve_id = $row_recompute_jobwork['stock_reserve_id'];

                // reduce the job work order reserve by the excess needed
                if ($excess_needed > 0 && $stock_reserve_id) {
                    $sql_update_stock_reserve = "UPDATE stock_reserve SET reserve_qty = reserve_qty - $excess_needed WHERE stock_reserve_id = $stock_reserve_id";
                    $conn->query($sql_update_stock_reserve);
                }
            }
        }
        $result_json['more_negative_demand_array'] = $negative_demand_array;



         echo json_encode($result_json);
          
 return true;
        //  $conn->commit();


    



    }
     


    catch (Exception $e) {
        //   $conn->rollback();
          throw new Exception($e->getMessage());
        //   echo "Transaction failed: " . $e->getMessage();
    }

}
 ?>