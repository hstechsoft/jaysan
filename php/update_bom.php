<?php
include 'db_head.php';


$inputPartsData = $_POST['inputPartsData']; // This should be an array of data for input_parts

$bom_id = $_POST['bom_id']; 



  foreach ($inputPartsData as $input)
    { 
       
        $input_part = $input['part_id']; 
        $input_qty = $input['part_qty']; 
        $sql_input = "INSERT INTO bom_input (bom_id, part_id, qty) 
        VALUES ('$bom_id', '$input_part', '$input_qty') 
        ON DUPLICATE KEY UPDATE qty = '$input_qty'";
           if ($conn->query($sql_input) === TRUE) {
           } 
           else {
             echo "Error: " . $sql_input . "<br>" . $conn->error;
           }
    }

    echo "ok";


$conn->close();
?>
