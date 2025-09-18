<?php
include 'db_head.php';

$updated_process_array = $_POST['updated_process_array']; // This should be an array of data for process_tbl
$process_id_array = $_POST['process_id_array']; // This should be an array of data for input_parts

if (count($updated_process_array) == count($process_id_array)) {
    // Iterate through both arrays
    for ($i = 0; $i < count($updated_process_array); $i++) {
        $updated_process = $updated_process_array[$i];
        $process_id = $process_id_array[$i];

        $sql = "UPDATE process_tbl SET process = '$updated_process' WHERE process_tbl.process_id = '$process_id';";
  
          if ($conn->query($sql) === TRUE) {
            
           
        
   
        
          } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
          }
          
         
    }
    echo "ok";
} else {
    echo "Error: The two arrays are not of the same length.";
}

//
 





$conn->close();
?>
