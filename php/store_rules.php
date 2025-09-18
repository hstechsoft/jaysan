<?php
include 'db_head.php';  // Ensure the database connection is established


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data array from the AJAX request
    $data = $_POST['rule_array'];
    $part_id = $_POST['part'];
    // foreach ($data  as $index => $rule) {
       
     
    //     echo $index;
    //   echo $data[$index];
    // }
  
    for($count = count($data)-1;$count>=1;$count--)
    {



    foreach ($data[$count]  as  $pre) {
       
     
        foreach ($data[$count-1]  as  $val) {
           

            $sql = "INSERT INTO part_rule ( part_id, title_id, pre_title_id) VALUES ('$part_id','$val', '$pre');";
  
            if ($conn->query($sql) === TRUE) {
              
             
          
          
          
            } else {
              echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
     
    }
    }
}


$conn->close();
?>
