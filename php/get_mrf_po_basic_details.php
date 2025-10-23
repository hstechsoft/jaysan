<?php
 include 'db_head.php';

   $mrf_id = test_input($_GET['mrf_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT
    (SELECT max(po_id)+1 from jaysan_po ) as max_po_no,
 sup.creditors_terms as terms,
    sup.creditor_name as sub_name,
    sup.creditors_addr as sub_addr,
    sup.creditor_gst as sub_gst,
    sup.state_name as sub_state_name,
    sup.contact_person as sub_contact_person,
    sup.contact as sub_contact,
    sup.creditors_email as sub_email,
     con.creditor_name as con_name,
   con.creditors_addr as con_addr,
   con.creditor_gst as con_gst,
   con.state_name as con_state_name,
   con.contact_person as con_contact_person,
   con.contact as con_contact,
   con.creditors_email as con_email,
   (SELECT company.company_address from company LIMIT 1) as company_address,
     REPLACE((SELECT company.company_address from company LIMIT 1) , '\n', '<br>') as company_address
    
FROM
    `mrf_purchase`
    LEFT JOIN creditors sup on mrf_purchase.po_order_to = sup.creditor_id
    LEFT JOIN creditors con on mrf_purchase.po_order_to = con.creditor_id WHERE mrf_purchase.mrf_id =  $mrf_id";

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            if ($result->num_rows > 0) {
                $rows = array();
                while ($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                echo json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error: " . $conn->error;
}
$conn->close();


 ?>


