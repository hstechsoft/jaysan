<?php
 include 'db_head.php';


 $part = ($_GET['part']);
 $term = ($_GET['term']);
 $title_id = test_input($_GET['title_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$part  = "%" .  $part ."%";


if($term == 'no')
$sql = "SELECT
    part_name,
    part_no,
    part_id
FROM
    `parts_tbl`
WHERE
    part_no LIKE '$part'  AND parts_tbl.part_id IN(
    SELECT
        parts_tbl.part_id
    FROM
        parts_tbl
    WHERE
        parts_tbl.part_id IN(
        SELECT DISTINCT
            (part_assign_tbl.part_id)
        FROM
            part_assign_tbl
        WHERE
            part_assign_tbl.multiple = 0 AND part_assign_tbl.title_id = $title_id AND part_assign_tbl.part_id NOT IN(
            SELECT
                process_tbl.output_part
            FROM
                process_tbl
        )
    )
UNION ALL
SELECT
    parts_tbl.part_id
FROM
    parts_tbl
WHERE
    parts_tbl.part_id IN(
    SELECT DISTINCT
        (part_assign_tbl.part_id)
    FROM
        part_assign_tbl
    WHERE
        part_assign_tbl.multiple = 1 AND part_assign_tbl.title_id = $title_id
)
)";
// $sql = "SELECT part_name,part_no,part_id FROM `parts_tbl` WHERE part_no LIKE  '$part'";
else 
$sql = "SELECT
    part_name,
    part_no,
    part_id
FROM
    `parts_tbl`
WHERE
    part_name LIKE '$part'  AND parts_tbl.part_id IN(
    SELECT
        parts_tbl.part_id
    FROM
        parts_tbl
    WHERE
        parts_tbl.part_id IN(
        SELECT DISTINCT
            (part_assign_tbl.part_id)
        FROM
            part_assign_tbl
        WHERE
            part_assign_tbl.multiple = 0 AND part_assign_tbl.title_id = $title_id AND part_assign_tbl.part_id NOT IN(
            SELECT
                process_tbl.output_part
            FROM
                process_tbl
        )
    )
UNION ALL
SELECT
    parts_tbl.part_id
FROM
    parts_tbl
WHERE
    parts_tbl.part_id IN(
    SELECT DISTINCT
        (part_assign_tbl.part_id)
    FROM
        part_assign_tbl
    WHERE
        part_assign_tbl.multiple = 1 AND part_assign_tbl.title_id = $title_id
)
)";
// $sql = "SELECT part_name,part_no,part_id FROM parts_tbl WHERE part_name LIKE  '$part'";

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


