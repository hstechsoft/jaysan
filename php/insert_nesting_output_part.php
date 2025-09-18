<?php
 include 'db_head.php';

 $nesting_array = ($_GET['nesting_array']);
 $ptype = test_input($_GET['ptype']); 
  $pmodel = test_input($_GET['pmodel']);
  $process_qty = test_input($_GET['process_qty']);
  $group_name = test_input($_GET['group_name']);
  $sample_sts = test_input($_GET['sample_sts']);
  $material_name = test_input($_GET['material_name']);
  $material_type = test_input($_GET['material_type']);
  $material_length = test_input($_GET['material_length']);
  $material_width = test_input($_GET['material_width']);
  $material_thickness = test_input($_GET['material_thickness']);
  $material_weight = test_input($_GET['material_weight']);
  $material_innerdia = test_input($_GET['material_innerdia']);
  $material_outterdia = test_input($_GET['material_outterdia']);
  $material_dia = test_input($_GET['material_dia']);
  $nesting_name = test_input($_GET['nesting_name']);
  $attachment = test_input($_GET['attachment']);
  $material_qty = test_input($_GET['material_qty']);
  $machine_id = test_input($_GET['machine_id']);
  $run_time = test_input($_GET['run_time']);
  $buffer_time = test_input($_GET['buffer_time']);
  $created_by = test_input($_GET['created_by']);
  $pgid = test_input($_GET['pgid']);





 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$rmid = 0;
$sql_insert_rm = "INSERT INTO jaysan_raw_material ( material_name, material_type, material_length, material_width, material_thickness, material_innerdia, material_outterdia, material_dia, material_weight) VALUES ( $material_name, $material_type, $material_length, $material_width, $material_thickness, $material_innerdia, $material_outterdia, $material_dia, $material_weight)";

  if ($conn->query($sql_insert_rm) === TRUE) {
       $rmid = $conn->insert_id;
  } else {
    echo "Error: " . $sql_insert_rm . "<br>" . $conn->error;
  }
$nsid =0;

$sql_insert_nesting = "INSERT INTO nesting_details (nesting_name, material_qty, machine_id, run_time, buffer_time, attachment, rmid, pgid, created_by) VALUES ($nesting_name, $material_qty, $machine_id, $run_time, $buffer_time, $attachment, $rmid, $pgid, $created_by)";

  if ($conn->query($sql_insert_nesting) === TRUE) {
 $nsid= $conn->insert_id;;
  } else {
    echo "Error: " . $sql_insert_nesting . "<br>" . $conn->error;
  }


foreach ($nesting_array as $nesting) {
       
      
        $part_id =  $nesting['part_id'];
        $qty =  $nesting['qty'];
        $rack =  $nesting['rack'];
        $bin =  $nesting['bin'];
       

 $sql = "INSERT INTO nesting_output_part ( nsid,part_id,qty,rack,bin) VALUES ($nsid,$part_id,$qty,$rack,$bin)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

//  $sql = "INSERT INTO nesting_output_part ( nsid,part_id,qty,rack,bin) VALUES ($nsid,$part_id,$qty,$rack,$bin)";

//   if ($conn->query($sql) === TRUE) {
//    echo "ok";
//   } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
//   }
$conn->close();

 ?>


