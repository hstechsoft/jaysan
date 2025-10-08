<?php
 include 'db_head.php';

 $jaysan_po_id = test_input($_GET['jaysan_po_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT
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
     REPLACE((SELECT company.company_address from company LIMIT 1) , '\n', '<br>') as company_address,
       po.po_no,
    po.po_date,
    po.po_order_to,
    po.po_delivery_to,
    po.po_terms,
    
   concat('[',GROUP_CONCAT( JSON_OBJECT('jaysan_po_material_id', jpm.jaysan_po_material_id ,'material_id', jpm.po_material_id ,'qty',    jpm.qty,'batch_id' ,jpm.batch_id,'material_rate',jpm.material_rate,'discount',jpm.disc,'is_approved' ,  jpm.is_approved, 'due_on',jpm.due_on ,'material_name',(select parts_tbl.part_name from parts_tbl where parts_tbl.part_id = jpm.po_material_id ),'uom',ifnull((SELECT uom FROM `mrf_purchase` WHERE mrf_id = (SELECT mrf_batch.mrf_id from mrf_batch WHERE mrf_batch.batch_id = jpm.batch_id) LIMIT 1),'Nos'),'gst',(select parts_tbl.gstrate from parts_tbl where parts_tbl.part_id = jpm.po_material_id ),'batch_date',(select  mrf_batch.batch_date from  mrf_batch where  mrf_batch.batch_id = jpm.batch_id ),'original_qty',ifnull((select mrf_batch.batch_qty from mrf_batch where mrf_batch.batch_id = jpm.batch_id ),jpm.qty)) SEPARATOR ','),']' )as materials_list
   
 
FROM
    jaysan_po po
INNER JOIN jaysan_po_material jpm ON
    po.po_id = jpm.jaysan_po_id
LEFT JOIN creditors con ON
    po.po_delivery_to = con.creditor_id
LEFT JOIN creditors sup ON
    po.po_delivery_to = sup.creditor_id WHERE jaysan_po_id =  $jaysan_po_id   group by po.po_id ";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


