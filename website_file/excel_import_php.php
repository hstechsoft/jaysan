<?php
$File = 'Book1.csv';

$arrResult  = array();
$handle     = fopen($File, "r");
if(empty($handle) === false) {
    while(($data = fgetcsv($handle, 1000, ",")) !== FALSE){
       

        $name = $data[0];
        $age = $data[1];
        $country = $data[2];

        echo $name.$age. $country."<br>";
    }

    fclose($handle);
}
    

?>