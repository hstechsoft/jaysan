<?php
include 'db_head.php';  // Ensure the database connection is established


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data array from the AJAX request

    $data_rule = $_POST['rule_array'] ?? [];
    $role_id = $_POST['role_id'];
    $update_p = $_POST['update'];
 if( $update_p == "Update")
 {
  
  $sql_rule_delete = "DELETE FROM att_approval_chart WHERE role_id =  $role_id ";
  
  if ($conn->query($sql_rule_delete) === TRUE) {
  

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

 }


    // Example processing: loop through the array and print names and ages



    for($count = 0;$count<count($data_rule);$count++)
    {



    foreach ($data_rule[$count]  as  $val) {
       
     {
           

$eag = $count+1;

            $sql = "INSERT INTO att_approval_chart ( role_id, a_role_id, eag) VALUES ('$role_id','$val', '$eag');";
  
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
