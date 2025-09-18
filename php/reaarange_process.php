<?php
include 'db_head.php';

$updated_process_array = $_POST['updated_process_array']; // This should be an array of data for process_tbl
$process_id_array = $_POST['process_id_array']; // This should be an array of data for input_parts

if (count($updated_process_array) == count($process_id_array)) {
    // Iterate through both arrays
    for ($i = 0; $i < count($updated_process_array); $i++) {
        $updated_process = $updated_process_array[$i];
        $process_id = $process_id_array[$i];

        // Process each pair of items
        echo "Process: " . $updated_process . " | id: " . $process_id . "<br>";

        // You can now use $processItem and $inputPartItem for further processing,
        // such as inserting into a database, performing calculations, etc.
    }
} else {
    echo "Error: The two arrays are not of the same length.";
}

// $sql = "UPDATE attendance SET attendance.logout_time = UNIX_TIMESTAMP( NOW())*1000 WHERE id = (SELECT id FROM attendance WHERE attendance.phone_id = $phone_id AND dated BETWEEN UNIX_TIMESTAMP(CURDATE())*1000 AND UNIX_TIMESTAMP( NOW())*1000 AND attendance.login_time>0 and attendance.logout_time=0 ORDER BY attendance.id DESC LIMIT 1)";
  
//   if ($conn->query($sql) === TRUE) {
    
   

// echo "ok";

//   } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
//   }
  
 
 





$conn->close();
?>
