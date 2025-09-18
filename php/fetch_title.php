<?php
include 'db_head.php';

try {
    $result = $conn->query("SELECT * FROM prs_title");

    if ($result->num_rows > 0) {
        $titles = [];
        while($row = $result->fetch_assoc()) {
            $titles[] = $row;
        }

        header('Content-Type: application/json');
        echo json_encode($titles);
    } else {
        echo json_encode([]);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
