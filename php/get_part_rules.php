<?php
 include 'db_head.php';


 $part = test_input($_GET['part_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}






$sql = "SELECT GROUP_CONCAT('<li class=\"list-group-item d-flex justify-content-between align-items-center\" data-id =',title_id,'> <span class=\"d-flex align-items-center flex-grow-1\">',prs_name, '</span> <button type=\"button\" class=\"btn btn-outline-danger border-0\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button></li>' SEPARATOR  '\n')as rules  from (SELECT DISTINCT(title_id),col_no,prs_title.prs_name FROM part_rule INNER JOIN prs_title on title_id = prs_title.prs_id WHERE part_id= $part UNION all SELECT DISTINCT(pre_title_id) as title_id,0,prs_title.prs_name FROM part_rule INNER JOIN prs_title on pre_title_id = prs_title.prs_id WHERE part_id= $part and col_no=1) as cr GROUP by col_no ORDER by col_no ";

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


