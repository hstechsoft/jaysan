<?php
include 'db_head.php';

$query = isset($_GET['query']) ? trim($_GET['query']) : '';
$results = [];

if ($query !== '') {
    $query = $conn->real_escape_string($query);

    $sql = "SELECT DISTINCT p.part_id, p.part_name 
            FROM parts_tbl p
            INNER JOIN process_wel_tbl pw ON pw.output_part = p.part_id
            WHERE p.part_name LIKE '%$query%'
            LIMIT 10";

    $res = $conn->query($sql);
    while ($row = $res->fetch_assoc()) {
        $results[] = $row;
    }
}

echo json_encode($results);
?>
