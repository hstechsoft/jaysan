<?php
 include 'db_head.php';

 
 $p_uid_p =test_input($_GET['p_uid_p']);
 $p_cur_time_p1 =test_input($_GET['p_cur_time_p1']);
 
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

 $sql = "SELECT *,work.work_date,work.work_status,work.work_id,work.work_description from customer INNER JOIN work ON customer.cus_id = work.cus_id"; 

 //$sql = "SELECT * from customer;

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
   echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

 ?>


