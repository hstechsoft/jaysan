 CREATE OR REPLACE VIEW sales_order_info_view AS WITH
    sales_order_info AS(
    SELECT
        sof.oid,
        sof.order_category,
        sof.customer_id,
        sof.order_type,
     sof.emp_id,
     (select emp_name from employee where emp_id= sof.emp_id) as emp_name,
        sof.oe_supply,
        sof.commitment_date,
        sof.dated,
        sof.required_qty as sof_re_qty,
        sof.color_choice,
        sof.color_choice_des,
        sof.chasis_choice,
        sof.chasis_choice_des,
        sof.any_other_spec,
        sof.loading_type,
        sof.order_no,
        sof.production_untill,
        sof.admin_remarks,
        sof.approved_by,
        sof.pincode,
        sof.delivery_addr,
        sof.approve_sts,
        sof.total_payment,
        sof.nex_payment_date,
        sof.first_payment_date,
        customer.cus_name,
        customer.cus_phone
    FROM
        `sales_order_form` sof
    LEFT JOIN customer ON sof.customer_id = customer.cus_id
    
)
SELECT
    sales_order_info.*,
    
    sop.opid,
    sop.type_id,
    sop.model_id,
    sop.sub_type,
    sop.required_qty,
    sop.price,
    jpm.model_name,
    jpm.product_id,
    (
    SELECT
        jaysan_final_product.product_name
    FROM
        jaysan_final_product
    WHERE
        jaysan_final_product.product_id = jpm.product_id
) AS product,
jmt.type_name

FROM
    sales_order_product sop
INNER JOIN sales_order_info ON sales_order_info.oid = sop.oid
LEFT JOIN jaysan_product_model jpm ON
    sop.model_id = jpm.model_id
LEFT JOIN jaysan_model_type jmt ON
    sop.type_id = jmt.mtid