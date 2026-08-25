<?php
 include 'db_head.php';

$nes_master_id = test_input($_GET['nes_master_id']);
$part_id = test_input($_GET['part_id']);
$qty = test_input($_GET['qty']);
$weight = test_input($_GET['weight']);



 

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// insert parts


      $sql_insert_parts = "INSERT INTO nesting_parts (nesting_id, part_id, qty, weight) VALUES ($nes_master_id, $part_id, $qty, $weight)";
      if ($conn->query($sql_insert_parts) === TRUE) {
        echo "ok";
      } else {
        echo "Error: " . $sql_insert_parts . "<br>" . $conn->error;
      }
// get material_id from nesting_master where nes_master_id = $nes_master_id
      $material_id = 0;
      $get_material_id_sql = "SELECT material_id FROM nesting_master WHERE nes_master_id = $nes_master_id";
      $result_get_material_id = $conn->query($get_material_id_sql);
      if ($result_get_material_id->num_rows > 0) {
          $row = $result_get_material_id->fetch_assoc();
          $material_id = $row['material_id'];
      }

      // create process_wel_tbl 
      // get process_id from process_wel_tbl where process_title = 'laser cutting' and output_part = $part_id
      $process_id = 0;
      $sql_get_process_id = "SELECT process_wel_tbl.process_id FROM process_wel_tbl 
      inner join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
      WHERE process_title = 'laser cutting' AND output_part = $part_id AND process_name = 'laser cutting'";
      $result_get_process_id = $conn->query($sql_get_process_id);
      if ($result_get_process_id->num_rows > 0) {
          $row = $result_get_process_id->fetch_assoc();
          $process_id = $row['process_id'];
      }

      if($process_id == 0){

// get bom from bom_tbl where output_part_id = $part_id and process_id = 1
$bom_id = 0;
        $sql_get_bom = "SELECT bom_id FROM bom_output WHERE part_id = $part_id AND component_cat = 'laser cutting'";
        $result_get_bom = $conn->query($sql_get_bom);
        if ($result_get_bom->num_rows > 0) {
            $bom_id = $result_get_bom->fetch_assoc()['bom_id'];
        }
// if bom_id =0 insert new record in bom_output with part_id = $part_id and component_cat = 'laser cutting' and process_id = 1
        if($bom_id == 0){
          
            $sql_insert_bom = "INSERT INTO bom_output (part_id, component_cat) VALUES ($part_id, 'laser cutting')";
            if ($conn->query($sql_insert_bom) === TRUE) {
                $bom_id = $conn->insert_id;
            } else {
                throw new Exception("Error: " . $sql_insert_bom . "<br>" . $conn->error);
            }

            // insert bom_input
            $sql_insert_bom_input = "INSERT INTO bom_input (bom_id, part_id, qty) VALUES ($bom_id, $material_id, $weight)";
            if ($conn->query($sql_insert_bom_input) !== TRUE) {
                throw new Exception("Error: " . $sql_insert_bom_input . "<br>" . $conn->error);
            }
        }

        // get process_id from jaysan_process where process_title = 'laser cutting'
        $sql_get_process_id = "SELECT process_id FROM jaysan_process WHERE process_name = 'laser cutting'";
        $result_get_process_id = $conn->query($sql_get_process_id);
        if ($result_get_process_id->num_rows > 0) {
            $row = $result_get_process_id->fetch_assoc();
            $process = $row['process_id'];
        }

        // insert new record in process_wel_tbl with process_id, output_part = $part_id, process_name = 'laser cutting'
        $sql_insert_process_wel_tbl = "INSERT INTO process_wel_tbl (process, output_part, component_cat, process_title,cat) VALUES ($process, $part_id, 'laser cutting', 'laser cutting','out')";
        if ($conn->query($sql_insert_process_wel_tbl) === TRUE) {
        $new_process_id = $conn->insert_id;
        } else {
          throw new Exception("Error: " . $sql_insert_process_wel_tbl . "<br>" . $conn->error);
        }


        

            $new_process_id_display =$new_process_id;
            include_once 'update_final_process_id.php';
            update_final_id($conn, $new_process_id);

        



        // insert input_wel_parts for new process id
        $insert_input_wel_parts_sql = "insert into input_wel_parts (process_id, input_part_id, qty) values ($new_process_id, $material_id,$weight);";
        if ($conn->query($insert_input_wel_parts_sql) !== TRUE) {
            throw new Exception("Error: " . $insert_input_wel_parts_sql . "<br>" . $conn->error);
        }
   
      }




$conn->close();

 ?>


