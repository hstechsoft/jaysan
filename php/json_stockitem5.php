<?php

include 'db_head.php';


$filename = __DIR__ . '/../tally/Json/JAStkItem.JSON';

if (file_exists($filename)) {

    $json = file_get_contents($filename);
    $data = json_decode($json, true);

    if (!isset($data['StockItem']) || !is_array($data['StockItem'])) {
        die('Invalid JSON structure');
    }

    $duplicates = []; // <-- IMPORTANT: initialize
    $i = 1;

    foreach ($data['StockItem'] as $item) {
        echo $i . ". ";
        echo $item['Name'] . "\t\t<br>\t\t";

        if (isset($duplicates[$item['Name']])) {
            echo "<span style='color:red;'>(DUPLICATE)</span><br>";
        } else {
            $duplicates[$item['Name']] = true;
        }

        $i++;
    }
}



  
    ?>

