<?php
 include 'db_head.php';

 $dcf_id = test_input($_GET['dcf_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = <<<SQL
WITH RECURSIVE

dcf_opid AS (
    SELECT DISTINCT
        ap.opid,
        dcf.dcf_id,
        dcf.dated as dcf_date,
        dcf.invoice_no,
        dcf.delivery_from
    FROM assign_product ap
    INNER JOIN dcf
        ON ap.dcf_id = dcf.dcf_id
    WHERE dcf.dcf_id = $dcf_id and dcf.invoice_no  <> ''
),

sop_details AS (
    SELECT
        dcf_opid.*,
        sop.required_qty,
        sop.price,
        sop.billing_amount,
        sop.oid
    FROM dcf_opid
    INNER JOIN sales_order_product sop
        ON dcf_opid.opid = sop.opid
),

sof_details AS (
    SELECT
        sop_details.*,
        sof.customer_id,
        sof.order_no,
        sof.emp_id,
        sp.product
    FROM sop_details
    INNER JOIN sales_order_form sof
        ON sof.oid = sop_details.oid
    INNER JOIN sales_product sp
        ON sp.opid = sop_details.opid
    WHERE 1
),

/* Customer parent hierarchy */

customer_parent AS (

    SELECT
        sd.customer_id,
        dm.parent_cus_id,
        1 AS parent_level,

        CAST(
            CONCAT(',', sd.customer_id, ',', dm.parent_cus_id, ',')
            AS CHAR(2000)
        ) AS path

    FROM (
        SELECT DISTINCT customer_id
        FROM sof_details
    ) sd

    INNER JOIN dealer_map dm
        ON dm.child_cus_id = sd.customer_id

    UNION ALL

    SELECT
        cp.customer_id,
        dm.parent_cus_id,
        cp.parent_level + 1,

        CONCAT(cp.path, dm.parent_cus_id, ',')

    FROM customer_parent cp

    INNER JOIN dealer_map dm
        ON dm.child_cus_id = cp.parent_cus_id

    WHERE LOCATE(
        CONCAT(',', dm.parent_cus_id, ','),
        cp.path
    ) = 0
),

/* Parent hierarchy JSON */

parent_agg AS (
    SELECT
        customer_id,

        JSON_ARRAYAGG(
            JSON_OBJECT(
                'parent_cus_id', parent_cus_id,
                'cus_name', customer.cus_name,
                'cus_phone', customer.cus_phone,
                'level', parent_level
            )
        ) AS parent_chain
    
    FROM customer_parent
    left join customer on customer.cus_id = customer_parent.parent_cus_id
    GROUP BY customer_id
),

/* Final sales details */

final AS (
    SELECT
        sd.*,

        cus.cus_name,
        emp.emp_name

    FROM sof_details sd

    INNER JOIN customer cus
        ON cus.cus_id = sd.customer_id

    INNER JOIN employee emp
        ON emp.emp_id = sd.emp_id
)

SELECT
    f.dcf_id,
    f.customer_id,
    f.cus_name,
    f.invoice_no,
    f.dcf_date,
    f.delivery_from,
    g.godown_name as delivery_from_name,

    /* Separate parent hierarchy JSON */
    COALESCE(
        MAX(pa.parent_chain),
        JSON_ARRAY()
    ) AS parent_chain,
/* Sales order JSON */
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'opid', f.opid,
            'required_qty', f.required_qty,
            'order_no', f.order_no,
            'product', f.product,
            'price', f.price,
            'billing_amount', f.billing_amount,
            'delivery_from', f.delivery_from,
            'delivery_from_name',  g.godown_name,
            'emp', f.emp_name
        )
    ) AS sale_order

FROM final f
LEFT JOIN godown g
    ON g.gid = f.delivery_from

LEFT JOIN parent_agg pa
    ON pa.customer_id = f.customer_id

GROUP BY
    f.dcf_id,
    f.customer_id,
    f.cus_name
SQL;



//  $sql = "SELECT  dcf1.dcf_id,dcf1.dated,dcf1.consignee,dcf1.sts,DATE_FORMAT(dcf1.dated, '%d-%m-%Y') as dated,employee.emp_name FROM dcf dcf1 INNER join employee on dcf1.dcf_by = employee.emp_id WHERE 1 ORDER by dcf_by ";

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




