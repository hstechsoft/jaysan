<?php
 include 'db_head.php';

 $id = test_input($_POST['id']);


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// check if input_part_id is null if yes stop the process
$sql_check = "select * from input_wel_parts where id = $id and input_part_id is null;";

$result_check = $conn->query($sql_check);
if ($result_check->num_rows > 0) {
    echo "Error: cannot delete previous processed part";
    $conn->close();
    exit();
}

// // also check inpuut count of that process_id if it is 1 then we cannot delete it because it will cause error in process_wel_tbl
// $sql_check_input_count = "select * from input_wel_parts where previous_process_id = (select previous_process_id from input_wel_parts where id = $id) and id != $id;";
// echo $sql_check_input_count;
// $result_check_input_count = $conn->query($sql_check_input_count);
// if ($result_check_input_count->num_rows == 0) {
//     echo "Error: cannot delete the only input part for this process";
//     $conn->close();
//     exit();
// }

$total_inputs = 0;
// also check inpuut count of that process_id if it is 1 then we cannot delete it because it will cause error in process_wel_tbl
$sql_check_input_count = "select count(id) as total_inputs from input_wel_parts iwp

 where iwp.process_id = (select process_id from input_wel_parts where id = $id) ";
echo $sql_check_input_count;
$result_check_input_count = $conn->query($sql_check_input_count);
// if total_inputs is 1 or less then 1  we cannot delete it because it will cause error in process_wel_tbl
$row_check_input_count = $result_check_input_count->fetch_assoc();
$total_inputs = $row_check_input_count['total_inputs'];
if ($total_inputs <= 1) {
    echo "Error: cannot delete the only input part for this process";
    $conn->close();
    exit();
}


 $sql =  "delete from input_wel_parts where id = $id;";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


