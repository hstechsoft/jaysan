<?php
include 'db_head.php';  // Ensure the database connection is established


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data array from the AJAX request
    $data = $_POST['part_array'];
    $part_id = $_POST['part'];
    $update_p = $_POST['update'];
 if( $update_p == "Update")
 {
  $sql_part_delete = "DELETE FROM part_assign_tbl WHERE part_id =  $part_id ";
  
  if ($conn->query($sql_part_delete) === TRUE) {
  

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql_rule_delete = "DELETE FROM part_rule WHERE part_id =  $part_id ";
  
  if ($conn->query($sql_rule_delete) === TRUE) {
  

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

 }

    $data_rule = $_POST['rule_array'] ?? [];
    // Example processing: loop through the array and print names and ages
    foreach ($data as $part) {
       
        $title =  $part['title_id'];
        $multiple =  $part['multiple'];
        $rule =  $part['rule'];
        $sql = "INSERT INTO part_assign_tbl ( part_id, title_id, need_rule,multiple) VALUES ('$part_id','$title', '$rule','$multiple');";
  
  if ($conn->query($sql) === TRUE) {
    
   



  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
    }


    for($count = count($data_rule)-1;$count>=1;$count--)
    {



    foreach ($data_rule[$count]  as  $val) {
       
     
        foreach ($data_rule[$count-1]  as  $pre) {
           

            $sql = "INSERT INTO part_rule ( part_id, title_id, pre_title_id,col_no) VALUES ('$part_id','$val', '$pre','$count');";
  
            if ($conn->query($sql) === TRUE) {
              
             
          
          
          
            } else {
              echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
     
    }
    }
    echo "done";
}
$conn->close();
?>
