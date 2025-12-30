CREATE or REPLACE view sales_order_sts_view as (SELECT oid,sum(details.tot_ass_qty) as tot_ass_qty,details.opid, concat('<div>',GROUP_CONCAT(details.detail SEPARATOR ''),'</div>') as sts from(SELECT
    oid,SUM(pr.ass_qty) AS tot_ass_qty,
     CONCAT(
        '<div class="card small m-0 p-0">',
            '<div class="card-header text-bg-warning m-0 p-0 p-1">',
                '<h6 class="small my-auto"> Production - ', SUM(pr.ass_qty), '</h6>',
            '</div>',
            '<div class="card-body small m-0 p-0">',
                '<ul class="list-group ">',
                CAST(GROUP_CONCAT(CONCAT('<li class="list-group-item">', pr.det, '</li>') SEPARATOR '') AS CHAR)
,
                '</ul>',
            '</div>',
        '</div>'
    ) AS detail,
    pr.opid,
    'Production' AS AT
FROM
    (
    SELECT
        CONCAT(ap.dated, ' - ', SUM(ap.qty)) AS det,sop.oid,
        SUM(ap.qty) AS ass_qty,
        sop.opid
    FROM
        sales_order_product sop
    INNER JOIN assign_product ap ON
        sop.opid = ap.opid
    WHERE
        ap.assign_type = 'Production'
    GROUP BY
        sop.opid,
        ap.dated
) AS pr
GROUP BY
    pr.opid
   
    UNION ALL
   
   
SELECT
    oid,SUM(pr.ass_qty) AS tot_ass_qty,
     CONCAT(
        '<div class="card small m-0 p-0">',
            '<div class="card-header small m-0 p-0 p-1 text-bg-secondary">',
                '<h6 class="small my-auto"> Finshed - ', SUM(pr.ass_qty), '</h6>',
            '</div>',
            '<div class="card-body small m-0 p-0">',
                '<ul class="list-group ">',
                CAST(GROUP_CONCAT(CONCAT('<li class="list-group-item">', pr.det, '</li>') SEPARATOR '') AS CHAR)
,
                '</ul>',
            '</div>',
        '</div>'
    ) AS detail,
    pr.opid,
    'Finshed' AS AT
FROM
    (
    SELECT
        sop.oid,CONCAT((SELECT concat(godown.godown_name ,'(',godown.place,')' ) from godown WHERE godown.gid = ap.godown), ' - ', SUM(ap.qty)) AS det,
        SUM(ap.qty) AS ass_qty,
        sop.opid
    FROM
        sales_order_product sop
    INNER JOIN assign_product ap ON
        sop.opid = ap.opid
    WHERE
        ap.assign_type = 'Finshed'
    GROUP BY
        sop.opid,
        ap.godown
) AS pr
GROUP BY
    pr.opid

    
   
    UNION ALL
    SELECT oid,ua.tot_ass_qty,ua.detail,ua.opid,'Unassigned' as AT from(SELECT oid, (sales_order_product.required_qty - sum(assign_product.qty)) as tot_ass_qty,CONCAT(
        '<div class="card small m-0 p-0">',
            '<div class="card-header small m-0 p-0 p-1 text-bg-danger">',
                '<h6 class="small my-auto"> Unassigned - ', sales_order_product.required_qty - sum(assign_product.qty), '</h6>',
            '</div>',
         
        '</div>'
    ) AS detail,sales_order_product.opid,sales_order_product.required_qty,sum(assign_product.qty) as ass_qty FROM `assign_product` INNER join sales_order_product on assign_product.opid = sales_order_product.opid GROUP by sales_order_product.opid HAVING sales_order_product.required_qty - sum(assign_product.qty)>0) as ua
   
   
    UNION ALL
    SELECT oid,ua.remian_qty as tot_ass_qty,ua.detail,ua.opid,'Unassigned' as AT from(SELECT oid,(sales_order_product.required_qty) as remian_qty,CONCAT(
        '<div class="card small m-0 p-0">',
            '<div class="card-header small m-0 p-0 text-bg-danger p-1">',
                '<h6 class="small my-auto"> Unassigned - ', sales_order_product.required_qty , '</h6>',
            '</div>',
         
        '</div>'
    ) AS detail,sales_order_product.opid,sales_order_product.required_qty,sum(assign_product.qty) as ass_qty FROM `assign_product` RIGHT join sales_order_product on assign_product.opid = sales_order_product.opid GROUP by sales_order_product.opid HAVING  sum(assign_product.qty) is null) as ua
   
    UNION ALL
   
    SELECT
    oid,SUM(pr.ass_qty) AS tot_ass_qty,
     CONCAT(
        '<div class="card small m-0 p-0">',
            '<div class="card-header small m-0 p-0 p-1 text-bg-success">',
                '<h6 class="small my-auto"> Delivered - ', SUM(pr.ass_qty), '</h6>',
            '</div>',
            '<div class="card-body small m-0 p-0">',
                '<ul class="list-group ">',
                CAST(GROUP_CONCAT(CONCAT('<li class="list-group-item">', pr.det, '</li>') SEPARATOR '') AS CHAR)
,
                '</ul>',
            '</div>',
        '</div>'
    ) AS detail,
    pr.opid,
    'Delivered' AS AT
FROM
    (
    SELECT
        sop.oid,CONCAT(ap.chasis_no, ' - ', SUM(ap.qty)) AS det,
        SUM(ap.qty) AS ass_qty,
        sop.opid
    FROM
        sales_order_product sop
    INNER JOIN assign_product ap ON
        sop.opid = ap.opid
    WHERE
        ap.assign_type = 'Delivered'
    GROUP BY
        sop.opid,
        ap.chasis_no
) AS pr
GROUP BY pr.opid) as details GROUP by opid order by opid asc)


