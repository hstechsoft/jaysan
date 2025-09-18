<?php
 include 'db_head.php';




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT
    gar.product_id,
    jaysan_final_product.product_name,
    GROUP_CONCAT(concat('<tr>', gar.model_type,'</tr>') SEPARATOR '') AS model
FROM
    (
    SELECT
        CONCAT(
         
   '<td>',jaysan_product_model.model_name , '</td>',
concat('<td><ol class=\"list-group \" style=\"max-height: 45vh; overflow-y: auto;\">',
            GROUP_CONCAT(
                concat(
           ' <li class=\"list-group-item d-flex justify-content-between align-items-center\"> <p class=\"p-0 m-0 \">',jaysan_model_type.type_name,' ( Count - ', (select count(mtid) from jaysan_model_subtype where jaysan_model_subtype.mtid = jaysan_model_type.mtid) ,')','</p> <div> <button name = \"edit\" value = \"',jaysan_model_type.mtid,'\" class=\"btn btn-outline-secondary border-0\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button> <button name = \"delete\"  value = \"',jaysan_model_type.mtid,'\"  class=\"btn btn-outline-danger border-0\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button> </div> </li>') SEPARATOR '') , '</ol></td>'
           
          )
        ) AS model_type,
        jaysan_product_model.product_id
    FROM
        jaysan_model_type
    INNER JOIN jaysan_product_model ON jaysan_model_type.pid = jaysan_product_model.model_id
    GROUP BY
        jaysan_model_type.pid
) AS gar
INNER JOIN jaysan_final_product ON gar.product_id = jaysan_final_product.product_id
GROUP BY
    gar.product_id;";

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


