<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
 include 'db_head.php';

$dc_no = test_input($_POST['dc_no']);
$dc_date = test_input($_POST['dc_date']);
$transport_mode = test_input($_POST['transport_mode']);
$transport_des = test_input($_POST['transport_des']);
$vehicle_no = test_input($_POST['vehicle_no']);
$driver_name = test_input($_POST['driver_name']);
$driver_contact = test_input($_POST['driver_contact']);

$emp_id = test_input($_POST['emp_id']);
$dc_type = test_input($_POST['dc_type']);
$dc_from = test_input($_POST['dc_from']);
$dc_to = test_input($_POST['dc_to']);


$dc_parts = json_decode($_POST['dc_parts'], true);
$dc_parts_location = json_decode($_POST['dc_parts_location'], true);
$dc_process = json_decode($_POST['dc_process'], true);
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









 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
try {
    $conn->begin_transaction();

    $sql = "INSERT INTO delivery_challan (dc_no, dc_date, transport_mode, transport_des, vehicle_no, driver_name, driver_contact, emp_id, dc_type, dc_from, dc_to) VALUES ($dc_no, $dc_date, $transport_mode, $transport_des, $vehicle_no, $driver_name, $driver_contact, $emp_id, $dc_type, $dc_from, $dc_to)";
    if ($conn->query($sql) === TRUE) {
        $dc_id = $conn->insert_id;
// insert dc parts
        foreach ($dc_parts as $part) {
            $part_id = test_input($part['part_id']);
              $part_pre_process_id  = test_input($part['part_pre_process_id ']);
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
            $remark = "Reserved for DC #$dc_id";
            $stock_id = $location['stock_id'];
            $reserve_qty = $location['qty'];
              $sql_reserve = "INSERT INTO stock_reserve (reserve_type, reserve_type_id, emp_id, remark, stock_id, reserve_qty) VALUES ($reserve_type, $reserve_type_id, $emp_id, $remark, $stock_id, $reserve_qty)";
              
            if (!$conn->query($sql_reserve)) {
                throw new Exception("Error reserving stock: " . $conn->error);

            } 
            
   
           
        }


        echo "ok";
        $conn->commit();
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (Exception $e) {
    echo "Transaction failed: " . $e->getMessage();
    $conn->rollback();
}

$conn->close();

 ?>


