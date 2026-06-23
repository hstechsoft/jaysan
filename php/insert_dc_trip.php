<?php
error_reporting(E_ALL);
 include 'db_head.php';



$destination = test_input($_POST['destination']);
$source_godown = test_input($_POST['source_godown']);

$emp_id = test_input($_POST['emp_id']);



$dc_parts_location = json_decode($_POST['dc_parts_location'], true);

$transport_dc_id = test_input($_POST['transport_dc_id'])??0;
$transport_dc_id = str_replace("'", "", $transport_dc_id);


// check dc part on dc_to location and exit if any part is already in dc_to location
foreach ($dc_parts_location as $location) {
      $stock_id = $location['stock_id'];
// get godown id from stock id
      $sql_godown = "SELECT godown FROM jaysan_stock WHERE stock_id = $stock_id";
      $result_godown = $conn->query($sql_godown);
      if ($result_godown->num_rows > 0) {
          $row_godown = $result_godown->fetch_assoc();
          $godown_id = $row_godown['godown'];
          if ($godown_id == $destination) {
              echo "source and destination godown cannot be same for stock id $stock_id";
              exit;
          }
      }

}
// check dc parts is array or not

// check dc parts location is array or not
if (!is_array($dc_parts_location)) {
    echo "dc_parts_location should be an array";
    exit;
}

// check dc process is array or not









$dc_id = 0; 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
try {
    $conn->begin_transaction();

 

    {
    
       // insert in_dc_tracking
       if($transport_dc_id == "0"){
                    $sql_in_dc = "INSERT INTO transport_dc (source_godown,des_godown) VALUES ($source_godown, $destination)";
                    // get in_dc_tracking id
                    if ($conn->query($sql_in_dc) === TRUE) {
                        $transport_dc_id = $conn->insert_id;
                    } else {
                        throw new Exception("Error inserting in_dc_tracking: " . $conn->error);
                    }

       }
        // reserve stock for dc parts
        foreach ($dc_parts_location as $location) {
            $reserve_type = "dc";
         
            $emp_id = $emp_id;
            $remark = "Reserved for DC #".$dc_id;
            $stock_id = $location['stock_id'];
            $reserve_qty = $location['qty'];
              $sql_reserve = "INSERT INTO stock_reserve (reserve_type, emp_id, remark, stock_id, reserve_qty) VALUES ('$reserve_type' , $emp_id, '$remark', $stock_id, $reserve_qty)";
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
                // if ($godown_id != $dc_from) {
                //     // insert in_dc_tracking
                //     $sql_in_dc = "INSERT INTO in_dc_tracking (out_dc_id, godown, dated) VALUES ($dc_id, $godown_id, NOW())";
                //     // get in_dc_tracking id
                //     if ($conn->query($sql_in_dc) === TRUE) {
                //         $in_dc_id = $conn->insert_id;
                //     } else {
                //         throw new Exception("Error inserting in_dc_tracking: " . $conn->error);
                //     }

                //     // add parts to in_dc_parts 
                //     $sql_in_dc_parts = "INSERT INTO in_dc_parts (tracking_id, part_id,process_id, qty) VALUES ($in_dc_id, $stock_part_id, $stock_process_id, $reserve_qty)";
                //     if (!$conn->query($sql_in_dc_parts)) {
                //         throw new Exception("Error inserting in_dc_parts: " . $conn->error);
                //     }
                // }
// check if stock is taken from source godown or not
// convert $godown_id and $source_godown to integer
                $godown_id = (int)$godown_id;
                // remove '$source_godown'
                $source_godown = (int)str_replace("'", "", $source_godown);

                $source_godown = (int)$source_godown;
                if ($godown_id != $source_godown) {
                    throw new Exception("Stock id $stock_id is not from source godown $source_godown and godown id is $godown_id");
                }

          
             

                    // add parts to in_dc_parts 
                    $sql_in_dc_parts = "INSERT INTO  transport_parts (transport_dc_id,part_id,process_id, qty,reserve_id) VALUES ($transport_dc_id, $stock_part_id, $stock_process_id, $reserve_qty, $reserve_id)";
                    if (!$conn->query($sql_in_dc_parts)) {
                        throw new Exception("Error inserting in_dc_parts: " . $conn->error);
                    }
             





            }
            
   
        }




echo "ok";


        
        $conn->commit();

// print dc

     
    }
} catch (Exception $e) {
    echo "Transaction failed: " . $e->getMessage();
    $conn->rollback();
}

$conn->close();

 ?>