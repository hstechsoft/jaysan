<?php

include 'db_head.php';


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
echo $sql_recompute_jobwork;
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
        


        ;
$conn->close();

 ?>