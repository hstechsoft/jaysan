<?php
include 'db_head.php';

$rqid =($_POST['rqid']);
$part_spec_data_json = $conn->real_escape_string("part_spec_data");
$part_spec_data_json = json_encode("part_spec_data", JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);


$sql_delete = "DELETE from rate_quotation_spec WHERE rqid = '$rqid '" ;




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
