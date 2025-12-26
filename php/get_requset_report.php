
<?php



 include 'db_head.php';

 $store_id = test_input($_GET['$store_id']);
 $store_type = test_input($_GET['$store_type']);

 




function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




function get_store_details($store_id, $store_type, $conn) {
 
$dep = null;
$sec = null;
$godown = null;


    if($store_type == 'godown')
    {
     $dep =   '';
     $sec =  '';
     $godown =  $store_id;
    }
    else if($store_type == 'dep')
    {

     $sec =  '';
     
$sql_store_type = "SELECT * FROM department WHERE dep_id  = $store_id";
$result = $conn->query($sql_store_type);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $dep =   $row['dep_id'];
    $godown = $row['godown_id'];
   
  }
}

    }
      else if($store_type == 'sec')
    {
             
$sql_store_type = "SELECT sec.dep_sec_id,dep.dep_id,dep.godown_id FROM `dep_section` sec inner join department dep on sec.dep_id = dep.dep_id WHERE sec.dep_sec_id = $store_id";
$result = $conn->query($sql_store_type);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $dep =   $row['dep_id'];
    $godown = $row['godown_id'];
    $sec = $row['dep_sec_id'];  
   
  }
}

    }

    $godown = sql_nullable($godown);
   $dep = sql_nullable($dep);       
    $sec = sql_nullable($sec);


return array($godown, $dep, $sec);

}


   
   
$sql ="select emr.qty,emr.dated,emr.emp_id,emr.emp_material_request_id,emr.part_id,emr.req_status,parts_tbl.part_name,
 JSON_ARRAYAGG(
        JSON_OBJECT('allocation_sts',sa.allocation_status,'allocation_id',sa.allocation_id,
'allocation_qty',sa.qty,'allocation_remark',sa.allocation_remark,'receive_remark',sa.receive_remark,'receive_qty',sa.allocation_qty
)) as allocation_details from emp_material_request emr 
inner join parts_tbl on parts_tbl.part_id = emr.part_id
INNER join stock_allocation sa on emr.emp_material_request_id = sa.req_no 
where  emr.store_type = $store_type AND emr.store_id = $store_id AND emr.req_status != 'received'  GROUP BY emr.part_id,emr.emp_material_request_id";
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





