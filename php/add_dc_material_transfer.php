
<?php
 include 'db_head.php';

 $source_godown = test_input($_GET['source_godown']);
 $des_godown = test_input($_GET['des_godown']);
 $current_transport = test_input($_GET['current_transport']);

$dc_parts_location = json_decode($_POST['dc_parts_location'], true);
 
  
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";

return $data;
}


// get transport_dc_id if already exsists

try {
    $conn->begin_transaction();
 $transport_dc_id = 0;
$sql_get_transport = "SELECT transport_dc_id FROM `transport_dc` WHERE source_godown = $source_godown and des_godown = $des_godown  and (sts = 'create' or sts = 'transport') and current_transport = $current_transport";
 $result_transport= $conn->query($sql_get_transport);
            if ($result_transport->num_rows > 0) {
                $row_transport= $result_transport->fetch_assoc();
                $transport_dc_id = $row_transport['transport_dc_id'];

            }

            if($transport_dc_id == 0)
              {
                
                     $sql_in_dc = "INSERT INTO transport_dc (source_godown,des_godown,transport_godown) VALUES ($source_godown, $des_godown, $current_transport)";
                    // get in_dc_tracking id
                    if ($conn->query($sql_in_dc) === TRUE) {
                        $transport_dc_id = $conn->insert_id;
                    } else {
                        throw new Exception("Error inserting in_dc_tracking: " . $conn->error);
                    }
              }

            //   get delivery challan details
            $sql_get_addr = "SELECT (SELECT concat(creditor_name ,' ',
    creditor_phone,' ',
    creditors_addr,' ',
    creditor_gst)
FROM creditors WHERE creditor_id = $des_godown) as ship_to,
(SELECT company_address
 FROM company) as company";

  $result_get_addr = $conn->query($sql_get_addr);
        if ($result_get_addr->num_rows > 0) {
            // stock exists in transport godown, update quantity
            $row_get_addr = $result_get_addr->fetch_assoc();
            $ship_to = $row_get_addr['ship_to'];
            $company = $row_get_addr['company'];

        } 




 $sql = "INSERT INTO delivery_challan ( dc_date, dc_type, dc_from, dc_to, bill_to, ship_to) VALUES (current_timestamp(),'dc',$company,$ship_to,$ship_to)";
    if ($conn->query($sql) === TRUE) {
        $dc_id = $conn->insert_id;
// insert dc parts
        foreach ($dc_parts as $part) {
            $part_id = test_input($part['part_id']);
              $part_pre_process_id  = test_input($part['part_pre_process_id']);
                $rate = test_input($part['rate']);
            $qty = test_input($part['qty']);
            $sql_part = "INSERT INTO dc_parts (dc_id, part_id, part_pre_process_id, rate, qty) VALUES ($dc_id, $part_id, $part_pre_process_id, $rate, $qty)";
            if (!$conn->query($sql_part)) {
                throw new Exception("Error inserting part: " . $conn->error);
            }
        }




        // reserve stock for dc parts
        foreach ($dc_parts_location as $location) {
            $reserve_type = "dc";
            $reserve_type_id = $dc_id;
            $emp_id = $emp_id;
            $remark = "Reserved for DC #".$dc_id;
            $stock_id = $location['stock_id'];
            $reserve_qty = $location['qty'];
              $sql_reserve = "INSERT INTO stock_reserve (reserve_type, reserve_type_id, emp_id, remark, stock_id, reserve_qty) VALUES ('$reserve_type', $reserve_type_id, $emp_id, '$remark', $stock_id, $reserve_qty)";
            //   get reserve id
            if ($conn->query($sql_reserve) === TRUE) {
                $reserve_id = $conn->insert_id;
            } else {
                throw new Exception("Error reserving stock: " . $conn->error);
            }
          
            


            // if stock taken from other then source godown need to insert in_dc_tracking
            // check godown of stock id
            $sql_godown = "SELECT * FROM jaysan_stock WHERE stock_id = $stock_id";
            $result_godown = $conn->query($sql_godown);
            if ($result_godown->num_rows > 0) {
                $row_godown = $result_godown->fetch_assoc();
                $godown_id = $row_godown['godown'];
                $stock_process_id = $row_godown['process_id'];
                $stock_part_id = $row_godown['part_id'];
         
          
                    // insert in_dc_tracking
                    $sql_in_dc = "INSERT INTO transport_dc (source_godown,des_godown,transport_godown,dc_id) VALUES ($godown_id, $dc_to, $transport_godown, $dc_id)";
                    // get in_dc_tracking id
                    if ($conn->query($sql_in_dc) === TRUE) {
                        $transport_dc_id = $conn->insert_id;
                    } else {
                        throw new Exception("Error inserting in_dc_tracking: " . $conn->error);
                    }

                    // add parts to in_dc_parts 
                    $sql_in_dc_parts = "INSERT INTO  transport_parts (transport_dc_id,part_id,process_id, qty,reserve_id) VALUES ($transport_dc_id, $stock_part_id, $stock_process_id, $reserve_qty, $reserve_id)";
                    if (!$conn->query($sql_in_dc_parts)) {
                        throw new Exception("Error inserting in_dc_parts: " . $conn->error);
                    }
             





            }
            
   
        }


           require_once 'print_dc.php';
            $result = print_dc($dc_id, $conn);

         

//  print array
        print_r($result);
        
        $conn->commit();

// print dc

    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
        
        $conn->commit();
 
}
 catch (Exception $e) {
    echo "Transaction failed: " . $e->getMessage();
    $conn->rollback();
}

$conn->close();


 ?>



2

