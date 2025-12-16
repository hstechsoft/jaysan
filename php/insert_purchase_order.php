<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
error_reporting(E_ALL);
ini_set('display_errors', 1);

 include 'db_head.php';

 $po_order_to = ($_POST['po_order_to']);
$po_delivery_to = isset($_POST['po_delivery_to']) ? $_POST['po_delivery_to'] : '359';
$po_terms = isset($_POST['po_terms']) ? $_POST['po_terms'] : '';
$po_email = isset($_POST['po_email']) ? $_POST['po_email'] : '';
$po_path = isset($_POST['po_path']) ? $_POST['po_path'] : '';
$po_no = isset($_POST['po_no']) ? $_POST['po_no'] : '0';
$is_ext_po = isset($_POST['is_ext_po']) ? $_POST['is_ext_po'] : '0';
if($is_ext_po == '1'){
$received_by = ($_POST['received_by']);
$dc_no = ($_POST['dc_no']);
$dc_date = ($_POST['dc_date']);

}

$po_materials = ($_POST['po_materials']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO jaysan_po (po_order_to,po_delivery_to,po_terms,email_sent,po_path,po_no,is_ext_po) VALUES ('$po_order_to','$po_delivery_to','$po_terms','$po_email','$po_path','$po_no','$is_ext_po')";

if ($conn->multi_query($sql)) {
    // Process the first result set (e.g., time zone set)
    do {
        // Empty the result set
        if ($result = $conn->store_result()) {
            // Process results here if needed
            $result->free();
        }
    } while ($conn->next_result());

    // Now insert the payment data
    $po_id = $conn->insert_id;  // Get the ID of the inserted sales order


    foreach ($po_materials as $po_materials)
    {
      $material_rate = $po_materials['material_rate'];
      $po_material_id = $po_materials['po_material_id'];
      $qty = $po_materials['qty']; 
      $batch_id = $po_materials['batch_id'];
      $is_approved = $po_materials['is_approved']; 
      $disc = $po_materials['disc'];
       $due_on = $po_materials['due_on'];
 
      $batch_id = sql_nullable( $batch_id );
 


      $sql_insert_pomaterial = "INSERT INTO jaysan_po_material ( material_rate,jaysan_po_id,po_material_id,qty,batch_id,is_approved,disc,due_on) VALUES ('$material_rate','$po_id','$po_material_id','$qty',$batch_id,'$is_approved','$disc','$due_on');";

      if ($conn->query($sql_insert_pomaterial) === TRUE) {
          $last_insert_id = $conn->insert_id;
              if($is_ext_po == '1'){
        

          $sql_grn = "INSERT INTO grn ( jaysan_po_material_id,qty,received_by,dc_no,dc_date) VALUES ('$last_insert_id','$qty',$received_by,$dc_no,'$dc_date')";

          if ($conn->query($sql_grn) === TRUE) {


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

       $check_sql = "SELECT qty FROM jaysan_stock WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id = $po_material_id)";

$result = $conn->query($check_sql);

if ($result->num_rows > 0) {
  // Record exists, update it
  $qty = $qty + $result->fetch_assoc()['qty'];
  $remark = "new inward stock updated dc". $dc_no1;
  $sql_stock = "UPDATE jaysan_stock   SET  qty= $qty,remark= '$remark' ,dated = NOW()
      WHERE (godown <=> $godown )AND (dep <=> $dep )AND (sec <=> $sec )AND (part_id =   $po_material_id)";

       if ($conn->query($sql_stock) === TRUE) {
   
  } else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
    
} else {
  // Record doesn't exist, insert it
  $remark = "new inward stock inserted dc" . $dc_no1;
  $sql_stock = "INSERT INTO jaysan_stock (godown,dep,sec,part_id,qty,remark) 
      VALUES ($godown,$dep,$sec, $po_material_id,$qty,'$remark')";

        if ($conn->query($sql_stock) === TRUE) {
        }
  else {
    echo "Error: " . $sql_stock . "<br>" . $conn->error;
  }
}


          } else {
              echo "Error: " . $sql_grn . "<br>" . $conn->error;
          }
      }
      } else {
          echo "Error: " . $sql_insert_pomaterial . "<br>" . $conn->error;
      }

  
    }




  echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

 ?>


