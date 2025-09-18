
<?php
 include 'db_head.php';
 
 $cus_name =test_input($_GET['cus_name']);
 $cus_address =test_input($_GET['cus_address']);
 $cus_lead_source =test_input($_GET['cus_lead_source']);
 $cus_location =test_input($_GET['cus_location']);
 $cus_phone =test_input($_GET['cus_phone']);
 $cus_aphone =test_input($_GET['cus_aphone']);
 $cus_state =test_input($_GET['cus_state']);
 $cus_lang =test_input($_GET['cus_lang']);
 $cus_exp =test_input($_GET['cus_exp']);
 $cus_tmodel =test_input($_GET['cus_tmodel']);
 $cus_imp =test_input($_GET['cus_imp']);
 $cus_sub =test_input($_GET['cus_sub']);
 $cus_usecase =test_input($_GET['cus_usecase']);
 $cus_showroom =test_input($_GET['cus_showroom']);
 $cus_oproduct =test_input($_GET['cus_oproduct']);
 $cus_category =test_input($_GET['cus_category']);
 $cus_gst =test_input($_GET['cus_gst']);
 $cus_type =test_input($_GET['cus_type']);
 $cus_place =test_input($_GET['cus_place']);


 
 

 $his_comment =test_input($_GET['his_comment']);
 $his_time =test_input($_GET['his_time']);
 $his_status =test_input($_GET['his_status']);
 $his_emp_id =test_input($_GET['his_emp_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT ignore INTO customer (cus_name,cus_address,cus_lead_source,cus_location,cus_phone,cus_aphone,cus_place,	cus_state,cus_lang,cus_exp,	cus_tmodel,	cus_imp,cus_sub,cus_usecase,cus_showroom,cus_oproduct,cus_category,cus_gst,cus_type)
VALUES ($cus_name,$cus_address,$cus_lead_source,$cus_location,$cus_phone,$cus_aphone,$cus_place,	$cus_state,$cus_lang,$cus_exp,	$cus_tmodel,	$cus_imp,$cus_sub,$cus_usecase,$cus_showroom,$cus_oproduct,$cus_category,$cus_gst,$cus_type)";
  
  if ($conn->query($sql) === TRUE) {
   
    $last_id_work = $conn->insert_id;
    if( $last_id_work > 0)
{
  echo $last_id_work;

      }
      else{
        $sql = "SELECT cus_id  FROM customer where cus_phone = $cus_phone";
  
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
          // output data of each row
          while($row = $result->fetch_assoc()) {
   
            echo  $row["cus_id"];
      }
  }
}
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





