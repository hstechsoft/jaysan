<?php
// 
function stock_distribution(mysqli $conn,$stock_id,$qty,$process_id)
{
    $process_id = sql_nullable($process_id);
    $result_json = [];
try
    {

    // get godown, dep, sec from stock id
    $sql_stock = "SELECT godown, dep, sec FROM jaysan_stock WHERE stock_id = $stock_id";
    $result_stock = $conn->query($sql_stock);
    if ($result_stock->num_rows > 0) {
        $row_stock = $result_stock->fetch_assoc();
        $godown = sql_nullable($row_stock['godown']);
        $dep = sql_nullable($row_stock['dep']);
        $sec = sql_nullable($row_stock['sec']);
    } else {
        throw new Exception("Stock id $stock_id not found in jaysan_stock");
    }

        $conn->begin_transaction();
// get work order demand and assign if demand 
$sql_work_order_demand = "with
    demand as (
        select
           iwp.process_id,
           sum(work_order.qty) as work_order_qty,
            sum(iwp.qty) as input_qty,
           sum(work_order.qty * iwp.qty) as total_production_qty,
            iwp.previous_process_id,
            iwp.input_part_id,
            work_order.godown,
            work_order.dep,
            work_order.sec
        from
            input_wel_parts iwp
            inner join demand on iwp.process_id = demand.process_id
            inner join work_order on demand.demand_id = work_order.demand_id
        WHERE
            iwp.previous_process_id <=> $process_id group by godown,dep,sec
    ),
    self_demand as (
        select *
        from demand
        where
            godown <=> $godown
            and dep <=> $dep
            and sec <=> $sec
    ) ,
    reserved_stock as (
              select   
        sr.stock_reserve_id,
        js.part_id,
        js.process_id,
        js.godown,
        js.dep,
        js.sec,
        js.stock_id,
        sr.reserve_qty,
        sr.reserve_type,
        js.qty as stock_qty
        from jaysan_stock js 
         LEFT join stock_reserve sr on sr.stock_id = js.stock_id and reserve_type = 'work_order' 
          where   js.godown <=> $godown and js.dep <=> $dep and js.sec <=> $sec
    )



select
    self_demand.process_id,
    self_demand.work_order_qty,
    self_demand.input_qty,
    self_demand.total_production_qty,
    self_demand.previous_process_id,
    self_demand.input_part_id,
    self_demand.godown,
    self_demand.dep,
    self_demand.sec,
    js.stock_id,
    js.stock_qty,
    js.stock_reserve_id,
    js.reserve_qty,
    js.reserve_type,
  self_demand.total_production_qty-ifnull(js.reserve_qty,0) as remaining_reserve_qty

from
    self_demand
    left join reserved_stock js on self_demand.input_part_id <=> js.part_id
    and self_demand.previous_process_id <=> js.process_id and  self_demand.godown <=> js.godown and self_demand.dep <=> js.dep and self_demand.sec <=> js.sec"; 
        // echo "<br>SQL Work Order Demand: ".$sql_work_order_demand;
        $result_work_order_demand = $conn->query($sql_work_order_demand);
        if ($result_work_order_demand->num_rows > 0) {
            while ($row_work_order_demand = $result_work_order_demand->fetch_assoc()) {
                // $stock_reserve_id = $row_work_order_demand['stock_reserve_id'];
                // $reserve_qty = $row_work_order_demand['reserve_qty'];
                // $stock_qty = $row_work_order_demand['qty'];
                // $reserve_type = $row_work_order_demand['reserve_type'];
               
                $remaining_reserve_qty = $row_work_order_demand['remaining_reserve_qty'];
       if($remaining_reserve_qty > 0){
if($remaining_reserve_qty >= $qty){
    // reserve full qty 
    $sql_reserve = "insert into stock_reserve (stock_id,reserve_type,reserve_qty) values ($stock_id,'work_order',$qty) on duplicate key update reserve_qty = reserve_qty + $qty";

   if($conn->query($sql_reserve)) {
       $qty = 0;
       $conn->commit();
       return "ok";
   }
   else
    {
        throw new Exception("Error reserving stock: " . $conn->error);
    }
           }
           else
            {
                $sql_reserve = "insert into stock_reserve (stock_id,reserve_type,reserve_qty) values ($stock_id,'work_order',$remaining_reserve_qty) on duplicate key update reserve_qty = reserve_qty + $remaining_reserve_qty";
                if($conn->query($sql_reserve)) {
                    $qty -= $remaining_reserve_qty;
                }
                else
                {
                    throw new Exception("Error reserving stock: " . $conn->error);
                }

            }

       }
            }
        } 
        
        // else {
        //     throw new Exception("No work order demand found for godown $godown, dep $dep, sec $sec");
        // }



        // get external work order demand and assign if demand


        $sql_job_work_order_demand = "with
    demand as (
        select
            iwp.process_id,
           sum(work_order.qty) as work_order_qty,
            sum(iwp.qty) as input_qty,
           sum(work_order.qty * iwp.qty) as total_production_qty,
            iwp.previous_process_id,
            iwp.input_part_id,
            work_order.godown,
            work_order.dep,
            work_order.sec
        from
            input_wel_parts iwp
            inner join demand on iwp.process_id = demand.process_id
            inner join work_order on demand.demand_id = work_order.demand_id
        WHERE
            iwp.previous_process_id <=> $process_id group by godown,dep,sec
    ),
    self_demand as (
        select *
        from demand
        where
             NOT (
    godown <=> $godown
    AND dep <=> $dep
    AND sec <=> $sec
)
    ) 

    ,
    reserved_stock as (
   select   
        sr.stock_reserve_id,
        js.part_id,
        js.process_id,
        js.godown,
        js.dep,
        js.sec,
        js.stock_id,
        sr.reserve_qty,
        sr.reserve_type,
        js.qty as stock_qty
        from jaysan_stock js 
         LEFT join stock_reserve sr on sr.stock_id = js.stock_id and reserve_type = 'job_work_order' 
        where
            NOT (
    godown <=> $godown
    AND dep <=> $dep
    AND sec <=> $sec
)
    )



select
    self_demand.process_id,
    self_demand.work_order_qty,
    self_demand.input_qty,
    self_demand.total_production_qty,
    self_demand.previous_process_id,
    self_demand.input_part_id,
    self_demand.godown,
    self_demand.dep,
    self_demand.sec,
    js.stock_id,
    js.stock_qty,
    js.stock_reserve_id,
    js.reserve_qty,
    js.reserve_type,
  self_demand.total_production_qty-ifnull(js.reserve_qty,0) as remaining_reserve_qty

from
    self_demand
    left join reserved_stock js on self_demand.input_part_id <=> js.part_id
    and self_demand.previous_process_id <=> js.process_id and  self_demand.godown <=> js.godown and self_demand.dep <=> js.dep and self_demand.sec <=> js.sec"; 
        //   echo "<br>SQL Job Work Order Demand: ".$sql_job_work_order_demand;
        $result_job_work_order_demand = $conn->query($sql_job_work_order_demand);
        if ($result_job_work_order_demand->num_rows > 0) {
            while ($row_job_work_order_demand = $result_job_work_order_demand->fetch_assoc()) {
                // $stock_reserve_id = $row_job_work_order_demand['stock_reserve_id'];
                // $reserve_qty = $row_job_work_order_demand['reserve_qty'];
                // $stock_qty = $row_job_work_order_demand['qty'];
                // $reserve_type = $row_job_work_order_demand['reserve_type'];
                $part_id = $row_job_work_order_demand['input_part_id'];
                $process_id = $row_job_work_order_demand['previous_process_id'];
                 $jobWork_stock_id = $row_job_work_order_demand['stock_id'];
                //  echo $jobWork_stock_id;
                //  if($jobWork_stock_id == null){
                //     throw new Exception("No stock found for job work order demand for godown kindly add 0 stock for godown ".$row_job_work_order_demand['godown']." dep ".$row_job_work_order_demand['dep']." sec ".$row_job_work_order_demand['sec']." and part id ".$row_job_work_order_demand['input_part_id']." and process id ".$row_job_work_order_demand['previous_process_id']);
                //  }
                $remaining_reserve_qty = $row_job_work_order_demand['remaining_reserve_qty'];
       if($remaining_reserve_qty > 0){
if($remaining_reserve_qty >= $qty){
    // reserve full qty 
    $sql_reserve = "insert into stock_reserve (stock_id,reserve_type,reserve_qty) values ($stock_id,'job_work_order',$qty) on duplicate key update reserve_qty = reserve_qty + $qty";
//    echo "<br>SQL Reserve: ".$sql_reserve;
    if($conn->query($sql_reserve)) {
       $qty = 0;
       $conn->commit();
       return "ok";
   }
   else
    {
        throw new Exception("Error reserving stock: " . $conn->error);
    }
           }
           else
            {
                $sql_reserve = "insert into stock_reserve (stock_id,reserve_type,reserve_qty) values ($stock_id,'job_work_order',$remaining_reserve_qty) on duplicate key update reserve_qty = reserve_qty + $remaining_reserve_qty";
                // echo "<br>SQL Reserve: ".$sql_reserve;
                if($conn->query($sql_reserve)) {
                    $qty -= $remaining_reserve_qty;
                }
                else
                {
                    throw new Exception("Error reserving stock: " . $conn->error);
                }

            }

       }
            }
        }
        
        // else {
        //     throw new Exception("No job work order demand found for godown $godown, dep $dep, sec $sec");
        // }
          $conn->commit();
          
return true;


    



    }
     
    catch (Exception $e) {
        $conn->rollback();
       return  false
        // echo "Transaction failed: " . $e->getMessage();
    }

}
 ?>