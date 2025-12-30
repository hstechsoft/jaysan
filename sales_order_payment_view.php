CREATE VIEW sale_order_payment as SELECT sof.oid,concat('<ul class="list-group "> <li class="list-group-item">
                                        <div class="d-flex justify-content-between">
                                            <p class="my-auto small">Total  </p>
                                         
                                            <p class="small fw-bold my-auto">',concat('₹',FORMAT(ifnull(sof.total_payment,0),2)),'</p>
                                            

                                      </div>
                                    </li>  <li class="list-group-item">
                                        <div class="d-flex justify-content-between">
                                            <p class="small my-auto">Paid </p>
                                         
                                            <p class="small  fw-bold my-auto">',concat('₹',FORMAT(ifnull(sum(jp.amount),0),2)),'</p>
                                            

                                        </div>
                                  
                                    </li>  <li class="list-group-item">
                                        <div class="d-flex justify-content-between">
                                            <p class="small my-auto">Balance   </p>
                                         
                                            <p class="small text-bg-warning  fw-bold my-auto">',concat('₹',FORMAT(sof.total_payment-ifnull(sum(jp.amount),0),2)),'</p>
                                            

                                        </div>
                                    </li> </ul> ') as pay_details,ifnull(sum(jp.amount),0) as paid,sof.total_payment, sof.total_payment-ifnull(sum(jp.amount),0) as bal from sales_order_form sof LEFT join jaysan_payment jp on sof.oid = jp.oid GROUP by sof.oid;