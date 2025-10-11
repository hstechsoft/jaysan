<?php
include 'db_head.php';

$rqid =($_POST['rqid']);
$part_spec_data =($_POST['part_spec_data']);
// $part_spec_data_json = $conn->real_escape_string("part_spec_data");
// $part_spec_data_json = json_encode("part_spec_data", JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$rate = isset($_POST['rate']) && $_POST['rate'] !== null ? $_POST['rate'] : 0;

$sql_delete = "DELETE from rate_quotation_spec WHERE rqid = '$rqid '" ;


if($rate > 0)
{
   $update_sql = "UPDATE rate_quotation set rate = $rate   WHERE rqid = $rqid";
 
 if ($conn->query($update_sql) === TRUE) {
 
   
 } else {
   echo "Error: " . $update_sql . "<br>" . $conn->error;
 
  }
}


if ($conn->query($sql_delete) === TRUE) {
 $insert_part_spec = "INSERT  INTO rate_quotation_spec (rqid,spec_details)
VALUES ($rqid,'$part_spec_data_json')";
 
 if ($conn->query($insert_part_spec) === TRUE) {
echo "ok";
   
 } else {
   echo "Error: " . $insert_part_spec . "<br>" . $conn->error;
 
  }

}

  

 else {
   echo "Error: " . $sql_process . "<br>" . $conn->error;
 }


$conn->close();
?>
