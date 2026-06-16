<?php
error_reporting(E_ALL);
 include 'db_head.php';

$dc_no = test_input($_POST['dc_no']);
$dc_date = test_input($_POST['dc_date']);
$transport_mode = test_input($_POST['transport_mode']);
$transport_des = test_input($_POST['transport_des']);
$vehicle_no = test_input($_POST['vehicle_no']);
$driver_name = test_input($_POST['driver_name']);
$driver_contact = test_input($_POST['driver_contact']);
$mode_of_payment = test_input($_POST['mode_of_payment']);
$supplier_ref_order_no = test_input($_POST['supplier_ref_order_no']);
$dispatch_doc_no = test_input($_POST['dispatch_doc_no']);
$dispatched_through = test_input($_POST['dispatched_through']);
$date_time_of_issue = test_input($_POST['date_time_of_issue']);
$duration_of_process = test_input($_POST['duration_of_process']);
$nature_of_processing = test_input($_POST['nature_of_processing']);
$challan_no = test_input($_POST['challan_no']);
$emp_id = test_input($_POST['emp_id']);
$dc_type = test_input($_POST['dc_type']);
$dc_from = test_input($_POST['dc_from']);
$dc_to = test_input($_POST['dc_to']);
$bill_to = test_input($_POST['bill_to']);
$ship_to = test_input($_POST['ship_to']);
$transport_godown = test_input($_POST['transport_godown']);


$dc_parts = json_decode($_POST['dc_parts'], true);
$dc_parts_location = json_decode($_POST['dc_parts_location'], true);
$dc_process = json_decode($_POST['dc_process'], true);

$dc_id = 0;
// check dc part on dc_to location and exit if any part is already in dc_to location
foreach ($dc_parts_location as $location) {
      $stock_id = $location['stock_id'];
// get godown id from stock id
      $sql_godown = "SELECT godown FROM jaysan_stock WHERE stock_id = $stock_id";
      $result_godown = $conn->query($sql_godown);
      if ($result_godown->num_rows > 0) {
          $row_godown = $result_godown->fetch_assoc();
          $godown_id = $row_godown['godown'];
          if ($godown_id == $dc_to) {
              echo "source and destination godown cannot be same for stock id $stock_id";
              exit;
          }
      }

}
// check dc parts is array or not
if (!is_array($dc_parts)) {
    echo "dc_parts should be an array";
    exit;
}
// check dc parts location is array or not
if (!is_array($dc_parts_location)) {
    echo "dc_parts_location should be an array";
    exit;
}

// check dc process is array or not
if (!is_array($dc_process)) {
    echo "dc_process should be an array";
    exit;
}








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

 

    $sql = "INSERT INTO delivery_challan (dc_no, dc_date, transport_mode, transport_des, vehicle_no, driver_name, driver_contact, emp_id, dc_type, dc_from, dc_to, bill_to, ship_to,mode_of_payment,supplier_ref_order_no,dispatch_doc_no,dispatched_through,date_time_of_issue,duration_of_process,nature_of_processing,challan_no) VALUES ($dc_no, $dc_date, $transport_mode, $transport_des, $vehicle_no, $driver_name, $driver_contact, $emp_id, $dc_type, $dc_from, $dc_to, $bill_to, $ship_to,$mode_of_payment,$supplier_ref_order_no,$dispatch_doc_no,$dispatched_through,$date_time_of_issue,$duration_of_process,$nature_of_processing,$challan_no)";
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

// insert dc process
        foreach ($dc_process as $process) {
            $process_id = test_input($process['process_id']);
            $qty = test_input($process['qty']);
            $rate = test_input($process['rate']);
            
            $sql_process = "INSERT INTO dc_process (dc_id, process_id, qty, rate) VALUES ($dc_id, $process_id, $qty, $rate)";
            if (!$conn->query($sql_process)) {
                throw new Exception("Error inserting process: " . $conn->error);
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
$result = print_dc($dc_id, $conn);

var_dump($result);

$json = json_encode($result);

if ($json === false) {
    die('JSON Error: ' . json_last_error_msg());
}

echo $json;


        
        $conn->commit();

// print dc

    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (Exception $e) {
    echo "Transaction failed: " . $e->getMessage();
    $conn->rollback();
}

$conn->close();

 ?>