<?php
header('Content-Type: application/json');

include "db_head.php";

$po_id = $_GET['po_id'] ?? 0;
if (!$po_id) {
    echo json_encode(["error" => "PO ID missing"]);
    exit;
}

/* 1️⃣ Fetch PO header */
$sql_po = "
SELECT 
    po.po_id,
    po.po_date,
    s.creditor_name,
    s.creditors_addr,
    s.creditors_addr,
    s.state_name,
    s.state_name,
    155 as total_amount

FROM jaysan_po po
JOIN creditors s ON s.creditor_id = po.po_order_to
WHERE po.po_id = '$po_id'
";

$po = $conn->query($sql_po)->fetch_assoc();
if (!$po) {
    echo json_encode(["error" => "PO not found"]);
    exit;
}

/* 2️⃣ Fetch PO items */
$sql_items = "
SELECT 
    i.part_name,
    pi.qty,
    pi.material_rate,
    pi.material_rate as amount
FROM jaysan_po_material pi
JOIN parts_tbl i ON i.part_id = pi.po_material_id
WHERE pi.jaysan_po_id = '$po_id'
";

$res_items = $conn->query($sql_items);

$inventory = [];

while ($row = $res_items->fetch_assoc()) {
    $inventory[] = [
        "StockItem"       => $row['part_name'],
        "DebitorCredit"   => "DR",
        "BilledQty"       => $row['qty']." Nos",
        "AcutalQty"       => $row['qty']." Nos",
        "Rate"            => number_format($row['material_rate'], 2)."/Nos",
        "Discount"        => 0,
        "Amount"          => -1 * $row['amount']
    ];
}

/* 3️⃣ Build final JSON */
$tally_json = [
    "Voucher" => [
        [
            "VoucherTypeName" => "Purchase Order",
            "VchNo"           => $po['po_id'],
            "Date"            => date("d-M-y", strtotime($po['po_date'])),
            "CustomerName"    => $po['creditor_name'],
            "MailingName"     => $po['creditor_name'],
            "BillingAddress"  => $po['creditors_addr'],
            "ShippingAddress"=> $po['creditors_addr'],
            "BillingState"    => $po['state_name'],
            "BillingCountry"  => $po['state_name'],
            "TotalAmount"     => (float)$po['total_amount'],
            "Inventory Entries" => $inventory
        ]
    ]
];

/* 4️⃣ Output as API */
echo json_encode($tally_json, JSON_PRETTY_PRINT);
