
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var part_id = 0;
var part_image_addr = ""
var vendor_id = 0
var new_part = "no"
var part_spec = [];
var qid = 0;
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
          if (part_image_addr != "") {
            console.log(part_image_addr);

            var timestamp = new Date().getTime(); // Get current timestamp
            $('#part_photo_preview').attr("src", "attachment/parts/" + part_id + "/" + part_image_addr + "?" + timestamp);

          }
          get_part_spec()
          get_sts()

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
    if (vendor_id != 0 && part_id != 0)
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
  });


  $('#search_quotation').change(function () {
    get_qcount($('#search_quotation').val())
    get_quotation_list($('#search_quotation').val())
  });


  $("#quotation_list_table").on("dblclick", "tr", function () {
    console.log($(this).find("td").data('part-id'));
    part_id = $(this).find("td").data('part-id');
    $('#partId').val(part_id);
    $('#part_name').val($(this).find("td").data('part_name'));
    $('#part_no').val($(this).find("td").data('part-no'));
    $('#part_name').prop("disabled", true)
    $('#part_no').prop("disabled", true)


    $('#spec_itemacc').show();
    part_image_addr = $(this).find("td").data('img_addr')
    if (part_image_addr != "") {
      console.log(part_image_addr);

      var timestamp = new Date().getTime(); // Get current timestamp
      $('#part_photo_preview').attr("src", "attachment/parts/" + part_id + "/" + part_image_addr + "?" + timestamp);

    }

    get_part_spec()
    get_sts()
    get_rate_quotation_part(part_id);
  });

});


function get_rate_quotation_part(rqpid) {

  $.ajax({
    url: "php/get_rate_quotation_part.php",
    type: "get", //send it through get method
    data: {
      rqpid: rqpid

    },
    success: function (response) {
      $('#quotation_list_table').empty()
      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0;
          var spec ='';
          var quot ='';


          obj.forEach(function (obj) {
            count = count + 1;

            $("#head_fixed-row").append("<th><div class='d-flex justify-content-between gap-2'><div class='my-auto'><p class='text-truncate my-auto small'>"+obj.creditor_name+"</p></div><div><div class='input-group'><select class='form-select border-0'><option value='0' selected>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></div></div><div><button class='btn btn-outline-success border-0 btn-sm'> <i class='fa-regular fa-star'></i></button></div></div></th>")

            spec = "<i class='fa-solid fa-rocket px-2' data-spec_pdf="+obj.spec_addr+"></i>";
            quot = "<i class='fa-brands fa-quora' data-quat_pdf="+obj.quotation_addr+"></i>";
            if (spec && quot) {
              $('.fixed-row').append("<td>"+spec+quot+"</td>");
            }
            if (spec && !quot) {
              $('.fixed-row').append("<td>"+spec+"</td>");
            }
            if (!spec && quot) {
              $('.fixed-row').append("<td>"+quot+"</td>");
            }if (!spec && !quot) {
              $('.fixed-row').append("<td>No PDF available</td>");
            }


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


          obj.forEach(function (obj) {
            count = count + 1;
            $('#quotation_list_table').append("<tr><td data-part-id='" + obj.part_id + "' data-part-no='" + obj.part_no + "'data-img_addr='" + obj.img_addr + "'data-part_name='" + obj.part_name + "'>" + obj.part_name + "<span class= 'text-danger'> (" + obj.qno + ")</span></td></tr>")


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


  $.ajax({
    url: "php/get_part_qsts.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id

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





function insert_part_spec() {


  $.ajax({
    url: "php/insert_part_spec.php",
    method: 'POST',
    data: {
      part_spec: part_spec,
      part_id: part_id,
      vendor_id: vendor_id
    },
    success: function (response) {
      console.log(response);


      if (response.trim() > 0) {
        qid = response.trim()
        $("#submit_btn").prop("disabled", true);
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


  $.ajax({
    url: "php/get_part_spec.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id

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
      part_id: part_id

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