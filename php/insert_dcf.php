<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
 include 'db_head.php';

 $consignee = test_input($_POST['consignee']);
$con_gst = test_input($_POST['con_gst']);
$con_con = test_input($_POST['con_con']);
$trans_mode = test_input($_POST['trans_mode']);
$trans_ref = test_input($_POST['trans_ref']);
$dcf_by = test_input($_POST['dcf_by']);
$ass_arr = ($_POST['ass_arr']);
$dcf_report = ($_POST['dcf_report']);
$narration =  test_input($_POST['narration']);




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$dcf_id = 0;

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO dcf ( consignee,con_gst,con_con,trans_mode,trans_ref,dcf_by,sts,dcf_report,dcf_narration) VALUES ($consignee,$con_gst,$con_con,$trans_mode,$trans_ref,$dcf_by,'create','$dcf_report',$narration)";

if ($conn->multi_query($sql)) {
    // Process the first result set (e.g., time zone set)
    do {
        // Empty the result set
        if ($result = $conn->store_result()) {
            // Process results here if needed
            $result->free();
        }
    } while ($conn->next_result());

    // Now insert the payment data
    $dcf_id = $conn->insert_id;  // Get the ID of the inserted sales order


     $sql = "UPDATE assign_product SET  assign_product.dcf_id =    $dcf_id  WHERE assign_product.ass_id in ($ass_arr)";

    // $sql = "UPDATE assign_product SET  assign_product.dcf_id =   0  WHERE assign_product.ass_id in ($ass_arr)";
  
  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();

 ?>


