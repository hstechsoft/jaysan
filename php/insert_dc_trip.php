<?php
error_reporting(E_ALL);
 include 'db_head.php';
$dc = "out_dc";
$dc_check = 1;
$current_godown = test_input($_POST['current_godown']);

$destination = test_input($_POST['destination']);
$source_godown = test_input($_POST['source_godown']);
if($source_godown == $destination)
{
    echo "source and destination godown cannot be same";
    exit;
}

$result_json = array();

if ($current_godown == $destination) {
  $dc = "out_dc";
  $dc_check = 1;
}
else
    {
        $dc = "in_dc";
        $dc_check = 0;
    }

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



$dc_parts_location = json_decode($_POST['dc_parts_location'], true);

$transport_dc_id = test_input($_POST['transport_dc_id'])??0;
$transport_dc_id = str_replace("'", "", $transport_dc_id);


$dc_parts = json_decode($_POST['dc_parts'], true);



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

  if($current_godown != $destination)
{
    $sql = "INSERT INTO delivery_challan (dc_no, dc_date, transport_mode, transport_des, vehicle_no, driver_name, driver_contact, emp_id, dc_type, dc_from, dc_to, bill_to, ship_to,mode_of_payment,supplier_ref_order_no,dispatch_doc_no,dispatched_through,date_time_of_issue,duration_of_process,nature_of_processing,challan_no) VALUES ($dc_no, $dc_date, $transport_mode, $transport_des, $vehicle_no, $driver_name, $driver_contact, $emp_id, $dc_type, $dc_from, $dc_to, $bill_to, $ship_to,$mode_of_payment,$supplier_ref_order_no,$dispatch_doc_no,$dispatched_through,$date_time_of_issue,$duration_of_process,$nature_of_processing,$challan_no)";
    if ($conn->query($sql) === TRUE) {
        $dc_id = $conn->insert_id;
// insert dc parts
$all_transport_ids = array_column($dc_parts, 'transport_id');
$transport_ids_str = implode(',', $all_transport_ids);


        foreach ($dc_parts as $part) {
            
            $part_id = sql_nullable($part['part_id']);
            
           $part_pre_process_id  = sql_nullable($part['part_pre_process_id']);
            if($part_id >0)
                {

           $part_pre_process_id  = "NULL";
                }

            $rate = test_input($part['rate']);
            $qty = test_input($part['qty']);
            $godown = sql_nullable($part['godown_id']);
            $dep = sql_nullable($part['department_id']);
            $sec = sql_nullable($part['section_id']);
            $work_process_id = isset($part['work_process_id']) ? sql_nullable($part['work_process_id']) : "2941";
            $sql_part = "INSERT INTO dc_parts (dc_id, part_id, part_pre_process_id, rate, qty) VALUES ($dc_id, $part_id, $part_pre_process_id, $rate, $qty)";
            echo $sql_part;
            if (!$conn->query($sql_part)) {
                throw new Exception("Error inserting part: " . $conn->error.$sql_part);
            }


		
$sql_input_demand = "insert into input_demand (work_process_id,godown,dep,sec,part_id,process_id,cat,qty) values ($work_process_id,$godown,$dep,$sec,$part_id,$part_pre_process_id,'dc',$qty) on duplicate key update qty = qty + $qty";
if ($conn->query($sql_input_demand) === TRUE) {
  $result_json['messages']['result4'][] = "input demand updated successfully";
} else {
  throw new Exception("Error updating input demand: " . $conn->error);
}



        }

    }
}

    {
    
       // insert in_dc_tracking
    {
                    $sql_in_dc = "INSERT INTO transport_dc (source_godown,des_godown,dc_id) VALUES ($source_godown, $destination,$dc_id)";
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
            $stock_reserve_id = $location['stock_reserve_id'];
            $reserve_qty = $location['qty'];

// get stock reserve details from stock_reserve table for stock_id and reserve_type = 'job_work_order' and stock_reserve_id = $stock_reserve_id
 $reserved_qty = 0;
$sql_get_stock_reserve = "SELECT reserve_qty FROM stock_view WHERE stock_id = $stock_id AND reserve_type = 'job_work_order' AND stock_reserve_id = $stock_reserve_id";
$result_stock_reserve = $conn->query($sql_get_stock_reserve);
if ($result_stock_reserve->num_rows > 0) {
    $row_stock_reserve = $result_stock_reserve->fetch_assoc();
    $reserved_qty = $row_stock_reserve['reserve_qty'];

} else {
    $reserved_qty = 0;
}
if ($reserved_qty < $reserve_qty) {
    throw new Exception("Not enough reserved stock available for Stock ID: $stock_id. Required: $reserve_qty, Reserved: $reserved_qty");
}

// update stock_reserve table for stock_id and reserve_type = 'job_work_order' and stock_reserve_id = $stock_reserve_id and decrease reserve_qty by $reserve_qty
$sql_update_stock_reserve = "UPDATE stock_reserve SET reserve_qty = reserve_qty - $reserve_qty WHERE stock_id = $stock_id AND reserve_type = 'job_work_order' AND stock_reserve_id = $stock_reserve_id";
if ($conn->query($sql_update_stock_reserve) === TRUE) {
}
    else {
        throw new Exception("Error updating stock reserve: " . $conn->error);
    }

    // if reserve_qty = 0 then delete the record from stock_reserve table
    $sql_delete_stock_reserve = "DELETE FROM stock_reserve WHERE reserve_qty <= 0";
    if ($conn->query($sql_delete_stock_reserve) === TRUE) {
    }
    else
        {
            throw new Exception("Error deleting stock reserve: " . $conn->error);
        }


              $sql_reserve = "INSERT INTO stock_reserve (reserve_type, emp_id, remark, stock_id, reserve_qty) VALUES ('$reserve_type' , $emp_id, '$remark', $stock_id, $reserve_qty) on duplicate key update reserve_qty = reserve_qty + $reserve_qty";
            //   get reserve id
            if ($conn->query($sql_reserve) === TRUE) {
                $reserve_id = $conn->insert_id;
            } else {
                throw new Exception("Error reserving stock: " . $conn->error);
            }
          
            


           
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

          
             $stock_part_id = sql_nullable($stock_part_id);
             $stock_process_id = sql_nullable($stock_process_id);

                    // add parts to in_dc_parts 
                    $sql_in_dc_parts = "INSERT INTO  transport_parts (transport_dc_id,part_id,process_id, qty,reserve_id,dc_check) VALUES ($transport_dc_id, $stock_part_id, $stock_process_id, $reserve_qty, $reserve_id, $dc_check)";
                    if (!$conn->query($sql_in_dc_parts)) {
                        throw new Exception("Error inserting in_dc_parts: " . $conn->error);
                    }
             





            }
            
   
        }

$result_json['success'] = true;



           require_once 'print_dc.php';
            $result = print_dc($dc_id, $conn);


$rows = [];
$result_json['data'] = $result;

header('Content-Type: application/json');
echo json_encode($result_json);



        
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