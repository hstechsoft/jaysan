<?php
 include 'db_head.php';
$shift = test_input($_GET['shift']);
$machine_id = test_input($_GET['machine_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "WITH
    job_card_details AS(
    SELECT
        laser_job_card.machine_id,
         laser_job_card.job_card_id,
        laser_job_card.shift,
        laser_job_card.assign_date,
        laser_job_card.assigned_by,
        laser_job_card.nesting_id,
        jaysan_machine.machine_name,
        employee.emp_name as job_card_assigned_by
    FROM
        laser_job_card
        
        inner join jaysan_machine on laser_job_card.machine_id = jaysan_machine.jmid
        inner join employee on laser_job_card.assigned_by = employee.emp_id WHERE laser_job_card.machine_id = $machine_id and laser_job_card.shift = '$shift' and laser_job_card.status = 'created' ORDER by laser_job_card.job_card_id ASC LIMIT 1
)
SELECT
 machine_id,
         job_card_id,
       shift,
       assign_date,
        assigned_by,
   
        machine_name,
       job_card_assigned_by,
    nesting_details.created_by,
    employee.emp_name AS created_name,
    nesting_details.path,
    nesting_details.nesting_name,
    nesting_details.material_id,
    parts_tbl.part_name,
    nesting_details.material_qty as total_material_qty,
    nesting_details.run_time,
    nesting_details.product,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'part_id',
            nesting_parts.part_id,
            'part_name',
            nesting_part.part_name,
            'qty',
            nesting_parts.qty
        )
    ) AS nesting_parts_details
FROM
    job_card_details
INNER JOIN nesting_details ON job_card_details.nesting_id = nesting_details.nesting_id
INNER JOIN parts_tbl ON nesting_details.material_id = parts_tbl.part_id
INNER JOIN nesting_parts ON nesting_details.nesting_id = nesting_parts.nesting_id
INNER JOIN parts_tbl nesting_part ON
    nesting_parts.part_id = nesting_part.part_id
INNER JOIN employee ON nesting_details.created_by = employee.emp_id
GROUP by nesting_details.nesting_id

";

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


