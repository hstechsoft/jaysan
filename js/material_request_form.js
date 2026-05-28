
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
let req_id_para = JSON.parse(decodeURIComponent(urlParams.get("req_id_para")));

var req_para = urlParams.get('req_para');
var qty_para = urlParams.get('qty_para');
var part_id_para = urlParams.get('part_id_para');


var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var mrf_id_g = 0;
$(document).ready(function () {





  $("#menu_bar").load('menu.html',
    function () {
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#" + (lo.substring(0, lo.indexOf(".")))


      if ($(web_addr).find("a").hasClass('nav-link')) {
        $(web_addr).find("a").toggleClass('active')
      }
      else if ($(web_addr).find("a").hasClass('dropdown-item')) {
        $(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
      }


    }
  );

  $("#print_container").load('material_request_form_report.html',
    function () {
      $("#mrf_print_btn").on("click", function (event) {
        event.preventDefault();
        // TODO: handle click here


        $('#mrf_report_table').printThis({



        });
      });


    });


  check_login();
  get_all_internal_godown()





  $("#unamed").text(localStorage.getItem("ls_uname"))

  $("#material_requset_form_table").on("click", "tr td button", function (event) {
    event.preventDefault();
    if ($(this).hasClass("edit")) {
      var mrf_id = $(this).val();

      if ($("#material_request_form_update_btn").hasClass("d-none") == true) {
        $("#material_request_form_update_btn").removeClass("d-none");
        $("#material_request_form_btn").addClass("d-none");

      }

      $('html, body').animate({
        scrollTop: 0
      }, 500);

      // Remove highlight from all rows
      $("#material_requset_form_table tr").removeClass("table-active");
      // Highlight the selected row
      $(this).closest("tr").addClass("table-active");

      get_material_request_form_details(mrf_id);
    }

    if ($(this).hasClass("print")) {
      var mrf_id = $(this).val();

      $(this).closest("tr").siblings().hide();
      $(this).closest("tr").show();
      $(this).addClass("d-none");
      $(this).siblings().removeClass("d-none");
      get_material_request_form_details_print(mrf_id);

    }
    if ($(this).hasClass("view_hide")) {
      var mrf_id = $(this).val();
      $(this).closest("tr").siblings().show();
      $(this).closest("tr").show();
      $(this).addClass("d-none");
      $(this).siblings().removeClass("d-none");

      $("#mrf_report_card").addClass("d-none");
    }

  });

  physical_stock_array = [];


  // insert_material_request_form();

  $('#part_no').on('input', function () {
    //check the value not empty
    if ($('#part_no').val() != "") {
      $('#part_no').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/mrf_partname_autocomplete.php",
            type: "get", //send it through get method
            data: {
              part_name: $("#part_no").val()


            },
            dataType: "json",
            success: function (data) {



              response($.map(data, function (item) {
                return {

                  label: item.part_name + "-" + item.part_no + "(" + item.total_count + ")",
                  value: item.part_name,
                  id: item.part_id,
                  part_name: item.part_name,
                  reorder_qty: item.reorder_qty,
                  min_order_qty: item.min_order_qty
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-part_id", ui.item.id);
          $("#minimum_order_qty").val(ui.item.min_order_qty);
          $("#reorder_quantity").val(ui.item.reorder_qty);
          // get part details
          var sts_array = [];
          get_material_request_form_parts_search(ui.item.id, 'all', "created");
        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#material_request_form').on('submit', function (event) {
    event.preventDefault();




    if (!this.checkValidity()) {
      salert("Error", "Please fill all required fields", "error");
      event.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }

    $("#material_request_form_btn").prop("disabled", true);

    $("#material_request_form_update_btn").prop("disabled", true);

    $(this).addClass('was-validated');


    if ($("#material_request_form_update_btn").hasClass("d-none") == false) {

      update_material_request_form();
    }
    else
      insert_material_request_form();

    // // ✅ All database (AJAX) operations go here
    // if (actionType === 'submit') {
    //   // insert via AJAX
    // } else if (actionType === 'update') {
    //   // update via AJAX 
    // }
  });



  $("#add_btn").on("click", function (event) {
    event.preventDefault();
    // TODO: handle click here


    if ($("#godown_select").val() == null || $("#physical_stock_input").val() == "")
      shw_toast("Invalid", "Enter All Details", "")
    else {
      var godown_name = $("#godown_select option:selected").text();
      var godown_id = $("#godown_select").val();
      $("#stock_table_body").append("<tr data-godown-id='" + godown_id + "'> <td>" + godown_name + "</td> <td>" + $("#physical_stock_input").val() + "</td> <td><button type='button' class='btn btn-outline-danger border-0 ' id=''><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>");
    }
    $("#godown_select").val("");
    $("#physical_stock_input").val("");

  });

  $("#stock_table_body").on("click", "tr td button", function (event) {
    event.preventDefault();
    // TODO: handle click here
    var thisrow = $(this).closest("tr")

    {
      swal({
        title: "Are you sure - Delete? ",
        text: "You will not be recover this  again!",
        icon: "warning",
        buttons: [
          'No, cancel it!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function (isConfirm) {
        if (isConfirm) {
          swal({
            title: 'Applied!',
            text: 'successfully Deleted!',
            icon: 'success'
          }).then(function () {

            thisrow.remove()


          });
        } else {
          swal("Cancelled", "This is safe :)", "error");
        }
      })
    }
  });
  var sts_array = [];
  get_material_request_form_list(sts_array, 'all', 'all');

  // $("#material_requset_form_table").on("click", "tr td button", function(event) {
  //   event.preventDefault();
  //   if ($(this).hasClass("edit")) {
  //     var mrf_id = $(this).val();
  //     console.log(mrf_id);
  //     if($("#material_request_form_update_btn").hasClass("d-none") == true)

  //       {
  //         $("#material_request_form_update_btn").removeClass("d-none");
  //         $("#material_request_form_btn").addClass("d-none");

  //       }

  //    $('html, body').animate({
  //           scrollTop: 0
  //         }, 500);

  //         // Remove highlight from all rows
  //         $("#material_requset_form_table tr").removeClass("table-active");
  //         // Highlight the selected row
  //         $(this).closest("tr").addClass("table-active");

  //         get_material_request_form_details(mrf_id);
  //   }


  // });

  $("#clear_btn").on("click", function (event) {
    event.preventDefault();
    // TODO: handle click here
    var sts_array = [];
    $("#received_btn").prop("checked", false);
    $("#all_btn").prop("checked", false);
    get_material_request_form_list(sts_array, 'all', 'all');
  });

  $("#all_btn").on("click", function (event) {
    var sts_array = [];
    if ($(this).is(":checked")) {
      $("#received_btn").prop("checked", false);
      get_material_request_form_list(sts_array, 'all', 'pending');
    }
    else {
      get_material_request_form_list(sts_array, 'all', 'all');
    }
  });

  $("#received_btn").on("click", function (event) {
    var sts_array = [];
    if ($(this).is(":checked")) {
      $("#all_btn").prop("checked", false);
      get_material_request_form_list(sts_array, 'all', 'received');
    }
    else {
      get_material_request_form_list(sts_array, 'all', 'all');
    }
  });


});

function get_material_request_form_parts_search(part_id, emp_id, field_name) {


  $.ajax({
    url: "php/get_material_request_form_parts_search.php",
    type: "GET", //send it through get method
    data: {

      part_id: part_id,


    },
    success: function (response) {


      console.log(response);
      $('#material_requset_form_table').empty();

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          $("#received_btn").prop("checked", false);
          $("#all_btn").prop("checked", false);

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            var statuss = ''

            var edit_btn = "disabled";
            if (field_name == "tally_stock_approved_by") {
              if (obj.tally_stock_approved_by == current_user_id && obj.status == "tally_stock_approved") {
                edit_btn = "";
              }
              else {
                edit_btn = "disabled";
              }

            }
            else if (field_name == "created" && obj.status == "created") {

              if (obj.emp_id == current_user_id) {
                edit_btn = "";
              }
              else {
                edit_btn = "disabled";

              }


            }
            else if (field_name == "purchase_requested_by" && obj.status == "purchase_requested") {
              if (obj.purchase_requested_by == current_user_id) {
                edit_btn = "";
              }
              else {
                edit_btn = "disabled";

              }
            }
            else if (field_name == "purchase_verified_by") {
              if (obj.purchase_verified_by == current_user_id) {
                edit_btn = "";
              }
              else {
                edit_btn = "disabled";

              }
            }
            else if (field_name == "purchase_approved_by") {
              if (obj.purchase_approved_by == current_user_id) {
                edit_btn = "";
              }
              else {
                edit_btn = "disabled";

              }
            }

            var emp_invalved_list = [];
            emp_invalved_list.push("Created by " + obj.emp_name);

            if (obj.tally_stock_approved_by != null && obj.tally_stock_approved_by != "" && obj.tally_stock_approved_by != "0") {
              emp_invalved_list.push("Tally Stock Approved by " + obj.tally_stock_approved_by_name);
            }
            if (obj.purchase_requested_by != null && obj.purchase_requested_by != "" && obj.purchase_requested_by != "0") {
              emp_invalved_list.push("Purchase Requested by " + obj.purchase_requested_by_name);
            }
            if (obj.purchase_verified_by != null && obj.purchase_verified_by != "" && obj.purchase_verified_by != "0") {
              emp_invalved_list.push("Purchase Verified by " + obj.purchase_verified_by);
            }
            if (obj.purchase_approved_by != null && obj.purchase_approved_by != "" && obj.purchase_approved_by != "0") {
              emp_invalved_list.push("Purchase Approved by " + obj.purchase_approved_by);
            }
            var emp_invalved = "<ul class='list-group small'><li class='list-group-item small m-0 p-0'>" + emp_invalved_list.join("</li><li class='list-group-item  m-0 p-0 small'>") + "</li></ul>";
            var order_type_badge = "";

            if (obj.order_type == "Regular") {
              order_type_badge = "<span class='ms-1 badge bg-success'>R</span>"
            }
            else if (obj.order_type == "Emergency") {
              order_type_badge = "<span class='ms-1 blink badge bg-danger'>E</span>"
            }

            var commitment_sts = "";
            if (obj.commitment_date != null && obj.commitment_date != "" && obj.commitment_date != "0" && obj.commitment_date != "undefined") {
              commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
            }
            else {
              commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
              // commitment_sts = obj.commitment_date
            }

            var batch_details = [];
            var bth_d = '';
            var mrf_batch_qty = 0;

            try {
              batch_details = JSON.parse(obj.batch_details || "[]");
            } catch (e) {
              batch_details = [];
              mrf_batch_qty = 1;
            }


            batch_details.forEach(function (bd) {

              let po_details = bd.po_details || [];

              if (typeof po_details === "string") {
                try {
                  po_details = JSON.parse(po_details || "[]");
                } catch (e) {
                  po_details = [];
                }
              }

              mrf_batch_qty += parseFloat(bd.batch_qty || 0);


              bth_d += `
                      <div class="border rounded px-1 py-1 mb-1 small">

                          <div class="d-flex justify-content-between align-items-start">

                              <div>
                                  <span class="badge bg-secondary fw-semibold">
                                      ${bd.batch_qty || 0} Qty • ${bd.batch_date || "-"}
                                  </span>
                              </div>

                              <div class="d-flex flex-wrap justify-content-end gap-1" style="max-width: 50%;">
                  `;

              let hasGRN = false;

              po_details.forEach(function (po_d) {

                let grn_details = po_d.grn_details || [];

                if (typeof grn_details === "string") {
                  try {
                    grn_details = JSON.parse(grn_details || "[]");
                  } catch (e) {
                    grn_details = [];
                  }
                }

                if (Array.isArray(grn_details) && grn_details.length > 0) {
                  grn_details.forEach(function (grn) {

                    hasGRN = true;

                    bth_d += `
                            <span class="badge bg-success">
                                ${grn.received_qty || 0} Qty • ${grn.grn_date || "-"}
                            </span>
                        `;
                  });
                }
              });

              if (!hasGRN) {
                if (!hasGRN) {
                  bth_d += `
                              <span class="badge bg-warning text-dark">
                                  No PO
                              </span>
                          `;
                }
              }

              bth_d += `
                            </div>
                        </div>
                    </div>
                `;
            });

            let pending =
              parseFloat(mrf_batch_qty || 0) - parseFloat(obj.mrf_receive_qty || 0);

            if (pending === 0 && obj.mrf_receive_qty !== null) {
              statuss = `<span class='text-success'>Material Received(${mrf_batch_qty + " Qty -" + obj.mrf_receive_qty + " Qty"})</span>
                    ${bth_d}`;
            } else {
              statuss = `
                    <span class='text-danger'>
                        ${pending} Material Not Received
                    </span>
                    ${bth_d}
                `;
            }

            count = count + 1;
            $('#material_requset_form_table').append(
              "<tr><td style='max-width:30px'>" + count + "</td><td><ul class='list-group ' ><li class='list-group-item '> <div class='d-flex justify-content-between align-content-around'> <div class = 'small'><span class='text-bg-light fw-bold'>  " + obj.mrf_id + ". </span>" + obj.part_name + order_type_badge + "<span class='ms-1 small  badge bg-primary '>" + obj.total_part_count + "</span></div> <div> <button class='btn btn-outline-danger btn-sm border-0 history_btn' " +
              "data-bs-toggle='popover' data-bs-html='true' data-bs-placement='left' " +
              "data-history=\"" + obj.form_history.replace(/"/g, '&quot;') + "\" title='History'>" +
              "<i class='fa fa-clock-o' aria-hidden='true'></i></button></div></div></li><li class='list-group-item '><div class='d-flex justify-content-between align-content-around'> <div class='small'>" + obj.req_date_format + " </div> <div class='small'>" + commitment_sts + "  </div></div></li></ul></td><td>" + statuss + "</td><td class = 'd-flex'><button " + edit_btn + " type='button' value='" + obj.mrf_id + "'  class='btn btn-outline-danger border-0 edit btn-animate btn-sm' id=''><i class='fa fa-pencil'  aria-hidden='true'></i></button> <button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-danger btn-sm border-0 print btn-animate ' id=''><i class='fa-solid fa-receipt' aria-hidden='true'></i></button><button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-secondary btn-sm border-0 view_hide btn-animate d-none' id=''><i class='fa-solid fa-eye-slash' aria-hidden='true'></i></button></td></tr>"
            );


          });


        }
        else {
          // $("#@id@") .append("<td colspan='7' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function update_material_request_form() {
  $("#stock_table_body tr").each(function () {
    var godown_id = $(this).data("godown-id");
    var physical_stock = $(this).find("td").eq(1).text();
    physical_stock_array.push({
      godown_id: godown_id,
      qty: physical_stock
    });
  });
  // your logic here
  var bom_production = 0;
  var material_receipt_status = 0;
  if ($("#bom_production_yes").prop("checked")) {
    bom_production = 1;
  }
  if ($("#matrial_receipt_status_yes").prop("checked")) {
    material_receipt_status = 1
  }
  $.ajax({
    url: "php/update_material_request_form.php",
    type: "get", //send it through get method

    data: {
      mrf_id: mrf_id_g,
      emp_id: current_user_id,
      part_id: $("#part_no").data("selected-part_id"),
      bom_production: bom_production,
      order_type: $('#order_type').val(),
      shortfall_qty: $('#shortfall_quantity').val(),
      stock_for_sufficent_days: $('#stock_for_sufficient_days').val(),
      req_qty: $('#requirement_quantity').val(),
      req_date: $('#requirement_date').val(),
      last_purchase_date: $('#last_purchase_date').val(),
      last_purchase_qty: $('#last_purchase_qty').val(),
      material_receipt_status: material_receipt_status,
      prepared_by: current_user_id,
      physical_stock_approved_by: current_user_id,
      physical_stock_array: JSON.stringify(physical_stock_array),
      uom: $('#uom').val(),
    },
    success: function (response) {

      if (response.trim() == "ok") {
        location.reload();
      } else {
        salert("Error", "Failed to update material request form", "error");
      }
    },
    error: function (xhr) {
      //Do Something to handle error
      salert("Error", "An error occurred while updating material request form", "error");
    }
  });
}



function get_material_request_form_details(mrf_id) {
  $.ajax({
    url: "php/get_material_request_form_single.php",
    type: "get", //send it through get method
    data: {
      mrf_id: mrf_id,


    },
    success: function (response) {
      mrf_id_g = mrf_id; // Set the global mrf_id variable

      if (response.trim() != "error") {

        var obj = JSON.parse(response);

        obj.forEach(function (obj) {
          $("#part_no").val(obj.part_name);
          $("#part_no").data("selected-part_id", obj.part_id);
          $("#minimum_order_qty").val(obj.min_order_qty);
          $("#reorder_quantity").val(obj.reorder_qty);

          $("#order_type").val(obj.order_type);
          $("#shortfall_quantity").val(obj.shortfall_qty);
          $("#stock_for_sufficient_days").val(obj.stock_for_sufficent_days);
          $("#requirement_quantity").val(obj.req_qty);
          $("#requirement_date").val(obj.req_date);
          $("#last_purchase_date").val(obj.last_purchase_date);
          $("#last_purchase_qty").val(obj.last_purchase_qty);

          if (obj.bom_production == 1) {
            $("#bom_production_yes").prop("checked", true);
          }
          else {
            $("#bom_production_no").prop("checked", true);

          }


          if (obj.material_receipt_status == 1) {
            $("#matrial_receipt_status_yes").prop("checked", true);
          } else {
            $("#matrial_receipt_status_no").prop("checked", true);
          }


        });
        get_physical_stock_details(mrf_id);
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

function get_physical_stock_details(mrf_id) {


  $.ajax({
    url: "php/get_internal_godown_stock_physical.php",
    type: "get", //send it through get method
    data: {
      mrf_id: mrf_id

    },
    success: function (response) {

      $('#stock_table_body').empty();

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#stock_table_body').append("<tr  data-godown-id='" + obj.godown_id + "'><td>" + obj.godown_name + "</td><td>" + obj.qty + "</td><td><button type='button' class='btn btn-outline-danger border-0 ' id=''><i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>")

          });


        }
        else {
          // $("#@id@") .append("<td colspan='3' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

  ``


}


function get_material_request_form_list(sts_array, emp_id, receive_filter) {
  console.log(sts_array, emp_id, receive_filter);


  $.ajax({
    url: "php/get_material_request_form_list.php",
    type: "POST", //send it through get method
    data: {
      status: JSON.stringify(sts_array),
      emp_id: emp_id,
      receive_filter: receive_filter,

    },
    success: function (response) {


      console.log(response);


      if (response.trim() != "error") {
        $('#material_requset_form_table').empty()
        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {

            var edit_btn = "disabled";
            var statuss = '';
            var reject = '';


            if (obj.emp_id == current_user_id && (obj.status == "created" || obj.status == "purchase_rejected"))

              edit_btn = "";

            else

              edit_btn = "disabled";

            if (obj.status == "purchase_rejected")
              reject = `<span class='badge bg-danger blink'>Purchase Rejected</span>`







              // var emp_invalved_list = [];
              // emp_invalved_list.push("Created by " + obj.emp_name);

              // if (obj.tally_stock_approved_by != null && obj.tally_stock_approved_by != "" && obj.tally_stock_approved_by != "0") {
              //   emp_invalved_list.push("Tally Stock Approved by " + obj.tally_stock_approved_by_name);
              // }
              // if (obj.purchase_requested_by != null && obj.purchase_requested_by != "" && obj.purchase_requested_by != "0") {
              //   emp_invalved_list.push("Purchase Requested by " + obj.purchase_requested_by_name);
              // }
              // if (obj.purchase_verified_by != null && obj.purchase_verified_by != "" && obj.purchase_verified_by != "0") {
              //   emp_invalved_list.push("Purchase Verified by " + obj.purchase_verified_by);
              // }
              // if (obj.purchase_approved_by != null && obj.purchase_approved_by != "" && obj.purchase_approved_by != "0") {
              //   emp_invalved_list.push("Purchase Approved by " + obj.purchase_approved_by);
              // }
              // var emp_invalved = "<ul class='list-group small'><li class='list-group-item small m-0 p-0'>" + emp_invalved_list.join("</li><li class='list-group-item  m-0 p-0 small'>") + "</li></ul>";

              var order_type_badge = "";

            if (obj.order_type == "Regular") {
              order_type_badge = "<span class='ms-1 badge bg-success'>R</span>"
            }
            else if (obj.order_type == "Emergency") {
              order_type_badge = "<span class='ms-1 blink badge bg-danger'>E</span>"
            }

            var commitment_sts = "";
            if (obj.commitment_date != null && obj.commitment_date != "" && obj.commitment_date != "0" && obj.commitment_date != "undefined") {
              commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
            }
            else {
              commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
              // commitment_sts = obj.commitment_date
            }

            var batch_details = [];
            var bth_d = '';
            var mrf_batch_qty = 0;

            try {
              batch_details = JSON.parse(obj.batch_details || "[]");
            } catch (e) {
              batch_details = [];
              mrf_batch_qty = 1
            }


            batch_details.forEach(function (bd) {

              let po_details = bd.po_details || [];

              if (typeof po_details === "string") {
                try {
                  po_details = JSON.parse(po_details || "[]");
                } catch (e) {
                  po_details = [];
                }
              }

              mrf_batch_qty += parseFloat(bd.batch_qty || 0);


              bth_d += `
                      <div class="border rounded px-1 py-1 mb-1 small">

                          <div class="d-flex justify-content-between align-items-start">

                              <div>
                                  <span class="badge bg-secondary fw-semibold">
                                      ${bd.batch_qty || 0} Qty • ${bd.batch_date || "-"}
                                  </span>
                              </div>

                              <div class="d-flex flex-wrap justify-content-end gap-1" style="max-width: 50%;">
                  `;

              let hasGRN = false;

              po_details.forEach(function (po_d) {

                let grn_details = po_d.grn_details || [];

                if (typeof grn_details === "string") {
                  try {
                    grn_details = JSON.parse(grn_details || "[]");
                  } catch (e) {
                    grn_details = [];
                  }
                }

                if (Array.isArray(grn_details) && grn_details.length > 0) {
                  grn_details.forEach(function (grn) {

                    hasGRN = true;

                    bth_d += `
                            <span class="badge bg-success">
                                ${grn.received_qty || 0} Qty • ${grn.grn_date || "-"}
                            </span>
                        `;
                  });
                }
              });

              if (!hasGRN) {
                if (!hasGRN) {
                  bth_d += `
                              <span class="badge bg-warning text-dark">
                                  No PO
                              </span>
                          `;
                }
              }

              bth_d += `
                            </div>
                        </div>
                    </div>
                `;
            });

            let pending =
              parseFloat(mrf_batch_qty || 0) - parseFloat(obj.mrf_receive_qty || 0);

            if (pending === 0 && obj.mrf_receive_qty !== null) {
              statuss = `<span class='text-success'>Material Received(${mrf_batch_qty + " Qty -" + obj.mrf_receive_qty + " Qty"})</span>
                    ${bth_d}`;
            } else {
              statuss = `
                    <span class='text-danger'>
                        ${pending} Material Not Received
                    </span>
                    ${bth_d}
                `;
            }



            count = count + 1;
            $('#material_requset_form_table').append(
              "<tr><td style='max-width:30px'>" + count + "</td><td><ul class='list-group ' ><li class='list-group-item '> <div class='d-flex justify-content-between align-content-around'> <div class = 'small'><span class='text-bg-light fw-bold'>  " + obj.mrf_id + ". </span>" + obj.part_name + order_type_badge + "<span class='ms-1 small  badge bg-primary'>" + obj.total_part_count + "</span>"+reject+"</div> <div> <button class='btn btn-outline-danger btn-sm border-0 history_btn' " +
              "data-bs-toggle='popover' data-bs-html='true' data-bs-placement='left' " +
              "data-history=\"" + obj.form_history.replace(/"/g, '&quot;') + "\" title='History'>" +
              "<i class='fa fa-clock-o' aria-hidden='true'></i></button></div></div></li><li class='list-group-item '><div class='d-flex justify-content-between align-content-around'> <div class='small'>" + obj.req_date_format + " </div> <div class='small'>" + commitment_sts + "  </div></div></li></ul></td><td>" + statuss + "</td><td class = 'd-flex'><button " + edit_btn + " type='button' value='" + obj.mrf_id + "'  class='btn btn-outline-danger border-0 edit btn-animate btn-sm' id=''><i class='fa fa-pencil'  aria-hidden='true'></i></button> <button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-danger btn-sm border-0 print btn-animate ' id=''><i class='fa-solid fa-receipt' aria-hidden='true'></i></button><button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-secondary btn-sm border-0 view_hide btn-animate d-none' id=''><i class='fa-solid fa-eye-slash' aria-hidden='true'></i></button></td></tr>"
            );


          });


        }
        else {
          // $("#@id@") .append("<td colspan='7' scope='col'>No Data</td>");

        }
      }

      if (part_id_para != null) {
        $("#requirement_quantity").val(qty_para);
        $.ajax({
          url: "php/get_part.php",
          type: "get", //send it through get method

          data: {
            part_id: part_id_para

          },
          success: function (response) {
            console.log(response);

            if (response.trim() != "0 result") {
              var obj = JSON.parse(response);

              obj.forEach(function (obj) {
                $("#part_no").val(obj.part_name);
                $("#part_no").data("selected-part_id", obj.part_id);
                $("#minimum_order_qty").val(obj.min_order_qty);
                $("#reorder_quantity").val(obj.reorder_qty);


                // get part details
                var sts_array = [];
                get_material_request_form_parts_search(obj.part_id, 'all', "created");
              });
            } else {
              salert("Error", "Failed to update material request form", "error");
            }
          },
          error: function (xhr) {
            //Do Something to handle error
            salert("Error", "An error occurred while updating material request form", "error");
          }
        });


      }



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_all_internal_godown() {


  $.ajax({
    url: "php/select_all_internal_godown.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {



      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;

            $('#godown_select').append("<option value = '" + obj.internal_godown_id + "'>" + obj.godown_name + "</option>")

          });


        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}





function insert_material_request_form() {
  $("#stock_table_body tr").each(function () {
    var godown_id = $(this).data("godown-id");
    var physical_stock = $(this).find("td").eq(1).text();
    physical_stock_array.push({
      godown_id: godown_id,
      qty: physical_stock
    });
  });
  // your logic here



  var bom_production = 0;
  var material_receipt_status = 0;
  if ($("#bom_production_yes").prop("checked")) {
    bom_production = 1;
  }

  if ($("#matrial_receipt_status_yes").prop("checked")) {
    material_receipt_status = 1
  }
  $.ajax({
    url: "php/insert_material_request_form.php",
    type: "get", //send it through get method
    data: {
      emp_id: current_user_id,
      part_id: $("#part_no").data("selected-part_id"),
      bom_production: bom_production,
      order_type: $('#order_type').val(),
      shortfall_qty: $('#shortfall_quantity').val(),
      stock_for_sufficent_days: $('#stock_for_sufficient_days').val(),
      req_qty: $('#requirement_quantity').val(),
      req_date: $('#requirement_date').val(),
      last_purchase_date: $('#last_purchase_date').val(),
      last_purchase_qty: $('#last_purchase_qty').val(),
      material_receipt_status: material_receipt_status,
      prepared_by: current_user_id,
      physical_stock_approved_by: current_user_id,
      physical_stock_array: JSON.stringify(physical_stock_array),
      uom: $('#uom').val(),
      req_id: JSON.stringify(req_id_para),

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        window.open("material_request_form.html", "_self");


      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}










function check_login() {

  if (localStorage.getItem("logemail") == null && phone_id == null) {
    window.location.replace("login.html");
  }
  else if (localStorage.getItem("logemail") == null && phone_id != null) {
    get_current_userid_byphoneid();
    $('#menu_bar').hide()
  }

  else {

  }
}


function get_current_userid_byphoneid() {
  $.ajax({
    url: "php/get_current_employee_id_byphoneid.php",
    type: "get", //send it through get method
    data: {
      phone_id: phone_id,


    },
    success: function (response) {


      if (response.trim() != "error") {
        var obj = JSON.parse(response);





        obj.forEach(function (obj) {
          current_user_id = obj.emp_id;
          current_user_name = obj.emp_name;
        });

        //    get_sales_order()
      }

      else {
        salert("Error", "User ", "error");
      }



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function shw_toast(title, des, theme) {


  $('.toast-title').text(title);
  $('.toast-description').text(des);
  var toast = new bootstrap.Toast($('#myToast'));
  toast.show();
}

function get_millis(t) {

  var dt = new Date(t);
  return dt.getTime();
}



function get_cur_millis() {
  var dt = new Date();
  return dt.getTime();
}


function get_today_date() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var hour = date.getHours();
  var mins = date.getMinutes();

  console.log(mins)

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T" + hour + ":" + mins;
  return today;
}

function get_today_start_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T00:00";

  return get_millis(today)

}


function get_today_end_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T23:59";

  return get_millis(today)

}

function salert(title, text, icon) {


  swal({
    title: title,
    text: text,
    icon: icon,
  });
}



function millis_to_date(millis) {
  var d = new Date(millis); // Parameter should be long value


  return d.toLocaleString('en-GB');

}