<?php
include 'db_head.php';



$process_id =  $_POST['process_id'];
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
try
{

$conn->begin_transaction();

// get all process_id whos have final_process_id = $process_id
$sql_get_process_ids = "SELECT process_id FROM process_wel_tbl WHERE final_process_id = $process_id";
$result_get_process_ids = $conn->query($sql_get_process_ids);
$process_ids = [];
if ($result_get_process_ids && $result_get_process_ids->num_rows > 0) {
    while ($row = $result_get_process_ids->fetch_assoc()) {
        $process_ids[] = $row['process_id'];
    }
}
echo "Process IDs to be deleted: " . implode(", ", $process_ids) . "<br>";
// update all process which have final_process_id = $process_id to final_process_id = null
$update_final_process_id_sql = "UPDATE process_wel_tbl SET final_process_id = NULL WHERE final_process_id = $process_id";
echo $update_final_process_id_sql;
if ($conn->query($update_final_process_id_sql) === TRUE) {

} else {
   throw new Exception("Error updating final_process_id: " . $conn->error);
}


foreach ($process_ids as $id) {

// delete process_wel_tbl
$sql_delete = "DELETE from process_wel_tbl WHERE process_id = $id" ;
echo $sql_delete;
if ($conn->query($sql_delete) === TRUE) {

  } else {
    throw new Exception("Error deleting record: " . $conn->error);
  }
}
    $conn->commit();
    echo "ok";




$conn->close();

} catch (Exception $e) {
    $conn->rollback();
    echo "Transaction failed: " . $e->getMessage();
}
?>
