<?php
 include 'db_head.php';



 $godown = test_input($_POST['godown']);
    $dep = test_input($_POST['dep']);
    $sec = test_input($_POST['sec']);
    $process_id = test_input($_POST['process_id']);

$qty = test_input($_POST['qty']);
 $manual_part_id  = isset($_POST['manual_part_id']) ? test_input($_POST['manual_part_id']) : 'no';
 $emp_id = test_input($_POST['emp_id']);





$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);
$process_id = sql_nullable($process_id);




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
$part_id = null;
$emp_name = '';

// get employee id from emp_id POST parameter if available
$sql_emp_id = "SELECT emp_name FROM employee WHERE emp_id = $emp_id";
$result_emp_id = $conn->query($sql_emp_id);
if ($result_emp_id->num_rows > 0) {
    $row_emp_id = $result_emp_id->fetch_assoc();
    $emp_name = $row_emp_id['emp_name'];

} else {
    echo "Error: Could not retrieve employee ID.";
    $conn->close();
    exit();
}

 $remark = "Stock manually updated by " . $emp_name;
// get part id from process_wel_tbl
if($manual_part_id == 'no') {

$get_part_id_sql = "SELECT output_part FROM process_wel_tbl WHERE process_id <=> $process_id";
$result = $conn->query($get_part_id_sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $part_id = $row['output_part'];
    $part_id = sql_nullable($part_id);
} else {
    echo "Error: Could not retrieve part ID.";
    $conn->close();
    exit();
}
}
else
    {
        $part_id = sql_nullable($manual_part_id);
    }

if($part_id > 0 && $part_id != "NULL")
    {
 $process_id = "NULL";
    }
   

    {

$sql = "insert into jaysan_stock (godown,dep,sec,process_id,qty,remark,part_id) values ($godown,$dep,$sec,$process_id,$qty,'$remark',$part_id) ON DUPLICATE KEY UPDATE qty =   $qty, remark = '$remark' ";

 
$stock_id = 0;
  if ($conn->query($sql) === TRUE) {

//     $stock_id = $conn->insert_id;


//    require_once 'stock_distribution.php';
   
//    $result = stock_distribution($conn,$stock_id,$qty,$process_id);
// echo "\n result:".$result;
//    if ($result) {
//     //    echo "ok";
//    } else {
//        echo "error distributing stock".$result;
//    }

echo "ok";


  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
    }
$conn->close();

 ?>


