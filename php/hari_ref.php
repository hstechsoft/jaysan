<?php

include 'db_head.php';

  require_once 'stock_distribution.php';
stock_distribution($conn, 1792, 1);

$conn->close();

 ?>