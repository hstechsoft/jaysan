
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var part_id = null;
var process_id = null;
var part_image_addr = ""
var vendor_id = 0
var new_part = "no"
var part_spec = [];
var qid = 0;
var stype = '';
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


  $('#process_name').on('input', function () {
    //check the value not empty
    if ($(this).val().trim() !== "") {
      $("label[for='process_name']").fadeOut(300);
    } else {
      $("label[for='process_name']").fadeIn(300);
    }


    if ($('#process_name').val() != "") {
      $('#process_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_process_auto.php",
            type: "get", //send it through get method
            data: {

              process: request.term

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.process_name,
                  value: item.process_name,

                  process_id: item.process_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-process_id", ui.item.process_id);
          $("#machine_name").closest('.col').removeClass('d-none')
          $("#machine_name").focus()

          $("label[for='process_name']").fadeIn(300);
          $('#process_name').closest('.col').find('*').prop('disabled', true);
          process_id = ui.item.process_id;
          //   get_machine_time(ui.item.process_id)
          get_part_spec()
          get_sts()
        },

      })
    }

  });

  $("#switch_type").on("change", function (event) {


    // your logic here
    if ($(this).prop("checked") == true)
      switch_process("process")
    else
      switch_process("part")

  });


  get_quotation_report();
  get_quotation_list("0")
  get_qcount("0")
  get_std_spec()
  check_login();
  $('#add_vendor_submit').hide();
  $('#add_part_submit').hide();
  $('#inprocess_btn').hide();
  $('#pending_btn').hide();
  $('#spec_itemacc').hide();
  $("#unamed").text(localStorage.getItem("ls_uname"))

  $('#part_photo_preview').click(function () {

    if (part_id != 0 && part_image_addr == "")
      $("#part_photo_up").trigger("click");


  });

  $('#add_part_submit').click(function () {
    if ($('#part_name').val() != "" && $('#part_no').val() != "") {
      insert_new_part()
    }
    else {
      shw_toast("Missing", "Enter All details")
    }
  });
  $('#add_part_btn').click(function () {
    $('#add_part_submit').show();
    $('#part_photo_preview').hide()

    part_id = 0;
    part_image_addr = ""
    $('#part_name').val("")
    $('#part_no').val("")


  });

  $('#add_vendor_submit').click(function () {
    if ($('#vendor_form')[0].checkValidity()) {
      insert_vendor()
    }

  });
  $('#add_vendor_btn').click(function () {
    $('#add_vendor_submit').show();

    $('#vendor_form')[0].reset();
    vendor_id = 0;

    $("#vendor_form :input").prop("disabled", false);

  });

  $('#preview').on('click', function () {

    console.log($('#field_type').val());

    if ($('#field_type').val() != 0) {
      if ($('#field_type').val() == "text") {
        if ($('#flabel').val() != "") {
          show_preview()
        }
        else {
          shw_toast("Custom Field", "Kindly Enter Correct Details", " ")
        }
      }
      if ($('#field_type').val() == "dropdown") {
        if (($('#flabel').val() != "") && $('#fvalue').val() != "") {


          show_preview()
        }
        else {
          shw_toast("Custom Field", "Kindly Enter Correct Details", " ")
        }
      }
    }
    else {
      shw_toast("Custom Field", "Kindly choose custom field", " ")
    }
  });

  $('#add_field').on('click', function () {
    insert_custom_field_master()

  });

  $('#part_name').on('input', function () {
    //check the value not empty
    if ($('#part_name').val() != "") {
      $('#part_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto1.php",
            type: "get", //send it through get method
            data: {
              term: "name",
              part: request.term,


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.part_name + "-" + item.part_no,
                  value: item.part_name,
                  id: item.part_id,
                  part_no: item.part_no,
                  img_addr: item.part_image
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-part_id", ui.item.id);
          $('#part_no').data("selected-part_id", ui.item.id);
          $('#part_no').val(ui.item.part_no)
          $('#spec_itemacc').show();
          part_id = ui.item.id;
          part_image_addr = ui.item.img_addr
          if (part_image_addr != "" && part_image_addr != null) {
            console.log(part_image_addr);

            var timestamp = new Date().getTime(); // Get current timestamp
            $('#part_photo_preview').attr("src", "attachment/parts/" + part_id + "/" + part_image_addr + "?" + timestamp);

          }
          get_part_spec()
          get_sts()
          get_spec_details(ui.item.id)

        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#part_no').on('input', function () {
    //check the value not empty
    if ($('#part_no').val() != "") {
      $('#part_no').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto1.php",
            type: "get", //send it through get method
            data: {
              term: "no",
              part: request.term,


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.part_name + "-" + item.part_no,
                  value: item.part_no,
                  id: item.part_id,
                  part_name: item.part_name,
                  img_addr: item.part_image
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-part_id", ui.item.id);
          $('#part_name').data("selected-part_id", ui.item.id);
          $('#part_name').val(ui.item.part_name)
          $('#spec_itemacc').show();
          part_id = ui.item.id;
          part_image_addr = ui.item.img_addr
          if (part_image_addr != "") {
            var timestamp = new Date().getTime(); // Get current timestamp
            $('#part_photo_preview').attr("src", "attachment/parts/" + part_id + "/" + part_image_addr + "?" + timestamp);
          }
          get_part_spec()
          get_sts()
        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
          .appendTo(ul);
      };
    }

  });


  $('#vendor_phone').on('input', function () {
    //check the value not empty

    if ($('#vendor_phone').val() != "") {
      $('#vendor_phone').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_vendor_auto.php",
            type: "get", //send it through get method
            data: {
              term: "no",
              vendor: request.term,

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.creditor_name + "-" + item.creditor_mobile,
                  value: item.creditor_mobile,
                  id: item.creditor_id,
                  vendor_name: item.creditor_name,

                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $('#vendor_name').val(ui.item.creditor_name)

          vendor_id = ui.item.id;

          get_vendor()
        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.vendor_name + "</strong> - " + item.value + "</div>")
          .appendTo(ul);
      };
    }

  });


  $('#vendor_name').on('input', function () {
    //check the value not empty

    if ($('#vendor_name').val() != "") {
      $('#vendor_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_vendor_auto.php",
            type: "get", //send it through get method
            data: {
              term: "name",
              vendor: request.term,

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.creditor_name + "-" + item.creditor_mobile,
                  value: item.creditor_name,
                  id: item.creditor_id,
                  vendor_phone: item.creditor_mobile,

                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $('#vendor_phone').val(ui.item.creditor_mobile)

          vendor_id = ui.item.id;

          get_vendor()
        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.value + "</strong> - " + item.vendor_phone + "</div>")
          .appendTo(ul);
      };
    }

  });


  $('#part_photo_up').on('change', function () {
    var property = this.files[0];


    part_image_addr = upload_sv(property, "delivery_photo", "#part_photo_preview");

  });


  $("#submit_btn").on("click", function () {
    getFieldData();
    var spec_rate = $("#spec_rate").val();

    if (vendor_id != 0 && (part_id != null || process_id != null) && spec_rate != '')
      insert_part_spec()
    else
      shw_toast("Warning", "Enter vendor or part first")
  });



  $("#clear").on("click", function () {
    $('#field_type').val("")
    $('#flabel').val("")
    $('#fvalue').val("")
    $("#preview_body").empty()
  });

  $('#specification_upload').on('click', function (e) {
    if (qid <= 0) {
      shw_toast("error", "Kindly Add specification first");
      e.preventDefault(); // Prevent the file dialog from opening
    }
  });

  $('#quotation_upload').on('click', function (e) {
    if (qid <= 0) {
      shw_toast("error", "Kindly Add specification first");
      e.preventDefault(); // Prevent the file dialog from opening
    }
  });

  $('#quotation_upload').on('change', function (e) {
    if (qid > 0) {
      var property = this.files[0];
      upload_quotation(property, "quotation");
      $(this).prop("disabled", true);
    }
    else {

      shw_toast("error", "Kindly insert specification first");
      $(this).val(''); // Reset file input to prevent the file from being used
    }
  })

  $('#specification_upload').on('change', function () {
    if (qid > 0) {
      var property = this.files[0];
      upload_quotation(property, "spec");
      $(this).prop("disabled", true);
    }
    else {
      shw_toast("error", "Kindly insert specification first");
      $(this).val(''); // Reset file input to prevent the file from being used
    }
  })

  $("#upload_submit_btn").on("click", function () {
    $(this).addClass("d-none");
    $("#upload_card").addClass("d-none");
    $("#submit_btn").removeClass("d-none");
    $('#vendor_form')[0].reset();
    vendor_id = 0;
    $("#vendor_form :input").prop("disabled", false);


    $('#spec_form')[0].reset();
    vendor_id = 0;
    $("#spec_form :input").prop("disabled", false);

    $('#quotation_upload').val('');
    $('#specification_upload').val('');
    $('#quotation_upload').prop("disabled", false);
    $('#specification_upload').prop("disabled", false);
    $('#vendor_name').focus()
    shw_toast("success", "Quotation Added")
    get_sts()
    get_rate_quotation_part(part_id, process_id);

  });


  $('#search_quotation').change(function () {
    get_qcount($('#search_quotation').val())
    get_quotation_list($('#search_quotation').val())
  });
  $('.fixed-row').on("click", "td i.fa-rocket", function () {
    let url = $(this).data("spec_pdf");

    window.open(url, '_blank');
  })
  $('.fixed-row').on("click", "td i.fa-quora", function () {
    let url = $(this).data("quat_pdf");
    window.open(url, '_blank');
  })

  $("#head_fixed-row").on("change", "select", function () {

    part_id = $(this).data("rqpid");
    stype = 'part';
    const rating = parseInt($(this).val());
    const rqid = $(this).data("rqid");
    update_quotation_rating("rating", rating, rqid);
  });
  $("#head_fixed-row").on("click", ".star-fill", function () {
    part_id = $(this).data("rqpid");
    const rqid = $(this).data("rqid");
    const important = $(this).data("val");
    update_quotation_rating('', important, rqid);
  });

  $("#quotation_list_table").on("dblclick", "tr", function (event) {

    $('html, body').animate({
      scrollTop: $("#head_fixed-row").offset().top
    }, 300);

    if ($(this).find("td").data('part-id') == null)
      switch_process("process")
    else
      switch_process("part")

    // $("#head_fixed-row").empty();
    // $("#company_quotation_details").empty();
    $('#partId').val(part_id);
    $("#process_name").val($(this).find("td").data('part_name'))
    $('#part_name').val($(this).find("td").data('part_name'));
    $('#part_no').val($(this).find("td").data('part-no'));
    $('#part_name').prop("disabled", true)
    $('#process_name').prop("disabled", true)
    $('#part_no').prop("disabled", true)

    $('#spec_itemacc').show();
    part_image_addr = $(this).find("td").data('img_addr')
    if (part_image_addr != "" && part_image_addr != "undefined") {
      console.log(part_image_addr);

      var timestamp = new Date().getTime(); // Get current timestamp
      $('#part_photo_preview').attr("src", "attachment/parts/" + part_id + "/" + part_image_addr + "?" + timestamp);

    }

    part_id = $(this).find("td").data('part-id')
    process_id = $(this).find("td").data('process-id')
    get_part_spec()
    get_sts()
    get_std_spec()
    get_spec_details($(this).find("td").data('part-id'))
    get_rate_quotation_part($(this).find("td").data('part-id'), $(this).find("td").data('process-id'));


  });

  $("#part_spec_tbody").on("click", "tr i.fa-edit", function () {
    let fid = $(this).data("fid");
    console.log(fid);
    $("#add_field").addClass("d-none");
    $("#update_field").removeClass("d-none");
    get_custom_spec(fid);
    $("#update_field").data("fid", fid);
  })

  $("#update_field").on("click", function () {
    var flabel = $("#flabel").val();
    var ftype = $("#field_type").val();
    var fvalue = $("#fvalue").val();
    var fid = $(this).data("fid");
    update_spec_details(flabel, ftype, fvalue, fid);
  })

  $('#flabel').on('input', function () {
    //check the value not empty
    if ($('#flabel').val() != "") {
      $('#flabel').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_spec_auto.php",
            type: "get", //send it through get method
            data: {
              spec: request.term,
              part_id: part_id


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.flabel,
                  value: item.flabel,
                  id: item.fid,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          //   $(this).data("selected-part_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)
          get_custom_spec(ui.item.id)
          $("#update_field").data("fid", ui.item.id);


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });

  // $("#company_quotation_details").on("input", "td[contenteditable='true']", function () {
  //   $("i.fa-edit").removeClass("d-none");

  //   let $cell = $(this);
  //   let $row = $cell.closest("tr");
  //   let label = $row.find("td:first").text().trim();
  //   let value = $cell.text().trim();

  //   part_spec = part_spec.filter(item => item.label !== label);

  //   part_spec.push({ label: label, value: value });

  //   console.log("Updated part_spec:", part_spec);
  // });


  $("#head_fixed-row").on("click", "i.fa-edit", function () {

    $('html, body').animate({
        scrollTop: $("#add_vendor_btn").offset().top
    }, 300);

    $(".spec_add_btn").addClass("d-none");
    $("#spec_update_btn").removeClass('d-none');
    $("#spec_update_btn").data("rqid", $(this).data("rqid"))
    // let $cell = $("#company_quotation_details").find("tr:last-child");
    // let $row = $cell.closest("tr");
    // let label = $row.find("td:first").text().trim();
    // let value = $cell.text().trim();

    // part_spec = part_spec.filter(item => item.label !== label);

    // part_spec.push({ label: label, value: value });
    part_id = $(this).data("rqpid");
    vendor_id = $(this).data("vendor_id");
    console.log("Updating part:", part_id, "for vendor:", vendor_id);
    // console.log("Collected part_spec:", part_spec);
    get_vendor();
    get_rate_quotation_details($(this).data("rqid"));
  })

  $("#spec_update_btn").on("click", function () {
    $("#spec_update_btn").prop("disabled", true);

    console.log($(this).data("rqid"));
    var spec_rate = $("#spec_rate").val();
    if (spec_rate != null) {
      $("#std_spec .input-group").each(function () {

        getFieldData();
      });
      $("#parts_spec .input-group").each(function () {

        getFieldData();
      });
      update_rate_quotation($(this).data("rqid"));
    }
    else {
      shw_toast("Warning", "Enter rate first");
    }


  })
});

function get_rate_quotation_details(rqid) {
  if (rqid != null)


    $.ajax({
      url: "php/get_rate_quotation_details.php",
      type: "get", //send it through get method
      data: {
        rqid: rqid,

      },
      success: function (response) {

        console.log(response);

        if (response.trim() != "error") {
          if (response.trim() != "0 result") {

            var obj = JSON.parse(response);

            obj.forEach(function (obj) {
              var details = JSON.parse(obj.spec_details);
              console.log(details);

              $("#spec_rate").val(obj.rate);
              details.forEach(function (item) {
                $("#std_spec").find('.input-group').each(function () {
                  const labelText = $(this).find(".input-group-text").text().trim();
                  console.log($(this).find("input"));
                  console.log($(this).find("select"));
                  if (labelText === item.label) {
                    const inputEl = $(this).find("input");
                    const selectEl = $(this).find("select");


                    if (inputEl.length) {
                      inputEl.val(item.value);
                    }
                    if (selectEl.length) {
                      selectEl.val(item.value);
                    }
                  }

                });

                $("#parts_spec").find('.input-group').each(function () {
                  const labelText = $(this).find(".input-group-text").text().trim();

                  if (labelText === item.label) {
                    const inputEl = $(this).find("input");
                    const selectEl = $(this).find("select");

                    if (inputEl.length) {
                      inputEl.val(item.value);
                    }
                    if (selectEl.length) {
                      selectEl.val(item.value);
                    }
                  }
                });
              });
            })



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
function update_spec_details(flabel, ftype, fvalue, fid) {


  $.ajax({
    url: "php/update_spec_details.php",
    type: "get", //send it through get method
    data: {
      flabel: flabel,
      fvalue: fvalue,
      ftype: ftype,
      fid: fid

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == 'ok') {
        shw_toast("Success", "Updated Successfully")
        $('#field_type').val("")
        $('#flabel').val("")
        $('#fvalue').val("")
        get_spec_details(part_id)
      }





    },
    error: function (xhr) {
      alert()
    }
  });




}

function get_custom_spec(fid) {
  if (fid != null)


    $.ajax({
      url: "php/get_custom_spec.php",
      type: "get", //send it through get method
      data: {
        fid: fid,

      },
      success: function (response) {

        console.log(response);

        if (response.trim() != "error") {

          if (response.trim() != "0 result") {

            var obj = JSON.parse(response);

            obj.forEach(function (obj) {

              $("#field_type").val(obj.ftype);
              $("#flabel").val(obj.flabel);
              $("#fvalue").val(obj.fvalue);
            })



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

function get_spec_details(part_id) {
  if (part_id != null)


    $.ajax({
      url: "php/get_spec_details.php",
      type: "get", //send it through get method
      data: {
        part_id: part_id,

      },
      success: function (response) {

        console.log(response);

        if (response.trim() != "error") {
          $("#part_spec_tbody").empty();
          $("#custom_spec_tbody").empty();
          if (response.trim() != "0 result") {

            var obj = JSON.parse(response);

            var object = JSON.parse(obj[0].result);

            if (object.part_spec != null) {
              var count = 0;
              var data = object.part_spec;
              data.forEach(function (item) {
                count++;


                // Append row
                $("#part_spec_tbody").append(`<tr data-fid=${item.fid}><td>${count}</td><td>${item.flabel}</td><td>${item.ftype}</td><td>${item.fvalue || ""}</td><td><i class='fa fa-edit' data-fid='${item.fid}'></i></td></tr>`);
              });
            }
            else {
              $("#part_spec_tbody").append("<tr><td colspan='5'>No Data Available</td></tr>")
            }
            console.log(object.custom_spec);

            if (object.custom_spec != null) {
              console.log(object.custom_spec);

              var count = 0;
              var data = object.custom_spec;
              data.forEach(function (item) {
                count++;


                // Append row
                $("#custom_spec_tbody").append(`<tr data-fid=${item.fid}'><td>${count}</td><td>${item.flabel}</td><td>${item.ftype}</td><td>${item.fvalue || ""}</td></tr>`);
              });
            }

            else {
              $("#custom_spec_tbody").append("<tr><td colspan='4'>No Data Available</td></tr>")
            }




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


function switch_process(stype) {
  part_id = null
  process_id = null
  $("#process_name").val("")
  $("#part_name").val("")
  $("#part_no").val("")
  $("#sts_txt").text("No Entry")
  if (stype == "process") {

    $("#type_text").text("Process")
    if ($("#process_div").hasClass("d-none"))
      $("#process_div").removeClass("d-none")

    if ($("#part_div").hasClass("d-none") == false)
      $("#part_div").addClass("d-none")
  }
  if (stype == "part") {
    if ($("#part_div").hasClass("d-none"))
      $("#part_div").removeClass("d-none")

    if ($("#process_div").hasClass("d-none") == false)
      $("#process_div").addClass("d-none")

    $("#type_text").text("Parts")
  }

}

function update_quotation_rating(q_type, q_value, rqid) {
  console.log(q_type);
  console.log(q_value);
  console.log(rqid);

  if (rqid != null)


    $.ajax({
      url: "php/update_quotation_rating.php",
      type: "GET", //send it through get method
      data: {
        q_type: q_type,
        q_value: q_value,
        rqid: rqid

      },
      success: function (response) {

        console.log(response);

        if (response.trim() == "ok") {
          get_rate_quotation_part(part_id, process_id);
        }





      },
      error: function (xhr) {
        //Do Something to handle error
      }
    });




}
function get_rate_quotation_part(part_id, process_id) {
  var stype = "part"
  if (part_id == null)
    stype = "process"


  $.ajax({
    url: "php/get_rate_quotation_part.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,
      process_id: process_id,
      stype: stype

    },
    success: function (response) {

      console.log(response);

      if (response.trim() != "error") {
        $("#head_fixed-row").empty()
        $("#head_fixed-row").append("<td style='font-size: 13px;'>Vendor</td>")
        $("#company_quotation_details").empty()
        $("#company_quotation_details").append("<tr class='fixed-row' style='font-size: 13px;'><td>Specification</td></tr>")
        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0;
          var spec = '';
          var quot = '';


          obj.forEach(function (obj) {
            var dclass = "<i class=\"fa-regular fa-star star-fill text-danger\" data-rqid='" + obj.rqid + "' data-val='1'  data-rqpid='" + obj.rqpid + "'></i>"

            if (obj.important == 1) {
              dclass = "<i class=\"fa-solid fa-star star-fill text-success\" data-rqid='" + obj.rqid + "'  data-val='0'  data-rqpid='" + obj.rqpid + "'></i>"
            }


            count = count + 1;

            $("#head_fixed-row").append("<th style='min-width:25vw; font-size:15px'><div class='d-flex justify-content-between align-item-center gap-2'><div class=''><p class='text-truncate  small'>" + obj.creditor_name + "</p></div><i class='fa fa-edit my-auto' data-rqpid='" + obj.rqpid + "' data-rqid='" + obj.rqid + "' data-vendor_id='" + obj.vendor_id + "'></i><div><div class='input-group'><select class='form-select  rating' data-rqid='" + obj.rqid + "' data-vendor_id='" + obj.vendor_id + "' data-rqpid='" + obj.rqpid + "'><option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></div></div><div class='my-auto'>" + dclass + "</div></div></th>")
            $("#head_fixed-row th:last-child").find(".rating").val(obj.rating);

            var spec = ""
            if (obj.spec_addr != "")
              spec = "<i class='fa-solid fa-rocket px-2' data-spec_pdf='" + obj.spec_addr + "'></i>"
            if (obj.quotation_addr != "")
              spec = spec + "<i class='fa-brands fa-quora' data-quat_pdf=" + obj.quotation_addr + "></i>"

            $('.fixed-row').append("<td>" + spec + "</td>");


            var dd = JSON.parse(obj.spec_details);
            var table = $("#company_quotation_details");

            var trow;


            dd.forEach(function (item) {
              trow = table.find("tr");
              var existingRow = null;
              var labelExists = false;
              trow.each(function () {

                if ($(this).find("td").eq(0).text() === item.label) {
                  labelExists = true;
                  existingRow = $(this);
                  return false;
                }
              });

              if (!labelExists) {
                let emptyCells = "";
                for (let i = 1; i < count; i++) {
                  emptyCells += "<td></td>";
                }
                table.append("<tr style='font-size: 13px;'><td>" + item.label + "</td>" + emptyCells + "<td>" + item.value + "</td></tr>");
              }
              // if (!labelExists) {
              //   table.append("<tr><td>" + item.label + "</td><td>" + item.value + "</td></tr>");
              // }
              else {
                existingRow.append("<td>" + item.value + "</td>");
              }


            })

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


function get_quotation_report() {

  $.ajax({
    url: "php/get_quotation_report.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {
      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          obj.forEach(function (obj) {
            count++;

            var detls = JSON.parse(obj.details);
            var l_details = "";
            var q_count = 0;
            detls.forEach(function (item) {
              q_count += 1;
              l_details += "<li class='list-group-item'>" + item.vendor_name + " - " + item.vendor_phone + "<br></li>";
            })
            $("#quotation_report").append("<tr style='font-size: 13px'><td class='text-center align-middle'>" + count + "</td><td class='text-center align-middle'>" + obj.part_name + " <b class='text-danger'>(" + q_count + ") </b>" + "</td><td><ul class='list-group' style='max-height: 100px; overflow-y: auto;'>" + l_details + "</ul></td></tr>");


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

function get_quotation_list(sts) {

  $.ajax({
    url: "php/get_quotation_list.php",
    type: "get", //send it through get method
    data: {
      sts: sts

    },
    success: function (response) {
      $('#quotation_list_table').empty()
      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          var qtype = ""

          obj.forEach(function (obj) {
            if (obj.process_id != null) {
              qtype = "<i class=\"fa-solid fa-industry\"></i>"
            }
            count = count + 1;
            $('#quotation_list_table').append("<tr  style='font-size: 13px;'><td data-part-id='" + obj.part_id + "' data-rqid='" + obj.rqid + "' data-process-id='" + obj.process_id + "' data-part-no='" + obj.part_no + "'data-img_addr='" + obj.img_addr + "'data-part_name='" + obj.part_name + "'>" + obj.part_name + "<span class= 'text-danger'> (" + obj.qno + ") </span><span class= 'text-success'>" + qtype + " </span></td></tr>")


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

function get_qcount() {



  $.ajax({
    url: "php/get_qcount.php",
    type: "get", //send it through get method
    data: {
      sts: $('#search_quotation').val()

    },
    success: function (response) {

      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#tp_no').text(obj.total)
            $('#tpno').val(obj.tqno)


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


function get_sts() {
  var qtype = "part"
  if (part_id == null)
    qtype = "process"

  $.ajax({
    url: "php/get_part_qsts.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,
      process_id: process_id,
      qtype: qtype

    },
    success: function (response) {
      console.log(response);

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {


          var obj = JSON.parse(response);
          obj.forEach(function (obj) {
            $('#sts_txt').html(obj.sts)
            if (obj.sts == "In Process") {
              $('#inprocess_btn').hide();
              $('#pending_btn').show();
            }

            else if (obj.sts == "Pending") {
              $('#inprocess_btn').show();
              $('#pending_btn').hide();
            }

            $('#sts_txt').html($('#sts_txt').html() + " (Total : " + obj.qno + ")" + " (Latest : " + obj.last_date + ")")

          });

        }
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

function upload_quotation(property, upload_type) {




  {
    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();


    var form_data = new FormData();
    form_data.append("file", property);
    form_data.append("qid", qid);
    form_data.append("upload_type", upload_type);

    $.ajax({
      xhr: function () {
        var xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            console.log(percentComplete);

            if (percentComplete === 100) {

              shw_toast("Done", "Uploaded Done")
            }

          }
        }, false);

        return xhr;
      },
      url: 'upload_quotation.php',
      method: 'POST',
      data: form_data,

      contentType: false,
      cache: false,
      processData: false,
      beforeSend: function () {

      },
      success: function (response) {
        console.log(response)






      }

    });

  }

}
function get_vendor() {

  console.log(vendor_id);

  $.ajax({
    url: "php/get_vendor.php",
    type: "get", //send it through get method
    data: {
      vid: vendor_id

    },
    success: function (response) {

      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#vendor_name').val(obj.creditor_name)
            $('#vendor_phone').val(obj.creditor_phone)
            $('#vendor_gst').val(obj.creditor_gst)
            $('#vendor_addr').val(obj.creditors_addr)

            $('#vendor_email').val(obj.creditors_email)
            $('#vendor_website').val(obj.creditor_website)

          });

          $("#vendor_form :input").prop("disabled", true);

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

function insert_vendor() {


  $.ajax({
    url: "php/insert_vendor.php",
    type: "get", //send it through get method
    data: {
      vendor_name: $('#vendor_name').val(),
      vendor_phone: $('#vendor_phone').val(),
      vendor_gst: $('#vendor_gst').val(),
      vendor_addr: $('#vendor_addr').val(),
      vendor_remark: "",
      vendor_email: $('#vendor_email').val(),
      vendor_website: $('#vendor_website').val()

    },
    success: function (response) {


      vendor_id = response.trim()
      if (response.trim() > 0) {

        vendor_id = response.trim()
        console.log(vendor_id);
        $('#add_vendor_submit').hide();
        shw_toast("success", "Vendor Successfully Added")
        $("#vendor_form :input").prop("disabled", true);
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}



function update_rate_quotation(rqid) {
  var quotation_type = "process"
  if ($("#type_text").val() == "Parts")
    quotation_type = "parts"
  $.ajax({
    url: "php/update_rate_quotation.php",
    method: 'POST',
    data: {
      part_spec_data: JSON.stringify(part_spec),
      part_id: part_id,
      process_id: process_id,
      vendor_id: vendor_id,
      quotation_type: quotation_type,
      rqid: rqid,
      rate: $("#spec_rate").val(),
    },
    success: function (response) {
      console.log(response);


      if (response.trim() == 'ok') {
        $("#spec_update_btn").prop("disabled", true);
        $("#upload_card").removeClass("d-none");
        get_rate_quotation_part(part_id, process_id)
        shw_toast("Success", "Specification Sucessfully updated")
        // $("#spec_form :input").prop("disabled", true);
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function insert_part_spec() {
  var quotation_type = "process"
  if ($("#type_text").val() == "Parts")
    quotation_type = "parts"
  $.ajax({
    url: "php/insert_part_spec.php",
    method: 'POST',
    data: {
      part_spec: JSON.stringify(part_spec),
      part_id: part_id,
      process_id: process_id,
      vendor_id: vendor_id,
      quotation_type: quotation_type,
      rate: $("#spec_rate").val(),
    },
    success: function (response) {
      console.log(response);


      if (response.trim() > 0) {
        qid = response.trim()
        $("#submit_btn").prop("disabled", true);
        $("#upload_card").removeClass("d-none");
        shw_toast("Success", "Specification Sucessfully Added")
        $("#spec_form :input").prop("disabled", true);
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function getFieldData() {

  part_spec = []
  // Loop through all rows in 'parts_spec'
  $("#std_spec .input-group").each(function () {
    var label = $(this).find('.input-group-text').text().trim(); // Get the label text
    var value;

    // Check if input or dropdown
    if ($(this).find("input").length > 0) {
      value = $(this).find("input").val(); // For text input
    } else if ($(this).find("select").length > 0) {
      value = $(this).find("select").val(); // For dropdown
    }

    // Add to array only if label exists
    if (label) {
      part_spec.push({ label: label, value: value });
    }
  });


  $("#parts_spec .input-group").each(function () {
    var label = $(this).find('.input-group-text').text().trim(); // Get the label text
    var value;

    // Check if input or dropdown
    if ($(this).find("input").length > 0) {
      value = $(this).find("input").val(); // For text input
    } else if ($(this).find("select").length > 0) {
      value = $(this).find("select").val(); // For dropdown
    }

    // Add to array only if label exists
    if (label) {
      part_spec.push({ label: label, value: value });
    }
  });


}

function get_std_spec() {


  $.ajax({
    url: "php/get_std_spec.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      $("#std_spec").empty()
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          console.log(response);

          var obj = JSON.parse(response);
          obj.forEach(function (obj) {
            if (obj.ftype == "text") {
              $("#std_spec").append("<div class='col mb-2'> <div class='input-group input-group-sm '> <label class='input-group-text' for='" + obj.flabel + "'><span>" + obj.flabel + "</span> </label> <input id='preview_field' type='text' class='form-control' > </div></div>")
            }
            if (obj.ftype == "dropdown") {

              {
                var fvalue = obj.fvalue.split(',');
                var dropdown_option = "<option value='' selected>Choose Options...</option>"
                fvalue.forEach(function (item) {

                  dropdown_option = dropdown_option + "<option value='" + item + "'>" + item + "</option>"

                });

                $("#std_spec").append("<div class='col mb-2'> <div class='input-group input-group-sm'> <div class='input-group-prepend '> <span class='input-group-text ' id='basic-addon1'> " + obj.flabel + " </span> </div> <select class='custom-select form-control' id='preview_field'> " + dropdown_option + "  </select> </div></div>")
              }
            }
          });
        }
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
function get_part_spec() {
  var qtype = "part"
  if (part_id == null)
    qtype = "process"

  $.ajax({
    url: "php/get_part_spec.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,
      process_id: process_id,
      qtype: qtype

    },
    success: function (response) {
      $("#parts_spec").empty()
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          console.log(response);

          var obj = JSON.parse(response);
          obj.forEach(function (obj) {
            if (obj.ftype == "text") {
              $("#parts_spec").append("<div class='col mb-2'> <div class='input-group input-group-sm '> <label class='input-group-text' for='" + obj.flabel + "'><span>" + obj.flabel + "</span> </label> <input id='preview_field' type='text' class='form-control' > </div></div>")
            }
            if (obj.ftype == "dropdown") {

              {
                var fvalue = obj.fvalue.split(',');
                var dropdown_option = "<option value='0' selected>Choose Options...</option>"
                fvalue.forEach(function (item) {

                  dropdown_option = dropdown_option + "<option value='" + item + "'>" + item + "</option>"

                });

                $("#parts_spec").append("<div class='col mb-2'> <div class='input-group input-group-sm'> <div class='input-group-prepend '> <span class='input-group-text ' id='basic-addon1'> " + obj.flabel + " </span> </div> <select class='custom-select form-control' id='preview_field'> " + dropdown_option + "  </select> </div></div>")
              }
            }
          });
        }
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

function insert_new_part() {


  $.ajax({
    url: "php/insert_new_part1.php",
    type: "get", //send it through get method
    data: {
      part_name: $('#part_name').val(),
      part_no: $('#part_no').val(),
      new_part: 1

    },
    success: function (response) {
      console.log(response);


      if (response.trim() > 0) {

        part_id = response.trim()
        $('#part_photo_preview').show()

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}




function upload_sv(property, fname, preview) {
  if (!property) {
    return; // No file selected
  }
  var file_name = property.name;
  var file_extension = file_name.split('.').pop().toLowerCase();
  {
    var form_data = new FormData();
    form_data.append("file", property);
    form_data.append("part_id", part_id);
    form_data.append("part_no", $('#part_no').val());
    form_data.append("file_name", part_id + "." + file_extension);


    // Show the overlay and reset progress bar


    $.ajax({
      url: 'upload_part_image.php',
      method: 'POST',
      data: form_data,
      contentType: false,
      cache: false,
      processData: false,
      beforeSend: function () {
        //  $('#msg').html('Loading......');
        console.log('Loading......');

      },

      success: function (data) {


        console.log(data);
        // $('#msg').html(data);
        var timestamp = new Date().getTime(); // Get current timestamp

        $(preview).attr("src", "attachment/parts/" + part_id + "/" + part_id + "." + file_extension + "?" + timestamp);

        $('#add_part_submit').hide();

      }
    });

  }
  return "attachment/parts/" + part_id + "/" + part_id + "." + file_extension
}

function insert_custom_field_master() {


  $.ajax({
    url: "php/insert_custom_field_master.php",
    type: "get", //send it through get method
    data: {
      flabel: $('#flabel').val(),
      fvalue: $('#fvalue').val(),
      ftype: $('#field_type :selected').val(),
      std: 0,
      part_id: part_id,
      process_id: process_id

    },
    success: function (response) {

      console.log(response);


      if (response.trim() == "ok") {

        $('#field_type').val("")
        $('#flabel').val("")
        $('#fvalue').val("")
        $("#preview_body").empty()
        get_part_spec()
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}









function show_preview() {
  $("#preview_body").empty()
  if ($('#field_type').val() == "text") {
    $("#preview_body").append(" <div class='input-group input-group-sm '> <label class='input-group-text' for='preview_field'><span>" + $('#flabel').val() + "</span> </label> <input id='preview_field' type='text' class='form-control' > </div>")
  }
  if ($('#field_type').val() == "dropdown") {
    var fvalue = $("#fvalue").val().split(',');
    var dropdown_option = "<option value='0' selected>Choose Options...</option>"
    fvalue.forEach(function (item) {

      dropdown_option = dropdown_option + "<option value='" + item + "'>" + item + "</option>"

    });

    $("#preview_body").append(" <div class='input-group input-group-sm'> <div class='input-group-prepend '> <span class='input-group-text ' id='basic-addon1'> " + $('#flabel').val() + " </span> </div> <select class='custom-select form-control' id='preview_field'> " + dropdown_option + "  </select> </div>")
  }
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