
<?php
 include 'db_head.php';
 $cus_name  =   test_input($_GET['cus_name']);
 $cus_phone  =   test_input($_GET['cus_phone']);
 $cus_place  =   test_input($_GET['cus_place']);
 $cus_addr  =  test_input($_GET['cus_addr']);
 $chasis_no  =   test_input($_GET['chasis_no']);
 $implement  =   test_input($_GET['implement']);
 $dealer_name  =   test_input($_GET['dealer_name']);
 $service_person_name  =  test_input($_GET['service_person_name']);
 $rating_service  =   test_input($_GET['rating_service']);
 $rating_dealer	=test_input($_GET['rating_dealer']);
 $did  =   test_input($_GET['did']);
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


$sql = "SET time_zone = '+05:30';"; 

$sql .= "INSERT  INTO review (cus_name,cus_phone,cus_place,cus_addr,chasis_no,dealer_name,service_person_name,rating_service,rating_dealer,did,cus_id,work_id,implement)
 VALUES ($cus_name,$cus_phone,$cus_place,$cus_addr,$chasis_no,$dealer_name,$service_person_name,$rating_service,$rating_dealer,$did,$cus_id,0,$implement	)";
  
  if ($conn->multi_query($sql) === TRUE) {
   echo "Thanks for your review";
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





