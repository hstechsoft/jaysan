<?php

function print_dc($dc_id, $conn) {

//  get dc details and generate pdf for that dc









$process_details = "";

// -- process details in json array format

$sql_dc_process = " with prs as(select dc_prs.process_id,jp1.process_name,JSON_ARRAYAGG(json_object('part_name', if(ip.input_part_id IS not NULL, concat(pt.part_name,'(',jp.process_name,')'), concat('Semi-finished part(', final_part.part_name, jp.process_name)), 'qty', ip.qty)) as part_details,dc_process.qty as process_qty,dc_process.dc_process_id as dc_process_id,if(prs_output_part.part_name IS NOT NULL, concat(prs_output_part.part_name), concat('Semi-finished part of ', final_part.part_name,'(from ', jp1.process_name, ' Process)')) as output_part_name from dc_process 



inner join process_wel_tbl pwt on pwt.process_id = dc_process.process_id

inner join input_wel_parts ip on ip.process_id = pwt.process_id



left join parts_tbl pt on pt.part_id = ip.input_part_id

left join process_wel_tbl ip_pre_process on ip_pre_process.process_id = ip.previous_process_id

left join jaysan_process jp on jp.process_id = ip_pre_process.process

left join process_wel_tbl pwt1 on pwt1.process_id = ip_pre_process.final_process_id

left join parts_tbl final_part on final_part.part_id = pwt1.output_part

left join process_wel_tbl dc_prs on dc_prs.process_id = dc_process.process_id

left join jaysan_process jp1 on jp1.process_id = dc_prs.process

left join parts_tbl prs_output_part on prs_output_part.part_id = pwt.output_part



 WHERE dc_process.dc_id = $dc_id group by dc_process.dc_process_id, dc_process.process_id)



 SELECT process_id,process_name,part_details,process_qty,dc_process_id,output_part_name from prs";



 $dc_process_id = 0;

 $dc_process_qty = 0;

 $process_name = "";

 $part_details = "";

 $output_part_name = "";

 $summary_table = "";

$result = $conn->query($sql_dc_process);

if ($result->num_rows > 0) {

    $rows = array();

    while($r = mysqli_fetch_assoc($result)) {

        $process_name = $r['process_name'];

        $part_details = json_decode($r['part_details'], true);

        $dc_process_id = $r['dc_process_id'];

        $dc_process_qty = $r['process_qty'];

        $output_part_name = $r['output_part_name'];

   $part_details_html = "<ul class='list-group'>";

    foreach($part_details as $part){

        $part_details_html .= "<li class='list-group-item'>".$part['part_name'] . " - " . $part['qty'] . " Qty</li>";

    }

    $part_details_html .= "</ul>";





$summary_table .= '<tr>

<td colspan="2">'.$output_part_name.'</td>

<td>'.$process_name.'</td>

<td>'.$dc_process_qty.'</td>

<td>'.$dc_process_id.'</td>

<td colspan="2">'.$part_details_html.'</td></tr>';





    }













} 

// else {

//   echo "0 result";

// }



// convert parts details into list format













//  part details in json array format





$sql_get_pats = "select
    dc.*,
    DATE_FORMAT(dc.dc_date, '%d-%m-%Y') as dated_format,
    dc_from.creditor_name as from_name,
    dc_to.creditor_name as to_name,
    dc_from.creditor_phone as from_phone,
    dc_to.creditor_phone as to_phone,
    dc_from.creditors_addr as from_address,
    dc_to.creditors_addr as to_address,
    dc_from.creditor_gst as from_gst,
    dc_to.creditor_gst as to_gst,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'dc_part_id',
            dcp.dc_part_id,
            'part_pre_process_id',
            dcp.part_pre_process_id,
            'qty',
            dcp.qty,
            'rate',
            dcp.rate,
            'previous_process_name',
            jp.process_name,
            'part_id',
            dcp.part_id,
            'part_name',
            if(
                dcp.part_id IS not NULL,
                concat(
                    dc_parttbl.part_name,
                    ifnull(
                        concat('(', jp.process_name, ')'),
                        ''
                    )
                    
                ),
                concat(
                    'Semi-finished part of ',
                    final_part.part_name,
                    ifnull(
                        concat('(', jp.process_name, ')'),
                        ''
                    )
                )
            )
        )
    ) as part_details
from
    delivery_challan dc
    inner join dc_parts dcp on dc.dc_id = dcp.dc_id
    left join creditors dc_from on dc_from.creditor_id = dc.dc_from
    left join creditors dc_to on dc_to.creditor_id = dc.dc_to
    left join parts_tbl dc_parttbl on dc_parttbl.part_id = dcp.part_id
    left join process_wel_tbl dc_parttbl_process on dc_parttbl_process.process_id = dcp.part_pre_process_id
    left join jaysan_process jp on jp.process_id = dc_parttbl_process.process
    left join process_wel_tbl pwt on pwt.process_id = dc_parttbl_process.final_process_id
    left join parts_tbl final_part on final_part.part_id = pwt.output_part
WHERE
    dc.dc_id = $dc_id
group by
    dcp.dc_id";









$dc_from = "";

$dispatch_to = "";

$challan_no = "";

$dated = "";

$mode_terms_of_payment = "";

$other_references = "";

$party = "";

$driver_name_number = "";

$date_time_of_issue = "";

$duration_of_process = "";

$description = "";

$nature_of_processing = "";

$dispatch_doc_no = "";

$dispatched_through = "";

$destination = "";

$transport_mode_type = "";

$supplier_ref_order_no = "";

$part_details =  array();

$motor_vehicle_no = "";



$result = $conn->query($sql_get_pats);

if ($result->num_rows > 0) {

    $rows = array();

    while($r = mysqli_fetch_assoc($result)) {

     $dc_from = $r['from_name'] . " (" . $r['from_phone'] . ")<br>" . $r['from_address'] . "<br>GST: " . $r['from_gst'];

     $dc_to = $r['to_name'] . " (" . $r['to_phone'] . ")<br>" . $r['to_address'] . "<br>GST: " . $r['to_gst'];

     $challan_no = $r['challan_no'];

        $dated = $r['dated_format'];

        $mode_terms_of_payment = $r['mode_of_payment'];

        $party =   $dc_to;

        $driver_name_number = $r['driver_name'] . " (" . $r['driver_contact'] . ")";

        $date_time_of_issue = $r['date_time_of_issue'];

        $duration_of_process = $r['duration_of_process'];

        $nature_of_processing = $r['nature_of_processing'];

        $dispatch_doc_no = $r['dispatch_doc_no'];

        $dispatched_through = $r['dispatched_through'];

        $destination = $dc_to;

        $transport_mode_type = $r['transport_mode'] . " - " . $r['transport_des'];

        $supplier_ref_order_no = $r['supplier_ref_order_no'];

        $motor_vehicle_no = $r['vehicle_no'];

        // convert to array

        $part_details =  json_decode($r['part_details'], true);











    }









} else {

  echo "0 result";

}



$body_html = "";
$counter = 1;
$total_amount = 0;
$total_qty = 0;

foreach ($part_details as $part) {
    $qty = (float)($part['qty'] ?? 0);
    $rate = (float)($part['rate'] ?? 0);
    $amount = $qty * $rate;

    $body_html .= '
        <tr class="item-row">
            <td class="center">' . $counter . '</td>
            <td class="description">' . htmlspecialchars($part['part_name'] ?? '') . '</td>
            <td class="center">-</td>
            <td class="right">' . number_format($qty, 2) . '</td>
            <td class="right">' . number_format($rate, 2) . '</td>
            <td class="center">Nos</td>
            <td class="right amount">' . number_format($amount, 2) . '</td>
        </tr>';

    $counter++;
    $total_amount += $amount;
    $total_qty += $qty;
}

require_once __DIR__ . '/convert_currency.php';

$total_amount_words = numberToIndianCurrency(number_format($total_amount, 2, '.', ''));



$total_amount_words = numberToIndianCurrency(number_format($total_amount, 2, '.', ''));





 $html = '
<style>
* { box-sizing: border-box; }
body {
    font-family: DejaVu Sans, Arial, sans-serif;
    color: #20262e;
    font-size: 9.5px;
    line-height: 1.35;
}
.dc-page { width: 100%; margin: 0 auto; }
.dc-header { border: 1px solid #1f2937; margin-bottom: 10px; }
.dc-brand {
    padding: 9px 12px 7px;
    text-align: center;
    border-bottom: 2px solid #1f2937;
}
.dc-brand-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1.4px;
}
.dc-brand-subtitle {
    font-size: 8.5px;
    margin-top: 2px;
    color: #5b6470;
}
.dc-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-top: 6px;
}
.info-grid, .items-table, .summary-table, .signature-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}
.info-grid td {
    border: 1px solid #c7cdd4;
    padding: 6px 7px;
    vertical-align: top;
}
.info-label {
    display: block;
    font-size: 7.5px;
    font-weight: 700;
    text-transform: uppercase;
    color: #66717d;
    margin-bottom: 2px;
    letter-spacing: .35px;
}
.info-value {
    display: block;
    font-size: 9px;
    font-weight: 600;
}
.section-title {
    margin-top: 10px;
    padding: 6px 8px;
    background: #26313d;
    color: #fff;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .7px;
}
.items-table th {
    background: #eef1f4;
    color: #27313b;
    border: 1px solid #aeb6bf;
    padding: 6px 5px;
    font-size: 8px;
    text-transform: uppercase;
}
.items-table td {
    border: 1px solid #c7cdd4;
    padding: 6px 5px;
    vertical-align: middle;
}
.items-table .summary-row td {
    background: #f7f8fa;
    font-weight: 700;
}
.summary-table th {
    background: #eef1f4;
    border: 1px solid #aeb6bf;
    padding: 6px 5px;
    font-size: 8px;
    text-align: left;
}
.summary-table td {
    border: 1px solid #c7cdd4;
    padding: 5px;
    vertical-align: top;
}
.remark-box {
    min-height: 38px;
    border: 1px solid #c7cdd4;
    padding: 7px;
    margin-top: 10px;
}
.signature-table { margin-top: 14px; }
.signature-table td {
    width: 50%;
    border-top: 1px solid #aeb6bf;
    padding: 8px 5px 3px;
    vertical-align: bottom;
}
.signature-space { height: 35px; }
.muted { color: #68727e; font-size: 8px; }
.footer-note {
    margin-top: 8px;
    text-align: center;
    color: #68727e;
    font-size: 7.5px;
}
.center { text-align: center; }
.right { text-align: right; }
.description { text-align: left; }
</style>

<div class="dc-page">
    <div class="dc-header">
        <div class="dc-brand">
            <div class="dc-brand-title">JAYSAN AGRI INDUSTRIAL</div>
            <div class="dc-brand-subtitle">Manufacturing &amp; Industrial Processing</div>
            <div class="dc-title">DELIVERY CHALLAN</div>
        </div>

        <table class="info-grid">
            <tr>
                <td colspan="4">
                    <span class="info-label">From</span>
                    <span class="info-value">' . $dc_from . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Challan No</span>
                    <span class="info-value">' . htmlspecialchars($challan_no) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Date</span>
                    <span class="info-value">' . htmlspecialchars($dated) . '</span>
                </td>
            </tr>
            <tr>
                <td colspan="4">
                    <span class="info-label">Dispatch To</span>
                    <span class="info-value">' . $dispatch_to . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Supplier Ref / Order No.</span>
                    <span class="info-value">' . htmlspecialchars($supplier_ref_order_no) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Order Date</span>
                    <span class="info-value">' . htmlspecialchars($dated) . '</span>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <span class="info-label">Dispatch Document No.</span>
                    <span class="info-value">' . htmlspecialchars($dispatch_doc_no) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Dispatched Through</span>
                    <span class="info-value">' . htmlspecialchars($dispatched_through) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Destination</span>
                    <span class="info-value">' . $destination . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Transport Mode &amp; Type</span>
                    <span class="info-value">' . htmlspecialchars($transport_mode_type) . '</span>
                </td>
            </tr>
            <tr>
                <td colspan="4">
                    <span class="info-label">Party</span>
                    <span class="info-value">' . $party . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Driver Name &amp; Number</span>
                    <span class="info-value">' . htmlspecialchars($driver_name_number) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Vehicle No.</span>
                    <span class="info-value">' . htmlspecialchars($motor_vehicle_no) . '</span>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <span class="info-label">Issue Date &amp; Time</span>
                    <span class="info-value">' . htmlspecialchars($date_time_of_issue) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Process Duration</span>
                    <span class="info-value">' . htmlspecialchars($duration_of_process) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Nature of Processing</span>
                    <span class="info-value">' . htmlspecialchars($nature_of_processing) . '</span>
                </td>
                <td colspan="2">
                    <span class="info-label">Payment Terms</span>
                    <span class="info-value">' . htmlspecialchars($mode_terms_of_payment) . '</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="section-title">Material Details</div>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width:6%;">S/No</th>
                <th style="width:36%;">Description of Goods</th>
                <th style="width:11%;">HSN/SAC</th>
                <th style="width:11%;">Quantity</th>
                <th style="width:12%;">Rate</th>
                <th style="width:9%;">Per</th>
                <th style="width:15%;">Amount</th>
            </tr>
        </thead>
        <tbody>
            ' . $body_html . '
            <tr class="summary-row">
                <td colspan="3" class="right">TOTAL</td>
                <td class="right">' . number_format($total_qty, 2) . '</td>
                <td></td>
                <td></td>
                <td class="right">' . number_format($total_amount, 2) . '</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Amount Chargeable (in words)</strong></td>
                <td colspan="5"><strong>' . htmlspecialchars($total_amount_words) . '</strong></td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Process Summary</div>

    <table class="summary-table">
        <thead>
            <tr>
                <th colspan="2" style="width:29%;">Output Part</th>
                <th style="width:15%;">Process</th>
                <th style="width:10%;">Qty</th>
                <th style="width:13%;">Order No.</th>
                <th colspan="2" style="width:33%;">Input Parts</th>
            </tr>
        </thead>
        <tbody>
            ' . $summary_table . '
        </tbody>
    </table>

    <div class="remark-box"><strong>Remark:</strong></div>

    <table class="signature-table">
        <tr>
            <td>
                <div class="signature-space"></div>
                <strong>Prepared / Dispatched By</strong>
            </td>
            <td style="text-align:right;">
                <div class="signature-space"></div>
                <strong>For JAYSAN AGRI INDUSTRIAL</strong><br>
                <span class="muted">Authorised Signatory</span>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        This is a system-generated Delivery Challan • HS Tech Soft ERP
    </div>
</div>';

require_once __DIR__ . '/../pdf_service.php';

$data = [
    'save_path' => dirname(__DIR__) . "/storage/demo/dc_" . $dc_id,
    'file_name' => "dc_" . $dc_id . ".pdf",
    'unique_file' => "yes",
    'header_html' => '',
    'footer_html' => '',
    'body_html' => $html,
    'orientation' => "portrait",
    'paper_size' => "A4",
    'pdf_password' => "",
    'watermark_text' => ""
];

$result = generatePDF($data);
return $result;

}
