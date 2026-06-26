<?php
error_reporting(E_ALL);
 include 'db_head.php';

 $godown = test_input($_POST['godown']);
$dc_date = test_input($_POST['dc_date']);
$transport_mode = test_input($_POST['transport_mode']);
$transport_des = test_input($_POST['transport_des']);
$vehicle_no = test_input($_POST['vehicle_no']);
$emp_id = test_input($_POST['emp_id']);
$attach_id  = test_input($_POST['attach_id']);







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

 $in_dc_id = 0;

    $sql = "INSERT INTO in_dc ( godown,dc_date,transport_mode,transport_des,vehicle_no,emp_id,invoice_sts) VALUES ($godown,$dc_date,$transport_mode,$transport_des,$vehicle_no,$emp_id,'pending')";
    if ($conn->query($sql) === TRUE) {
        $in_dc_id = $conn->insert_id;
// insert dc parts
$all_transport_ids = array_column($dc_parts, 'transport_id');
$transport_ids_str = implode(',', $all_transport_ids);


        foreach ($dc_parts as $part) {
            $part_id = test_input($part['part_id']);
              $transport_id = test_input($part['transport_id']);
              $part_pre_process_id  = test_input($part['part_pre_process_id']);
                $rate = test_input($part['rate']);
            $qty = test_input($part['qty']);
            $sql_part = "INSERT INTO in_dc_parts (in_dc_id, part_id, part_pre_process_id, rate, qty) VALUES ($in_dc_id, $part_id, $part_pre_process_id, $rate, $qty)";
            if (!$conn->query($sql_part)) {
                throw new Exception("Error inserting part: " . $conn->error.$sql_part);
            }



        }

        // update transport parts set dc_check = 1
            $sql_update_transport_parts = "UPDATE transport_parts SET dc_check = 1 WHERE transport_id IN ($transport_ids_str)";
           
            if (!$conn->query($sql_update_transport_parts)) {
                throw new Exception("Error updating transport parts: " . $conn->error.$sql_update_transport_parts);
            }

            // update dc_id in transport_dc
            $sql_update_transport_dc_id = "UPDATE transport_dc SET dc_id = $in_dc_id WHERE transport_dc_id IN (SELECT transport_dc_id FROM transport_parts WHERE transport_id IN ($transport_ids_str) GROUP BY transport_dc_id)";
            if (!$conn->query($sql_update_transport_dc_id)) {
                throw new Exception("Error updating transport dc id: " . $conn->error.$sql_update_transport_dc_id);
            }

 

// update dc_attachment 
$sql_update_attachment = "UPDATE dc_attachment SET dc_id = $in_dc_id,status = 'updated' WHERE attach_id = $attach_id";
if (!$conn->query($sql_update_attachment)) {
    throw new Exception("Error updating dc attachment: " . $conn->error.$sql_update_attachment);
}

         

echo "ok";
        $conn->commit();

// print dc

    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error."<br>".$sql);
    }
} catch (Exception $e) {
    echo "Transaction failed: " . $e->getMessage();
    $conn->rollback();
}

$conn->close();

 ?>