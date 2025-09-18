<?php
include 'db_head.php';

$part_id = isset($_GET['part_id']) ? intval($_GET['part_id']) : 0;
$emp_id = isset($_GET['emp_id']) ? intval($_GET['emp_id']) : 0;

if ($part_id == 0 || $emp_id == 0) {
   
    echo json_encode([]);
    exit;
}

$sql = "
WITH RECURSIVE process_chain AS (
    SELECT
        pw.process,
        pw.previous_process_id
    FROM process_wel_tbl pw
    WHERE pw.output_part = $part_id

    UNION ALL

    SELECT
        pw2.process,
        pw2.previous_process_id
    FROM process_wel_tbl pw2
    INNER JOIN process_chain pc ON pw2.process_id = pc.previous_process_id
)
SELECT 
    pc.process AS process_id,
    jp.process_name,
    ep.machine_id
FROM process_chain pc
INNER JOIN jaysan_process jp ON pc.process = jp.process_id
INNER JOIN employee_process ep ON pc.process = ep.process_id 
where ep.emp_id = $emp_id

";

$res = $conn->query($sql);

$results = [];
while ($row = $res->fetch_assoc()) {
    $results[] = [
        'process_id' => $row['process_id'],
        'process_name' => $row['process_name'],
        'machine_id' => $row['machine_id']
    ];
}

echo json_encode($results);
?>
