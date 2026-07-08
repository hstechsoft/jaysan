<?php
 include 'db_head.php';

 $process_id = test_input($_GET['process_id']);

//  get partid prcess id from process_wel_tbl
$sql = "select output_part, process_id from process_wel_tbl where process_id = $process_id";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$part_id = $row['output_part'];
$process_id = $row['process_id'];



 $part_id = sql_nullable($part_id);
 $process_id = sql_nullable($process_id);
$part_query = 1;
$process_query = 1;


 if($part_id > 0 and $part_id != 'NULL')
    {
        $part_query = "input_part_id = $part_id";
       
 }
 else if($process_id > 0 and $process_id != 'NULL')
    {
        $process_query = "previous_process_id = $process_id";
        
 }

 if($part_query == 1 && $process_query == 1)
    {
        echo "No part or process id provided";
        exit();
    }



 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}



// combine both results

  

 $sql = "select input_part_demand_view.*,creditors.creditor_name as godown_name, department.dep_name, dep_section.sec_name from input_part_demand_view 
left join creditors on creditors.creditor_id <=> input_part_demand_view.godown 
left join department on input_part_demand_view.dep <=> department.dep_id
left join dep_section on input_part_demand_view.sec <=> dep_section.dep_sec_id 
where $part_query and $process_query";
 


// echo "sql: " . $sql . "<br>";


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


