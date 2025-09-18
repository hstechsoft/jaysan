<?php
include 'db_head.php';

$newPartName    = test_input($_GET['newPartName']);
$newPartNo      = test_input($_GET['newPartNo']);
$newPartDes     = test_input($_GET['newPartDes']);
$reorder_qty    = test_input($_GET['reorder_qty']);
$min_order_qty  = test_input($_GET['min_order_qty']);
$Parent         = test_input($_GET['Parent']);
$category       = test_input($_GET['category']);
$baseunits      = test_input($_GET['baseunits']);
$gstrate        = test_input($_GET['gstrate']);

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return "'".$data."'";
}

// Multi-query: set time zone + insert
$sql = "SET time_zone = '+05:30';";
$sql .= "INSERT INTO parts_tbl (part_name, part_no, des, reorder_qty, min_order_qty, Parent, category, baseunits, gstrate) 
         VALUES ($newPartName, $newPartNo, $newPartDes, $reorder_qty, $min_order_qty, $Parent, $category, $baseunits, $gstrate)";

if ($conn->multi_query($sql)) {
    // Clear all result sets
    while ($conn->more_results() && $conn->next_result()) {;}

    // Create JSON
    $json_array = [
        "tally_input_data" => [
            [
               
                "part_name" => str_replace("'", "", $newPartName),
                "part_no" => str_replace("'", "", $newPartNo),
                "reorder_qty" => (int)str_replace("'", "", $reorder_qty),
                "min_order_qty" => (int)str_replace("'", "", $min_order_qty),
                "parent" => str_replace("'", "", $Parent) ?: null,
                "category" => str_replace("'", "", $category),
                "baseunits" => str_replace("'", "", $baseunits),
                "gstrate" => (float)str_replace("'", "", $gstrate)
            ]
        ]
    ];
    $json_encoded = json_encode($json_array, JSON_UNESCAPED_UNICODE);
    $json_encoded_safe = $conn->real_escape_string($json_encoded);

    $sql_insert = "INSERT INTO tally_transactions 
        (json_data, response_json, receive_date, transactions_details_id, trasaction_type) 
        VALUES ('$json_encoded_safe', '{}', '', '1', 'insert_new_part')";

    if (mysqli_query($conn, $sql_insert)) {
        echo 'Inserted Successfully';
    } else {
        echo mysqli_error($conn);
    }
} else {
    http_response_code(500);
    echo $conn->error;
}

$conn->close();
?>
