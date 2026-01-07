<?php
include 'db_head.php';

$subgroup_id = isset($_GET['subgroup_id']) ? intval($_GET['subgroup_id']) : 0;
$mtid = isset($_GET['mtid']) ? intval($_GET['mtid']) : 0;

if ($subgroup_id == 0 || $mtid == 0) {
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
}

$sql = "SELECT 
    JSON_OBJECT(
        'subgroup_type_price', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'sub_group_id', sub_group_id,
                    'mtid', mtid
                )
            )
            FROM subgroup_type_price 
            WHERE sub_group_id = $subgroup_id AND mtid = $mtid
        ),
        'model_subtypes', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'msid', msid,
                    'subtype_name', subtype_name,
                    'is_reduce', is_reduce,
                    'sub_price', (
                        SELECT price 
                        FROM subgroup_subtype_price 
                        WHERE subgroup_subtype_price.msid = jaysan_model_subtype.msid 
                        AND subgroup_subtype_price.sub_group_id = 1
                    )
                )
            )
            FROM jaysan_model_subtype 
            WHERE mtid = $mtid
        )
    ) as result;";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row['json_data'];
} else {
    echo json_encode(['error' => 'No results found']);
}

$conn->close();
?>
