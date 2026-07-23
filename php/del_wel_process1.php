<?php
include 'db_head.php';



$process_id =  $_POST['process_id'];
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

// delete process_wel_tbl
$sql_delete = "DELETE from process_wel_tbl WHERE final_process_id = $process_id" ;
if ($conn->query($sql_delete) === TRUE) {
    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }







$conn->close();
?>
