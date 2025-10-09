<?php
 include 'db_head.php';

 $part_id = test_input($_GET['part_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "

SELECT JSON_OBJECT(
    'part_spec', (
        SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'fid',part_custom_spec.fid,
                    'flabel',custom_field_master.flabel,
                    'fvalue',custom_field_master.fvalue,
                    ftype, custom_field_master.ftype
                )
            )
        FROM
            part_custom_spec
        INNER JOIN custom_field_master ON part_custom_spec.fid = custom_field_master.fid
        WHERE
            part_custom_spec.part_id =  $part_id AND custom_field_master.std = 0
      
),
     'custom_spec', (
    SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'fid',part_custom_spec.fid,
                    'flabel',custom_field_master.flabel,
                    'fvalue',custom_field_master.fvalue,
                    ftype, custom_field_master.ftype
                )
            )
    FROM
        part_custom_spec
    INNER JOIN custom_field_master ON part_custom_spec.fid = custom_field_master.fid
    WHERE
        part_custom_spec.part_id !=  $part_id AND custom_field_master.std = 0
    )
    ) AS result;";

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


