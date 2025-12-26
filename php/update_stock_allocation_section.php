
<?php

use BcMath\Number;

 include 'db_head.php';

 $allocation_id =test_input($_GET['allocation_id']);
 $received_qty =($_GET['received_qty']);
 $received_by =test_input($_GET['received_by']);
 $receive_remark = ($_GET['receive_remark']);
$req_no = null;


$from_place_id = null;
$from_place_type = null;
$to_place_id = null;
$to_place_type = null;
$part_id = null;

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

$sql_get_allocation = "SELECT   part_id, from_place_id, from_place_type, to_palce_id, to_place_type, qty, req_no, allocation_status, allocation_cat, allocation_qty, received_qty, created_by, allocated_by, received_by, allocation_remark, receive_remark FROM stock_allocation WHERE allocation_id = $allocation_id";
$result = $conn->query($sql_get_allocation);
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $part_id =   $row['part_id'];
$from_place_id = $row['from_place_id'];
$from_place_type = $row['from_place_type'];
$to_place_id = $row['to_palce_id'];
$to_place_type = $row['to_place_type'];
$req_no = $row['req_no'];

  }
}


$sql = "UPDATE stock_allocation SET allocation_status = 'received', received_qty = $received_qty, received_by = $received_by, receive_remark = '$receive_remark' WHERE allocation_id = $allocation_id";
  
  if ($conn->query($sql) === TRUE) {



    
$sql_update_req = "UPDATE emp_material_request SET req_status = 'received' WHERE emp_material_request_id = $req_no";
    if ($conn->query($sql_update_req) === TRUE) {
    }
    else {
    echo "Error: " . $sql_update_req . "<br>" . $conn->error;
    }
   


list($godown, $dep, $sec) = get_store_details($to_place_id, $to_place_type, $conn);


    $check_sql_receive = "SELECT qty FROM jaysan_stock WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id = $part_id )";

$result = $conn->query($check_sql_receive);

if ($result->num_rows > 0) {
  // Record exists, update it
  $qty_stock = $result->fetch_assoc()['qty'];

  $qty_stock = floatval($received_qty) +   ($qty_stock);
echo $qty_stock;
  $remark = "stock updated by store allocation-inward <br>".$receive_remark ;
  $sql_stock = "UPDATE jaysan_stock   SET emp_id = $received_by, qty= '$qty_stock',remark= '$remark' ,dated = NOW()
      WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id =  $part_id )";

       if ($conn->query($sql_stock) === TRUE) {
   
  } else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
    
} else {
  // Record doesn't exist, insert it
  $remark = "stock inserted by store allocation-inward <br>".$receive_remark ;
  $sql_stock = "INSERT INTO jaysan_stock (godown,dep,sec,part_id,qty,remark,emp_id) 
      VALUES ($godown,$dep,$sec, $part_id,$qty,'$remark',$received_by)";

        if ($conn->query($sql_stock) === TRUE) {
        }
  else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
}



list($godown, $dep, $sec) = get_store_details($to_place_id, $to_place_type, $conn);

   
    $check_sql_receive = "SELECT qty FROM jaysan_stock WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id = $part_id )";

$result = $conn->query($check_sql_receive);

if ($result->num_rows > 0) {
  // Record exists, update it
  $qty_stock =   $result->fetch_assoc()['qty'];
  $qty_stock = floatval($qty_stock) -floatval($received_qty);
;
  $remark = "stock updated by store allocation-outward <br>".$receive_remark;
  $sql_stock = "UPDATE jaysan_stock   SET emp_id = $received_by, qty= $qty_stock,remark= '$remark' ,dated = NOW()
      WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id =  $part_id )";

       if ($conn->query($sql_stock) === TRUE) {
   
  } else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
    
} else {
  // Record doesn't exist, insert it
  $remark = "stock taken by store allocation-outward <br>".$receive_remark ;
  $sql_stock = "INSERT INTO jaysan_stock (godown,dep,sec,part_id,qty,remark,emp_id) 
      VALUES ($godown,$dep,$sec, $part_id,$qty,'$remark',$received_by)";

        if ($conn->query($sql_stock) === TRUE) {
        }
  else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
}




echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





