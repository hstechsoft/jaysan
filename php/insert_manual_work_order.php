
<?php
include 'db_head.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

header('Content-Type: text/plain; charset=utf-8');

$plan_name = trim($_POST['plan_name'] ?? '');
$due_date = $_POST['due_date'] ?? '';
$remark = $_POST['remark'] ?? '';
$created_by = (int)($_POST['created_by'] ?? 0);

$part_id = ($_POST['part_id'] ?? '') !== '' ? (int)$_POST['part_id'] : null;

$process_id = ($_POST['process_id'] ?? '') !== '' ? (int)$_POST['process_id'] : null;

$demand_qty = (float)($_POST['qty'] ?? 0);

$godown = (int)($_POST['godown'] ?? 0);
$dep = ($_POST['dep'] ?? '') !== '' ? (int)$_POST['dep'] : null;

$sec = ($_POST['sec'] ?? '') !== '' ? (int)$_POST['sec'] : null;

$work_order_type = 'INTERNAL';

if (
    empty($plan_name) ||
    empty($due_date) ||
    ($part_id === null && $process_id === null) ||
    $demand_qty <= 0 ||
    empty($godown) ||
    empty($created_by)
) {
    die('Required fields are missing.');
}

try {

    $conn->begin_transaction();
 

    $stmt = $conn->prepare(" INSERT INTO production_planner (plan_name, due_date, remark, created_by) VALUES (?, ?, ?, ?) ");

    $stmt->bind_param( "sssi", $plan_name, $due_date, $remark, $created_by );

    $stmt->execute();

    $planner_id = $conn->insert_id;

    $stmt->close();

 

    $stmt = $conn->prepare(" INSERT INTO demand (plan_id, part_id, process_id, demand_qty, created_by) VALUES (?, ?, ?, ?, ?) ");

    $stmt->bind_param( "iiidi", $planner_id, $part_id, $process_id, $demand_qty, $created_by );

    $stmt->execute();

    $demand_id = $conn->insert_id;

    $stmt->close();

 

    $stmt = $conn->prepare(" INSERT INTO work_order (demand_id, godown, dep, sec, qty, created_by, work_order_type, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ");

    $stmt->bind_param( "iiiidiss", $demand_id, $godown, $dep, $sec, $demand_qty, $created_by, $work_order_type, $due_date);

    $stmt->execute();

    $work_order_id = $conn->insert_id;

    $stmt->close();



    $conn->commit();

    echo "ok";
} catch (Throwable $e) {

    $conn->rollback();

    echo "Error: " . $e->getMessage();
}

$conn->close();
?>
