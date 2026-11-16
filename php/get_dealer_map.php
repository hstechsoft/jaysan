<?php
 include 'db_head.php';

 $parent_cus_id = test_input($_GET['parent_cus_id']);
$child_cus_id = test_input($_GET['child_cus_id']);

$parent_query =  1;
$child_query = 1;

 if($parent_cus_id > 0) {
    $parent_query = "parent_cus_id = $parent_cus_id";
 }
 if($child_cus_id > 0) {
    $child_query = "child_cus_id = $child_cus_id";
 }
    
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "SELECT dealer_map.*,c.cus_name as child_cus_name, p.cus_name as parent_cus_name FROM dealer_map
 left join customer c on dealer_map.child_cus_id = c.cus_id
 left join customer p on dealer_map.parent_cus_id = p.cus_id
  WHERE $parent_query AND $child_query";

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


