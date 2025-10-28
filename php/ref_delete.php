<?php
 include 'db_head.php';
$data = json_decode($_POST['allWeldingData'], true);

foreach ($data as $row) {
 $process_id = $row['process']['process_id'];



 echo "process data added \n";

  if (count($row['input_parts']) > 0 ) 
  {
    foreach ($row['input_parts'] as $input) {
            $godown_id = isset($input['godown_id']) ? $input['godown_id'] : '';
            $dep_id = isset($input['dep_id']) ? $input['dep_id'] : '';
            $dep_sec_id = isset($input['dep_sec_id']) ? $input['dep_sec_id'] : '';
            $dep_sec_machine_id = isset($input['dep_sec_machine_id']) ? $input['dep_sec_machine_id'] : '';
            $min_time = isset($input['min_time']) ? $input['min_time'] : '';
            $max_time = isset($input['max_time']) ? $input['max_time'] : '';
          
            $cost = isset($input['cost']) ? $input['cost'] : '';

            $dep_id = sql_nullable($dep_id);
            $dep_sec_id = sql_nullable($dep_sec_id);
            $dep_sec_machine_id = sql_nullable($dep_sec_machine_id);

            $insert_part = "INSERT INTO `process_extra_details` ( `godown_id`, `dep_id`, `dep_sec_id`, `dep_sec_machine_id`, `min_time`, `max_time`, `process_id`, `cost`) VALUES ( '$godown_id', $dep_id,  $dep_sec_id ,  $dep_sec_machine_id, '$min_time', '$max_time', '$process_id', ' $cost');";

if ($conn->query($insert_part) === TRUE) {
    // Retrieve the last inserted ID
   
} else {
    echo "Error: " . $insert_part . "<br>" . $conn->error;
}
           
    }
  }
}


// //  demo text 12345
// $material_query = isset($_GET['material_query']) ? $_GET['material_query'] : '';
//   $material_query = ($material_query == '') ? "1" :  " jmat.po_material_id = '$material_query'";

//    $from_date = isset($_GET['from_date']) ? $_GET['from_date'] : '';
//     $to_date = isset($_GET['to_date']) ? $_GET['to_date'] : '';
    
//   $date_query = ($from_date == '' || $to_date  == '') ? "1" :  " jaysan_po.po_date between   '$from_date' and '$to_date' ";


//   $order_to_query = isset($_GET['order_to_query']) ? $_GET['order_to_query'] : '';
//   $order_to_query = ($order_to_query == '') ? "1" :  "jp.po_order_to = '$order_to_query'";
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// foreach ($data as $row) {
// //  $godown_id = isset($input['godown_id']) ? $input['godown_id'] : '';
// //  $dep_id = isset($input['dep_id']) ? $input['dep_id'] : '';
// //   $dep_sec_id = isset($input['dep_sec_id']) ? $input['dep_sec_id'] : '';
// //    $dep_sec_machine_id = isset($input['dep_sec_machine_id']) ? $input['dep_sec_machine_id'] : '';
// //      $min_time = isset($input['min_time']) ? $input['min_time'] : '';
// //        $max_time = isset($input['max_time']) ? $input['max_time'] : '';
// //          $process_id = isset($input['process_id']) ? $input['process_id'] : '';
// //            $cost = isset($input['cost']) ? $input['cost'] : '';
           
// echo  $row[1]['godown_id'];

 
//  }

// foreach ($data as $row) {
// $insert_part = "INSERT INTO `process_extra_details` ( `godown_id`, `dep_id`, `dep_sec_id`, `dep_sec_machine_id`, `min_time`, `max_time`, `process_id`, `cost`) VALUES ('1', NULL, NULL, NULL, '0', '0', '515', '500');";

// if ($conn->query($insert_part) === TRUE) {
//     // Retrieve the last inserted ID
   
// } else {
//     echo "Error: " . $insert_part . "<br>" . $conn->error;
// }
// }

$conn->close();


 ?>
