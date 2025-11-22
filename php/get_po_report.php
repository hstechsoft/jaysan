<?php
 include 'db_head.php';

//  demo text 12345
$material_query = isset($_GET['material_query']) ? $_GET['material_query'] : '';
  $material_query = ($material_query == '') ? "1" :  " jmat.po_material_id = '$material_query'";

   $from_date = isset($_GET['from_date']) ? $_GET['from_date'] : '';
    $to_date = isset($_GET['to_date']) ? $_GET['to_date'] : '';
    
  $date_query = ($from_date == '' || $to_date  == '') ? "1" :  " jp.po_date between   '$from_date' and '$to_date' ";


  $order_to_query = isset($_GET['order_to_query']) ? $_GET['order_to_query'] : '';
  $order_to_query = ($order_to_query == '') ? "1" :  "jp.po_order_to = '$order_to_query'";
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
// $sql .= "SELECT
//     jp.po_no,
//     jp.po_date,
//     (SELECT creditors.creditor_name from  creditors WHERE creditors.creditor_id = jp.po_order_to) order_to,
//     sum(jmat.qty) as total_po_qty,
//        sum(jaysan_inward.qty) as inward_qty
 
// FROM
//     jaysan_po jp
// INNER JOIN jaysan_po_material jmat ON  jmat.jaysan_po_id = jp.po_id
// left join jaysan_inward on jp.po_id = jaysan_inward.ref_id and jaysan_inward.inward_cat = 'po'

$sql .= "SELECT
jp.po_no,
jp.po_date,
jp.po_id,
sum(jmat.qty) as total_po_qty,

ifnull(sum(grn.qty),0) as inward_qty,
    (SELECT creditors.creditor_name from  creditors WHERE creditors.creditor_id = jp.po_order_to)  as order_to
    
FROM
  jaysan_po_material   jmat
INNER JOIN jaysan_po jp  ON  jmat.jaysan_po_id = jp.po_id 
LEFT join grn on jmat.jaysan_po_material_id = grn.jaysan_po_material_id where  $material_query and  $date_query and  $order_to_query  GROUP by po_id
";
    // jmat.po_material_id = '' AND jp.po_order_to = 1";

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
