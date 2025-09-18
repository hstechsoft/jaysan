<?php
 include 'db_head.php';


 $req_id =test_input($_GET['req_id']);
 $sts =test_input($_GET['sts']);
 $admin_id =test_input($_GET['admin_id']);
 $emp_id =test_input($_GET['emp_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "INSERT INTO req_approval ( att_req_id, sts, emp_id, admin_role_id) VALUES ( $req_id, $sts, $admin_id,  (SELECT emp_menu.menu_id FROM emp_menu WHERE emp_menu.role = (SELECT employee.emp_role from employee WHERE employee.emp_id = $admin_id)));";
  
if ($conn->query($sql) === TRUE) {
   
    
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

if($sts == "'declined'")
{
  
$sql_update_decline = "UPDATE att_req set att_req.status = 'declined' WHERE att_req.id =  $req_id";
  
if ($conn->query($sql_update_decline) === TRUE) {
  
 

echo "done";

} else {
  echo "Error: " . $sql_update_decline . "<br>" . $conn->error;
}

}
else if($sts == "'approved'"){
  $sql_update_approved = "UPDATE att_req set att_req.status = 'approved' WHERE  (SELECT if(ifnull(COUNT(*),0)=1,1,0) as count 
FROM att_approval_chart 
WHERE att_approval_chart.role_id = (
    SELECT emp_menu.menu_id 
    FROM employee 
    INNER JOIN emp_menu ON employee.emp_role = emp_menu.role 
    WHERE employee.emp_id = $emp_id
)
AND att_approval_chart.a_role_id NOT IN (
    SELECT req_approval.admin_role_id 
    FROM req_approval) and att_req.id =  $req_id";
  
  if ($conn->query($sql_update_approved) === TRUE) {
    
   
  
  echo "done";
  
  } else {
    echo "Error: " . $sql_update_approved . "<br>" . $conn->error;
  }
  
}


$conn->close();

 ?>


