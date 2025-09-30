<?php
 include 'db_head.php';




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = <<<SQL
SELECT
    assign_product.opid,
    sales_order_product.sub_type,
acc
    (
        assign_product.opid,
        acc_item(
            assign_product.opid,
            assign_product.opid,
            assign_product.opid,
            ul(
                "",
                CONCAT(
                    GROUP_CONCAT(
                        li(
                            div_fun("d-flex justify-content-between",
                                CONCAT(
                                    p("", sales_order_product.sub_type),
                                      p("", date_only(assign_product.dated)),
                                    button(
                                        assign_product.opid,
                                        "<i class=\" fa-solid fa-trash \"></i>",
                                        ""
                                    )
                                )
                            )
                        ) SEPARATOR ""
                    )
                )
            )
        )
    ) AS final

FROM
    assign_product
INNER JOIN sales_order_product ON assign_product.opid = sales_order_product.opid
GROUP BY
    opid limit 10
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


