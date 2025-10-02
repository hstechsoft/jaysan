<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT CURRENT_DATE as date;";

if ($conn->multi_query($sql)) {
  do {
    if ($result = $conn->store_result()) {
      if ($result->num_rows > 0) {
        while ($r = $result->fetch_assoc()) {
          echo $r['date'];
        }
      } else {
        echo "0 result";
      }
      $result->free();
    }
  } while ($conn->more_results() && $conn->next_result());
} else {
  echo "Error: " . $conn->error;
}
$conn->close();


 ?>


