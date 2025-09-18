<?php
 include 'db_head.php';

 
 
 
 



 $sql = "SELECT emp_name,emp_id FROM `employee`;";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


