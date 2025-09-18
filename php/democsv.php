

<?php
    $csvFile = file('php/upload/demo.csv');
    $data = [];
    foreach ($csvFile as $line) {
        $data[] = str_getcsv($line);
      
    }

    var_dump($data);
 ?>