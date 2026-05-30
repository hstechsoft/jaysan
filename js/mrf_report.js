

window.demo = function () {
  console.log("Demo function is working!");
  // Add your logic here


  $("#department_txt").html("selector");
};
window.get_material_request_form_details_print1 = function (mrf_id) {

       $("#mrf_report_card1").removeClass("d-none");
       $("#mrf_report_modal1").modal("show");
//   $('html, body').animate({
//     scrollTop: $(document).height()
//   }, 500);
    $.ajax({
      url: "php/get_material_request_form_report.php",
      type: "get", //send it through get method
      data: {
      mrf_id : mrf_id,
    
  
      },
      success: function (response) {  
   
   


   console.log(response);

      if (response.trim() != "error") { 
        
        var obj = JSON.parse(response);
    
         obj.forEach(function (obj) {
        
          console.log(obj.uom);
      
          $("#mrf_form_no_print1").text(obj.mrf_id)
          
        $("#department_print1").html(obj.department_print);
        $("#desigination_print1").html(obj.desigination_print);
        $("#name_print1").html(obj.name_print);
        $("#finished_goods_delivery_godown_print1").html(obj.finished_goods_delivery_godown_print);
        $("#part_no_print1").html(obj.part_no_print);  
        $("#bom_production_print1").html(obj.bom_production_print);     
        $("#order_type_print1").html(obj.order_type_print);
        $("#minimum_order_qty_print1").html(obj.minimum_order_qty_print);
        $("#reorder_qty_print1").html(obj.reorder_qty_print);
        $("#shortfall_qty_print1").html(obj.shortfall_qty_print);
        $("#stock_for_sufficient_days_print1").html(obj.stock_for_sufficient_days_print);
        $("#requirement_qty_print1").html(obj.requirement_qty_print);
        $("#requirement_date_print1").html(obj.requirement_date_print);
        $("#last_purchase_date_print1").html(obj.last_purchase_date_print);
        $("#last_purchase_qty_print1").html(obj.last_purchase_qty_print);
         var receive_sts = "<i class='fa fa-thumbs-o-up text-success h6' aria-hidden='true'></i>"
         if(obj.material_receipt_status_print == 0)
  receive_sts = "<i class='fa fa-thumbs-o-down text-danger h6' aria-hidden='true'></i>"
      

        $("#material_receipt_status_print1").html(receive_sts);
        // $("#stock_table_body_print1").empty().after(obj.phy_stock_only);
        $("#physical_stock_print1").empty().append(obj.phy_stock_only);
         $("#physical_stock_print1").append("<tr><td><b>Total </b></td><td>"+obj.total_physical_stock_print+" " + obj.uom+"</td></tr>");
        $("#tally_stock_print1").empty().append(obj.tally_stock_only); 
          $("#tally_stock_print1").append("<tr><td><b>Total </b></td><td>"+obj.total_tally_stock_print+ " " + obj.uom+"</td></tr>");
        // $("#total_physical_stock_print1").html(obj.total_physical_stock_print + " " + obj.uom);

        $("#total_tally_stock_print1").html(obj.total_tally_stock_print+ " " + obj.uom);
        $("#physical_stock_verfied_by_print1").html(obj.physical_stock_verfied_by_print);
        $("#tally_stock_verfied_by_print1").html(obj.tally_stock_verfied_by_print);
        $("#purchase_department_print1").html(obj.purchase_department_print);
        $("#purchase_desigination_print1").html(obj.purchase_desigination_print);
        $("#purchase_name_print1").html(obj.purchase_name_print);
        $("#purchase_order_date_print1").html(obj.purchase_order_date_print);
        $("#order_to_print1").html(obj.order_to_print);
        $("#raw_material_name_print1").html(obj.raw_material_name_print);
        $("#raw_material_part_no_print1").html(obj.raw_material_part_no_print);
        $("#order_qty_print1").html(obj.order_qty_print);
        $("#batch_qty_print1").html(obj.batch_qty_print);
        $("#next_batch_date_print1").html(obj.next_batch_date_print);
        $("#next_po_date_print1").html(obj.next_po_date_print);
        $("#raw_material_rate_print1").html(obj.raw_material_rate_print);
        $("#raw_material_budget_print1").html(obj.raw_material_budget_print);
        $("#po_no_print1").html(obj.po_no_print);
        $("#po_date_print1").html(obj.po_date_print);
        $("#requested_by_print1").html(obj.requested_by_print);
        $("#verifide_by_print1").html(obj.verifide_by_print);
        $("#approved_by_print1").html(obj.approved_by_print);

        if(obj.root_cause == "")  
        {
 $("#root_cause_text_print1").html("-");
        }
        else
        {
 $("#root_cause_text_print1").html(obj.root_cause);
        }   

        if(obj.corrective_action == "")
        {
 $("#corrective_action_text_print1").html("-");
        } 
        else
        {
 $("#corrective_action_text_print1").html(obj.corrective_action);
        }

        if(obj.preventive_action == "")
        {
 $("#preventive_action_text_print1").html("-");
        } 
        else
        {       
  $("#preventive_action_text_print1").html(obj.preventive_action);
        }

    
       
       







        


        
                                                             




      

      
      });
     
      } 
      else {
        salert("Error", "Failed to fetch material request form details", "error");
      }
      
      },
      error: function (xhr) {
          //Do Something to handle error
          salert("Error", "An error occurred while fetching material request form details", "error");
      }
    });
   }


