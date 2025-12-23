<?php
include 'db_head.php';

header('Content-Type: application/json');

// Read raw JSON input
$input = json_decode(file_get_contents("php://input"), true);

// Safe read
$phone_id = $input['phone_id'] ?? '';
$version  = $input['version'] ?? '';

// Fetch latest version (only one row needed)
$sql = "SELECT latest_version, force_update, apk_url 
        FROM app_version_control 
        ORDER BY id DESC 
        LIMIT 1";

$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {

    echo json_encode([
        "latest_version" => $row['latest_version'],
        "force_update"   => (int)$row['force_update'],
        "apk_url"        => $row['apk_url'],
        "server_time"    => date('Y-m-d H:i:s')
    ]);

} else {

    echo json_encode([
        "latest_version" => $version,
        "force_update"   => 0,
        "apk_url"        => ""
    ]);
}

$conn->close();
exit;
