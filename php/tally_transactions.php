<?php
header("Access-Control-Allow-Origin: *");
include 'db_head.php';

$sql = "SELECT 
tally_transactions.tally_transactions_id,
tally_transactions.dated,
tally_transactions.json_data,
tally_transactions.trasaction_type,
tally_transactions_details.tally_transactions_name,
tally_transactions_details.tally_transactions_des
FROM tally_transactions 
INNER JOIN tally_transactions_details 
ON tally_transactions.transactions_details_id = tally_transactions_details.tally_transactions_details_id
ORDER BY tally_transactions.tally_transactions_id DESC";

$result = $conn->query($sql);

$rows = array();
$rows['tally_transactions'] = [];

if ($result->num_rows > 0) {

    while ($r = $result->fetch_assoc()) {

        if (!empty($r['json_data'])) {
            $decoded = json_decode($r['json_data'], true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $r['json_data'] = $decoded;
            }
        }

        $rows['tally_transactions'][] = $r;
    }
}

header('Content-Type: application/json');
echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$conn->close();
?>