<?php
include 'db_head.php';

$opid = test_input($_GET['opid']);
$dated = test_input($_GET['dated']);
$qty = test_input($_GET['qty']);
$ins_date = ($_GET['ins_date']);

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Set time zone first
$conn->query("SET time_zone = '+05:30'");

$ass_id = [];
$emergency_order = [];
$opid_a = [];
$line_no = 0;
$del_id = 0;

for ($i = 0; $i < $qty; $i++) {

  // get the  record of the assign_product table
    $sql = "SELECT ass_id, opid, emergency_order, assign_type, line_no 
            FROM `assign_product` 
            WHERE assign_type = 'Production' 
            AND opid = $opid 
            AND dated = '$dated' 
            LIMIT 1";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $r = $result->fetch_assoc();
        $ass_id[] = $r["ass_id"]; // Append to array
        $emergency_order[] = $r["emergency_order"];
        $opid_a[] = $r["opid"];
       $del_id = $r["ass_id"];
       $line_no =  $r["line_no"];
    } else {
        // echo "0 result<br>";
    }

// delete the record
    $sql_delete =  "DELETE  FROM assign_product WHERE ass_id =   $del_id";

    if ($conn->query($sql_delete) === TRUE) {
    //  echo  $del_id."deleted". "<br>";
     $sql_update = "UPDATE assign_product SET  line_no =  line_no - 1  where line_no >  $line_no and assign_type = 'Production'";


  
     if ($conn->query($sql_update) === TRUE) {
      
     } else {
      //  echo "Error: " . $sql_update . "<br>" . $conn->error;
     }

    } else {
      // echo "Error: " . $sql_delete . "<br>" . $conn->error;
    }
}


for ($i = 0; $i < $qty; $i++) {
   
$last_line_no = 0;
    $get_last_id = "SELECT line_no  FROM `assign_product` WHERE dated >= '$ins_date' and assign_type = 'Production'  ORDER by line_no ASC LIMIT 1";



    $result = $conn->query($get_last_id);
    if ($result && $result->num_rows > 0) {
        $r = $result->fetch_assoc();
        $last_line_no =  $r["line_no"]; // Append to array
        // echo "last_line_no".$r["line_no"]. PHP_EOL;
    } else {
      // echo "no line no";
    }


    if( $last_line_no > 0)
    {
      $sql_update_line = "UPDATE assign_product SET  line_no =  line_no + 1  where line_no >=  $last_line_no and assign_type = 'Production'";


  
      if ($conn->query($sql_update_line) === TRUE) {
       
      } else {
        // echo "Error: " . $sql_update_line . "<br>" . $conn->error;
      }
    }
  

    $get_max_line_no = 0;
if($last_line_no == 0)
{
  $get_max_last_id = "SELECT COALESCE(MAX(line_no), 0) + 1 as max_line_no FROM assign_product";

  $result = $conn->query($get_max_last_id);
  if ($result && $result->num_rows > 0) {
      $r = $result->fetch_assoc();
      $get_max_line_no  =  $r["max_line_no"]; // Append to array
      
  } else {
    // echo "0 max";
  }


  $sql_insert= "INSERT INTO  assign_product  ( ass_id, opid, emergency_order, assign_type, line_no,qty,dated )
    VALUES ($ass_id[$i],$opid_a[$i],$emergency_order[$i],'Production',$get_max_line_no ,'1','$ins_date')";

}
   
     else
     $sql_insert= "INSERT INTO  assign_product  ( ass_id, opid, emergency_order, assign_type, line_no,qty,dated )
    VALUES ($ass_id[$i],$opid_a[$i],$emergency_order[$i],'Production','$last_line_no','1','$ins_date')";
      
       if ($conn->query($sql_insert) === TRUE) {
        // echo  $ass_id[$i]."inserted". "<br>";
       } 
       else {
        //  echo "Error: " . $sql_insert . "<br>" . $conn->error;
       }
}
  
echo "ok";
$conn->close();
?>
