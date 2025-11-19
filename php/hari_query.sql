with ass_info as(SELECT
  
  
    IFNULL(ap.qty, 0) AS qty,
    ap.dated,
    ap.assign_type,

    ap.godown,
   
    sop.opid,
    godown.godown_name,
    IFNULL(
        SUM(qty) OVER(
    PARTITION BY sop.opid
    ),
    0
    ) AS assigned_qty, 
   sop.required_qty,
    sop.required_qty -(SUM(IFNULL(qty, 0)) OVER(PARTITION BY sop.opid)) AS unassigned_qty,
   SUM(ifnull(qty,0)) over (PARTITION by ap.opid order by ap.assign_type) as assigntype_total_count,
    SUM(
    CASE  WHEN assign_type = 'Finshed' THEN IFNULL(ap.qty, 0) ELSE 0 END
) OVER ( PARTITION BY ap.opid,ap.godown ) AS finished_godown_count,

SUM(
    CASE  WHEN assign_type = 'Production'   THEN IFNULL(qty, 0) ELSE 0 END
) OVER ( PARTITION BY ap.opid,ap.assign_type,ap.dated ) AS production_date_count,
 sum(IFNULL(qty, 0)) over ( PARTITION BY ap.opid,ap.assign_type,ap.godown ) as fw,
                  sum(IFNULL(qty, 0)) over ( PARTITION BY ap.opid,ap.assign_type,ap.dated ) as fw1
 
                 
                 
      

   
FROM
    assign_product ap

LEFT JOIN godown ON ap.godown = godown.gid
RIGHT JOIN sales_order_product sop ON
    ap.opid = sop.opid 
)

select opid,assign_type,qty,godown,
dated as production_date,godown_name,assigned_qty,required_qty,unassigned_qty,assigntype_total_count,finished_godown_count,production_date_count,fw,fw1 from ass_info WHERE 1 
-- AND assign_type in ("Waiting") and unassigned_qty > 1 and godown = 0 and dated BETWEEN '2025-05-10' and '2025-12-10' and  unassigned_qty > 0 

and opid = 195 GROUP by assign_type,production_date,godown

