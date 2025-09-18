<?php
include("db_head.php");
date_default_timezone_set("Asia/Kolkata");

$from = $_GET['from'] ?? null;
$to = $_GET['to'] ?? null;

if (!$from || !$to) {
    echo json_encode(["error" => "Missing 'from' or 'to' parameters"]);
    exit;
}

$startMillis = strtotime($from);
$endMillis = strtotime($to);

function getDateRange($startDate, $endDate) {
    $range = [];
    $current = strtotime(date("Y-m-d", strtotime($startDate)));
    $end = strtotime(date("Y-m-d", strtotime($endDate)));
    while ($current <= $end) {
        $range[] = date("Y-m-d", $current);
        $current = strtotime("+1 day", $current);
    }
    return $range;
}

$dates = getDateRange($from, $to);

$sql = "SELECT * FROM extra_time_master 
        WHERE start_time IS NOT NULL AND end_time IS NOT NULL 
        AND start_time <> '' AND end_time <> ''";

$result = $conn->query($sql);
$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        foreach ($dates as $date) {
            $fullStart = strtotime("$date " . date("H:i:s", strtotime($row['start_time'])));
            $fullEnd   = strtotime("$date " . date("H:i:s", strtotime($row['end_time'])));

            if ($fullStart >= $startMillis && $fullEnd <= $endMillis) {
                $data[] = $row;
                break; // Don't add same row twice
            }
        }
    }
}

echo json_encode($data);
?>
