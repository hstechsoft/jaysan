<?php
include 'db_head.php';  // Include your database connection

$part_id = $_GET['part_id'];

$response = [];

// Fetch the part details
$partQuery = "SELECT part_name, part_no FROM parts_tbl WHERE part_id = ?";
$stmt = $conn->prepare($partQuery);
$stmt->bind_param('i', $part_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $response = $result->fetch_assoc();
    $response['part_id'] = $part_id;
} else {
    echo json_encode(['error' => 'Part not found']);
    exit;
}

// Fetch the titles associated with the part
$titleQuery = "
    SELECT t.prs_id, t.prs_name, 
           (SELECT COUNT(*) FROM part_assign_tbl WHERE part_id = ? AND title_id = t.prs_id) as selected,
           (SELECT COUNT(*) FROM part_assign_tbl WHERE part_id = ? AND title_id = t.prs_id AND need_rule = 1) as need_rule
    FROM prs_title t
";
$stmt = $conn->prepare($titleQuery);
$stmt->bind_param('ii', $part_id, $part_id);
$stmt->execute();
$result = $stmt->get_result();

$response['titles'] = [];
while ($row = $result->fetch_assoc()) {
    $response['titles'][] = [
        'id' => $row['prs_id'],
        'name' => $row['prs_name'],
        'selected' => $row['selected'] > 0,
        'need_rule' => $row['need_rule'] > 0
    ];
}

// Fetch the rules associated with the part
$ruleQuery = "SELECT title_id, pre_title_id, (SELECT prs_name FROM prs_title WHERE prs_id = title_id) as title_name FROM part_rule WHERE part_id = ?";
$stmt = $conn->prepare($ruleQuery);
$stmt->bind_param('i', $part_id);
$stmt->execute();
$result = $stmt->get_result();

$response['rules'] = [];
while ($row = $result->fetch_assoc()) {
    $response['rules'][] = [
        'title_id' => $row['title_id'],
        'pre_title_id' => $row['pre_title_id'],
        'title_name' => $row['title_name']
    ];
}

echo json_encode($response);

$conn->close();
?>
