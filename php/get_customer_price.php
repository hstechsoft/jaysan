<?php
include 'db_head.php';

$group_id = isset($_GET['group_id']) ? intval($_GET['group_id']) : 0;
$mtid = isset($_GET['mtid']) ? intval($_GET['mtid']) : 0;

if ($group_id == 0 || $mtid == 0) {
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
}

$sql = "SELECT JSON_OBJECT(
    'subgroups', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'sub_group_id', cus_sub.sub_group_id,
            'sub_group_name', cus_sub.sub_group_name,
            'sgt_price_id', subgroup_type_price.sgt_price_id,
            'max_price', subgroup_type_price.max_price,
            'min_price', subgroup_type_price.min_price,
            'mrp', subgroup_type_price.mrp,
            'mtid', $mtid 
        ))
        FROM customer_subgroup_master cus_sub
        LEFT JOIN subgroup_type_price ON cus_sub.sub_group_id = subgroup_type_price.sub_group_id 
            AND subgroup_type_price.mtid = $mtid 
        WHERE cus_sub.group_id = $group_id
    ),
    'group_price', (
        SELECT JSON_OBJECT(
            'gtp_id', gtp.gtp_id,
            'max_price', gtp.max_price,
            'min_price', gtp.min_price,
            'mrp', gtp.mrp
        )
        FROM group_type_price gtp 
        WHERE gtp.group_id = $group_id AND gtp.mtid = $mtid
        LIMIT 1
    ),
    'group_subtypes', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'msid', sub.msid,
            'mtid', sub.mtid,
            'subtype_name', sub.subtype_name,
            'main_price', sub.price,
            'is_reduce', sub.is_reduce,
            'gsp_id', gstp.gsp_id,
            'price', gstp.price,
            'group_id', gstp.group_id,
            'group_name', (SELECT gmas.group_name FROM customer_group_master gmas WHERE gmas.group_id = gstp.group_id)
        ))
        FROM jaysan_model_subtype sub 
        LEFT JOIN group_subtype_price gstp ON sub.msid = gstp.msid AND gstp.group_id = $group_id  
        WHERE sub.mtid = $mtid
    ),
    'subgroup_subtypes', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'msid', sub.msid,
            'subtype_name', sub.subtype_name,
            'main_price', sub.price,
            'price', sstp.price,
            'sgst_id', sstp.sgst_id,
            'sub_group_id', sstp.sub_group_id,
            'sub_group_name', (SELECT sub_mas.sub_group_name FROM customer_subgroup_master sub_mas WHERE sub_mas.sub_group_id = sstp.sub_group_id)
        ))
        FROM jaysan_model_subtype sub 
        LEFT JOIN subgroup_subtype_price sstp ON sub.msid = sstp.msid AND sstp.sub_group_id IN(
            SELECT cus_sub.sub_group_id FROM customer_subgroup_master cus_sub WHERE cus_sub.group_id = $group_id
        ) 
        WHERE sub.mtid = $mtid
    )
) as json_data";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row['json_data'];
} else {
    echo json_encode(['error' => 'No results found']);
}

$conn->close();
?>
