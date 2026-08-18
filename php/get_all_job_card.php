<?php
 include 'db_head.php';


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "select * from laser_job_card
 inner join nesting_details on laser_job_card.nesting_id = nesting_details.nesting_id
 inn
 inner join nesting_parts on nesting_details.nesting_id = nesting_parts.nesting_id
 inner join parts_tbl on nesting_parts.part_id = parts_tbl.part_id
 inner join employee on nesting_details.created_by = employee.emp_id
";

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


