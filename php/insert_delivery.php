<?php
include 'db_head.php';

$cus_name = test_input($_GET['cus_name']);
$cus_phone = test_input($_GET['cus_phone']);
$cus_addr = test_input($_GET['cus_addr']);
$chasis_no = test_input($_GET['chasis_no']);
$dimage = test_input($_GET['dimage']);
$implement = test_input($_GET['implement']);
$model = test_input($_GET['model']);
$ext_warranty = test_input($_GET['ext_warranty']);
$did = test_input($_GET['did']);
$cus_id = 0;
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = "'".$data."'";
    return $data;
}


$sql_ic = "INSERT ignore INTO customer (cus_name,cus_address,cus_phone,cus_type)
VALUES ($cus_name,$cus_addr,$cus_phone,'customer')";
  
  if ($conn->query($sql_ic) === TRUE) {
   
    $last_id_work = $conn->insert_id;
    $cus_id =  $last_id_work;
    if( $last_id_work > 0)
{


      }
      else{
        $sql_gc = "SELECT cus_id  FROM customer where cus_phone = $cus_phone";
  
        $result = $conn->query($sql_gc);

        if ($result->num_rows > 0) {
          // output data of each row
          while($row = $result->fetch_assoc()) {
            $cus_id = $row["cus_id"];
           
            
      }
  }
}
}


$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO dealer_delivery (cus_name, cus_phone, cus_addr, chasis_no, dimage, implement, model, ext_warranty, did,cus_id,work_id) VALUES ($cus_name, $cus_phone, $cus_addr, $chasis_no, $dimage, $implement, $model, $ext_warranty, $did,$cus_id,0)";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();



?>
