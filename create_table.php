<?php
 include 'db_head.php';



$sql = "CREATE TABLE customer (
lead_att_on text,
lead_source text,
lead_att_by text,
cus_name text,
company_name text,
cus_phone text unique,
location text,
segment text,
followed_by text,
ss_assigned_to text,
appoinment_date double,
status text
)";

if ($conn->query($sql) === TRUE) {
  echo "Table customer created successfully";  
  echo "</br>";
} else {
  echo "Error creating table: " . $conn->error;
}



$sql = "CREATE TABLE mcall (
    cus_phone text,
    his_date double,
    user_id text,
    last_att double,
    call_status text
    )";
   
    if ($conn->query($sql) === TRUE) {
      echo "Table mcall created successfully";
      echo "</br>";
    } else {
      echo "Error creating table: " . $conn->error;
    }

    $sql = "CREATE TABLE call_history (
        cus_phone text,
       remark text,
       hdate double
        )";
       
        if ($conn->query($sql) === TRUE) {
          echo "Table call_history created successfully";
          echo "</br>";
        } else {
          echo "Error creating table: " . $conn->error;
        }
   
        $sql = "CREATE TABLE user_info (
            user_id text,
            user_name text
            )";
           
            if ($conn->query($sql) === TRUE) {
              echo "Table user_info created successfully";
              echo "</br>";
            } else {
              echo "Error creating table: " . $conn->error;
            }  

$conn->close();
?>
