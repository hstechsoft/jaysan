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


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "with stock_wo as(SELECT js.stock_id,js.part_id,qty,godown,dep,sec,
cre.creditor_name as unit,cre_master.min_qty as godown_min,cre_master.max_qty as godown_max,dep_master.min_qty as dep_min,dep_master.max_qty as dep_max,sec_master.min_qty as sec_min,sec_master.max_qty as sec_max,
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
WHERE  1),
 stock as(SELECT * from stock_wo
WHERE   $creditor_query and  $dep_query and  $sec_query and $part_query and $qty_query and $min_order_query),
sec_stock as(SELECT godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,stock_id,part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec from stock GROUP by part_id,godown,dep,sec),
dep_stock as(SELECT godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,stock_id,part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec,JSON_ARRAYAGG(
        JSON_OBJECT('section',section,'Section_qty',total_stock_sec,'sec_id',sec,'sec_min',sec_min,'sec_max',sec_max)) as sec_wise_total from sec_stock GROUP by part_id,godown,dep),
        unit_stock as (SELECT godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,stock_id,part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec,JSON_ARRAYAGG(
        JSON_OBJECT('dep_min',dep_min,'dep_max',dep_max,'department',department,'department_qty',total_stock_dep,'dep_id',dep,'section_details',sec_wise_total)) as dep_total from dep_stock GROUP by part_id,godown)
        
        SELECT stock_id,godown_min,godown_max,dep_min,dep_max,sec_min,sec_max,(select part_name from parts_tbl where part_id = unit_stock.part_id) as part_name ,(select min_order_qty from parts_tbl where part_id = unit_stock.part_id) as min_order_qty, part_id,qty,godown,dep,sec,unit,department,section,total_stock,total_stock_godown,total_stock_dep,total_stock_sec,JSON_ARRAYAGG(
        JSON_OBJECT('godown_min',godown_min,'godown_max',godown_max,'unit',unit,'godown_qty',total_stock_godown,'godown_id',godown,'department_details',dep_total)) as unit_total from unit_stock GROUP by part_id";

 

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


