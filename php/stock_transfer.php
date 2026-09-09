<?php
 
function stock_transfer(mysqli $conn, $part_id, $process_id, $from_godown, $from_dep, $from_sec, $to_godown, $to_dep, $to_sec, $qty)
{
    // we need to reduce stock from from and insert stock to to
    // 1. need to reduce stock reserve for from godown
    // 2. need to reduce input_demand for to godown

    // get input_demand for the to godown
    $input_demand_id = 0;
    $ip_demand_qty = 0;
    $part_id = sql_nullable($part_id);
    $process_id = sql_nullable($process_id);
    $from_godown = sql_nullable($from_godown);
    $from_dep = sql_nullable($from_dep);
    $from_sec = sql_nullable($from_sec);
    $to_godown = sql_nullable($to_godown);
    $to_dep = sql_nullable($to_dep);
    $to_sec = sql_nullable($to_sec);
    $reduce_qty = 0;
    echo "Part ID: $part_id, Process ID: $process_id, From Godown: $from_godown, From Dep: $from_dep, From Sec: $from_sec, To Godown: $to_godown, To Dep: $to_dep, To Sec: $to_sec, Qty: $qty";
    exit();
    $sql_input_demand_to = "SELECT qty,input_demand_id FROM input_demand WHERE godown = $to_godown AND dep = $to_dep AND sec = $to_sec AND part_id <=> $part_id AND process_id <=> $process_id and cat = 'stock_transfer'";
    $result_input_demand_to = $conn->query($sql_input_demand_to);
    $input_demand_to = array();
    if ($result_input_demand_to->num_rows > 0) {
        while ($row_input_demand_to = $result_input_demand_to->fetch_assoc()) {
            $input_demand_id = $row_input_demand_to['input_demand_id'];
            $ip_demand_qty = $row_input_demand_to['qty'];
        }
    }

    $reduce_qty = min($ip_demand_qty,$qty);

    // update the input_demand for the to godown
    if ($reduce_qty > 0) {
        $sql_update_input_demand_to = "UPDATE input_demand SET qty = qty - $reduce_qty WHERE input_demand_id = $input_demand_id";
        if ($conn->query($sql_update_input_demand_to) === TRUE) {
            // handle error
            
        }
        else
            {
throw new Exception("Failed to update input_demand for input_demand_id: $input_demand_id");
            }

        // delete zero qty input_demand
        $sql_delete_zero_input_demand_to = "DELETE FROM input_demand WHERE input_demand_id = $input_demand_id AND qty = 0";
        $conn->query($sql_delete_zero_input_demand_to);
    }

  $reduce_qty = 0;
  $reserve_qty = 0;
  // get stock_reserve for the from godown
  $sql_get_reserve = "SELECT reserve_qty,stock_reserve_id FROM stock_view WHERE godown = $from_godown AND dep = $from_dep AND sec = $from_sec AND part_id <=> $part_id AND process_id <=> $process_id and reserve_type = 'stock_transfer'";
  $result_get_reserve = $conn->query($sql_get_reserve);
  $reserve = array();
  if ($result_get_reserve->num_rows > 0) {
      while ($row_get_reserve = $result_get_reserve->fetch_assoc()) {
          $stock_reserve_id = $row_get_reserve['stock_reserve_id'];
          $reserve_qty = $row_get_reserve['reserve_qty'];
      }
  }

  $reduce_qty = min($reserve_qty,$qty);

  // update the stock_reserve for the from godown
  if ($reduce_qty > 0) {
      $sql_update_reserve = "UPDATE stock_reserve SET reserve_qty = reserve_qty - $reduce_qty WHERE stock_reserve_id = $stock_reserve_id";
      if ($conn->query($sql_update_reserve) !== TRUE) {
          throw new Exception("Failed to update stock_reserve for stock_reserve_id: $stock_reserve_id");
      }

      // delete zero qty stock_reserve
      $sql_delete_zero_reserve = "DELETE FROM stock_reserve WHERE stock_reserve_id = $stock_reserve_id AND reserve_qty = 0";
      $conn->query($sql_delete_zero_reserve);
  }


//   reduce the stock from the from godown 
$stock_reduction = "UPDATE jaysan_stock SET qty = qty - $qty WHERE godown = $from_godown AND dep = $from_dep AND sec = $from_sec AND part_id <=> $part_id AND process_id <=> $process_id";
if ($conn->query($stock_reduction) !== TRUE) {
    throw new Exception("Failed to reduce stock for godown: $from_godown, dep: $from_dep, sec: $from_sec, part_id: $part_id, process_id: $process_id");
}
$stock_id= 0;
// add the stock to the to godown ,insert on duplicate key update and get stock_id
$stock_addition = "INSERT INTO jaysan_stock (godown, dep, sec, part_id, process_id, qty) VALUES ($to_godown, $to_dep, $to_sec, $part_id, $process_id, $qty) ON DUPLICATE KEY UPDATE qty = qty + $qty";
// get stock_id

  if ($conn->query($stock_addition) === TRUE) {
      $stock_id = $conn->insert_id;
  } else {
      throw new Exception("Failed to add jaysan_stock for godown: $to_godown, dep: $to_dep, sec: $to_sec, part_id: $part_id, process_id: $process_id");
  }

  require_once 'stock_distribution.php';
  stock_distribution($conn, $stock_id, $qty);






}
 ?>