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


$dc_id = 0;

// check dc parts is array or not
if (!is_array($dc_parts)) {
    echo "dc_parts should be an array";
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






           require_once 'print_dc.php';
            $result = print_dc($dc_id, $conn);


$rows = [];
$rows[] = $result;

header('Content-Type: application/json');
echo json_encode($rows);


        
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