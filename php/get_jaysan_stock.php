<?php
 include 'db_head.php';

  $from_date = isset($_GET['from_date']) ? $_GET['from_date'] : '';
    $to_date = isset($_GET['to_date']) ? $_GET['to_date'] : '';
    
  // $date_query = ($from_date == '' || $to_date  == '') ? "1" :  "dated between    '$from_date' and '$to_date' ";
  $creditor_query = isset($_GET['creditor_query']) ? $_GET['creditor_query'] : '';
    $creditor_query = ($creditor_query == '') ? "1" :  "godown  = '$creditor_query'";
 
 
    $dep_query = isset($_GET['dep_query']) ? $_GET['dep_query'] : '';
    $dep_query = ($dep_query == '') ? "1" :  "dep  = '$dep_query'";
 
    $sec_query = isset($_GET['sec_query']) ? $_GET['sec_query'] : '';

    $sec_query = ($sec_query == '') ? "1" :  "sec  = '$sec_query'";

    $part_query = isset($_GET['part_query']) ? $_GET['part_query'] : '';
    $part_query = ($part_query == '') ? "1" :  "part_id  = '$part_query'";

    $qty_query = isset($_GET['qty_query']) ? $_GET['qty_query'] : '';
    $qty_query = ($qty_query == '') ? "1" :  "qty  >= '$qty_query'";

    $min_order_query = isset($_GET['min_order_query']) ? $_GET['min_order_query'] : '';
    $min_order_query = ($min_order_query == '') ? "1" :  "(total_stock_godown  <= dep_min OR total_stock_dep <= dep_min OR total_stock_sec <= sec_min)"; 

$requst_query = isset($_GET['requst_query']) ? $_GET['requst_query'] : '';
$requst_query = ($requst_query == '') ? "1" :  " (sec_req is not null OR dep_req is not null OR godown_req is not null) ";
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "with request as(SELECT emr.part_id,store_type,store_id,sum(qty) as total_qty , JSON_ARRAYAGG(
        JSON_OBJECT('emp',emp.emp_name,'req_id',emp_material_request_id,'dated' ,dated,'qty',qty,'status',emr.req_status)) as req_details  FROM `emp_material_request` emr INNER join employee emp  on emp.emp_id = emr.`emp_id` WHERE emr.req_status != 'received' GROUP by part_id,store_type,store_id),
  stock_wo as(SELECT js.stock_id,js.part_id,qty,godown,dep,sec,
cre.creditor_name as unit,cre_master.min_qty as godown_min,cre_master.max_qty as godown_max,dep_master.min_qty as dep_min,dep_master.max_qty as dep_max,sec_master.min_qty as sec_min,sec_master.max_qty as sec_max,
sec_requset.req_details as sec_req,
dep_requset.req_details as dep_req,
godown_requset.req_details as godown_req,
ifnull(dep.dep_name,'no-department') as department,
ifnull(sec.sec_name,'no-section') as section,
sum(qty) over (PARTITION by part_id) as total_stock,
sum(qty) over (PARTITION by part_id,godown) as total_stock_godown,
sum(qty) over (PARTITION by part_id,godown,dep) as total_stock_dep,
sum(qty) over (PARTITION by part_id,godown,dep,sec) as total_stock_sec
FROM `jaysan_stock` js
LEFT join creditors cre on  js.godown = cre.creditor_id 
LEFT join department dep on  js.dep = dep.dep_id 
LEFT join dep_section sec on  js.sec = sec.dep_sec_id 
left join  sec_stock_master cre_master on  js.godown =  cre_master.store_id and cre_master.store_type = 'godown' and cre_master.part_id = js.part_id
left join  sec_stock_master dep_master on  js.dep =  dep_master.store_id and dep_master.store_type = 'dep' and dep_master.part_id = js.part_id
left join  sec_stock_master sec_master on  js.sec =  sec_master.store_id and sec_master.store_type = 'sec' and sec_master.part_id = js.part_id
left join  request sec_requset on  js.sec =  sec_requset.store_id and sec_requset.store_type = 'sec' and sec_requset.part_id = js.part_id 
left join  request dep_requset on  js.dep =  dep_requset.store_id and dep_requset.store_type = 'dep' and dep_requset.part_id = js.part_id 
left join  request godown_requset on  js.godown =  godown_requset.store_id and godown_requset.store_type = 'godown' and godown_requset.part_id = js.part_id 
WHERE  1),
 stock as(SELECT * from stock_wo
WHERE   $creditor_query and  $dep_query and  $sec_query and $part_query and $qty_query and $min_order_query and $requst_query),
sec_stock as(SELECT sec_req,dep_req,godown_req,godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,stock_id,part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec from stock GROUP by part_id,godown,dep,sec),
dep_stock as(SELECT sec_req,dep_req,godown_req,godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,stock_id,part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec,JSON_ARRAYAGG(
        JSON_OBJECT('store_type','sec','sec_req',sec_req,'section',section,'Section_qty',total_stock_sec,'sec_id',sec,'sec_min',sec_min,'sec_max',sec_max,'sec_inward',(SELECT sum(stock_allocation.qty)  from stock_allocation WHERE stock_allocation.part_id = part_id and  stock_allocation.to_place_type = 'sec'and stock_allocation.to_palce_id = sec and stock_allocation.allocation_status != 'received' GROUP by part_id),'sec_outward',(SELECT sum(stock_allocation.qty)  from stock_allocation WHERE stock_allocation.part_id = part_id and  stock_allocation.from_place_type = 'sec'and stock_allocation.from_place_id = sec and stock_allocation.allocation_status != 'received' GROUP by part_id))) as sec_wise_total from sec_stock GROUP by part_id,godown,dep),
        unit_stock as (SELECT sec_req,dep_req,godown_req,godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,stock_id,part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec,JSON_ARRAYAGG(
        JSON_OBJECT('store_type','dep','dep_req',dep_req,'dep_min',dep_min,'dep_max',dep_max,'department',department,'department_qty',total_stock_dep,'dep_id',dep,'section_details',sec_wise_total)) as dep_total from dep_stock GROUP by part_id,godown),
        req_detials as (SELECT part_id, JSON_ARRAYAGG(
        JSON_OBJECT('req_status',req_status,'emp',emp.emp_name,'req_id',emp_material_request_id,'dated' ,dated,'qty',qty,'store_type',store_type,'store_id',store_id,'store',
                   if(store_type = 'godown',(SELECT creditor_name from creditors WHERE creditor_id = store_id),(if(store_type = 'dep',(SELECT dep_name from department WHERE dep_id = store_id),(SELECT sec_name   FROM `dep_section` WHERE dep_sec_id = store_id))))
                   )) as req_details FROM `emp_material_request` emr1 INNER join employee emp  on emp.emp_id = emr1.emp_id   WHERE  emr1.req_status != 'received'  GROUP by store_type,store_id,part_id)
       SELECT (select  JSON_ARRAYAGG(JSON_OBJECT('req_details',req_details)) as req_details from req_detials rd where rd.part_id = unit_stock.part_id GROUP by part_id) as req_details, sec_req,dep_req,godown_req,stock_id,godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,(select part_name from parts_tbl where part_id = unit_stock.part_id) as part_name ,(select min_order_qty from parts_tbl where part_id = unit_stock.part_id) as min_order_qty, part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec,JSON_ARRAYAGG(
        JSON_OBJECT('store_type','unit','godown_req',godown_req,'godown_min',godown_min,'godown_max',godown_max,'unit',unit,'godown_qty',total_stock_godown,'godown_id',godown,'department_details',dep_total)) as unit_total,(SELECT JSON_ARRAYAGG(
        JSON_OBJECT('cat',prs_title.prs_name,'id',prs_title.prs_id)) as de FROM `part_assign_tbl` inner join prs_title on part_assign_tbl.title_id = prs_title.prs_id WHERE part_id = part_id) from unit_stock GROUP by part_id";

 

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


