<?php
 include 'db_head.php';

 $emp_id =  isset($_GET['emp_id']) ? test_input($_GET['emp_id']) : '';
 $godown = isset($_GET['godown']) ? test_input($_GET['godown']) : '';
 $dc_id = isset($_GET['dc_id']) ? test_input($_GET['dc_id']) : '';
 $dc_status = isset($_GET['dc_status']) ? test_input($_GET['dc_status']) : 'all';

 $emp_query = 1;
 $godown_query = 1;
 $dc_query = 1;
 $status_query = 1;

 if( $emp_id > 0)
  {
$emp_query = "emp_id = $emp_id";
  }
  if( $godown > 0)
  {
    $godown_query = "godown = $godown";
  }
    if( $dc_id > 0)
    {
        $dc_query = "dc_id = $dc_id";
    }



    if( $dc_status != "all")
    {
     
        $status_query = "status = $dc_status";
    }
    


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




 $sql = "select attach_id,godown,dc_id,status,date_time_only(dated) as dated,emp_id,attach_type,concat('storage/dc/',godown,'/',path) as path from dc_attachment where $emp_query and $godown_query and $dc_query and $status_query";


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


