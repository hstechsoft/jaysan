<?php
 include 'db_head.php';

 $mtid = test_input($_GET['mtid']);
 $subgroup_id = test_input($_GET['subgroup_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


// $sql = "SELECT
//     subtype_group_id,
//     subgroup_type_price.min_price as w,
//     IFNULL(group_type_price.max_price, 0) AS max_price,
//     IFNULL(group_type_price.min_price, 0) AS min_price,
//     IFNULL(group_type_price.mrp, 0) AS mrp,
//     (
//     SELECT
//         dep_section.sec_name
//     FROM
//         dep_section
//     WHERE
//         dep_section.dep_sec_id = subtype_group_id
// ) AS sec_name,
// JSON_ARRAYAGG(
//     JSON_OBJECT(
//         'msid',
//         jaysan_model_subtype.msid,
//         'subtype_name',
//         subtype_name,
//         'is_default',
//         is_default,
//         'is_reduce',
//         is_reduce,
//         'max_price',
//         IFNULL(group_type_price.max_price, 0),
//         'min_price',
//         IFNULL(group_type_price.min_price, 0),
//         'mrp',
//         IFNULL(group_type_price.mrp, 0),
//         'price',
//         IFNULL(subgroup_subtype_price.price, 0),
//         'discount',
//         IFNULL(
//             subgroup_subtype_price.discount,
//             0
//         )
//     )
// ) AS price_details
// FROM
//     jaysan_model_subtype
// LEFT JOIN group_type_price ON jaysan_model_subtype.mtid = group_type_price.mtid AND group_type_price.group_id =(
//     SELECT
//         group_id
//     FROM
//         customer_subgroup_master
//     WHERE
//         sub_group_id = $subgroup_id
// )
// LEFT JOIN subgroup_subtype_price ON jaysan_model_subtype.msid = subgroup_subtype_price.msid AND subgroup_subtype_price.sub_group_id = $subgroup_id
// WHERE
//     jaysan_model_subtype.mtid = $mtid
// GROUP BY
//     subtype_group_id
// ORDER BY
//     subtype_group_id
// DESC";


$sql = <<<SQL
SELECT 
    st.msid,
    st.is_default,
    st.is_reduce,
    st.subtype_name,
    sp.discount,
    sp.price,
    stp.mrp,
    stp.min_price,
    stp.max_price
FROM jaysan_model_subtype st
LEFT JOIN subgroup_subtype_price sp ON st.msid = sp.msid AND sp.sub_group_id = $subgroup_id
LEFT JOIN subgroup_type_price stp ON st.mtid = stp.mtid AND stp.sub_group_id = $subgroup_id
WHERE st.mtid = $mtid;
SQL;

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


