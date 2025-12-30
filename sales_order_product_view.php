CREATE or REPLACE VIEW sales_product_view as SELECT oid,sop.opid,concat('<ul  data-price="',sop.price,'" class="list-group"> <li class="list-group-item">
                                        <div class="d-flex justify-content-between">
                                            <p class="small my-auto">',(SELECT jfp.product_name from jaysan_final_product jfp WHERE jfp.product_id = jpm.product_id),'</p>
                                            <p class="small my-auto">' ,jpm.model_name,'</p>
                                            <p class="small my-auto">',jmt.type_name,'</p> <p class="small my-auto fw-bold"> Qty - ',sop.required_qty,'</p>
                                            </div><div class="d-flex justify-content-center"><p class="small my-auto">(',sop.sub_type,')</p> 
                                           </div></li></ul>')as product  from sales_order_product sop
INNER join jaysan_product_model jpm on jpm.model_id = sop.model_id
INNER join jaysan_model_type jmt on jmt.mtid = sop.type_id order by sop.opid asc;