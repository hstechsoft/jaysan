<?php
 include 'db_head.php';

 $part_id = test_input($_POST['part_id']);



// decode the JSON string into an array
$msid_array = json_decode(($_POST['msid']), true);
 


// get array as comma separated string
$msid_string = implode(',', $msid_array);
// check same combination of  msid already exists in the table
$sql_check = "SELECT jaysan_subtype_link.part_id,part_name
FROM jaysan_subtype_link
inner join parts_tbl on jaysan_subtype_link.part_id = parts_tbl.part_id
WHERE msid IN ($msid_string)
GROUP BY part_id
HAVING COUNT(DISTINCT msid) = ".count($msid_array).";";
$result = $conn->query($sql_check);
if ($result->num_rows > 0) {
// show part_name and exit
echo "The following part(s) already have the same combination of subtypes: ";
while($row = $result->fetch_assoc()) {
    echo $row["part_name"]." ";
}
exit();
}

$mtid = 0;
// check same part_id  already exists in the table
$sql_check_part = "SELECT jaysan_subtype_link.part_id,part_name,mtid
FROM jaysan_subtype_link
inner join parts_tbl on jaysan_subtype_link.part_id = parts_tbl.part_id
inner join jaysan_product_view on jaysan_subtype_link.msid = jaysan_product_view.msid
WHERE part_id = $part_id
GROUP BY part_id";

$result_part = $conn->query($sql_check_part);
if ($result_part->num_rows > 0) {
// show part_name and exit

$row_part = $result_part->fetch_assoc();
$mtid = $row_part["mtid"];

// check mtid of incoming msid  of any one
$sql_get_mtid = "SELECT mtid FROM jaysan_product_view WHERE msid IN ($msid_string) LIMIT 1";
$result_mtid = $conn->query($sql_get_mtid);
if ($result_mtid->num_rows > 0) {
    $row_mtid = $result_mtid->fetch_assoc();
    $mtid = $row_mtid["mtid"];
}

if ($mtid != $row_part["mtid"]) {
    echo "The part ". $row_part["part_name"]." is associated with a different type. Please choose a different part.";
    exit();
}

else
    {
        // delete existing records for the part_id
        $sql_delete = "DELETE FROM jaysan_subtype_link WHERE part_id = $part_id";
        if ($conn->query($sql_delete) === TRUE) {
            // proceed to insert new records
        } else {
            echo "Error deleting existing records: " . $conn->error;
            exit();
        }
    }
}

 
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


