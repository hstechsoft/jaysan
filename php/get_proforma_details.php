<?php
 include 'db_head.php';


 
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "SELECT company.*,(SELECT CASE WHEN max(proforma_invoice.pino > 0) THEN (max(proforma_invoice.pino) +1) ELSE 1 end FROM proforma_invoice) AS qno,(SELECT CASE WHEN max(proforma_invoice.spino > 0) THEN (max(proforma_invoice.spino) +1) ELSE 1 end FROM proforma_invoice) AS sqno FROM company";

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


