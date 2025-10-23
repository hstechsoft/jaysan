<?php
 include 'db_head.php';

 


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT count(mrf.part_id) as frq,sum(mrf.req_qty)as total_req_qty,mrf.mrf_id,mrf.part_id,parts_tbl.part_name FROM `material_request_form` mrf INNER join parts_tbl on mrf.part_id = parts_tbl.part_id GROUP by mrf.part_id;";

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


