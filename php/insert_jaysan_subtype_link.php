<?php
 include 'db_head.php';

 $part_id = test_input($_POST['part_id']);



// decode the JSON string into an array
$msid_array = json_decode(($_POST['msid']), true);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
try
{
    $conn->begin_transaction();
for ($i = 0; $i < count($msid_array); $i++) {
    $msid = test_input($msid_array[$i]);
    $sql = "INSERT INTO jaysan_subtype_link (part_id, msid) VALUES ($part_id, $msid) on duplicate key update part_id = $part_id, msid = $msid";

    if ($conn->query($sql) === TRUE) {
        
    } else {
       
       throw new Exception("Error inserting record: " . $conn->error);
    }
}
$conn->commit();
echo "ok";
}catch (Exception $e) {
    $conn->rollback();
    echo "Error: " . $e->getMessage();
}
$conn->close();

 ?>


