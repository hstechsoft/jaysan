<?php
 include 'db_head.php';

 $flabel = test_input($_GET['flabel']);
$fvalue = test_input($_GET['fvalue']);
$ftype = test_input($_GET['ftype']);
$std = test_input($_GET['std']);
$part_id = test_input($_GET['part_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO custom_field_master (flabel,fvalue,ftype,std) VALUES ($flabel,$fvalue,$ftype,$std)";

  if ($conn->query($sql) === TRUE) {
    $last_id = $conn->insert_id;
    $sql_part = "INSERT INTO  part_custom_spec (part_id,fid) VALUES ($part_id,$last_id)";

  if ($conn->query($sql_part) === TRUE) {
  echo "ok";
  }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


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
            part_custom_spec.part_id = 5815 AND custom_field_master.std = 0
      
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
        part_custom_spec.part_id != 5815 AND custom_field_master.std = 0
    )
    ) AS result;



    SELECT JSON_OBJECT(
    'part_spec', (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'part_id', pcs.part_id,
                'fid', pcs.fid,
                'field_name', cfm.field_name,
                'value', pcs.value
            )
        )
        FROM part_custom_spec pcs
        INNER JOIN custom_field_master cfm ON pcs.fid = cfm.fid
        WHERE pcs.part_id = 5815
    ),
    'custom_spec', (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'part_id', pcs.part_id,
                'fid', pcs.fid,
                'field_name', cfm.field_name,
                'value', pcs.value
            )
        )
        FROM part_custom_spec pcs
        INNER JOIN custom_field_master cfm ON pcs.fid = cfm.fid
        WHERE pcs.part_id != 5815
    )
) AS result;
