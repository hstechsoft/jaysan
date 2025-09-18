<?php
 include 'db_head.php';



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT dcf.dcf_id,dcf.dated,dcf.consignee,dcf.sts,DATE_FORMAT(dcf.dated, '%d-%m-%Y') as dated,employee.emp_name FROM dcf INNER join employee on dcf.dcf_by = employee.emp_id WHERE 1 ORDER by dcf_by ";

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


