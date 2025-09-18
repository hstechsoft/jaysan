<?php
include 'db_head.php';

$processData = $_POST['processData']; // This should be an array of data for process_tbl
$inputPartsData = $_POST['inputPartsData']; // This should be an array of data for input_parts
foreach ($processData as $process) {
    $process_id = $process['process_id']; 
    $output_part = $process['output_part']; 
}
$conn->close();
?>
