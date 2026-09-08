<?php

include 'db_head.php';

echo "hi";
require_once 'stock_distribution.php';

stock_distribution($conn,1883,2);

$conn->close();

 ?>