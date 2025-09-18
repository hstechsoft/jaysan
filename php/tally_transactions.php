<?php
include 'db_head.php';

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return "'".$data."'";
}

$sql = "SELECT tally_transactions.tally_transactions_id,tally_transactions.dated,tally_transactions.json_data,tally_transactions.trasaction_type,tally_transactions_details.tally_transactions_name,tally_transactions_details.tally_transactions_des FROM tally_transactions INNER join tally_transactions_details on tally_transactions.transactions_details_id = tally_transactions_details.tally_transactions_details_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while ($r = mysqli_fetch_assoc($result)) {
        // Decode JSON fields
        $r['json_data'] = json_decode($r['json_data'], true);

        $rows['tally_transactions'][] = $r;
    }
    header('Content-Type: application/json');
    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([]);
}

$conn->close();
?>
