<?php
 include 'db_head.php';

 
 $p_uid_p =test_input($_GET['p_uid_p']);
 $p_cur_m =test_input($_GET['p_cur_m']);
 $cst =test_input($_GET['cst']);
 $cet =test_input($_GET['cet']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$result = $conn->query("CALL `get_call_table`($p_uid_p , $p_cur_m,$cst,$cet);");

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 results";
}
$conn->close();

 ?>


