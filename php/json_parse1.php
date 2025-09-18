<?php
include 'db_head.php';

$path = 'json/Ledger.JSON'; // Replace with your actual file path
$jsonContent = file_get_contents($path);
$data = json_decode($jsonContent, true);

if (!isset($data['LedgerJson']) || !is_array($data['LedgerJson'])) {
    die("Invalid JSON structure.");
}

foreach ($data['LedgerJson'] as $entry) {
    // Filter: Group must contain 'Creditor'
    if (!isset($entry['Group']) || stripos($entry['Group'], 'creditor') === false) {
        continue;
    }

    $name = $entry['Name'] ?? '';
    $group = $entry['Group'] ?? '';
    $mobile = $entry['LEDGERMOBILE'] ?? '';
    $phone = $entry['LEDGERPHONE'] ?? '';
    $gstin = '';

    if (!empty($entry['LEDGSTREGDETAILS']) && is_array($entry['LEDGSTREGDETAILS'])) {
        foreach ($entry['LEDGSTREGDETAILS'] as $gst) {
            if (!empty($gst['GSTIN'])) {
                $gstin = $gst['GSTIN'];
                break;
            }
        }
    }

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO creditors (creditor_name, creditor_phone, creditor_mobile, creditor_gst, creditor_group) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $phone, $mobile, $gstin, $group);
    $stmt->execute();
    $stmt->close();
}

echo "Creditor records inserted successfully.";
?>
