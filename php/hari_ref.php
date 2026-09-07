<?php

include 'db_head.php';


try
{
  $conn->begin_transaction();
$negative_demand_array = array();

        // recompute stock reserve
        // check input_demand_view to see needed  less then 0s
        $sql_recompute_stock_reserve = "select * from input_part_demand_view where  needed < 0";
        $result_recompute_stock_reserve = $conn->query($sql_recompute_stock_reserve);
        if ($result_recompute_stock_reserve->num_rows > 0) {
            while ($row_recompute_stock_reserve = $result_recompute_stock_reserve->fetch_assoc()) {
                // process each row where needed < 0
                $negative_demand_array[] = $row_recompute_stock_reserve;
            }
        }
        $result_json['negative_demand_array'] = $negative_demand_array;
        
   
// reduce stock reserve based on negative demand
        foreach($negative_demand_array as $negative_demand){
          $work_process_id = $negative_demand['work_process_id'];
          $input_part_id = sql_nullable($negative_demand['input_part_id']);
          $previous_process_id = sql_nullable($negative_demand['previous_process_id']);
          $godown = sql_nullable($negative_demand['godown']);
          $dep = sql_nullable($negative_demand['dep']);
          $sec = sql_nullable($negative_demand['sec']);
            $reduce_qty = abs($negative_demand['needed']);

            $result_json['message'][] = "Processing negative demand for work_process_id: $work_process_id";
            $result_json['message'][] = "Reducing quantity: $reduce_qty";
          

            $reduced_qty = 0;
            $total_reduced_qty = 0;
            // loop through input_demand records if needed
            while($reduce_qty > 0 ){
// get  input_demand record for this negative demand
        $sql_get_input_demand = "SELECT qty,input_demand_id FROM input_demand WHERE work_process_id <=> $work_process_id AND part_id <=> $input_part_id AND process_id <=> $previous_process_id AND godown <=> $godown AND dep <=> $dep AND sec <=> $sec and cat = 'work_order'";

        $result_json['message'][] = "Executing SQL: $sql_get_input_demand";
        $result_get_input_demand = $conn->query($sql_get_input_demand);
    //    get the qty from input_demand record
        if ($result_get_input_demand->num_rows > 0) {
            $input_demand_record = $result_get_input_demand->fetch_assoc();
            $input_demand_qty = $input_demand_record['qty'];
            $input_demand_id = $input_demand_record['input_demand_id'];
        } else {
            $input_demand_qty = 0;
            $input_demand_id = null;
        }
$reduced_qty = min($reduce_qty, $input_demand_qty);
$total_reduced_qty += $reduced_qty;

// update input_demand record to reduce the qty
            if($input_demand_id !== null){
                $sql_update_input_demand = "UPDATE input_demand SET qty = qty - $reduced_qty WHERE input_demand_id = $input_demand_id";
                $result_json['message'][] = "Executing SQL: $sql_update_input_demand";
                $conn->query($sql_update_input_demand);
            }
            $reduce_qty -= $reduced_qty;
        
            }


            // delete zero qty input_demand records
            $sql_delete_zero_input_demand = "DELETE FROM input_demand WHERE qty <= 0";
            $conn->query($sql_delete_zero_input_demand);


            // reduce stock reserve based on total reduced qty
            if($total_reduced_qty > 0){
                $sql_update_stock_reserve = "UPDATE stock_reserve sr
inner join jaysan_stock js on sr.stock_id = js.stock_id
 SET sr.reserve_qty = sr.reserve_qty - $total_reduced_qty
 WHERE  js.part_id <=> $input_part_id AND js.process_id <=> $previous_process_id AND js.godown <=> $godown AND js.dep <=> $dep AND js.sec <=> $sec and sr.reserve_type = 'work_order'";
 $result_json['message'][] = "Executing SQL: $sql_update_stock_reserve";
                $conn->query($sql_update_stock_reserve);
            }

        }

        echo json_encode($result_json);
         $conn->commit();


}
catch(Exception $e) {
    $conn->rollback();
    $result_json['message'] = "Transaction failed: " . $e->getMessage();
    echo json_encode($result_json);
}

$conn->close();

 ?>