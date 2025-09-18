<?php
include 'db_head.php';  // Include your database connection

// Retrieve form data
$part_id = isset($_POST['partId']) ? $_POST['partId'] : 0;
$part_name = isset($_POST['partName']) ? $_POST['partName'] : '';
$part_no = isset($_POST['partNo']) ? $_POST['partNo'] : '';
$selectTitle = isset($_POST['selectTitle']) ? $_POST['selectTitle'] : array();
$needRule = isset($_POST['needRule']) ? $_POST['needRule'] : array();
$ruleList = isset($_POST['ruleList']) ? json_decode($_POST['ruleList'], true) : array();

if ($part_id > 0 && !empty($part_name) && !empty($part_no)) {
    // Update the part information in parts_tbl
    $query = "UPDATE parts_tbl SET part_name = ?, part_no = ? WHERE part_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssi', $part_name, $part_no, $part_id);
    $stmt->execute();

    // Clear existing part assignments in part_assign_tbl for this part_id
    $query = "DELETE FROM part_assign_tbl WHERE part_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $part_id);
    $stmt->execute();

    // Insert updated part assignments into part_assign_tbl
    foreach ($selectTitle as $prs_id) {
        $need_rule = in_array($prs_id, $needRule) ? 1 : 0;
        $query = "INSERT INTO part_assign_tbl (part_id, title_id, need_rule) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('iii', $part_id, $prs_id, $need_rule);
        $stmt->execute();
    }

    // Clear existing rules in parts_rule for this part_id
    $query = "DELETE FROM part_rule WHERE part_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $part_id);
    $stmt->execute();

    // Insert updated rules into parts_rule
    foreach ($ruleList as $rule) {
        $title_id = isset($rule['title_id']) ? $rule['title_id'] : null;
        $pre_title_id = isset($rule['pre_title_id']) ? $rule['pre_title_id'] : null;

        if ($title_id !== null && $pre_title_id !== null) {
            $query = "INSERT INTO part_rule (part_id, title_id, pre_title_id) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('iii', $part_id, $title_id, $pre_title_id);
            $stmt->execute();
        }
    }

    // If everything is successful, return a success message
    echo json_encode(['status' => 'success', 'message' => 'Part updated successfully']);
} else {
    // If there was an issue with the form data, return an error
    echo json_encode(['status' => 'error', 'message' => 'Invalid part data or missing fields']);
}

$conn->close();
?>
