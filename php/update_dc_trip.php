<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

error_reporting(0);
ini_set('display_errors', 0);

 include 'db_head.php';

$transport_part_id = test_input($_POST['transport_part_id']);
$qty = test_input($_POST['qty']);


$result_json = array();


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



// $dc_parts_location = json_decode($_POST['dc_parts_location'], true);

$transport_dc_id = test_input($_POST['transport_dc_id'])??0;
$transport_dc_id = str_replace("'", "", $transport_dc_id);









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

 $result_json['success'] = true;

if($dc_id) { 

           require_once 'print_dc.php';
             $result = print_dc($dc_id, $conn);
              $rows = [];
 $result_json['data'] = $result;

//    header('Content-Type: application/json');
 echo json_encode($result_json);
        }
        else{
            // no need of out dc
            $result_json['data'] = null;
            //  header('Content-Type: application/json');
            echo json_encode($result_json);
        }






        
        $conn->commit();

// print dc

     
    }
} catch (Exception $e) {
    $result_json['success'] = false;
    $result_json['error'] = $e->getMessage();
    echo json_encode($result_json);
    $conn->rollback();
}

$conn->close();

 ?>