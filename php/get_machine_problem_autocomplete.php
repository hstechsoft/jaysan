<?php
include "db_head.php";

$problem = isset($_GET['problem']) ? $_GET['problem'] : '';
$problem = "%" . $problem . "%";

$sql = "SELECT machine_problem FROM review WHERE machine_problem LIKE ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $problem);
$stmt->execute();

$result = $stmt->get_result();

$problems = [];

while ($row = $result->fetch_assoc()) {

    $items = explode(",", $row['machine_problem']);

    foreach ($items as $item) {
        $item = trim($item);

        if ($item != '') {
            $problems[] = $item;
        }
    }
}

$problems = array_values(array_unique($problems));

$output = [];

foreach ($problems as $problem) {
    $output[] = [
        "machine_problem" => $problem
    ];
}

echo json_encode($output);

$stmt->close();
$conn->close();
?>