<?php
 include 'db_head.php';

 

$received_by = test_input($_GET['received_by']);
$dc_no = test_input($_GET['dc_no']);
$dc_date = test_input($_GET['dc_date']);
$receive_details = json_decode($_GET['receive_details'], true);
$dc_type = test_input($_GET['dc_type']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$conn->query("SET time_zone = '+05:30'");
foreach ($receive_details as $details) 
{ 
  
    $qty = $details['qty']; 
    $jaysan_po_material_id = $details['jaysan_po_material_id']; 
    $store_id = $details['store_id'];
    $store_type = $details['store_type'];
    $dep = '';
    $godown = '';
    $sec = '';

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

    echo "godown: $godown dep: $dep sec: $sec <br>";

    $check_sql = "SELECT qty FROM jaysan_stock WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id =(select po_material_id from jaysan_po_material where jaysan_po_material_id = $jaysan_po_material_id) )";

$result = $conn->query($check_sql);

if ($result->num_rows > 0) {
  // Record exists, update it
  $qty = $qty + $result->fetch_assoc()['qty'];
  $remark = "inward stock updated dc". $dc_no;
  $sql_stock = "UPDATE jaysan_stock   SET  qty= $qty,remark= $remark ,dated = NOW()
      WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id = (select po_material_id from jaysan_po_material where jaysan_po_material_id = $jaysan_po_material_id) )";

       if ($conn->query($sql_stock) === TRUE) {
   
  } else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
    
} else {
  // Record doesn't exist, insert it
  $remark = "inward stock inserted dc";
  $sql_stock = "INSERT INTO jaysan_stock (godown,dep,sec,part_id,batch_id,qty,finished_godown,remark) 
      VALUES ($godown,$dep,$sec, (select po_material_id from jaysan_po_material where jaysan_po_material_id = $jaysan_po_material_id),$qty,$remark)";

        if ($conn->query($sql_stock) === TRUE) {
        }
  else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
}


  
 $sql = "INSERT INTO grn ( jaysan_po_material_id,qty,received_by,dc_no,dc_date) VALUES ('$jaysan_po_material_id','$qty',$received_by,$dc_no,$dc_date)";

  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
echo "ok";

$conn->close();

 ?>


