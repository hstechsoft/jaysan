<?php
 include 'db_head.php';

 $process_id = test_input($_GET['process_id']);
 $source_godown_id = test_input($_GET['godown_id']);
 $dest_godown_id = test_input($_GET['dest_godown_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



 $sql = "with recursive
    process_cte as (
        SELECT
            pwt.process,
            pwt.process_id,
            pwt.previous_process_id,
            iwp.previous_process_id as in_previous_process_id,
            iwp.input_part_id,
            iwp.qty,
            0 as level
        from
            process_wel_tbl pwt
            inner join input_wel_parts iwp on pwt.process_id = iwp.process_id
        WHERE
            pwt.process_id = $process_id
        union all
        SELECT
            pwt.process,
            pwt.process_id,
            pwt.previous_process_id,
            iwp.previous_process_id as in_previous_process_id,
            iwp.input_part_id,
            iwp.qty,
            level + 1 as level
        from
            process_wel_tbl pwt
            inner join process_cte pc on pwt.process_id = pc.previous_process_id
            inner join input_wel_parts iwp on pwt.process_id = iwp.process_id
    ),
    stock_reserve_godown as (
        SELECT
            process_cte.process,
            process_cte.process_id ,
            process_cte.previous_process_id,
            process_cte.in_previous_process_id,
            process_cte.input_part_id,
            process_cte.qty ,
            process_cte.level,
            srv.creditor_name,
            srv.dep_name,
            srv.sec_name,
            srv.godown,
            srv.dep,
            srv.sec,
            srv.stock_id,
            srv.batch_id,
        
            sum(ifnull(srv.reserve_qty, 0)) as total_reserve_qty,
            sum(ifnull(srv.qty, 0)) as total_stock_qty,
            


            JSON_OBJECT('reserve_detail', srv.reserve_details) as reserve_details,
            ifnull(srv.reserve_qty, 0) as reserve_qty,
            srv.qty as stock_qty


         
           
    
        FROM
            process_cte
             left JOIN stock_reserve_view srv on process_cte.input_part_id <=> srv.part_id 
            and process_cte.in_previous_process_id <=> srv.process_id

            group by
            process_cte.input_part_id,
            process_cte.in_previous_process_id,
            srv.godown,
            srv.dep,
            srv.sec

          
            
      
    ),
    stock_reserve as (
        SELECT
            stock_reserve_godown.process,
            stock_reserve_godown.process_id,
            stock_reserve_godown.previous_process_id,
            stock_reserve_godown.in_previous_process_id,
            stock_reserve_godown.input_part_id,
            stock_reserve_godown.qty,
            stock_reserve_godown.level,
            sum(stock_reserve_godown.total_stock_qty) as total_stock_qty,
            sum(stock_reserve_godown.total_reserve_qty) as reserved_qty,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'godown_name',
                    stock_reserve_godown.creditor_name,
                    'godown',
                    stock_reserve_godown.godown,
                    'dep_name',
                    stock_reserve_godown.dep_name,
                    'dep',
                    stock_reserve_godown.dep,
                    'sec_name',
                    stock_reserve_godown.sec_name,
                    'sec',
                    stock_reserve_godown.sec,
                    'stock_id',
                    stock_reserve_godown.stock_id,
                    'batch_id',
                    stock_reserve_godown.batch_id,
                    'qty',
                    stock_reserve_godown.total_stock_qty,
                    'reserve_qty',
                    stock_reserve_godown.total_reserve_qty,
                    'reserve_details',
                    stock_reserve_godown.reserve_details,
                    'same_des_godown',
                    if(stock_reserve_godown.godown = $dest_godown_id, 1, 0)
                )
            ) as stock_reserve_details
        FROM
            stock_reserve_godown
           
            
        group by
         input_part_id,
           in_previous_process_id
         
    ),
    process_final as (
        select
            stock_reserve.process_id,
            stock_reserve.level,
            stock_reserve.process,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'part_id',
                    stock_reserve.input_part_id,
                    'part_name',
                    if(
                        in_previous_process_id is null,
                        pt_in.part_name,
                        concat(
                            ifnull(
                                pt_in.part_name,
                                'semi finished part '
                            ),
                            ' (',
                            jp_in.process_name,
                            ')'
                        )
                    ),
                    'in_previous_process_id',
                    stock_reserve.in_previous_process_id,
                    'in_previous_process_name',
                    ifnull(jp_in.process_name, 'N/A'),
                    'qty',
                    stock_reserve.qty,
                    'total_stock_qty',
                    stock_reserve.total_stock_qty,
                    'reserved_qty',
                    stock_reserve.reserved_qty,
                    'stock_reserve_details',
                    stock_reserve.stock_reserve_details
                )
            ) as part_details,
            jp.process_name as process_name
        from
            stock_reserve
            left join parts_tbl pt_in on stock_reserve.input_part_id = pt_in.part_id
            left join process_wel_tbl pwt_in on stock_reserve.in_previous_process_id = pwt_in.process_id
            left join jaysan_process jp_in on pwt_in.process = jp_in.process_id
            left join jaysan_process jp on stock_reserve.process = jp.process_id
        group by
            stock_reserve.process_id
    ),



godwn as(SELECT
    process_final.process_id,
    process_final.process_name,
    process_final.part_details,

    process_final.level,
    creditors.creditor_name,
    department.dep_name,
    dep_section.sec_name,
    wtm.cost,
    wtm.godown_id,
    wtm.dep_id,
    wtm.dep_sec_id,
    wtm.is_default,
    wtm.max_time,
    wtm.min_time,
    wtm.wtid,
    if(wtm.godown_id = $source_godown_id, 1, 0) as godown_flag
FROM
    process_final
    left join work_time_master wtm on process_final.process_id = wtm.ori_process_id
    left join creditors on wtm.godown_id = creditors.creditor_id
    left join department on wtm.dep_id = department.dep_id
    left join dep_section on wtm.dep_sec_id = dep_section.dep_sec_id),

    final_process_list as (SELECT
    godwn.process_id,
    godwn.process_name,
    godwn.part_details,
    godwn.level,
 JSON_ARRAYAGG(
        JSON_OBJECT(
            'godown_name',
           creditor_name,
            'dep_name',
           dep_name,
            'sec_name',
            sec_name,
            'cost',
            cost,
            'godown_id',
            godown_id,
            'dep_id',
            dep_id,
            'dep_sec_id',
            dep_sec_id,
            'is_default',
            is_default,
            'max_time',
            max_time,
            'min_time',
            min_time,
            'wtid',
            wtid
           
        )
    ) as work_time_details,
    if(sum(godown_flag) > 0, 1, 0) as has_godown

    from godwn group by process_id order by level DESC),
    out_process_stock as(select process_wel_tbl.process_id,ifnull(parts_tbl.part_name, concat('semi finished part ', jaysan_process.process_name)) as part_name,jaysan_process.process_name,sum(stock_reserve_view.qty) as qty,reserve_qty,reserve_details from stock_reserve_view 
    inner join process_wel_tbl on stock_reserve_view.process_id = process_wel_tbl.process_id
    left join parts_tbl on process_wel_tbl.output_part = parts_tbl.part_id
    left join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
    where godown = $dest_godown_id group by process_wel_tbl.process_id)

    select   final_process_list.process_id,
    final_process_list.process_name,
    reserve_qty as out_process_reserve_qty,
    reserve_details as out_process_reserve_details,
    part_details,
    level,
    work_time_details,
    has_godown,
    out_process_stock.part_name as out_part_name,
    out_process_stock.qty as out_part_qty

    from final_process_list

    left join out_process_stock on final_process_list.process_id = out_process_stock.process_id and has_godown = 1
    ";

    // echo $sql;

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


