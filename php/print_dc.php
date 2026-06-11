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

 WHERE dc_process.dc_id = 20 group by dc_process.dc_process_id, dc_process.process_id)

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

   

    
    

} else {
  echo "0 result";
}

// convert parts details into list format
 





//  part details in json array format
 

$sql_get_pats = "select dc.*,DATE_FORMAT(dc.dc_date,'%d-%m-%Y') as dated_format,dc_from.creditor_name as from_name, dc_to.creditor_name as to_name,dc_from.creditor_phone as from_phone, dc_to.creditor_phone as to_phone,dc_from.creditors_addr as from_address, dc_to.creditors_addr as to_address, dc_from.creditor_gst as from_gst, dc_to.creditor_gst as to_gst, JSON_ARRAYAGG(JSON_OBJECT('dc_part_id', dcp.dc_part_id, 'part_pre_process_id', dcp.part_pre_process_id, 'qty', dcp.qty, 'rate', dcp.rate, 'previous_process_name', jp.process_name, 'part_name', if(dcp.dc_id IS not NULL, concat(dc_parttbl.part_name,'(',jp.process_name,')'), concat('Semi-finished part(', final_part.part_name, jp.process_name)))) as part_details from delivery_challan dc
inner join dc_parts dcp on dc.dc_id = dcp.dc_id

left join creditors dc_from on dc_from.creditor_id = dc.dc_from
left join creditors dc_to on dc_to.creditor_id = dc.dc_to
left join parts_tbl dc_parttbl on dc_parttbl.part_id = dcp.part_id
left join process_wel_tbl dc_parttbl_process on dc_parttbl_process.process_id = dcp.part_pre_process_id
left join jaysan_process jp on jp.process_id = dc_parttbl_process.process
left join process_wel_tbl pwt on pwt.process_id = dc_parttbl_process.final_process_id
left join parts_tbl final_part on final_part.part_id = pwt.output_part

 WHERE dc.dc_id = 20

 group by dcp.dc_id";
 




$dc_form = "";
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
$part_details = "";

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
        $part_details = json_decode($r['part_details'], true);



    

    }

    
    

} else {
  echo "0 result";
}

$body_html = "";
$counter = 1;
 $total_amount = 0;
 $total_qty = 0;
 foreach($part_details as $part){
    $body_html .= "<tr>
    <td>$counter</td>
    <td>".$part['part_name']."</td>
    <td></td>
    <td>".$part['qty']."</td>
    <td>".$part['rate']."</td>
    <td>Nos</td>
    <td>".$part['qty']*$part['rate']."</td>
    </tr>";
    $counter++;
    $total_amount += $part['qty']*$part['rate'];
    $total_qty += $part['qty'];
}

 require_once __DIR__ . '/convert_currency.php';

$total_amount_words = numberToIndianCurrency(number_format($total_amount, 2, '.', ''));


 $html = ' <div class="table-responsive mt-3">
                                <table class="table caption-top table-bordered table-striped " style="font-size: 12px;"
                                   ">
                                    <thead>

                                        <tr>
                                            <th scope="col" rowspan="2" colspan="3" > ' . $dc_from . ' <br>
                                           
                                            </th>
                                            <th scope="col" colspan="2" id="Challan_no">Challan No <br><span>' . $challan_no . '</span></th>
                                            <th scope="col" colspan="2">Dated <br><span>' . $dated . '</span></th>
                                        </tr>
                                        <tr>
                                            <th scope="col" colspan="2">Mode/Terms of payment <br><span>' . $mode_terms_of_payment . '</span></th>
                                            <th scope="col" colspan="2">Other References <br><span>' . $other_references . '</span></th>
                                        </tr>
                                        <tr>
                                            <th scope="col" colspan="3" rowspan="3" id="dispatch_to">Dispatch To <span>' . $dispatch_to . '</span></th>
                                            <th scope="col" colspan="2" id="buyer_order_no">Suppiler\'s Ref/Order No. <br><span>' . $supplier_ref_order_no . '</span></th>
                                            </th>
                                            <th scope="col" colspan="2" id="buyer_date">Dated <br><span>' . $dated . '</span></th>
                                        </tr>

                                        <tr>
                                            <th scope="col" colspan="2">Dispatch Doc No. <br><span>' . $dispatch_doc_no . '</span></th>
                                            <th scope="col" colspan="2">Dispatched through <br><span>' . $dispatched_through . '</span></th>
                                        </tr>
                                        <tr>
                                            <th scope="col" colspan="2">Destination <br><span>' . $destination . '</span></th>
                                            <th scope="col" colspan="2">Transport Mode & Type <br><span>' . $transport_mode_type . '</span></th>
                                        </tr>
                                        <tr>
                                            <th scope="col" colspan="3" rowspan="3" id="Party">Party <span></span></th>
                                            <th scope="col" colspan="2" id="bill_of_lading">Driver Name & Number <br><span>' . $driver_name_number . '</span></th>
                                            </th>
                                            <th scope="col" colspan="2" id="motor_vehicle_no">Vehicle No <br><span>' . $motor_vehicle_no . '</span></th>
                                        </tr>
                                        <tr>
                                            <th scope="col" colspan="2">Date & Time of Issue <br><span>' . $date_time_of_issue . '</span></th>
                                            <th scope="col" colspan="2">Duration of Process <br><span>' . $duration_of_process . '</span></th>
                                        </tr>
                                        <tr>
                                            <th scope="col" colspan="2">Description <br><span>' . $description . '</span></th>
                                            <th scope="col" colspan="2" id="terms_of_delivery"
                                                class="text-start align-top">
                                                Nature of Processing <br><span>' . $nature_of_processing . '</span></th>
                                        </tr>
                                        <tr>

                                            <td id="sno">S/No</td>
                                            <td>Description of Goods</td>
                                            <td>HSN/SAC</td>
                                            <td>Quantity</td>
                                            <td>Rate</td>
                                            <td>Per</td>
                                            <td>Amount</td>

                                        </tr>
                                    </thead>
                                    <tbody id="purchase_order_details">

                                   
                                    
                                    ' . $body_html . '
                                    <tr>
                                            <td colspan="3" class="text-end font-weight-bold">Total</td>
                                            <td>' . $total_qty . '</td>
                                            <td></td>
                                            <td></td>

                                            <td>' . $total_amount . '</td>

                                        <tr>
                                            <td colspan="2">Amount chargeable (in words)</td>
                                            <th colspan="5">' . $total_amount_words . '</th>
                                        </tr>


                                <tr>
                                            <td colspan="7" class="text-center font-weight-bold bg-dark text-white">
                                                Summarized Details</td>
                                        </tr>

                                        <tr>
                                            <td colspan="2">Output Part</td>
                                            <td>Process</td>
                                            <td>Qty</td>
                                            <td>Order NO</td>
                                           
                                            <td colspan="2">Input parts</td>
                                           
                                        </tr>
                                        ' . $summary_table . '
                                        <tr>
                                            <td colspan="2">Remark</td>
                                            <th colspan="5"></th>
                                        </tr>

                                        <tr>
                                            <td colspan="4">for JAYSAN AGRI INDUSTRIAL Signatory</td>
                                            <th colspan="3"></th>
                                        </tr>



                                    </tbody>


                                </table>
                            </div>';

require_once __DIR__ . '/../pdf_service.php';

//  require_once __DIR__ . 'pdf_service.php';
    $data = [
                    // 'save_path' =>  dirname(__DIR__) . "/storage/demo/po_" . $company_con,
                    'file_name' => "dc_" . $dc_id . ".pdf",
                    'unique_file' => "yes",
                    'header_html' => "<h3 class='text-center' style='text-align: center;'>PURCHASE ORDER</h3>",
                    'footer_html' => "<p>Generated by HS Tech Soft ERP</p>",
                    'body_html' => $html,
                    'orientation' => "portrait",
                    'paper_size' => "A4",
                  
                    // 'email_to' => "sanjay040611@gmail.com",
                    // 'email_subject' => "Invoice #1001",
                    // 'email_body' => "Hello, please find attached your invoice.",
                    'pdf_password' => "",        // optional
                    'watermark_text' => ""       // optional
                ];

$result = generatePDF($data);
//    header('Content-Type: application/pdf');
//     header('Content-Disposition: inline; filename="' . basename($data['save_path']) . '"');
    return $result;


                


}
 ?>