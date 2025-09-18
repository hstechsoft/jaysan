<?php
 include 'db_head.php';


 
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT company.*,(SELECT CASE WHEN max(quotation.qno > 0) THEN (max(quotation.qno) +1) ELSE 1 end FROM quotation) AS qno,(SELECT CASE WHEN max(quotation.sqno > 0) THEN (max(quotation.sqno) +1) ELSE 1 end FROM quotation) AS sqno FROM company";

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


