
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var mrf_id_g = 0;
var purchase_mrf_id_g = 0;
var purchase_id = 0;


$(document).ready(function () {

  $("#badge_table_body tr").find("td").eq(1).find("*").prop("disabled", true);
  $("#badge_table_body tr").find("td").eq(2).find("*").prop("disabled", true);

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

  $("input").on("input", function () {
    let labelText = $(this).siblings("label").text();
    $(this).attr("title", `${labelText}: ${$(this).val()}`);
  });

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

  $("#unamed").text(localStorage.getItem("ls_uname"))

  $("#material_requset_form_table").closest("table").hide();



  var sts_array_tally = ["tally_stock_approved"];
  get_material_request_form_list_purchase(sts_array_tally, 'all');


  var sts_array = ["purchase_requested", "md_rejected", "md_rejected-puraches"];
  get_material_request_form_list(sts_array, current_user_id, "purchase_requested");

  $("#material_requset_form_purchase_table").on("click", "tr", function (event) {
    event.preventDefault();

    $("#material_requset_form_purchase_table").find("tr").removeClass("table-active");
    $(this).addClass("table-active");

    mrf_id_g = $(this).find("button.print").val();

    get_mrf_details(mrf_id_g)
    get_bom_list_wel($(this).data("part_id"));

    $('#details').text(" part Name : " + $(this).data("part_name"))
    $("#reject_modal_btn").removeClass("d-none");
    $("#reject_btn").data("mrf_id", mrf_id_g);
  });

  $("#material_requset_form_purchase_table").on("click", "tr td  button", function (event) {
    //  var mrf_id = $(this).val();
    //   get_material_request_form_details_print(mrf_id);
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

  $('#material_request_form_purchase').on('submit', function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
      event.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }
    $("#material_request_form_purchase_btn").prop("disabled", true);
    $("#material_request_form_purchase_update_btn").prop("disabled", true);
    $(this).addClass('was-validated');


    if ($("#material_request_form_purchase_update_btn").hasClass("d-none") == false && mrf_id_g != 0) {

      update_material_request_form_purchase();


    }
    else if (mrf_id_g > 0)
      insert_material_request_form_purchase();
    // console.log($('#order_to').data("selected-creditor_id"));

    else {
      salert("Error", "Please select a Material Request Form to insert", "error");

    }




    // // ✅ All database (AJAX) operations go here
    // if (actionType === 'submit') {
    //   // insert via AJAX
    // } else if (actionType === 'update') {
    //   // update via AJAX 
    // }
  });



  $("#material_requset_form_table").on("click", "tr td button", function (event) {
    event.preventDefault();
    purchase_id = $(this).closest('tr').data('purchase_id');
    console.log(purchase_id);

    mrf_id_g = $(this).closest("tr").find('button.print').val();

    if ($(this).hasClass("edit")) {
      var mrf_id = $(this).val();

      if ($("#material_request_form_purchase_update_btn").hasClass("d-none") == true) {
        $("#material_request_form_purchase_update_btn").removeClass("d-none");
        $("#material_request_form_purchase_btn").addClass("d-none");

      }

      $('html, body').animate({
        scrollTop: 0
      }, 500);

      // Remove highlight from all rows
      $("#material_requset_form_table tr").removeClass("table-active");
      // Highlight the selected row
      $(this).closest("tr").addClass("table-active");

      // get_material_request_form_details(purchase_id);

      get_mrf_details(mrf_id_g)
      get_bom_list_wel($(this).data("part_id"));
      $('#details').text(" part Name : " + $(this).data("part_name"))
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

  $("#multiple_badge_chk").on("change", function (event) {
    event.preventDefault();
    // your logic here
    if ($(this).is(":checked")) {
      $("#multiple_badge_div").removeClass("d-none");
    }
    else {
      $("#multiple_badge_div").addClass("d-none");
    }

  });

  $("#split_badge_radio").on("change", function (event) {
    event.preventDefault();
    // your logic here
    var table_td = $(this).closest("table").find("tbody tr");
    if ($(this).prop("checked") == true) {
      table_td.find("td").eq(0).find("*").prop("disabled", true);
      table_td.find("td").eq(1).find("*").prop("disabled", false);
      table_td.find("td").eq(2).find("*").prop("disabled", true);

    }


  });


  $("#stop_until_radio").on("change", function (event) {
    event.preventDefault();
    // your logic here
    var table_td = $(this).closest("table").find("tbody tr");
    if ($(this).prop("checked") == true) {
      table_td.find("td").eq(0).find("*").prop("disabled", false);
      table_td.find("td").eq(1).find("*").prop("disabled", true);
      table_td.find("td").eq(2).find("*").prop("disabled", true);

    }


  });

  $("#manual_badge_radio").on("change", function (event) {
    event.preventDefault();
    // your logic here
    var table_td = $(this).closest("table").find("tbody tr");
    if ($(this).prop("checked") == true) {
      table_td.find("td").eq(0).find("*").prop("disabled", true);
      table_td.find("td").eq(1).find("*").prop("disabled", true);
      table_td.find("td").eq(2).find("*").prop("disabled", false);
      $("#batch_remaining").prop("disabled", true);
      $("#batch_remaining").val($("#order_qty").val() ? $("#order_qty").val() : "0");
    }


  });

  $("#stop_untill_btn").on("click", function (event) {
    event.preventDefault();
    // TODO: handle click here
    var start_date = $("#batch_start1").val();
    var time_gap = $("#batch_time_gap1").val();
    var end_date = $("#batch_end1").val();
    if (start_date == "" || time_gap == "" || end_date == "" || $("#order_qty").val() == "") {
      salert("Error", "Please enter all details", "error");
      return;
    }
    if (get_millis(end_date) < get_millis(start_date)) {

      salert("Error", "End date should be greater than start date", "error");
      return;
    }
    // Generate list of dates from start_date to end_date with time_gap (in days)
    var startMillis = get_millis(start_date);
    var endMillis = get_millis(end_date);
    var gapMillis = parseInt(time_gap, 10) * 24 * 60 * 60 * 1000; // days to ms

    var datesList = [];
    var count = 1;
    $("#batch_table").empty();
    for (var t = startMillis; t <= endMillis; t += gapMillis) {
      var d = new Date(t);
      var dateStr = d.getFullYear() + "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2);

      $("#batch_table").append("<tr> <td>" + count + "</td> <td>" + dateStr + "</td> <td>" + $("#order_qty").val() + "</td> <td><button type='button' class='btn btn-outline-danger border-0' ><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
      count = count + 1;
    }


  });

  $("#split_badge_btn").on("click", function (event) {
    event.preventDefault();
    // TODO: handle click here
    var start_date = $("#batch_start2").val();
    var time_gap = $("#batch_time_gap2").val();
    var order_qty = parseInt($("#order_qty").val());


    if (start_date == "" || time_gap == "" || $("#order_qty").val() == "") {
      salert("Error", "Please enter all details", "error");
      return;
    }

    // Generate list of dates from start_date to end_date with time_gap (in days)
    var startMillis = get_millis(start_date);
    var split_qty = parseInt($("#badge_qty2").val())
    var gapMillis = parseInt(time_gap, 10) * 24 * 60 * 60 * 1000; // days to ms

    var datesList = [];
    var count = 1;
    $("#batch_table").empty();
    for (var s = order_qty; s > 0; s -= split_qty) {
      var d = new Date(startMillis);
      var dateStr = d.getFullYear() + "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2);



      startMillis += gapMillis;
      $("#batch_table").append("<tr> <td>" + count + "</td> <td>" + dateStr + "</td> <td>" + (s >= split_qty ? split_qty : s) + "</td> <td><button type='button' class='btn btn-outline-danger border-0' ><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
      count = count + 1;
    }
    //   for (var t = startMillis; t <= endMillis; t += gapMillis) {
    //     var d = new Date(t);
    //     var dateStr = d.getFullYear() + "-" +
    //                   ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
    //                   ("0" + d.getDate()).slice(-2);

    // $("#badge_table_body").append( "<tr> <td>"+ count+"</td> <td>"+dateStr +"</td> <td>"+$("#order_qty").val()+"</td> <td><button type='button' class='btn btn-outline-danger border-0' ><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
    // count = count +1;
    //   }


  });


  $("#manual_btn").on("click", function (event) {

    event.preventDefault();
    if ($("#batch_remaining").val() == "0" || $("#batch_remaining").val() == "" || $("#manual_batch_date").val() == "" || $("#manual_batch_qty").val() == "") {
      salert("Error", "Please enter all details", "error");
      return;
    }
    else {
      if (parseInt($("#manual_batch_qty").val()) > parseInt($("#batch_remaining").val())) {
        salert("Error", "Badge quantity should be less than or equal to remaining quantity", "error");
        return;
      }
      else {
        var count = $("#batch_table tr").length + 1;
        $("#batch_table").append("<tr> <td>" + count + "</td> <td>" + $("#manual_batch_date").val() + "</td> <td>" + $("#manual_batch_qty").val() + "</td> <td><button type='button' class='btn btn-outline-danger border-0' ><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
        var remaining = parseInt($("#batch_remaining").val()) - parseInt($("#manual_batch_qty").val());
        $("#batch_remaining").val(remaining);
        $("#manual_batch_date").val("");
        $("#manual_batch_qty").val("");

      }

    }
  });
  $("#batch_table").on("click", "tr td button", function (event) {

    event.preventDefault();

    var this_row = $(this).closest("tr");
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
            this_row.remove();
            var count = 1;
            $("#batch_table tr").each(function () {
              $(this).find("td").eq(0).text(count);
              count = count + 1;
            });

          });
        } else {
          swal("Cancelled", "This is safe :)", "error");
        }
      })
    }

  });

  $('#order_to').on('input', function () {
    //check the value not empty
    if ($('#order_to').val() != "") {
      $('#order_to').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_creditors_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.creditor_name + "-" + item.creditor_gst,
                  value: item.creditor_name,
                  id: item.creditor_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-creditor_id", ui.item.id);

          $('#order_to').prop('disabled', true);
          $("#delivery_to").focus()

        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });

  $('#delivery_to').on('input', function () {
    //check the value not empty
    if ($('#delivery_to').val() != "") {
      $('#delivery_to').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_creditors_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.creditor_name + "-" + item.creditor_gst,
                  value: item.creditor_name,
                  id: item.creditor_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-creditor_id", ui.item.id);

          $('#delivery_to').prop('disabled', true);


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });


  $('#raw_material_part_no').on('input', function () {
    //check the value not empty
    if ($('#raw_material_part_no').val() != "") {
      $('#raw_material_part_no').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/mrf_partname_autocomplete.php",
            type: "get", //send it through get method
            data: {
              part_name: $("#raw_material_part_no").val()


            },
            dataType: "json",
            success: function (data) {


              response($.map(data, function (item) {
                return {

                  label: item.part_name + "-" + item.part_no,
                  value: item.part_name,
                  id: item.part_id,

                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-part_id", ui.item.id);


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> </div>")
          .appendTo(ul);
      };
    }

  });

  $('#creditors_form').on('submit', function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
      event.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }

    $(this).addClass('was-validated');

    // // ✅ All database (AJAX) operations go here
    // if (actionType === 'submit') {
    //   // insert via AJAX
    // } else if (actionType === 'update') {
    //   // update via AJAX
    // }

    insert_creditors();
  });

  $("#switch_view").on("change", function (event) {

    $("#material_requset_form_table").closest("table").toggle();
    $("#material_requset_form_purchase_table").closest("table").toggle();
    if ($("#reject_modal_btn").hasClass("d-none") == false)
      $("#reject_modal_btn").addClass("d-none");
  });

  $("#reject_btn").on("click", function (event) {
    event.preventDefault();
    // TODO: handle click here
    if ($("#reject_reason").val() != "" && $("#reject_to").val() != null) {
      update_reject($(this).data("mrf_id"), $("#reject_to").val(), $("#reject_reason").val())
    }
    else {
      shw_toast("Warning", "Enter Reason And Select Reject To", "warning")
    }
  });


  $("#bom_list_select").on("click", ".bom_list_li", function (event) {
    event.preventDefault();
    var part_id = $("#bom_list_select").data("part_id");

    var part_name = $("#bom_list_select").data("part_name");
    var component_cat = $(this).data("component_cat");
    if (part_id != "" && part_id != null) {
      window.location.href = "welding_process.html?part_id=" + part_id + "&part_name=" + encodeURIComponent(part_name) + "&component_cat=" + encodeURIComponent(component_cat);
    }
  });
});



function get_bom_list_wel(part_id) {


  $.ajax({
    url: "php/get_bom_list_wel.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id

    },
    success: function (response) {
      console.log(response);

      $('#bom_list_select').empty()

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {


          $("#bom_list_select").empty()

          var obj = JSON.parse(response);
          var count = 0

          $("#bom_list_select").append(`<li class="list-group-item align-items-center bg-dark text-white">BOM List</li>`)

          obj.forEach(function (obj) {
            count = count + 1;
            //  $("#bom_list_item").append("<li  data-bom_id='"+ obj.bom_id+"' data-part_id='"+obj.part_id+" ' class=' list-group-item'>"+obj.component_cat + "</li>")
            $("#bom_list_select").append("<li class='list-group-item align-items-center bom_list_li' data-component_cat='" + obj.component_cat + "' data-part_id='" + obj.part_id + "' data-process_count='" + obj.process_count + "' data-bom_list='" + obj.bom_list + "'>" + obj.component_cat + "</li>")

            // $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


          });





        }
        else {
          $('#bom_list_item').append("<li class='list-group-item'>No BOM Found</li>")

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function update_reject(mrf_id, reject_to, reject_reason) {


  $.ajax({
    url: "php/update_material_request_form_status.php",
    type: "get", //send it through get method
    data: {
      status: "purchase_rejected-" + reject_to,
      mrf_id: mrf_id,
      emp_id: current_user_id,
      reason: reject_reason

    },
    success: function (response) {

      console.log(response);

      if (response.trim() == "ok") {

        location.reload()

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}




function get_mrf_purchase_details(mrf_id, part_id) {


  $.ajax({
    url: "php/get_mrf_purchase_details.php",
    type: "get", //send it through get method
    data: {
      mrf_id: mrf_id,
      part_id: part_id

    },
    success: function (response) {
      console.log(response);
      $("#batch_table").empty()
      if (response.trim() != "error") {
        $("#delivery_to").val("");
        $("#delivery_to").removeAttr("selected-creditor_id");
        $("#order_to").val("");
        $("#order_to").removeAttr("selected-creditor_id");
        $("#raw_material_part_no").val("");
        $("#uom").val("")
        $("#raw_material_part_no").removeAttr("selected-part_id")
        $("#raw_material_rate").val("")
        $("#purchase_email").val("")
        $("#approx_delivery_days").val("")
        $('#multiple_badge_chk').prop('checked', false).trigger('change');
        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {

            count = count + 1;
            $("#order_qty").val(obj.order_qty)
            if (JSON.parse(obj.batch_materials) != null) {
              var batch_mat = JSON.parse(obj.batch_materials)
              console.log(batch_mat.length);
              if (batch_mat.length > 1) {
                $('#multiple_badge_chk').prop('checked', true).trigger('change');
                var batch_count = 0
                batch_mat.forEach(function (batch_mat_obj) {
                  batch_count += 1
                  $("#batch_table").append("<tr><td>" + batch_count + "</td> <td>" + batch_mat_obj.batch_date + "</td> <td>" + batch_mat_obj.batch_qty + "</td><td><button type='button' class='btn btn-outline-danger border-0' ><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")

                  // $("#batch_table").append( "<tr> <td>"+ count+"</td> <td>"+dateStr +"</td> <td>"+$("#order_qty").val()+"</td> <td><button type='button' class='btn btn-outline-danger border-0' ><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
                })
              }
              else {
                batch_mat.forEach(function (batch_mat) {

                  $("#order_qty").val(batch_mat.batch_qty)
                  $("#order_date").val(batch_mat.batch_date)
                })
              }
            }

            else {

            }
            if (obj.po_order_to != null && obj.po_order_to != "") {
              $("#order_to").val(obj.creditors_name);
              $("#order_to").data("selected-creditor_id", obj.po_order_to);
            }

            if (obj.po_delivery_to != null && obj.po_delivery_to != "") {
              $("#delivery_to").val(obj.deliver_name);
              $("#delivery_to").data("selected-creditor_id", obj.po_delivery_to);
            }


            if (obj.raw_material_part_id != null && obj.raw_material_part_id != "") {

              $("#raw_material_part_no").val(obj.raw_material_name);
              $("#raw_material_part_no").data("selected-part_id", obj.raw_material_part_id);
            }



            $("#uom").val(obj.uom)
            $("#raw_material_rate").val(obj.raw_material_rate)
            $("#purchase_email").val(obj.po_email)
            $("#approx_delivery_days").val(obj.approx_delivery_days)
            $("#raw_material_stock").val(obj.raw_material_stock)

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




}

function get_mrf_details(mrf_id) {


  $.ajax({
    url: "php/get_mrf_details.php",
    type: "get", //send it through get method
    data: {
      mrf_id: mrf_id

    },
    success: function (response) {
      console.log(response);

      $('#physical_stock_info').empty();
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0
          var part_id = 0;

          var receive_sts = "<i class='fa fa-thumbs-o-up text-success h6' aria-hidden='true'></i>"
          obj.forEach(function (obj) {
            count = count + 1;
            var uom1 = " Nos"
            if (obj.mrf_uom != "" && obj.mrf_uom != null) {
              uom1 = " " + obj.mrf_uom;
            }
            part_id = obj.part_id;


            $("#bom_list_select").data("part_name", obj.part_name);
            $("#bom_list_select").data("part_id", obj.part_id);
            $("#details").text($("#details").text() + uom1);
            details_body
            $("#details_body").find("tr").eq(1).find("td").eq(0).html(obj.part_name)
            $("#details_body").find("tr").eq(1).find("td").eq(1).html(obj.req_qty + " " + uom1)
            $("#details_body").find("tr").eq(1).find("td").eq(2).html(obj.dated)
            $("#details_body").find("tr").eq(1).find("td").eq(3).html(obj.req_date)
            $("#details_body").find("tr").eq(3).find("td").eq(0).html(obj.order_type)
            $("#details_body").find("tr").eq(3).find("td").eq(1).html(obj.stock_for_sufficent_days)
            $("#details_body").find("tr").eq(3).find("td").eq(2).html(obj.last_purchase_date)
            $("#details_body").find("tr").eq(3).find("td").eq(3).html(obj.emp_name)
          });

          get_mrf_purchase_details(mrf_id, part_id);
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




}
function insert_creditors() {


  $.ajax({
    url: "php/insert_creditors.php",
    type: "get", //send it through get method
    data: {
      creditor_name: $('#creditor_name').val(),
      creditor_phone: $('#creditor_phone').val(),
      creditor_gst: $('#creditor_gst').val(),
      creditors_email: $('#creditors_email').val()

    },
    success: function (response) {


      if (response.trim() == "ok") {
        $("#creditors_modal").modal('hide');

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}




function get_material_request_form_details(mrf_purchase_id) {
  $.ajax({
    url: "php/get_material_request_form_details_purchase.php",
    type: "get", //send it through get method
    data: {
      mrf_purchase_id: mrf_purchase_id,


    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        var obj = JSON.parse(response);

        obj.forEach(function (obj) {
          $('#order_to').val(obj.order_to)
          $('#delivery_to').val(obj.delivery_to)
          $('#raw_material_part_no').val(obj.raw_material_part_id)
          $('#raw_material_stock').val(obj.raw_material_stock)
          $('#order_qty').val(obj.order_qty)
          $('#batch_qty').val(obj.batch_qty)
          $('#raw_material_rate').val(obj.raw_material_rate)
          $('#next_batch_date').val(obj.next_batch_date)
          $('#next_po_date').val(obj.next_po_date)
          $('#raw_material_budget').val(obj.raw_material_budget)


          mrf_id_g = obj.mrf_id;




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

function get_material_request_form_list(sts_array, emp_id, field_name) {

  console.log(JSON.stringify(sts_array));

  $.ajax({
    url: "php/get_material_request_form_list.php",
    type: "POST", //send it through get method
    data: {
      status: JSON.stringify(sts_array),
      emp_id: 'all',
      mrf_purchase_by: current_user_id

    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            console.log(obj.status);
            var edit_btn = "disabled";
            var reject = '';
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
            else if (field_name == "purchase_requested" && (obj.status == "purchase_requested" || obj.status == "md_rejected-puraches" || obj.status == "md_rejected")) {
              if (obj.purchase_requested_by == current_user_id) {
                edit_btn = "";
              }
              else {
                edit_btn = "disabled";

              }

              if (obj.status == "md_rejected" || obj.status == "md_rejected-puraches") {
                reject = `<span class='badge bg-danger blink'>MD Rejected</span>`
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




            count = count + 1;
            // $('#material_requset_form_table').append(
            //   "<tr data-purchase_id = "+obj.mrf_purchase_id+"><td>"+count+"</td><td>"+obj.part_name+"</td><td>"+obj.req_date_format+"</td><td><div class='accordion' id='acc_"+obj.mrf_id+"'> <div class='accordion-item'> <h2 class='accordion-header'> <button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse_"+obj.mrf_id+"' aria-expanded='false' aria-controls='collapse_"+obj.mrf_id+"'> History </button> </h2> <div id='collapse_"+obj.mrf_id+"' class='accordion-collapse collapse' data-bs-parent='#acc_"+obj.mrf_id+"'> <div class='accordion-body'><ul class='list-group'> "+obj.form_history+"</ul> </div> </div> </div></div></td><td>"+obj.dated_format+"</td><td>"+obj.status+"</td> \
            //   <td><button "+edit_btn+" type='button' value='"+obj.mrf_id+"'  class='btn btn-outline-danger border-0 edit btn-animate' id=''><i class='fa fa-pencil'  aria-hidden='true'></i></button></td>\
            //   <td><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger border-0 print btn-animate' id=''><i class='fa fa-print' aria-hidden='true'></i></button></td></tr>"
            // );


            $('#material_requset_form_table').append(
              "<tr><td style='max-width:30px'>" + count + "</td><td><ul class='list-group ' ><li class='list-group-item '> <div class='d-flex justify-content-between align-content-around'> <div class = 'small'><span class='text-bg-light fw-bold'>  " + obj.mrf_id + ". </span>" + obj.part_name + order_type_badge + "<span class='ms-1 small  badge bg-primary'>" + obj.total_part_count + "</span> " + reject + "</div> <div> <button class='btn btn-outline-danger btn-sm border-0 history_btn' " +
              "data-bs-toggle='popover' data-bs-html='true' data-bs-placement='left' " +
              "data-history=\"" + obj.form_history.replace(/"/g, '&quot;') + "\" title='History'>" +
              "<i class='fa fa-clock' aria-hidden='true'></i></button></div></div></li><li class='list-group-item '><div class='d-flex justify-content-between align-content-around'> <div class='small'>" + obj.req_date_format + " </div> <div class='small'>" + commitment_sts + "  </div></div></li></ul></td><td class = 'd-flex'><button " + edit_btn + " type='button' value='" + obj.mrf_id + "'  data-part_id = '" + obj.part_id + "' class='btn btn-outline-danger border-0 edit btn-animate btn-sm ' id=''><i class='fa fa-pencil'  aria-hidden='true'></i></button> <button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-danger btn-sm border-0 print btn-animate ' id=''><i class='fa-solid fa-receipt' aria-hidden='true'></i></button><button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-secondary btn-sm border-0 view_hide btn-animate d-none' id=''><i class='fa-solid fa-eye-slash' aria-hidden='true'></i></button></td></tr>"
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
function insert_material_request_form_purchase() {

  var batch_details = [];
  var c_order_qty = 0;
  // Iterate through each row of the table
  if ($("#batch_table tr").length == 0) {
    if ($("#order_qty").val() == "" || parseInt($("#order_qty").val()) == 0 || $("#order_date").val() == "") {
      salert("Error", "Please enter order date and order quantity", "error");
      $("#material_request_form_purchase_btn").prop("disabled", false)
      return;
    }
    else {
      batch_details.push({ order_date: $("#order_date").val(), qty: $("#order_qty").val() });
      c_order_qty = parseInt($("#order_qty").val());
    }
  }
  else {
    $("#batch_table tr").each(function () {
      batch_details.push({ order_date: $(this).find("td").eq(1).text(), qty: $(this).find("td").eq(2).text() });
      c_order_qty = c_order_qty + parseInt($(this).find("td").eq(2).text())
    });
  }

  // your logic here

  console.log($('#raw_material_part_no').data("selected-part_id"));

  $.ajax({
    url: "php/insert_material_request_form_purchase.php",
    type: "POST", //send it through get method
    data: {
      mrf_id: mrf_id_g,

      order_to_id: $('#order_to').data("selected-creditor_id"),

      delivery_to_id: $('#delivery_to').data("selected-creditor_id"),
      uom: $("#uom").val(),
      purchase_email: $('#purchase_email').val(),
      approx_delivery_days: $('#approx_delivery_days').val(),
      raw_material_part_id: $('#raw_material_part_no').data("selected-part_id"),
      raw_material_stock: $('#raw_material_stock').val(),
      order_qty: c_order_qty,
      // batch_qty :  $('#batch_qty').val(),
      raw_material_rate: $('#raw_material_rate').val(),
      // next_batch_date :  $('#next_batch_date').val(),
      // next_po_date :  $('#next_po_date').val(),
      raw_material_budget: $('#raw_material_budget').val(),
      purchase_requested_by: current_user_id,
      batch_details: JSON.stringify(batch_details),


    },

    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {


        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function update_material_request_form_purchase() {

  var batch_details = [];
  // Iterate through each row of the table
  var c_order_qty = 0;
  // Iterate through each row of the table
  if ($("#batch_table tr").length == 0) {
    if ($("#order_qty").val() == "" || parseInt($("#order_qty").val()) == 0 || $("#order_date").val() == "") {
      salert("Error", "Please enter order date and order quantity", "error");
      $("#material_request_form_purchase_update_btn").prop("disabled", false)
      return;
    }
    else {
      batch_details.push({ order_date: $("#order_date").val(), qty: $("#order_qty").val() });
      c_order_qty = parseInt($("#order_qty").val());
    }
  }
  else {
    $("#batch_table tr").each(function () {
      batch_details.push({ order_date: $(this).find("td").eq(1).text(), qty: $(this).find("td").eq(2).text() });
      c_order_qty = c_order_qty + parseInt($(this).find("td").eq(2).text())
    });
  }

  $.ajax({
    url: "php/update_material_request_form_purchase.php",
    type: "get", //send it through get method
    data: {
      mrf_id: mrf_id_g,

      order_to_id: $('#order_to').data("selected-creditor_id"),

      delivery_to_id: $('#delivery_to').data("selected-creditor_id"),
      uom: $("#uom").val(),
      purchase_email: $('#purchase_email').val(),
      approx_delivery_days: $('#approx_delivery_days').val(),
      raw_material_part_id: $('#raw_material_part_no').data("selected-part_id"),
      raw_material_stock: $('#raw_material_stock').val(),
      order_qty: c_order_qty,
      // batch_qty :  $('#batch_qty').val(),
      raw_material_rate: $('#raw_material_rate').val(),
      // next_batch_date :  $('#next_batch_date').val(),
      // next_po_date :  $('#next_po_date').val(),
      raw_material_budget: $('#raw_material_budget').val(),
      purchase_requested_by: current_user_id,
      batch_details: JSON.stringify(batch_details),


    },
    success: function (response) {
      console.log(response);

      console.log(purchase_id);


      if (response.trim() == "ok") {


        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}




function get_material_request_form_list_purchase(sts_array, emp_id) {


  $.ajax({
    url: "php/get_material_request_form_list_purchase.php",
    type: "POST", //send it through get method
    data: {
      status: JSON.stringify(sts_array),
      emp_id: emp_id

    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            console.log(obj.status);


            // var emp_invalved_list = [];
            // emp_invalved_list.push("Created by " + obj.emp_name);

            // if (obj.tally_stock_approved_by != null && obj.tally_stock_approved_by != "" && obj.tally_stock_approved_by != "0") {
            //   emp_invalved_list.push("Tally Stock Approved by " + obj.tally_stock_approved_by_name);
            // }
            // if (obj.purchase_requested_by != null && obj.purchase_requested_by != "" && obj.purchase_requested_by != "0") {
            //   emp_invalved_list.push("Purchase Requested by " + obj.purchase_requested_by);
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



            count = count + 1;
            // $('#material_requset_form_purchase_table').append(
            //   "<tr><td>"+count+"</td><td>"+obj.part_name+"</td><td>"+obj.req_date_format+"</td><td><div class='accordion' id='acc1_"+obj.mrf_id+"'> <div class='accordion-item'> <h2 class='accordion-header'> <button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse1_"+obj.mrf_id+"' aria-expanded='false' aria-controls='collapse1_"+obj.mrf_id+"'> History </button> </h2> <div id='collapse1_"+obj.mrf_id+"' class='accordion-collapse collapse' data-bs-parent='#acc1_"+obj.mrf_id+"'> <div class='accordion-body'><ul class='list-group'> "+obj.form_history+"</ul> </div> </div> </div></div></td><td>"+obj.dated_format+"</td><td><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger border-0 print btn-animate' id=''><i class='fa fa-print' aria-hidden='true'></i></button></td></tr>"
            // );

            $('#material_requset_form_purchase_table').append(
              "<tr data-part_name = '" + obj.part_name + "'  data-part_id = '" + obj.part_id + "'><td style='max-width:30px'>" + count + "</td><td><ul class='list-group ' ><li class='list-group-item '> <div class='d-flex justify-content-between align-content-around'> <div class = 'small'><span class='text-bg-light fw-bold'>  " + obj.mrf_id + ". </span>" + obj.part_name + order_type_badge + "<span class='ms-1 small  badge bg-primary '>" + obj.total_part_count + "</span></div> <div> <button class='btn btn-outline-danger btn-sm border-0 history_btn' " +
              "data-bs-toggle='popover' data-bs-html='true' data-bs-placement='left' " +
              "data-history=\"" + obj.form_history.replace(/"/g, '&quot;') + "\" title='History'>" +
              "<i class='fa fa-clock' aria-hidden='true'></i></button></div></div></li><li class='list-group-item '><div class='d-flex justify-content-between align-content-around'> <div class='small'>" + obj.req_date_format + " </div> <div class='small'>" + commitment_sts + "  </div></div></li></ul></td><td class = 'd-flex'><button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-danger btn-sm border-0 print btn-animate ' id=''><i class='fa-solid fa-receipt' aria-hidden='true'></i></button><button type='button'  value='" + obj.mrf_id + "' class='btn btn-outline-secondary btn-sm border-0 view_hide btn-animate d-none' id=''><i class='fa-solid fa-eye-slash' aria-hidden='true'></i></button></td></tr>");


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


        console.log(response);


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