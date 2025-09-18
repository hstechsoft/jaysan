<?php
include 'db_head.php';

$id = intval($_GET['id']);

$stmt = $conn->prepare("DELETE FROM prs_title WHERE prs_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(['success' => true]);
