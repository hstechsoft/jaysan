<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
 include 'db_head.php';


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
try
{
    $conn->begin_transaction();
    require_once 'stock_update_fn.php';
    $godown_id = ($_POST['godown_id']);
    $dep_id = sql_nullable($_POST['dep_id']);
    $sec_id = sql_nullable($_POST['sec_id']);
    $finished_process_id = ($_POST['finished_process_id']);
    $finished_qty = ($_POST['finished_qty']);


    if(stock_update_fn($conn,$finished_process_id,$finished_qty,$godown_id,$dep_id,$sec_id)) {
         $conn->commit();
    }
    else {
        $conn->rollback();
    }
}
catch (Exception $e) {
    $conn->rollback();
    $conn->close();
    throw new Exception($e->getMessage());
}
$conn->close();

 ?>


