<?php
include 'db_head.php';

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return "'".$data."'";
}

$sql = "SELECT tally_transactions.tally_transactions_id,tally_transactions.dated,tally_transactions.json_data,tally_transactions.trasaction_type FROM tally_transactions INNER join tally_transactions_details on tally_transactions.transactions_details_id = tally_transactions_details.tally_transactions_details_id where tally_transactions.sts = 'created' and tally_transactions_details.tally_transactions_name = 'insert_po'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while ($r = mysqli_fetch_assoc($result)) {
        // Decode JSON fields
       $jsonData = json_decode($r['json_data'], true);
           $newJson = [];
     
    foreach ($jsonData as $key => $value) {

        // Insert ID before party_name
        if ($key === 'VoucherTypeName') {
            $newJson['tally_transactions_id'] = $r['tally_transactions_id'];
        }

        $newJson[$key] = $value;
    }

    $rows['Voucher'][] = $newJson;
    }
    header('Content-Type: application/json');

    $tally_json = [
    "Voucher" => 
        $rows['Voucher']
    
    ];
    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([]);
}

$conn->close();
?>
