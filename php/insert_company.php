
<?php
 include 'db_head.php';

 $company_name =test_input($_GET['company_name']);
 $company_address =test_input($_GET['company_address']);
 $company_terms =test_input($_GET['company_terms']);
 $company_terms_pi =test_input($_GET['company_terms_pi']);
 $company_terms_q =test_input($_GET['company_terms_q']);
 $company_logo =test_input($_GET['company_logo']);
 $company_bank =test_input($_GET['company_bank']);
 $gst =test_input($_GET['gst']);
 $company_logo1 =test_input($_GET['company_logo1']);
 $qno_seq =  test_input($_GET['qno_seq']);
 $ino_seq =  test_input($_GET['ino_seq']);
 $pino_seq = test_input($_GET['pino_seq']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  company (company_name,company_address,company_terms,company_terms_pi,company_terms_q,company_logo,company_bank,gst,company_logo1,qno_seq,ino_seq,pino_seq)
 VALUES ($company_name,$company_address,$company_terms,$company_terms_pi,$company_terms_q,$company_logo,$company_bank,$gst,$company_logo1,$qno_seq,$ino_seq,$pino_seq)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





