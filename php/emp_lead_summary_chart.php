<?php
 include 'db_head.php';

 
 $emp_id = test_input($_GET['emp_id']);
 $start_date = ($_GET['start_date']);
 $end_date = ($_GET['end_date']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

//select from two table and join together

$sql = "SELECT IFNULL(table1.count,0)as count,date_seq.date as date from  (select count(emp_id) as count, FROM_UNIXTIME(dated/1000 ,'%Y-%m-%d') as date FROM `marketing_lead`  as table1  WHERE dated BETWEEN $start_date and $end_date and emp_id =  $emp_id GROUP by date) as table1 right join (select a.Date 
from (
    select  (FROM_UNIXTIME($end_date/1000 ,'%Y-%m-%d') - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY) as Date
    from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
    cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
    cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
) a 
where a.Date between FROM_UNIXTIME($start_date/1000 ,'%Y-%m-%d') and  FROM_UNIXTIME($end_date/1000 ,'%Y-%m-%d')  
ORDER BY `a`.`Date` DESC) as date_seq on table1.date = date_seq.date ORDER BY date_seq.date DESC"   ;

// $sql = "SELECT work.work_type,work_history.his_status,COUNT(work_history.his_status) as total FROM work_history left JOIN work ON work_history.work_id = work.work_id WHERE  work_history.emp_id = $emp_id and work_history.his_date between  $start_date and  $end_date GROUP BY work_type,his_status ORDER by work.work_type ";




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


