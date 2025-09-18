<?php
include 'db_head.php';


$inputPartsData = $_POST['inputPartsData']; // This should be an array of data for input_parts
$output_part_no = $_POST['output_part_no'];
$output_part_name = $_POST['output_part_name'];
 $bom_list = $_POST['bom_list'];

$sql_check = "SELECT part_id FROM parts_tbl WHERE part_name = '$output_part_name'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
    $row = $result_check->fetch_assoc();
    $output_part = $row['part_id'];
} else {
    $sql_part = "INSERT INTO parts_tbl (part_name, part_no,sub_ass) VALUES ('$output_part_name', '$output_part_no',1)";
    if ($conn->query($sql_part) === TRUE) {
        $output_part = $conn->insert_id;
    } else {
        echo "Error: " . $conn->error;
        exit;
    }
}

$sql_process = "INSERT INTO bom_output (part_id, component_cat) VALUES ($output_part, '$bom_list')";
if ($conn->query($sql_process) === TRUE) {
    $last_insert_id = $conn->insert_id;

    foreach ($inputPartsData as $input) {
        $input_part = $input['part_id'];
        $input_qty = $input['part_qty'];

        $sql_input = "INSERT INTO bom_input (bom_id, part_id, qty) VALUES ($last_insert_id, $input_part, $input_qty)";
        if (!$conn->query($sql_input)) {
            echo "Error: " . $conn->error;
        }
    }
    echo "ok";
} else {
    echo "Error: " . $conn->error;
}


$conn->close();
?>
