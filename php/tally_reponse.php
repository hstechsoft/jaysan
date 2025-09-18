<?php
include 'db_head.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read and sanitize inputs
    $response_json = trim($_POST['response_json'] ?? '');
    $tally_transactions_id = intval($_POST['tally_transactions_id'] ?? 0);

    // Validate
    if ($response_json === '' || $tally_transactions_id === 0) {
        http_response_code(400);
        echo "Invalid input.";
        exit;
    }

    // Escape JSON for SQL
    $response_json_safe = $conn->real_escape_string($response_json);

    // Run update
    $sql = "UPDATE tally_transactions 
            SET response_json = '$response_json_safe' 
            WHERE tally_transactions_id = $tally_transactions_id";

    if ($conn->query($sql) === TRUE) {
        echo "ok";
    } else {
        http_response_code(500);
        echo "Error: " . $conn->error;
    }

    $conn->close();
} else {
    http_response_code(405);
    echo "Method not allowed";
}
?>
