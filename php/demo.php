
<?php
 include 'db_head.php';
//  assign demo json data 
$assign_id_json = '[1, 2, 3, 4, 5]';
 $assign_id_array = json_decode($assign_id_json, true);


foreach ($assign_id_array as $assign_id) {
    echo $assign_id . "<br>";
}
?>
