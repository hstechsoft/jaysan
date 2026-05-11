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
SELECT po.po_id,date_only(po.po_date) as po_date,
buyer.creditor_name as po_buyer_name,
buyer.creditor_gst as po_buyer_gst,
buyer.creditor_mobile as po_buyer_mobile,
buyer.creditors_addr as po_buyer_address,
buyer.state_name as po_buyer_state,
seller.creditor_name as po_seller_name,
seller.creditor_gst as po_seller_gst,
seller.creditor_mobile as po_seller_mobile,
seller.creditors_addr as po_seller_address,
seller.state_name as po_seller_state

from jaysan_po po
INNER join creditors seller on po.po_order_to = seller.creditor_id
INNER join creditors buyer on po.po_delivery_to = buyer.creditor_id
WHERE po.po_id = '$po_id'
";

$po = $conn->query($sql_po)->fetch_assoc();
if (!$po) {
    echo json_encode(["error" => "PO not found"]);
    exit;
}

$inventory_array = [];

/* 2️⃣ Fetch PO items */
$sql_items = "
SELECT parts_tbl.part_id,jpm.qty,jpm.disc,jpm.material_rate,parts_tbl.part_name,parts_tbl.unique_part_id,parts_tbl.baseunits,parts_tbl.gstrate FROM jaysan_po_material jpm inner join  jaysan_po po   on po.po_id = jpm.jaysan_po_id 
INNER join parts_tbl on parts_tbl.part_id = jpm.po_material_id
WHERE po.po_id = '$po_id'";

$res_items = $conn->query($sql_items);



while ($row = $res_items->fetch_assoc()) {
    $inventory_array[] = [
        "StockItem"       => $row['part_name'],
        "UniqueID"        => $row['unique_part_id'],
        "GstRate"         => (float)$row['gstrate'],
        "Qty"       => $row['qty'],
        "Unit"            => $row['baseunits'],
        "Rate"            => (float)$row['material_rate'],
        "discount"        => (float)$row['disc'],
        "Amount"          => (float)($row['qty'] * $row['material_rate'] - ($row['material_rate'] * $row['disc'] / 100))

         ];
}

$total_amount = 0;
foreach ($inventory_array as $item) {
    $total_amount += $item['Amount'];
} 


$sql_gst_wise = "with gst as (SELECT parts_tbl.part_id,
jpm.qty,
jpm.disc,
jpm.material_rate,
(jpm.qty * jpm.material_rate * (1 - jpm.disc / 100) * (1 + parts_tbl.gstrate / 100)) as part_total_amount,
parts_tbl.gstrate FROM jaysan_po_material jpm inner join  jaysan_po po   on po.po_id = jpm.jaysan_po_id 
INNER join parts_tbl on parts_tbl.part_id = jpm.po_material_id
WHERE po.po_id = '$po_id')
SELECT 
SUM(part_total_amount) as total_amount,
gst.gstrate
 from gst GROUP BY gst.gstrate";

$gst_items = $conn->query($sql_gst_wise);
$gst_wise_array = [];
$BillWiseDetails = [];
$BillWiseDetails[] = [  "BillType" => "On Account", 
                            "BillAmount" => $total_amount,
                            ];
$Ledgerdetails = [];
$Ledgerdetails[] =[ "Ledgername" => $po['po_seller_name'], 
                    "DebitorCredit" => "CR", 
                    "Amount" => $total_amount, 
                    "BillWiseDetails" => $BillWiseDetails
                    ];
while ($row = $gst_items->fetch_assoc()) {
    $gst = $row['gstrate'] / 2;
    $gst_amount = round($row['total_amount']/2);
    $Ledgerdetails[] = [
                    "Ledgername" => "Input Cgst @{$gst}%", 
                    "DebitorCredit" => "DR", 
                    "Amount" => $gst_amount
    ];
       $Ledgerdetails[] = [
                    "Ledgername" => "Input Sgst @{$gst}%", 
                    "DebitorCredit" => "DR", 
                    "Amount" => $gst_amount
    ];
  


    
}

  


foreach ($inventory_array as $item) {
        $BatchAllocations = [];
    $AccountingAllocations = [];
$BatchAllocations[] = ["BatchName" => "Primary Batch", 
                            "BatchBilledQty" => $item['Qty'] . " " . $item['Unit'], 
                            "BatchActualQty" => $item['Qty'] . " " . $item['Unit'], 
                            "BatchRate" => $item['Rate'] . "/" . $item['Unit'], 
                            "BatchDiscount" => $item['discount'], 
                            "Amount" => $item['Amount']
                            ];

   $AccountingAllocations[] = ["LedgerName" => "Gst Purchase", 
        "Amount" => round(($item['Amount'] * $item['GstRate'] / 100), 2)
    ];                         

    $inventory[] = [  
                    "StockItem" => $item['StockItem'], 
                    "DebitorCredit"=> "DR", 
                    "BilledQty"=> $item['Qty'] . " " . $item['Unit'], 
                    "AcutalQty"=> $item['Qty'] . " " . $item['Unit'], 
                    "Rate"=> $item['Rate'] , 
                    "Discount"=> $item['discount'], 
                    "Amount"=> $item['Amount'], 
                      "BatchAllocations" => $BatchAllocations,
            "AccountingAllocations" => $AccountingAllocations,
                  
    ];

}




/* 3️⃣ Build final JSON */
$tally_json = [
  
        
            "VoucherTypeName"=> "Purchase Order", 
            "VchNo"=> $po['po_id'], 
            "Date"=> date("d-M-y", strtotime($po['po_date'])), 
            "CustomerName"=> $po['po_seller_name'], 
            "MailingName"=> $po['po_seller_name'],  
            "BillingAddress"=> $po['po_seller_address'], 
            "ConsigneeName"=> $po['po_seller_name'], 
            "ShippingAddress"=> $po['po_seller_address'], 
            "BillingPinCode"=> "600001", 
            "ShippingPinCode"=> "641048", 
            "BillingPhoneNo"=> "NULL", 
            "ShippingPhoneNo"=> $po['po_seller_mobile'], 
            "TotalAmount"=> round($total_amount, 2), 
            "BillingState"=> $po['po_seller_state'], 
            "BillingCountry"=> "India", 
            "ShippingState"=> $po['po_seller_state'], 
            "ShippingCountry"=> "India",
            "InventoryEntries" => $inventory,
            "LedgerEntries" => $Ledgerdetails
          
        
    
];




// /* 4️⃣ Output as API */
// echo json_encode($tally_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

$sql_insert_json = "INSERT INTO tally_transactions ( json_data, sts, response_json, transactions_details_id, trasaction_type) VALUES ( '" . json_encode($tally_json) . "', 'created', '{}', '2', 'insert');";
    $last_id_work =0;
  if ($conn->query($sql_insert_json) === TRUE) {
   
  } else {
    echo "Error: " . $sql_insert_json . "<br>" . $conn->error;
  }
  
 

$conn->close();

