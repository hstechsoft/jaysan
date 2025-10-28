<?php
 include 'db_head.php';

 $term = ($_GET['term']);
 $dep_id = ($_GET['dep_id']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$term = "%".$term."%";

 $sql = "SELECT * FROM dep_section WHERE sec_name like  '$term' and dep_id =  '$dep_id'";

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


