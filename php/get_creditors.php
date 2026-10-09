<?php
 include 'db_head.php';

$creditor_id = test_input($_GET['creditor_id']);
$creditor_query  =1;
if ($creditor_id > 0 ) {
    $creditor_query = "  creditor_id = $creditor_id";
}

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "SELECT * FROM creditors WHERE $creditor_query";

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


