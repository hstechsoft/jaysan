<?php
include 'db_head.php';  // Ensure the database connection is established

// Retrieve form data
$partId = $_POST['partId'];  // Use the part_id directly
$selectTitle = $_POST['selectTitle'];
$needRule = isset($_POST['needRule']) ? $_POST['needRule'] : array();
$multiple = isset($_POST['multiple']) ? $_POST['multiple'] : array();
// Ensure ruleList is properly decoded
$ruleList = isset($_POST['ruleList']) ? json_decode($_POST['ruleList'], true) : array();

if (!is_array($ruleList)) {
    $ruleList = array();  // Ensure $ruleList is an array
}

if ($partId) {
    // Insert selected titles into part_assign_tbl
    foreach ($selectTitle as $prs_id) {
        $need_rule = in_array($prs_id, $needRule) ? 1 : 0;
        $query = "INSERT INTO part_assign_tbl (part_id, title_id, need_rule,multiple) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('iiii', $partId, $prs_id, $need_rule, $multiple);
        $stmt->execute();
        $stmt->close();
    }

    // Insert rules into parts_rule
    foreach ($ruleList as $rule) {
        $title_id = isset($rule['title_id']) ? $rule['title_id'] : null;
        $pre_title_id = isset($rule['pre_title_id']) ? $rule['pre_title_id'] : null;
        
        if ($title_id !== null && $pre_title_id !== null) {
            $query = "INSERT INTO part_rule (part_id, title_id, pre_title_id) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('iii', $partId, $title_id, $pre_title_id);
            $stmt->execute();
            $stmt->close();
        }
    }

 
} else {
    echo "Part ID not found.";
}

// Close the database connection
$conn->close();
?>
