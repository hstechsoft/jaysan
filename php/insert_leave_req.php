<?php
 include 'db_head.php';

 $from_date = test_input($_GET['from_date']);
$to_date = test_input($_GET['to_date']);
$emp_id = test_input($_GET['emp_id']);
$leave_type = test_input($_GET['leave_type']);
$reason = test_input($_GET['reason']);
$status = test_input($_GET['status']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql_check = "SELECT 1 FROM att_req 
              WHERE emp_id = $emp_id 
              AND (
                  ($from_date BETWEEN from_date AND to_date) 
                  OR ($to_date BETWEEN from_date AND to_date)
                  OR (from_date BETWEEN $from_date AND $to_date)
                  OR (to_date BETWEEN $from_date AND $to_date)
              )";

// Execute the SELECT query and check if any rows are returned
$result_check = mysqli_query($conn, $sql_check);
if (mysqli_num_rows($result_check) == 0) {
$sql = "INSERT INTO att_req ( from_date,to_date,emp_id,leave_type,reason,status) VALUES ($from_date, $to_date,$emp_id,$leave_type,$reason,$status)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
else
{
  echo "not-ok";
}
$conn->close();

 ?>


