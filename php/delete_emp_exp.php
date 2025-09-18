<?php
include 'db_head.php';

$exp_id_array = $_POST['exp_id_array']; // This should be an array of data for process_tbl


foreach ($exp_id_array as $exp_id) {
   
    


    $sql = "DELETE from expense WHERE exp_id = '$exp_id'" ;
if ( $conn->query($sql) === TRUE) {
} 
 else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
}

   
echo "ok" ;


$conn->close();
?>
