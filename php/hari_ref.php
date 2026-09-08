<?php

include 'db_head.php';
require_once 'stock_transfer.php'; // replace with the actual file you need to include


try {
    stock_transfer($conn,null,2944,359,36,47,359,36,52,1);
    // $conn->commit();
} catch (Exception $e) {
    $conn->rollback();
    echo "Stock transfer failed: " . $e->getMessage();
}

$conn->close();

 ?>