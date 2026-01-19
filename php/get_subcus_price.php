<?php
include 'db_head.php';

$subgroup_id = isset($_GET['subgroup_id']) ? intval($_GET['subgroup_id']) : 0;
$mtid = isset($_GET['mtid']) ? intval($_GET['mtid']) : 0;

if ($subgroup_id == 0 || $mtid == 0) {
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
}

// $sql = "SELECT 
//     JSON_OBJECT(
//         'subgroup_type_price', (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'sub_group_id', sub_group_id,
//                     'mtid', mtid,
//                      'min_price', min_price,
//                     'max_price', max_price,
//                     'mrp', mrp
//                 )
//             )
//             FROM subgroup_type_price 
//             WHERE sub_group_id = $subgroup_id AND mtid = $mtid
//         ),
//         'model_subtypes', (
//             SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'msid', msid,
//                     'subtype_name', subtype_name,
//                     'is_reduce', is_reduce,
//                     'sub_price', (
//                         SELECT price 
//                         FROM subgroup_subtype_price 
//                         WHERE subgroup_subtype_price.msid = jaysan_model_subtype.msid 
//                         AND subgroup_subtype_price.sub_group_id = $subgroup_id
//                     ),
//                     'discount', (
//                         SELECT discount 
//                         FROM subgroup_subtype_price 
//                         WHERE subgroup_subtype_price.msid = jaysan_model_subtype.msid 
//                         AND subgroup_subtype_price.sub_group_id = $subgroup_id
//                     ),
//                        'sub_price_final', (
//                         SELECT (price-discount) as price 
//                         FROM subgroup_subtype_price 
//                         WHERE subgroup_subtype_price.msid = jaysan_model_subtype.msid 
//                         AND subgroup_subtype_price.sub_group_id = $subgroup_id
//                     )
//                 )
//             )
//             FROM jaysan_model_subtype 
//             WHERE mtid = $mtid
//         )
//     ) as json_data;";

$sql = "SELECT jaysan_model_subtype.msid,jaysan_model_subtype.subtype_name,jaysan_model_subtype.is_reduce,jaysan_model_subtype.is_default,subgroup_subtype_price.discount,subgroup_subtype_price.price,subgroup_type_price.mrp,subgroup_type_price.max_price,subgroup_type_price.min_price FROM jaysan_model_subtype 
left join subgroup_subtype_price on jaysan_model_subtype.msid = subgroup_subtype_price.msid and subgroup_subtype_price.sub_group_id = $subgroup_id
left join subgroup_type_price on jaysan_model_subtype.mtid = subgroup_type_price.mtid 

 WHERE jaysan_model_subtype.mtid = $mtid GROUP BY msid ";


$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row['json_data'];
} else {
    echo json_encode(['error' => 'No results found']);
}

$conn->close();
?>
