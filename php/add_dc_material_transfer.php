
<?php
 include 'db_head.php';

 $source_godown = test_input($_GET['source_godown']);
 $des_godown = test_input($_GET['des_godown']);
 $current_transport = test_input($_GET['current_transport']);

$dc_parts_location = json_decode($_POST['dc_parts_location'], true);
 
  
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


// get transport_dc_id if already exsists

try {
    $conn->begin_transaction();
 $transport_dc_id = 0;
$sql_get_transport = "SELECT transport_dc_id FROM `transport_dc` WHERE source_godown = $source_godown and des_godown = $des_godown  and (sts = 'create' or sts = 'transport') and current_transport = $current_transport";
 $result_transport= $conn->query($sql_get_transport);
            if ($result_transport->num_rows > 0) {
                $row_transport= $result_transport->fetch_assoc();
                $transport_dc_id = $row_transport['transport_dc_id'];

            }

            if($transport_dc_id == 0)
              {
                     $sql_in_dc = "INSERT INTO transport_dc (source_godown,des_godown,transport_godown,dc_id) VALUES ($source_godown, $des_godown, $current_transport, $dc_id)";
                    // get in_dc_tracking id
                    if ($conn->query($sql_in_dc) === TRUE) {
                        $transport_dc_id = $conn->insert_id;
                    } else {
                        throw new Exception("Error inserting in_dc_tracking: " . $conn->error);
                    }
              }
         
 
}
 catch (Exception $e) {
    echo "Transaction failed: " . $e->getMessage();
    $conn->rollback();
}

$conn->close();


 ?>



2

