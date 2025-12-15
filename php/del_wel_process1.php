<?php
include 'db_head.php';



$did =  $_POST['did'];






foreach ($did as $row) {


$sql = "DELETE from process_wel_tbl WHERE process_id = $row" ;


log_delete_query($sql);

if ($conn->query($sql) === TRUE) {
   
  } else {
    
  }

}
echo "ok";

$conn->close();
?>
