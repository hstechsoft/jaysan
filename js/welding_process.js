const urlParams = new URLSearchParams(window.location.search);

const part_id = urlParams.get('part_id');
const part_name = urlParams.get('part_name');
const component_cat = urlParams.get('component_cat');




var cus_id = '0';
var issaved = 'yes'
var selected_process_tbl = ""
var selected_input_part_tbl = ""
var valid_sts = ""
var edit_process_id = ""
var mode = 'new'
var change_input_id = ""
var change_process_id = ""
var sel_input_part_id = "0"
var sel_output_part_id = "0"
var process_id_array = [];
var sel_comp_cat = ""
var extra_bom = [];
let editingRow = null;
var place_filter = 0;
var html_li = "";
let available_part_ids = [];

$(document).ready(function () {

  //   $('[id]').each(function(){

  //     var elementId = $(this).attr('id');
  //     console.log(elementId);
  // });

  //   $(window).on('beforeunload', function(e) {

  //     if(issaved == 'no')
  //      {
  //       var message = "You have unsaved changes in jaysan process. Are you sure you want to leave?";
  //       e.returnValue = message; // Standard way to display the message in modern browsers
  //       return message; // For older browsers
  //     }
  // });







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

  var editProcessId = sessionStorage.getItem('editProcessId');
  var edit_mode_exit = sessionStorage.getItem('edit_mode_exit');
  var breadcrumb = sessionStorage.getItem('breadcrumb');





  check_login();


  get_bom_recent()

  get_bom_count()


  // $('#prs_title').change(function() {
  //   if($('#prs_title').find(':selected').val()==0)

  //     $('#ap').hide()
  // else
  // $('#ap').show()

  //   //$('#prs_title').find(':selected').text()
  //   //$('#prs_title').find(':selected').val()
  //    });





  $("#unamed").text(localStorage.getItem("ls_uname"))

  $("#add_new_part_btn").click(function () {
    $("#addNewPartModal").modal('show');
  });







  //   $('#submit_btn').on('click', function() {


  //     var input_count =  $('#input_part_tbl .card').length;
  // var process_count =  $('#process_tbl .card').length;
  // var output_part = $('#output_part_txt').data('out-part-id')

  // var title_id = $('#prs_title').val()
  // console.log(title_id);


  //  if(input_count>=1 && process_count>=1 && output_part !="")
  //  {

  //   var processData = []
  // var inputPartsData = [];
  // $('#input_part_tbl .card').each(function(index) {


  //   inputPartsData.push({
  //     part_id: $(this).data('part-id'),
  //     pre_process_id: $(this).data('pre-process-id'),
  //     part_qty: $(this).data('part-qty')
  // });
  // });

  // $('#process_tbl .card').each(function(index) {

  //   processData.push({
  //     process_id: $(this).data('process-id'),

  //     output_part:output_part
  // });

  // });

  // var url = ''
  // if(input_count>=1 && process_count==1)
  // {
  //   // one/many input one process
  //  url = 'php/insert_ass_process1.php'

  // }
  // else if(input_count==1 && process_count>1)
  // {
  // // one input many process
  //  url = 'php/insert_wel_process1.php'
  // }
  // $.ajax({

  //   url: url,
  //   method: 'POST',
  //   data: {
  //       processData: processData,
  //       inputPartsData: inputPartsData,

  //   },
  //   success: function(response) {
  //       console.log(response);
  //   if(response.trim()=="ok")
  //   {
  //     issaved = "yes"
  //     location.reload()
  //   }
  //   }
  // });
  //  }
  //  else
  //  shw_toast("Enter Required" , "Kindly enter all required ")

  //   });

  $("#process_default").on("change", function () {

    var component_cat = $("#ma_name").data("component_cat");
    var output_part = $("#ma_name").data("part_id");
    var process_id = $("#ma_name").data("pro_id");

    if ($("#submit_btn").hasClass("d-none")) {
      if ($(this).is(":checked")) {
        if (component_cat && process_id && output_part) {
          update_wel_process_default(output_part, component_cat, 1, process_id);
        }
      } else {
        if (component_cat && process_id && output_part) {
          update_wel_process_default(output_part, component_cat, 0, process_id);
        }
      }
    }

  });

  $("#process_title").on("focusout", function () {

    var process_id = $("#ma_name").data("pro_id");
    if ($("#submit_btn").hasClass("d-none")) {
      if ($(this).val()) {
        if (process_id) {
          update_wel_process_title(process_id, $(this).val());
        }
      } else {
        salert("Warning", "Overall Tittle Required", "warning");
      }
    }

  });

  $('#submit_btn').on('click', function () {
    $('#submit_btn').prop('disabled', true);
    var processData = []
    var inputPartsData = [];
    var process_title = $("#process_title").val();
    var is_default = '';
    var tbl_valid = true;

    if ($("#process_default").is(":checked")) {
      is_default = 1;
    }
    else {
      is_default = 0;
    }
    $("#welding_table tr").each(function () {

      if ($(this).find("td").eq(1).find("li").length < 1 || $(this).find("td").eq(2).find("li").length < 1) {
        $('#submit_btn').prop('disabled', false);
        shw_toast("Warning", "Invalid/Missing Data")
        tbl_valid = false
      }
    })

    if (tbl_valid === true && process_title && process_title.trim() !== '') {







      var allWeldingData = [];
      var output_part = "0"
      var count = 0;
      // var newObj = {}
      // var extra_bomm = []
      // $("#godown_table_data tr").each(function () {
      //   var is_default = 0
      //   if($(this).find("td").find("input").is(":checked")){
      //     is_default = 1
      //   }
      //   var text = $(this).find("td").eq(5).text().trim();

      //   var parts = text.split(" ");

      //   var min = parts[0];
      //   var max = parts[1];

      //   newObj = {
      //     godown_id: $(this).data("godown_id"),
      //     dep_id: $(this).data("dept_id"),
      //     dep_sec_id: $(this).data("section_id"),
      //     dep_sec_machine_id: $(this).data("machine_id"),
      //     min_time: min,
      //     max_time: max,
      //     cost: $(this).find("td").eq(6).text(),
      //     is_default: is_default
      //   };
      //   extra_bomm.push(newObj)
      // })

      // console.log(extra_bomm);

      $("#welding_table tr").each(function () {
        var inputPartsArr = [];
        var inputParts = $(this).find("td").eq(1).find("li");
        var processPart = $(this).find("td").eq(2).find("li");
        var process_time = $(this).find("td").eq(3).find("li");
        output_part = $("#part_no_out").data('selected-part_id')
        inputParts.each(function () {
          inputPartsArr.push({
            part_id: $(this).data('part-id'),

            part_qty: $(this).data('part-qty'),
            pre_process_id: $(this).data('in_previous_process_id')
          });
        });

        var processData = {
          process_id: processPart.data('process-id'),

        };

        if (inputPartsArr.length > 0 || processData.output_part) {
          allWeldingData.push({
            input_parts: inputPartsArr,
            process: processData,
            extra_details: extra_bom[count] ? extra_bom[count] : extra_bom[count] = []

          });
        }
        count++;
      });




      console.log(allWeldingData);

      $.ajax({

        url: 'php/insert_wel_process1.php',
        method: 'POST',
        data: {
          allWeldingData: JSON.stringify(allWeldingData),
          output_part: output_part,
          component_cat: sel_comp_cat,
          process_title: process_title,
          is_default: is_default,
          // inputPartsData: inputPartsData,

        },
        success: function (response) {
          console.log(response);
          if (response.trim() == "ok") {
            issaved = "yes"
            location.reload()
          }
          else {
            salert("Warning", response, "warning");
            $('#submit_btn').prop('disabled', false);
          }
        }
      });



    }
    else {
      $('#submit_btn').prop('disabled', false);
      $("#process_title").focus();
      shw_toast("Warning", "Fill Process Title")
    }




  });







  // $('#update_btn').on('click', function () {
  //   $('#update_btn').prop('disabled', true);
  //   var del_process_list = [];
  //   var tbl_valid = true;
  //   var is_default = '';
  //   var process_title = $("#process_title").val();


  //   if ($("#process_default").is(":checked")) {
  //     is_default = 1;
  //   }
  //   else {
  //     is_default = 0;
  //   }
  //   $("#welding_table tr").each(function () {

  //     if ($(this).find("td").eq(1).find("li").length < 1 || $(this).find("td").eq(2).find("li").length < 1) {
  //       $('#update_btn').prop('disabled', false);
  //       console.log(process_title);

  //       shw_toast("Warning", "Invalid/Missing Data")
  //       tbl_valid = false
  //     }
  //   })
  //   // alert(process_title)
  //   console.log(process_title);

  //   if (tbl_valid === true && process_title && process_title.trim() !== '') {







  //     var allWeldingData = [];
  //     var output_part = "0";
  //     var count = 0;

  //     // var newObj = {}
  //     // var extra_bomm = []
  //     // $("#godown_table_data tr").each(function () {
  //     //   var is_default = 0
  //     //   if($(this).find("td").find("input").is(":checked")){
  //     //     is_default = 1
  //     //   }
  //     //   var text = $(this).find("td").eq(5).text().trim();

  //     //   var parts = text.split(" ");

  //     //   var min = parts[0];
  //     //   var max = parts[1];

  //     //   newObj = {
  //     //     godown_id: $(this).data("godown_id"),
  //     //     dep_id: $(this).data("dept_id"),
  //     //     dep_sec_id: $(this).data("section_id"),
  //     //     dep_sec_machine_id: $(this).data("machine_id"),
  //     //     min_time: min,
  //     //     max_time: max,
  //     //     cost: $(this).find("td").eq(6).text(),
  //     //     is_default: is_default
  //     //   };
  //     //   extra_bomm.push(newObj)
  //     // })

  //     // console.log(extra_bomm);


  //     $("#welding_table tr").each(function () {
  //       var inputPartsArr = [];

  //       var inputParts = $(this).find("td").eq(1).find("li");
  //       var processPart = $(this).find("td").eq(2).find("li");
  //       var process_time = $(this).find("td").eq(3).find("li");
  //       output_part = $("#part_no_out").data('selected-part_id')
  //       inputParts.each(function () {
  //         inputPartsArr.push({
  //           part_id: $(this).data('part-id'),

  //           part_qty: $(this).data('part-qty'),
  //           pre_process_id: $(this).data('in_previous_process_id'),
  //         });
  //       });

  //       var processData = {
  //         process_id: processPart.data('process-id'),

  //       };


  //       del_process_list.push(processPart.data('tr_process') || 0)


  //       if (inputPartsArr.length > 0 || processData.output_part) {
  //         allWeldingData.push({
  //           input_parts: inputPartsArr,
  //           process: processData,
  //           extra_details: extra_bom[count] ? extra_bom[count] : extra_bom[count] = []


  //         });
  //       }
  //       count++;
  //     });

  //     console.log(allWeldingData);
  //     console.log(del_process_list);
  //     console.log(sel_comp_cat);

  //     $.ajax({

  //       url: 'php/update_wel_process1.php',
  //       method: 'POST',
  //       data: {
  //         allWeldingData: JSON.stringify(allWeldingData),
  //         output_part: output_part,
  //         did: del_process_list,
  //         component_cat: sel_comp_cat,
  //         process_title: process_title,
  //         is_default: is_default,
  //         // inputPartsData: inputPartsData,

  //       },
  //       success: function (response) {
  //         console.log(response);
  //         if (response.trim() == "ok") {
  //           issaved = "yes"
  //           location.reload()
  //         }
  //       }
  //     });



  //   }

  //   else {
  //     $('#update_btn').prop('disabled', false);
  //     $("#process_title").focus();
  //     shw_toast("Warning", "Fill Process Title")
  //   }



  // });


  $("#welding_table").on("dblclick", "li", function () {

    let part_id = $(this).data("part-id");
    let id = $(this).data("id");

    if (part_id !== undefined && part_id !== "") {
      html_li = $(this);
      get_process_count(part_id, id);



    } else {
      salert("Warning", "Part ID Missing!, Try Later", "warning");
    }



  });


  if (part_id && part_name && component_cat) {

    $("#part_name_out")
      .val(part_name)
      .data("selected-part_id", part_id);

    $('#part_no_out').data("selected-part_id", part_id);

    get_bom_list(part_id);
    get_bom_list_comp(part_id);
    setTimeout(() => {
      $('#bom_list_select').val(component_cat).trigger('change');
    }, 500);

  }

  $('#part_no_out').on('input', function () {
    //check the value not empty
    clear();
    if ($('#part_no_out').val() != "") {
      $('#part_no_out').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto_wel.php",
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
                  part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("selected-part_id", ui.item.id);
          console.log(ui.item.id)
          $('#part_name_out').data("selected-part_id", ui.item.id);
          $('#part_name_out').val(ui.item.part_name)
          get_bom_list(ui.item.id)
          get_bom_list_comp(ui.item.id)
        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
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
            url: "php/get_part_name_auto_wel.php",
            type: "get", //send it through get method
            data: {
              term: "no",
              part: request.term,
              godwon_id: $("#godown_filter").data("godown_id"),
              department_id: $("#department_filter").data("dept_id"),
              section_id: $("#section_filter").data("sec_id"),


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.part_name + "-" + item.part_no,
                  value: item.part_no,
                  id: item.part_id,
                  part_name: item.part_name
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
          $('#qty').focus()
        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#part_name_out').on('input', function () {
    //check the value not empty
    clear();

    if ($('#part_name_out').val() != "") {
      $('#part_name_out').autocomplete({
        //get data from database return as array of object which contain label,value
        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto_wel.php",
            type: "get", //send it through get method
            data: {
              term: "name",
              part: request.term,
              godwon_id: $("#godown_filter").data("godown_id"),
              department_id: $("#department_filter").data("dept_id"),
              section_id: $("#section_filter").data("sec_id"),
            },
            dataType: "json",
            success: function (data) {
              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.part_name + "-" + item.part_no,
                  value: item.part_name,
                  id: item.part_id,
                  part_no: item.part_no
                };
              }));
            }
          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {
          $(this).data("selected-part_id", ui.item.id);
          $('#part_no_out').data("selected-part_id", ui.item.id);
          $('#part_no_out').val(ui.item.part_no);
          console.log(ui.item.id)

          get_bom_list(ui.item.id);
          get_bom_list_comp(ui.item.id);
        },
      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
          .appendTo(ul);
      };
    }
  });



  $('#part_name').on('input', function () {
    //check the value not empty
    if ($('#part_name').val() != "") {
      $('#part_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto_wel.php",
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
                  part_no: item.part_no
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
          $('#qty').focus()
        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
          .appendTo(ul);
      };
    }

  });


  $('#process_name').on('input', function () {
    //check the value not empty
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

        },

      })
    }

  });

  $('#add_new_process_btn').on('click', function () {
    $('#addNewProcessModal').modal('show');
  });

  $("#set_btn").click(function () {
    $("#godown_filter, #department_filter, #section_filter").prop("disabled", true);
  })
  $("#refresh_btn").click(function () {
    window.location.reload();
  })





  // Handle form submission
  $('#addNewProcessForm').on('submit', function (e) {
    e.preventDefault();

    var processName = $('#processName').val();
    var processDes = $('#processDes').val();

    $.ajax({
      url: 'php/insert_new_process.php', // PHP script to handle form submission
      type: 'POST',
      data: {
        process_name: processName,
        process_des: processDes
      },
      success: function (response) {
        // Handle success response
        shw_toast("Success", "Successfully Inserted")
        $('#addNewProcessModal').modal('hide');
        // Optionally, refresh the process table or perform other actions
        $('#processName').val('');
        $('#processDes').val('');
      },
      error: function () {
        // Handle error response
        // alert('Error adding process');
      }
    });
  });



















  // $('#add_part_btn').on('click', function() {


  // var input_count =  $('#input_part_tbl .card').length;
  // var process_count =  $('#process_tbl .card').length;

  // if(input_count >=1 && process_count>1)
  // {
  // shw_toast("invalid","multiple input not allowed for multiple process")
  // }
  // else{

  //   if($('#part_no').val() && $('#part_name').val()  && $('#qty').val() &&  $('#part_name').data('selected-part_id') )
  //     {
  //       issaved = 'no'
  //       var partId = $('#part_no').data('selected-part_id');
  //      var qty = $('#qty').val()
  //       var processId = 0
  //         var pre_process = "<span class='text-danger h6'> No Previous process</span>"

  //   if($('#finished_process').text().trim()!== '')
  //   {
  //      pre_process = $('#finished_process').html()
  //     processId = $('#finished_process').data('process-id');
  //   }



  //     if(mode == 'in_change')
  //       {
  //         update_input(partId,processId,change_input_id,qty)
  //       }
  //       else if(mode == 'edit')
  //         {
  //           insert_new_input(partId,processId,qty)
  //         }
  //     else
  //     {
  //       $('#input_part_tbl').append(" <div class='card mt-1' data-part-id="+partId+" data-part-qty="+qty+"  data-pre-process-id="+processId+ "> <div class='card-header '> <p class='my-auto'>"+$('#part_no').val()+"-"+  $('#part_name').val()+ " ("+  pre_process +")<br> Qty : "+ qty+ "</p> </div> </div>")
  //     }



  //   $('#process_name').val('')
  //   $('#part_no').val('');
  //   $('#part_name').val('');
  //   $('#finished_process').val('');
  //   $('#qty').val('');
  //   $('#finished_process').html('');

  //   $('#part_no').removeData('part-id');
  //   $('#finished_process').removeData('process-id');


  //   $('#pa_nxt_prs .card').each(function() {
  //     if ($(this).data('part-id') === partId && $(this).data('process-id') === processId ) {
  //         $(this).fadeOut(500);
  //     }
  //   });


  //   }
  //   else{
  //     shw_toast("Insert","Kindly insert qty or select part from autocomplete")
  //   }
  // }

  // });


  // $('#add_part_btn').on('click', function () {

  //   {
  //     // alert(1)
  //     if ($('#part_no').val() && $('#part_name').val() && $('#qty').val() && $('#part_name').data('selected-part_id')) {
  //       issaved = 'no'
  //       var partId = $('#part_no').data('selected-part_id');
  //       var qty = $('#qty').val();
  //       var process_id = $(this).val();
  //       var process = process_id ? `(${$(this).data("process")})` : "";







  //       {
  //         $('#welding_table .tbl_selected').parent().find("td").eq(1).find("ul").append(" <li class='list-group-item d-flex justify-content-between' data-part-id=" + partId + " data-part-qty=" + qty + " data-in_previous_process_id=" + process_id + ">  <p class='my-auto'>" + $('#part_name').val() + " <b class='bg-warning'>" + process + "</b> <br> Qty : <span contenteditable='true' class= 'px-2 qty-editable'>" + qty + "</span></p>  <button class='btn btn-sm btn-outline-danger border-0 m-0 p-0 px-3'><i class='fa fa-trash' aria-hidden='true'></i></button> </li>")
  //       }




  //       $('#process_name').val('')
  //       $('#part_no').val('');
  //       $('#part_name').val('');

  //       $('#qty').val('');


  //       $('#part_no').removeData('part-id');



  //     }
  //     else {
  //       console.log($('#part_no').val(), $('#part_name').val(), $('#qty').val(), $('#part_name').data('selected-part_id'));

  //       shw_toast("Insert", "Kindly insert qty or select part from autocomplete")
  //     }
  //   }

  // });
  $('#add_part_btn').on('click', function () {

    if ($('#part_no').val() && $('#part_name').val() && $('#qty').val() && $('#part_name').data('selected-part_id')) {

      var partId = $('#part_no').data('selected-part_id');
      var bomQty = parseFloat($('#qty').attr("data-original")) || parseFloat($('#qty').val());
      var newQty = parseFloat($('#qty').val());
      // var available_part_ids = $(this).data("available_part_ids") || [];
      if (available_part_ids.includes(partId)) {
        salert("Warning", "Part Is Already There. If Qty Available Update The Qty.", "warning");
        return;
      }

      let usedQty = getUsedQty(partId);
      newQty = newQty - usedQty
      let remaining = bomQty - usedQty;
      let cla = 'd-none';

      let rows = $('#welding_table tr');

      if (rows.length >= 1 && available_part_ids.length > 0) {
        cla = '';
      }
      // alert(usedQty+" "+remaining)
      if (remaining <= 0) {
        salert("Warning", "No quantity remaining for this part");
        return;
      }

      if (newQty > remaining) {
        salert("Warning", "Only " + remaining + " quantity available");
        return;
      }

      var process_id = $(this).val();
      var process = process_id ? `(${$(this).data("process")})` : "";

      $('#welding_table .tbl_selected')
        .parent()
        .find("td")
        .eq(1)
        .find("ul")
        .append(`
        <li class='list-group-item d-flex justify-content-between'
            data-part-id="${partId}"
            data-part-qty="${newQty}"
            data-in_previous_process_id="${process_id}">
          <p class='my-auto'>
            ${$('#part_name').val()} 
            <b class='bg-warning'>${process}</b><br>
            Qty : <span contenteditable='true' class='px-2 qty-editable'>${newQty}</span>
          </p>
          <button class='btn btn-sm btn-outline-danger border-0 m-0 p-0 px-3'>
            <i class='fa fa-trash'></i>
          </button>
          <button class='btn btn-sm btn-outline-success border-0 m-0 p-0 px-3 fa-plus ${cla}' data-part-id="${partId}"
            data-part-qty="${newQty}"
            data-in_previous_process_id="${process_id}">
            <i class="fa-solid fa-plus fa-bounce"></i>
          </button>
        </li>
      `);

      // clear
      $('#part_no, #part_name, #qty').val('');
    }
    else {
      shw_toast("Insert", "Kindly insert qty or select part");
    }
  });




  $('#add_process_btn').on('click', function () {




    {
      if ($('#process_name').val() && $('#process_name').data('selected-process_id')) {
        issaved = 'no'


        {

          $("#welding_table .tbl_selected").parent().find("td").eq(2).find("ul").empty()
          $("#welding_table .tbl_selected").parent().find("td").eq(2).find("ul").append("<li class='list-group-item' data-process-id=" + $('#process_name').data('selected-process_id') + "> <p class='m-0 p-0'>" + $('#process_name').val() + "</p></li>")
          get_machine($('#process_name').data('selected-process_id'));

          if ($("#welding_table .tbl_selected").parent().find("td").eq(0).data("ori_process-id")) {
            update_wel_process($('#process_name').data('selected-process_id'), $("#welding_table .tbl_selected").parent().find("td").eq(0).data("ori_process-id"));
          }


        }

        $('#process_name').val('')

        $('#process_name').removeData('selected-process_id');
      }
      else {
        shw_toast("Insert", "Kindly select Process from autocomplete")
      }
    }


  });
  // $('#add_process_btn').on('click', function() {

  //   var input_count =  $('#input_part_tbl .card').length;
  //   var process_count =  $('#process_tbl .card').length;

  //   if(input_count == 0)
  //   shw_toast("Input","Kindly enter Input part first")
  // else if(input_count>1 && process_count >=1)
  // {

  //   if(mode == 'prs_change')
  //     {
  //      var  processId =   $('#process_name').data('selected-process_id')
  //       update_process(processId,change_process_id)
  //     }
  //     else
  //     shw_toast("invalid","multiple input not allowed for multiple process")
  // }

  // else
  // {
  //  if($('#process_name').val() && $('#process_name').data('selected-process_id'))
  //  {
  //   issaved = 'no'
  // console.log(mode);
  // if(mode == 'prs_change')
  //   {
  //    var  processId =   $('#process_name').data('selected-process_id')
  //     update_process(processId,change_process_id)
  //   }
  //   else if(mode == 'edit')
  //     {
  //       var  processId =   $('#process_name').data('selected-process_id')
  //       insert_new_process(processId)
  //     }
  //   else
  // {
  //   $('#process_tbl').append(" <div class='card mt-1' data-process-id="+$('#process_name').data('selected-process_id')+ "> <div class='card-header'> <h6>"+$('#process_name').val()+"</h6> </div> </div>")
  // }

  //   $('#process_name').val('')

  //   $('#process_name').removeData('selected-process_id');
  //  }
  //  else{
  //   shw_toast("Insert","Kindly select Process from autocomplete")
  //  }
  // }


  // });







  $('#godown_filter').on('input', function () {
    // if ($(this).val().trim() === '') {
    //   $(this).removeData("godown_id");
    // }
    $(this).removeData("godown_id");
    $('#department_filter').val('').removeData("dept_id");
    $('#section_filter').val('').removeData("section_id");

    //check the value not empty
    if ($('#godown_filter').val() != "") {
      $('#godown_filter').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_creditors_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.creditor_name,
                  value: item.creditor_name,
                  id: item.creditor_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("godown_id", ui.item.id);
          get_part_dept_wise('', ui.item.id, '', '');


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#department_filter').on('input', function () {

    $(this).removeData("dept_id");
    $('#section_filter').val('').removeData("section_id");

    //check the value not empty
    if ($('#department_filter').val() != "") {
      $('#department_filter').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_departments_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              godown_id: $("#godown_filter").data("godown_id")

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.dep_name,
                  value: item.dep_name,
                  id: item.dep_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("dept_id", ui.item.id);
          get_part_dept_wise('', $("#godown_filter").data("godown_id"), ui.item.id, '');


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#section_filter').on('input', function () {

    //check the value not empty     
    $(this).removeData("sec_id");

    if ($('#section_filter').val() != "") {
      $('#section_filter').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_sections_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              dep_id: $("#department_filter").data("dept_id")

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.sec_name,
                  value: item.sec_name,
                  id: item.dep_sec_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("sec_id", ui.item.id);
          get_part_dept_wise('', $("#godown_filter").data("godown_id"), $("#department_filter").data("dept_id"), ui.item.id);



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });









  // welding process

  $("#welding_table").on("click", "button", function (event) {

    if ($(this).hasClass("add_pr")) {

      var ori_process_id = $(this).data("ori_process-id");

      console.log($(this).closest('tr').find("td").eq(1).find("ul").length);

      var in_length = $(this).closest('tr').find("td").eq(1).find("li").length
      var prs_length = $(this).closest('tr').find("td").eq(2).find("li").length
      console.log(in_length, prs_length);


      if (ori_process_id) {

        add_wel_process(ori_process_id);
      }
      else if (in_length > 0 && prs_length > 0) {
        var prs_count = parseInt($("#welding_table tr").length) + 1
        var pre_count = prs_count - 1
        $("#welding_table .tbl_selected").removeClass("tbl_selected")
        $(this).closest('tr').after("<tr class='small'><td class='tbl_selected'>" + prs_count + "</td><td > <ul class='list-group'> <li class='list-group-item d-flex justify-content-between' data-part-qty= 1>  <p class='my-auto'> process - <span class='pr_no'>" + pre_count + "</span> <br>  Qty : <span contenteditable='true' class= 'px-2 qty-editable'> 1</span></p>   </li> </ul></td><td><ul class='list-group'></ul></td><td><button class='btn btn-outline-success border-0 add_pr'><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td><td><button class='btn btn-outline-danger border-0 delete_pr'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
        // $("#welding_table").append("<tr class='small'><td class='tbl_selected'>"+prs_count+ "</td><td > <ul class='list-group'> <li class='list-group-item d-flex justify-content-between' data-part-qty= 1>  <p class='my-auto'> Process "+ pre_count + " <br>  Qty : <span contenteditable='true' class= 'px-2 qty-editable'> 1</span></p>   </li> </ul></td><td><ul class='list-group'></ul></td><td><button class='btn btn-outline-success border-0 add_pr'><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td><td><button class='btn btn-outline-danger border-0 delete_pr'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>");

        // Add event listener for contenteditable finish

        $("#welding_table .pr_no").each(function (index) {
          $(this).text(index + 1);

        })
        $("#welding_table tr").each(function (index) {
          $(this).find("td").eq(0).text(index + 1);

        })

      }
      else {
        shw_toast("invalid", "Kindly add input and process part first")
      }
    }
    else if ($(this).hasClass("fa-plus")) {

      var part_id = $(this).data("part-id");
      var part_qty = $(this).closest("li").find("span").text();
      var previous_process_id = $(this).data("in_previous_process_id");
      var process_id = $(this).closest("ul").data("ori_process-id");

      console.log(part_id, part_qty, previous_process_id, process_id);
      if (part_id && part_qty && process_id) {
        update_input_wel_parts(part_id, part_qty, previous_process_id, process_id);
      }
      else {
        console.log(part_id, part_qty, previous_process_id, process_id);
        salert("Warning", "Data Missing! Try Again.", "warning");
      }
    }
    else if ($(this).hasClass("delete_pr")) {
      var selected_li = $(this)
      var process_id = $(this).data("ori_process-id")

      {
        swal({
          title: "Are you sure - delete? ",
          text: "You will not be recover this  again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function (isConfirm) {
          if (isConfirm) {

            if (process_id) {
              delete_wel_process(process_id);
            }
            else {
              selected_li.closest("tr").remove();



              // Traverse through all list items and log their data attributes
              $("#bom_list li").each(function () {

                if (selected_li.data('part-id') == $(this).data('part_id')) {
                  $(this).removeClass("text-bg-secondary");
                }
              });


              $("#welding_table .pr_no").each(function (index) {
                $(this).text(index + 1);

              })
              $("#welding_table tr").each(function (index) {
                $(this).find("td").eq(0).text(index + 1);

              })
            }




          }

        })
      }
    }
    else if ($(this).hasClass("view_btn")) {
      var tbl_location = $(this).closest("ul")
      var process_id = $(this).val()
      get_machine_1(process_id, tbl_location)
    }
    else {
      console.log("delete");
      var selected_li = $(this).closest('li')
      var id = $(this).data("id");
      var process_id = $(this).data("ori_process-id");

      {
        swal({
          title: "Are you sure - delete? ",
          text: "You will not be recover this  again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function (isConfirm) {
          if (isConfirm) {
            if (id) {
              delete_input_wel_parts(id);
            }
            else {
              selected_li.remove();
              console.log(selected_li.data('part-id'));


              // Traverse through all list items and log their data attributes
              $("#bom_list li").each(function () {

                if (selected_li.data('part-id') == $(this).data('part_id')) {
                  $(this).removeClass("text-bg-secondary");
                }
              });
            }


          }

        })
      }
    }
  });

  $("#welding_table").on("click", "tr td", function () {
    console.log($(this).index());
    $("#godown_form")[0].reset();
    $("#godown_table_data").empty();
    if ($(this).index() == 0) {

      $("#welding_table .tbl_selected").removeClass("tbl_selected");
      $(this).addClass("tbl_selected");

      const encodedExtra = $(this).data("extra");
      var original_process_id = $(this).data("ori_process-id");

      if (encodedExtra) {
        try {
          const extra_data = JSON.parse(decodeURIComponent(encodedExtra));
          console.log(extra_data);

          // show table rows
          extra_data.forEach(function (extra_obj) {

            if (extra_obj.wtid > 0) {
              $("#godown_table_data").append(`
                <tr class="godown_row" data-ori_process-id=${original_process_id} data-wtid=${extra_obj.wtid} data-godown_id=${extra_obj.godown_id} data-dept_id=${extra_obj.dep_id} data-section_id=${extra_obj.dep_sec_id} data-machine_id=${extra_obj.dep_sec_machine_id}>
                  <td> <input class="form-check-input" data-wtid=${extra_obj.wtid} ${extra_obj.is_default == 1 ? "checked" : ''} type="radio" name="flexRadioDefault" id="default_godown" ></td>
                  <td>${extra_obj.godown_name}</td>
                  <td>${extra_obj.dep_name}</td>
                  <td>${extra_obj.dep_sec_name}</td>
                  <td>${extra_obj.dep_sec_machine_name}</td>
                  <td><span class='badge bg-secondary'>${extra_obj.min_time}</span> <span class='badge bg-primary'>${extra_obj.max_time}</span></td>
                  <td>${extra_obj.cost}</td>
                  <td>${extra_obj.qty}</td>
                  <td>
                    <i class='fa fa-pen pe-2 text-warning edit_extra btn' data-wtid=${extra_obj.wtid}></i>
                    <i class='fa fa-trash text-danger delete_extra btn' data-wtid=${extra_obj.wtid}></i>
                  </td>
                </tr>
              `);
            }

          });

          var row = $(this).closest("tr");
          var li = row.find("td").eq(1).find("ul");

          li.find("li").each(function () {
            available_part_ids.push("part_id", $(this).data("part-id"))
          })

          console.log(available_part_ids);

          $("#add_part_btn").data("available_part_ids", available_part_ids)
          $("#godown_data").removeClass("d-none");
        } catch (err) {
          console.error("Error parsing extra data:", err);
          // $("#godown_data").addClass("d-none");
        }
      } else {
        $("#godown_data").addClass("d-none");
      }

    }
  });

  $("#godown_table_data").on("change", "#default_godown", function () {
    update_work_time_master_default($(this).data("wtid"), 1, $(".form_godown_update_btn").data("ori_process_id"));
  })

  $("#godown_table_data").on("dblclick", "td", function () {
    var wtid = $(this).closest("tr").data("wtid");
    $("#opening_qty_modalLabel").text($(this).closest("tr").find("td").eq(1).text());

    $("#opening_qty_modal").modal("show");
    $(".add_opening_qty_btn").data("wtid", wtid);


  });

  $(".add_opening_qty_btn").click(function () {
    var wtid = $(this).data("wtid");
    var opening_qty = $("#opening_qty").val() || 0;

    update_manual_process_stock(wtid, opening_qty);

  });

  $("#welding_table").on("blur", ".qty-editable", function () {
    let newQty = $(this).text().trim();
    if (isNaN(newQty) || newQty <= 0) {
      shw_toast("Warning", "Please enter a valid quantity.");
      $(this).text("1"); // Reset to default value
    } else {
      $(this).closest("li").data("part-qty", newQty);

    }

    // var id = $(this).closest("li").data("id");
    // var part_qty = $(this).text().trim();

    // console.log(id, part_qty);
    // if (id && part_qty) {
    //   update_input_wel_parts_qty(id, part_qty);
    // }
    // else {
    //   console.log(part_id, part_qty, previous_process_id, process_id);
    //   salert("Warning", "Data Missing! Try Again.", "warning");
    // }




  });

  $("#welding_table").on("click", "tr td", function () {
    if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {

      var process_id = $(this).data("process-id");
      var ori_process_id = $(this).data("ori_process-id");
      $(".form_godown_update_btn").data("process_id", process_id);
      $(".form_godown_update_btn").data("ori_process_id", ori_process_id);
      $("#godown_data").removeClass("d-none");

      if (process_id && ori_process_id) {
        $(".form_godown_btn").addClass('d-none');
        $(".form_godown_update_btn").removeClass('d-none');
      } else {
        $(".form_godown_update_btn").addClass('d-none');
        $(".form_godown_btn").removeClass('d-none');
      }
    }
    else {
      $("#godown_data").addClass("d-none");
    }
  })

  $("#bom_list").on("click", "li", function () {
    $("#process_list").empty();
    var part_id = $(this).data('part_id');
    var process_details = [];
    var process_availble = $(this).data("process_availble");

    try {
      process_details = JSON.parse($(this).attr("data-process_details"));
    } catch (e) {
      process_details = [];
    }
    console.log(process_availble, process_details);


    $('#part_no').val($(this).data('part_no') == null ? 'no' : $(this).data('part_no'));
    $('#part_no').data('selected-part_id', part_id);
    $('#part_name').val($(this).data('part_name'));
    $('#part_name').data('selected-part_id', part_id);

    $('#qty').val($(this).data('part_qty'));

    // $("#add_part_btn").trigger("click");
    $('#process_name').focus();

    // Change the color of the clicked item
    $(this).addClass("text-bg-secondary")


    if (Number(process_availble) > 0) {
      $("#process_modal").modal("show");
      console.log(process_details);
      $("#process_title").text($(this).data('part_name'));
      process_details.forEach(function (obj) {
        $("#process_list").append("<li class='list-group-item' data-in_previous_process_id=" + obj.process_id + ">" + obj.process + "</li>")

        $("#close_btn").data({ "part_no": $(this).data('part_no'), "part_id": part_id, "part_name": $(this).data('part_name') })

      })
    } else {
      $("#add_part_btn").val('').data("process", '').trigger("click");
    }

    console.log($(this).data('part_qty'));

    console.log(part_id);
    console.log($(this).data('part_no'));

  });

  $("#process_list").on("dblclick", "li", function () {
    $("#add_part_btn").val($(this).data("in_previous_process_id")).data("process", $(this).text().trim()).trigger("click");
    $("#process_modal").modal("hide");
  })

  $("#process_modal_close_btn").click(function () {

    $("#add_part_btn").val('').data("process", $(this).text().trim()).trigger("click");
    // $("#process_modal").modal("hide");

  })

  $("#close_btn").click(function () {
    var part_id = $(this).data('part_id');

    $('#part_no').val($(this).data('part_no') == null ? 'no' : $(this).data('part_no'));
    $('#part_no').data('selected-part_id', part_id);
    $('#part_name').val($(this).data('part_name'));
    $('#part_name').data('selected-part_id', part_id);
    $("#add_part_btn").val('').data("process", '').trigger("click");

  })

  $("#process_list1").on("dblclick", "li", function () {

    // alert()
    if ($(this).data("in_previous_process_id") && $(this).data("id")) {
      update_input_wel_parts_pre_process($(this).data("id"), $(this).data("in_previous_process_id"));
    }
    else {
      shw_toast("Warning", "Data Missing! Try Later");
    }
    html_li.attr("data-in_previous_process_id", $(this).data("in_previous_process_id"));
    html_li.find("b").text($(this).text())

    $("#process_modal1").modal("hide");

  });

  $("#bom_recent_list").on("click", "li", function () {
    var part_id = $(this).data('part_id');
    var component_cat = $(this).data('cat');
    sel_comp_cat = component_cat
    $("#godown_data").addClass("d-none");
    selectAutocompleteByPartId(part_id); // Replace 1234 with the actual part_id
    get_bom_process_details_summary(part_id, component_cat)
    // get_bom_process_details(part_id, component_cat)

    available_part_ids = [];
    $("#process_title").val('');
    $('#process_default').prop("checked", false);
    $(".form_godown_update_btn").addClass("d-none");
    $(".form_godown_btn").removeClass("d-none");
    setTimeout(() => {
      get_bom(part_id, component_cat)
    }, 500)
  });


  $('#bom_list_select').change(function () {


    $("#godown_form")[0].reset();
    $("#godown_table_data").empty();
    if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {
      $("#godown_data").removeClass("d-none");
    }
    else {
      $("#godown_data").addClass("d-none");
    }


    get_bom_process_details_summary($('#bom_list_select').find(':selected').data('part_id'), $('#bom_list_select').find(':selected').val())
    console.log($('#bom_list_select').find(':selected').val());
    get_bom($('#bom_list_select').find(':selected').data('part_id'), $('#bom_list_select').find(':selected').val())
    // get_bom_process_details($('#bom_list_select').find(':selected').data('part_id'), $('#bom_list_select').find(':selected').val())
    sel_comp_cat = $('#bom_list_select').find(':selected').val()
    // $('html, body').animate({
    //   scrollTop: $('#welding_table').offset().top
    // }, 800);
  });

  $('#multi_process_list').on("click", "li", function () {

    $("#ma_name").data("pro_id", '')
    $("#ma_name").data("part_id", '')
    $("#ma_name").data("component_cat", '')
    var part_id = $(this).data("part_id");
    var component_cat = $(this).data("component_cat");
    var process_id = $(this).data("process_id");
    var is_default = $(this).data("is_default");

    $("#del_btn").val(process_id);

    if (part_id && component_cat) {
      $("#multi_process").modal("hide")
      $("#process_title").val($(this).data("process_title"))
      if (Number(is_default) > 0) {
        $("#process_default").prop("checked", true)

      } else {
        $("#process_default").prop("checked", false)

      }
      // get_bom(part_id, component_cat)
      $("#ma_name").data("pro_id", process_id)
      $("#ma_name").data("part_id", part_id)
      $("#ma_name").data("component_cat", component_cat)
      get_bom_process_details1(process_id)

    }
    else {
      shw_toast("Warning", "Required Data Missing")
    }
  })
  // $(".add_new_process_btnnnn").click(function () {

  //   get_bom($(this).data("part_id"), $(this).data("component_cat"));

  // })

  $("#search_process").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#bom_recent_list li").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $("#del_btn").on("click", function () {

    var process_id = $(this).val();
    if(process_id <= 0 ){
      salert("Warning", "Data Missing!, Try Later.", "warning");
      return;
    }
    swal({
      title: "Are you sure - delete? ",
      text: "You will not be recover this  again!",
      icon: "warning",
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {

        del_process_list(process_id)


      }

    })
  })


  $('#godown').on('input', function () {
    $(".form_godown_update_btn").removeData("wtid")
    $(this).removeData("godown_id");
    if ($(this).val().trim() === '') {
      $(this).removeData("godown_id");
    }

    $('#department').val('').removeData("dept_id");
    $('#section').val('').removeData("section_id");
    $('#machine').val('').removeData("machine_id");
    $('#min_time').val('');
    $('#max_time').val('');
    $('#cost').val('');

    $("#department_add_btn").addClass("d-none");
    $("#section_add_btn").addClass("d-none");
    $("#machine_add_btn").addClass("d-none");

    $("#department_da").empty();
    $("#section_da").empty();
    $("#machine_da").empty();

    //check the value not empty
    if ($('#godown').val() != "") {
      $('#godown').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_creditors_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.creditor_name,
                  value: item.creditor_name,
                  id: item.creditor_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("godown_id", ui.item.id);
          get_department(ui.item.id);
          $("#department_add_btn").removeClass("d-none");


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#department').on('input', function () {

    $(this).data("dept_id", "");
    $("#department_add_btn").removeClass("d-none");
    $('#section').val('').removeData("section_id");
    $('#machine').val('').removeData("machine_id");
    $('#min_time').val('');
    $('#max_time').val('');
    $('#cost').val('');


    $("#section_add_btn").addClass("d-none");
    $("#machine_add_btn").addClass("d-none");


    $("#section_da").empty();
    $("#machine_da").empty();

    //check the value not empty
    if ($('#department').val() != "") {
      $('#department').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_departments_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              godown_id: $("#godown").data("godown_id")

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.dep_name,
                  value: item.dep_name,
                  id: item.dep_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("dept_id", ui.item.id);
          get_dep_section(ui.item.id);
          $("#department_add_btn").addClass("d-none");
          $("#section_add_btn").removeClass("d-none");


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $("#department_da").on("click", "li a", function () {
    $('#section').val('').removeData("sec_id");
    $('#machine').val('').removeData("mach_id");
    $('#min_time').val('');
    $('#max_time').val('');
    $('#cost').val('');

    $("#section_da").empty();
    $("#machine_da").empty();

    $("#department").val($(this).text())
    $("#department").data("dept_id", $(this).data("dept_id"))
    get_dep_section($(this).data("dept_id"))
    $("#section_add_btn").removeClass("d-none");
    $("#department_add_btn").addClass("d-none");
  })

  $("#department_add_btn").on("click", function () {
    var go_id = $('#godown').data("godown_id");
    var dept_name = $('#department').val();
    insert_department(go_id, dept_name);
  })

  $('#section').on('input', function () {
    $("#section_add_btn").removeClass("d-none");
    $(this).data("sec_id", "");


    $('#machine').val('').removeData("machine_id");
    $('#min_time').val('');
    $('#max_time').val('');
    $('#cost').val('');


    $("#machine_add_btn").addClass("d-none");


    $("#machine_da").empty();

    //check the value not empty
    if ($('#section').val() != "") {
      $('#section').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_sections_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              dep_id: $("#department").data("dept_id") || $("#department_da").find("li").find("a").data("dept_id")

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.sec_name,
                  value: item.sec_name,
                  id: item.dep_sec_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("sec_id", ui.item.id);
          get_dep_sec_machine(ui.item.id);
          $("#section_add_btn").addClass("d-none");
          $("#machine_add_btn").removeClass("d-none");


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });
  $("#section_da").on("click", "li a", function () {

    $('#machine').val('').removeData("mach_id");
    $('#min_time').val('');
    $('#max_time').val('');
    $('#cost').val('');


    $("#machine_da").empty();

    $("#section").val($(this).text())
    $("#section").data('sec_id', $(this).data("sec_id"))
    get_dep_sec_machine($(this).data("sec_id"))
    $("#machine_add_btn").removeClass("d-none");
    $("#section_add_btn").addClass("d-none");

  })
  $("#section_add_btn").on("click", function () {

    var dept_id = $('#department').data("dept_id") || $('#department_da').find("li a").data("dept_id");
    console.log(dept_id);

    var sec_name = $('#section').val();
    insert_dep_section(dept_id, sec_name);
  })

  $('#machine').on('input', function () {

    $("#machine_add_btn").removeClass("d-none");
    $(this).data("mach_id", "");


    $('#min_time').val('');
    $('#max_time').val('');
    $('#cost').val('');



    if ($('#machine').val() != "") {

      $('#machine').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_sec_machine_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              sec_id: $("#section").data("sec_id") || $("#section_da").find("li").find("a").data("sec_id"),

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.machine_name,
                  value: item.machine_name,
                  id: item.dep_sec_machine_id
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("mach_id", ui.item.id);
          // get_dep_section(ui.item.id)
          $("#machine_add_btn").addClass("d-none");



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });
  $("#machine_da").on("click", "li a", function () {

    $('#min_time').val('');
    $('#max_time').val('');
    $('#cost').val('');

    $("#machine").val($(this).text())
    $("#machine").data("mach_id", $(this).data("mach_id"))
    $("#machine_add_btn").addClass("d-none");

    get_machine($(this).data("mach_id"))
  })
  $("#machine_add_btn").on("click", function () {
    var sec_id = $('#section').data("sec_id") || $('#section_da').find("li a").data("sec_id");
    console.log(sec_id);

    var mach_name = $('#machine').val();
    insert_dep_sec_machine(sec_id, mach_name);
  })


  $(".form_godown_btn").on("click", function () {

    // $("#godown_table_data").empty();
    var godown = $("#godown").val();
    var godown_id = $("#godown").data("godown_id");
    var depart = $("#department").val();
    var depart_id = $("#department").data("dept_id");
    var section = $("#section").val();
    // var section = $("#section").val() || $("#section_da").val();
    var section_id = $("#section").data("sec_id");
    // var section_id = $("#section").data("sec_id") || $("#section_da").find("li a").data("sec_id");
    var machine = $("#machine").val();
    var machine_id = $("#machine").data("mach_id");
    var min = $("#min_time").val();
    var max = $("#max_time").val();
    var cost = $("#cost").val();

    var is_default = $("#is_default").is("checked") ? 1 : 0;
    console.log(machine_id, section_id);


    if ($('#welding_table td.tbl_selected').length > 0) {
      var a = parseInt($('#welding_table td.tbl_selected').html()) - 1;
      if (extra_bom[a] === undefined) {
        extra_bom[a] = [];
      }

      const newObj = {
        godown_id,
        dep_id: depart_id,
        dep_sec_id: section_id,
        dep_sec_machine_id: machine_id,
        min_time: min,
        max_time: max,
        cost,
        is_default: is_default,
      };

      if (editingRow) {
        const editIndex = editingRow.index();

        if (extra_bom[a][editIndex]) {
          extra_bom[a][editIndex] = newObj;
        } else {
          extra_bom[a].push(newObj);
        }

        editingRow.attr({
          "data-godown_id": godown_id,
          "data-dept_id": depart_id,
          "data-section_id": section_id,
          "data-machine_id": machine_id
        });

        editingRow.find("td").eq(1).text(godown);
        editingRow.find("td").eq(2).text(depart);
        editingRow.find("td").eq(3).text(section);
        editingRow.find("td").eq(4).text(machine);
        editingRow.find("td").eq(5).text(min + " " + max);
        editingRow.find("td").eq(6).text(cost);

        editingRow = null;
      }
      else {

        extra_bom[a].push(newObj);

        $("#godown_table_data").append(`
        <tr data-godown_id="${godown_id}" data-dept_id="${depart_id}" data-section_id="${section_id}" data-machine_id="${machine_id}">
          <td> <input class="form-check-input" type="radio" name="flexRadioDefault" id="default_godown" ></td>
          <td>${godown}</td>
          <td>${depart}</td>
          <td>${section}</td>
          <td>${machine}</td>
          <td>${min} ${max}</td>
          <td>${cost}</td>
          <td></td>
          <td>
            <i class='fa fa-pen pe-2 text-warning edit_extra btn'></i>
            <i class='fa fa-trash text-danger delete_extra btn'></i>
          </td>
        </tr>
      `);
      }
    }


    $("#godown_form")[0].reset();
    $("#department, #section, #machine").val("").removeData("dept_id sec_id mach_id");
    $("#min_time, #max_time, #cost").val("");
    $("#department_da, #section_da, #machine_da").empty();
    $("#department_add_btn, #section_add_btn, #machine_add_btn").addClass("d-none");
  });

  $(".form_godown_update_btn").on("click", function () {

    var process_id = $(this).data("process_id");
    var ori_process_id = $(this).data("ori_process_id");
    var wtid = $(this).data("wtid") || 0;

    var godown_id = $("#godown").data("godown_id");
    var depart_id = $("#department").data("dept_id") || null;
    var section_id = $("#section").data("sec_id") || null;
    var machine_id = $("#machine").data("mach_id") || null;
    var min = $("#min_time").val();
    var max = $("#max_time").val();
    var cost = $("#cost").val();

    var openning_stock = $("#openning_stock").val() || 0;

    var is_default = $("#is_default").is(":checked") ? 1 : 0;

    if(godown_id && openning_stock >=0 && ori_process_id){
      update_manual_stock(openning_stock, ori_process_id, godown_id, depart_id, section_id);
    }

    if (godown_id && process_id && ori_process_id) {

      console.log(process_id, ori_process_id, godown_id, depart_id, section_id, machine_id, min, max, cost);

      update_work_time_master1(process_id, ori_process_id, godown_id, depart_id, section_id, machine_id, min, max, cost, wtid, is_default)

    } else {
      salert("Warning", "Fill the fields/Requied Data Missing.", "warning");
    }
  })

  $("#godown_table_data").on("click", "i.fa-trash", function () {

    const icon = $(this);
    const wtid = $(this).data("wtid");

    swal({
      title: "Are you sure - delete? ",
      text: "You will not be recover this  again!",
      icon: "warning",
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {

        if (wtid) {
          delete_work_time_master(wtid)
        }
        else {


          const row = icon.closest("tr");

          const index = row.index();

          const a = parseInt($('#welding_table td.tbl_selected').html()) - 1;

          if (extra_bom[a] && extra_bom[a][index] !== undefined) {
            extra_bom[a].splice(index, 1);
          }

          row.remove();

          console.log("Deleted entry from extra_bom:", extra_bom[a]);

        }
      }

    })

  });


  $("#godown_table_data").on("click", "i.fa-pen", function () {
    // get_department();

    editingRow = $(this).closest("tr");
    $(".form_godown_update_btn").data("wtid", $(this).data("wtid"))

    let value = $(this).closest("tr").find("td").eq(5).text().trim();
    let parts = value.split(" ");
    let min = parts[0] || "";
    let max = parts[1] || "";
    $("#godown").val($(this).closest("tr").find("td").eq(1).text());
    $("#godown").data("godown_id", $(this).closest("tr").data("godown_id"));
    get_department($(this).closest("tr").data("godown_id"));


    $("#department").val($(this).closest("tr").find("td").eq(2).text());
    $("#department").data("dept_id", $(this).closest("tr").data("dept_id"));
    get_dep_section($(this).closest("tr").data("dept_id"));

    $("#section").val($(this).closest("tr").find("td").eq(3).text());
    $("#section").data("sec_id", $(this).closest("tr").data("section_id"));
    get_dep_sec_machine($(this).closest("tr").data("section_id"));


    $("#machine").val($(this).closest("tr").find("td").eq(4).text());
    $("#machine").data("mach_id", $(this).closest("tr").data("machine_id"));

    $("#min_time").val(min);
    $("#max_time").val(max);
    $("#cost").val($(this).closest("tr").find("td").eq(6).text());
  });


  get_part_dept_wise('', '', '', '');

  $("#dept_wise_list").on("dblclick", "li a", function () {
    var partId = $(this).data("part_id");
    var part_name = $(this).text();

    // alert(partId)
    selectAutocompleteByPartId(partId)
  })


  $(document).on("focusout", ".qty-editable", function () {
    let span = $(this);
    let li = span.closest("li");

    let partId = li.data("part-id");
    let bomQty = parseFloat($("#bom_list li[data-part_id='" + partId + "']").data("part_qty")) || 0;

    let newQty = parseFloat(span.text()) || 0;

    let usedQty = getUsedQty(partId);
    let currentQty = parseFloat(li.attr("data-part-qty")) || 0;

    usedQty = usedQty - newQty;
    let remaining = bomQty - usedQty;

    if (newQty > remaining && partId != null) {
      salert("Warning", "Only " + bomQty + " allowed");
      span.text(currentQty);
      return;
    }

    if (newQty <= 0) {
      salert("Warning", "Invalid quantity");
      span.text(currentQty);
      return;
    }


    var id = $(this).closest("li").data("id");
    var part_qty = $(this).text().trim();

    console.log(id, part_qty);
    if ($("#submit_btn").hasClass("d-none")) {
      if (id && part_qty) {
        update_input_wel_parts_qty(id, part_qty);
      }
      else {
        console.log(part_id, part_qty, previous_process_id, process_id);
        salert("Warning", "Data Missing! Try Again.", "warning");
      }
    }


    li.attr("data-part-qty", newQty);
  });

  $("#default_btn").on("click", function () {

    var output_part = $(this).data("output_part");
    var component_cat = $(this).data("component_cat");
    let process_id = $(".default_process_list input:checked").val() || 0;

    console.log(output_part, component_cat, process_id);


    if (output_part && component_cat && process_id > 0) {
      $("#defaultProcess").modal("hide");
      update_wel_process_default(output_part, component_cat, 1, process_id)
    }
    else {
      salert("Warning", "Data Missing! Try Later.", "warning");
    }
  })
});



function getUsedQty(partId) {
  let total = 0;

  $("#welding_table tr").each(function () {
    $(this).find("td").eq(1).find("li").each(function () {
      let pid = $(this).data("part-id");
      let qty = parseFloat($(this).find(".qty-editable").text()) || 0;

      if (pid == partId) {
        total += qty;
      }
    });
  });

  return total;
}


function clear() {
  $("#welding_table").empty();
  // if ($("#update_btn").hasClass("d-none") == false)
  //   $("#update_btn").addClass("d-none")

  if ($("#del_btn").hasClass("d-none") == false)
    $("#del_btn").addClass("d-none")

  if ($("#submit_btn").hasClass("d-none"))
    $("#submit_btn").removeClass("d-none")

  $("#welding_table").append(" <tr class='small'> <td class='tbl_selected'> 1 </td> <td > <ul class='list-group'> </ul> </td> <td><ul class='list-group'> </ul></td>  <td><button class='btn btn-outline-success border-0 add_pr'><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td> <td><button class='btn btn-outline-danger border-0 delete_pr'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
  if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {
    $("#godown_data").removeClass("d-none");
  }
  else {
    $("#godown_data").addClass("d-none");
  }

  $("#bom_list").empty();
  $("#godown_table_data").empty();
  $("#multi_process_list").empty();
}

function get_process_count(part_id, id) {

  $.ajax({
    url: "php/get_process_count.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {
        $("#process_list1").empty()
        if (response.trim() != "0 results") {

          var obj = JSON.parse(response);

          obj.forEach(function (item) {

            if (Number(item.process_availble) > 0) {

              let process_details = [];

              try {
                process_details = JSON.parse(item.process_details);
              } catch (e) {
                console.error("Invalid JSON:", item.process_details);
                process_details = [];
              }

              $("#process_modal1").modal("show");

              process_details.forEach(function (obj) {

                $("#process_list1").append(
                  "<li class='list-group-item' data-id='" + id + "' data-in_previous_process_id='" + obj.process_id + "'>" + obj.process + "</li>"
                );
              });



            } else {
              shw_toast("Happy", "No Process Available");
            }

          });
        }
        else {
          // $("#machine_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")


        }
      }

    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}

function update_input_wel_parts_pre_process(id, previous_process_id) {

  console.log(id, previous_process_id);


  $.ajax({
    url: "php/update_input_wel_parts_pre_process.php",
    type: "post", //send it through get method
    data: {
      id: id,
      previous_process_id: previous_process_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_manual_process_stock(wtid, opening_qty) {

  console.log(wtid, opening_qty);


  $.ajax({
    url: "php/update_manual_process_stock.php",
    type: "post", //send it through get method
    data: {
      wtid: wtid,
      qty: opening_qty,
    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        $("#opening_qty_modal").modal("hide");
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_wel_process(process, process_id) {

  console.log(process, process_id);


  $.ajax({
    url: "php/update_wel_process.php",
    type: "post", //send it through get method
    data: {
      process_id: process_id,
      process: process,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_wel_process_title(process_id, process_title) {

  console.log(process_id, process_title);


  $.ajax({
    url: "php/update_wel_process_title.php",
    type: "post", //send it through get method
    data: {
      process_id: process_id,
      process_title: process_title,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_wel_process_default(output_part, component_cat, is_default, process_id) {

  console.log(output_part, component_cat, is_default, process_id);


  $.ajax({
    url: "php/update_wel_process_default.php",
    type: "post", //send it through get method
    data: {
      output_part: output_part,
      component_cat: component_cat,
      is_default: is_default,
      process_id: process_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        let res = JSON.parse(response);

        if (res.processes) {

          $("#default_btn").data("output_part", output_part);
          $("#default_btn").data("component_cat", component_cat);
          $(".default_process_list").empty(); // clear old list
          $("#defaultProcess").modal("show");

          res.processes.forEach(function (item) {
            $(".default_process_list").append(`
                      <li data-id="${item.process_id}" class="d-flex justify-content-between">
                        <label class="form-check-label" for="process_${item.process_id}">
                          ${item.process_title}
                        </label>
                        <input 
                          class="form-check-input" 
                          type="radio" 
                          name="flexRadioDefault" 
                          id="process_${item.process_id}" 
                          value="${item.process_id}">
                      </li>
                    `);
          });

        } else {
          $("#defaultProcess").modal("hide");
          salert("Warning", response, "warning");
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_input_wel_parts_qty(id, part_qty) {

  console.log(id, part_qty);


  $.ajax({
    url: "php/update_input_wel_parts_qty.php",
    type: "post", //send it through get method
    data: {
      id: id,
      qty: part_qty,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_work_time_master1(process_id, ori_process_id, godown_id, depart_id, section_id, machine_id, min, max, cost, wtid, is_default) {

  console.log(process_id, ori_process_id, godown_id, depart_id, section_id, machine_id, min, max, cost, wtid, is_default);


  $.ajax({
    url: "php/update_work_time_master1.php",
    type: "post", //send it through get method
    data: {
      min_time: min,
      max_time: max,
      process_id: process_id,
      machine_id: machine_id,
      dep_id: depart_id,
      dep_sec_id: section_id,
      cost: cost,
      godown_id: godown_id,
      ori_process_id: ori_process_id,
      wtid: wtid,
      is_default: is_default,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_manual_stock(openning_stock, ori_process_id, godown_id, depart_id, section_id) {

  console.log(openning_stock, ori_process_id, godown_id, depart_id, section_id);


  $.ajax({
    url: "php/update_manual_stock.php",
    type: "post", //send it through get method
    data: {
      process_id: ori_process_id,
      dep: depart_id,
      sec: section_id,
      godown: godown_id,
      qty: openning_stock,
    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Openning Stock Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function delete_work_time_master(wtid) {

  console.log(wtid);


  $.ajax({
    url: "php/delete_work_time_master.php",
    type: "post", //send it through get method
    data: {
      wtid: wtid,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        if (response.trim() > 0) {
          shw_toast("Success", "Deleted Successfully!");
          get_bom_process_details1(response.trim());
        }
        else {
          shw_toast("Success", "Deleted Successfully!");
          get_bom_process_details1($("#ma_name").data("pro_id"));

        }
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function add_wel_process(process_id) {

  console.log(process_id);


  $.ajax({
    url: "php/add_wel_process.php",
    type: "post", //send it through get method
    data: {
      process_id: process_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() >= 0) {

        if (response.trim() > 0) {
          $("#ma_name").data("pro_id", response.trim());
          shw_toast("Success", "Added Successfully!");
          get_bom_process_details1(response.trim());
        }
        else {
          shw_toast("Success", "Added Successfully!");
          get_bom_process_details1($("#ma_name").data("pro_id"))

        }
      } else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function delete_wel_process(process_id) {

  console.log(process_id);


  $.ajax({
    url: "php/delete_wel_process.php",
    type: "post", //send it through get method
    data: {
      process_id: process_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() >= 0) {

        if (response.trim() > 0) {
          $("#ma_name").data("pro_id", response.trim());
          shw_toast("Success", "Deleted Successfully!");
          get_bom_process_details1(response.trim())
        }
        else {
          shw_toast("Success", "Deleted Successfully!");
          get_bom_process_details1($("#ma_name").data("pro_id"));

        }
      }
      else {
        salert("Warning", response, "warning");
      }




    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_input_wel_parts(part_id, part_qty, previous_process_id, process_id) {

  console.log(part_id, part_qty, previous_process_id, process_id);


  $.ajax({
    url: "php/update_input_wel_parts.php",
    type: "post", //send it through get method
    data: {
      process_id: process_id,
      input_part_id: part_id,
      previous_process_id: previous_process_id,
      qty: part_qty,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function delete_input_wel_parts(id) {

  console.log(id);


  $.ajax({
    url: "php/delete_input_wel_parts.php",
    type: "post", //send it through get method
    data: {
      id: id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        shw_toast("Success", "Deleted Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"))
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_work_time_master_default(wtid, is_default, process_id) {

  console.log(wtid, is_default, process_id);


  $.ajax({
    url: "php/update_work_time_master_default.php",
    type: "post", //send it through get method
    data: {
      wtid: wtid,
      is_default: is_default,
      process_id: process_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        shw_toast("Success", "Updated Successfully!");
        get_bom_process_details1($("#ma_name").data("pro_id"));
      }
      else {
        salert("Warning", response, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function get_part_dept_wise(part_id, godown_id, dep_id, dep_sec_id) {

  $.ajax({
    url: "php/get_part_dept_wise.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,
      godown_id: godown_id,
      dep_id: dep_id,
      dep_sec_id: dep_sec_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {
        $("#dept_wise_list").empty();
        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;

            $("#dept_wise_list").append("<li class='list-group-item'><a class='dropdown-item' data-part_id=" + obj.part_id + ">" + obj.part_name + "</a></li>")

          });


        }
        else {
          // $("#machine_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")


        }
      }

    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}



function get_dep_sec_machine(sec_id) {

  $.ajax({
    url: "php/get_dep_sec_machine.php",
    type: "get", //send it through get method
    data: {
      sec_id: sec_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {
        $("#machine_da").empty();
        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;

            $("#machine_da").append("<li><a class='dropdown-item' data-mach_id=" + obj.dep_sec_machine_id + ">" + obj.machine_name + "</a></li>")

          });


        }
        else {
          // $("#machine_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")


        }
      }

    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}
function insert_dep_sec_machine(sec_id, mach_name) {
  console.log(sec_id, mach_name);

  $.ajax({
    url: "php/insert_dep_sec_machine.php",
    type: "get", //send it through get method
    data: {
      sec_id: sec_id,
      machine_name: mach_name,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() > 0) {
        $("#machine").data("mach_id", response);
        shw_toast("success", "Machine Added");
        $("#machine_add_btn").addClass("d-none");
      }



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function get_dep_section(dept_id) {

  $.ajax({
    url: "php/get_dep_section.php",
    type: "get", //send it through get method
    data: {
      dep_id: dept_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {
        $("#section_da").empty();
        if (response.trim() != "0 result") {





          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;

            $("#section_da").append("<li><a class='dropdown-item' data-sec_id=" + obj.dep_sec_id + ">" + obj.sec_name + "</a></li>")


            // $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


          });


        }
        else {
          // $("#section_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}

function insert_dep_section(dept_id, sec_name) {
  $.ajax({
    url: "php/insert_dep_section.php",
    type: "get", //send it through get method
    data: {
      dep_id: dept_id,
      sec_name: sec_name,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() > 0) {
        $("#section").data("sec_id", response);
        shw_toast("success", "Section Added");
        $("#section_add_btn").addClass("d-none")
        $("#machine_add_btn").removeClass("d-none")
      }



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function get_department(godown_id) {

  $.ajax({
    url: "php/get_department.php",
    type: "get", //send it through get method
    data: {
      godown_id: godown_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {
        $("#department_da").empty();
        if (response.trim() != "0 result") {





          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;

            $("#department_da").append("<li><a class='dropdown-item' data-dept_id=" + obj.dep_id + ">" + obj.dep_name + "</a></li>")


            // $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


          });


        }
        else {
          // $("#department_da").append("<li disabled><a class='dropdown-item'  >NO DATA</a></li>")

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}

function insert_department(go_id, dept_name) {
  $.ajax({
    url: "php/insert_department.php",
    type: "get", //send it through get method
    data: {
      godown_id: go_id,
      dep_name: dept_name,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() > 0) {
        $("#department").data("dept_id", response);
        shw_toast("success", "Department Added")
        $("#department_add_btn").addClass("d-none")
        $("#section_add_btn").removeClass("d-none")
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function del_process_list(process_id) {

  // var del_process_list = [];
  // var tbl_valid = true;
  // $("#welding_table tr").each(function () {

  //   if ($(this).find("td").eq(1).find("li").length < 1 || $(this).find("td").eq(2).find("li").length < 1) {
  //     shw_toast("Warning", "Invalid/Missing Data")
  //     tbl_valid = false
  //   }
  // })

  // if (tbl_valid == true) {





  //   $("#welding_table tr").each(function () {


  //     var processPart = $(this).find("td").eq(2).find("li");



  //     console.log();



  //     del_process_list.push(processPart.data('pid') || 0)

  //   })

    console.log(process_id);




    $.ajax({

      url: 'php/del_wel_process1.php',
      method: 'POST',
      data: {

        process_id: process_id,

        // inputPartsData: inputPartsData,

      },
      success: function (response) {
        console.log(response);
        if (response.trim() == "ok") {
          issaved = "yes"
          location.reload()
        }
      }
    });



  // }

}

// Dynamically select autocomplete item based on part-id
function selectAutocompleteByPartId(partId) {
  let input = $('#part_name_out');

  // Trigger input to initiate autocomplete search
  input.val('').trigger('input');

  // Wait a short time to ensure the autocomplete source is triggered
  setTimeout(function () {
    $.ajax({
      url: "php/get_part_name_auto_wel.php",
      type: "get",
      data: {
        term: "name",
        part: "" // You can pass a specific search term if needed
      },
      dataType: "json",
      success: function (data) {
        let item = data.find(i => i.part_id == partId);
        if (item) {
          let uiItem = {
            label: item.part_name + "-" + item.part_no,
            value: item.part_name,
            id: item.part_id,
            part_no: item.part_no
          };

          // Set the value and trigger the select
          input.val(uiItem.value);
          input.data("selected-part_id", uiItem.id);
          $('#part_no_out').data("selected-part_id", uiItem.id);
          $('#part_no_out').val(uiItem.part_no);
          get_bom_list(uiItem.id);
          get_bom_list_comp(uiItem.id);
          $('#part_no_out').attr("disabled", true); // Enable the input field if needed
          $('#part_name_out').attr("disabled", true);
        } else {
          console.warn("Part ID not found in autocomplete data.");
        }
      }
    });
  }, 200); // Adjust timeout if needed
}


// function_start
function get_machine_1(process_id, tbl_location) {


  $.ajax({
    url: "php/get_machine.php",
    type: "get", //send it through get method
    data: {
      process_id: process_id

    },
    success: function (response) {
      console.log(response);

      tbl_location.empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {





          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            tbl_location.append(obj.details)


            // $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


          });


        }
        else {
          $('#bom_list').append("<li class='list-group-item'>No BOM Found</li>")

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_machine(process_id) {


  $.ajax({
    url: "php/get_machine.php",
    type: "get", //send it through get method
    data: {
      process_id: process_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {





          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $("#welding_table .tbl_selected").parent().find("td").eq(3).find("ul").append(obj.details)


            // $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


          });


        }
        else {
          $('#bom_list').append("<li class='list-group-item'>No BOM Found</li>")

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_bom_process_details1(process_id) {
  console.log(process_id);


  $.ajax({
    url: "php/get_bom_process_details1.php",
    type: "get", //send it through get method
    data: {
      process_id: process_id,
    },
    success: function (response) {

      console.log(response);

      if (response.trim() != "error") {

        $("#welding_table").empty()
        extra_bom = [];
        // $("#update_btn").removeClass("d-none");
        if (response.trim() != "0 result") {

          if ($("#submit_btn").hasClass("d-none") == false)
            $("#submit_btn").addClass("d-none")

          if ($("#del_btn").hasClass("d-none"))
            $("#del_btn").removeClass("d-none")

          // if ($("#update_btn").hasClass("d-none"))
          //   $("#update_btn").removeClass("d-none")


          var obj1 = JSON.parse(response);
          var count = 0



          obj1.forEach(function (obj) {
            count = count + 1;
            var in_tbl = '';

            var input_p = JSON.parse(obj.input_parts);

            input_p.forEach(function (item) {
              in_tbl += " <li class='list-group-item d-flex justify-content-between' data-id=" + item.id + " data-part-id=" + item.input_part_id + " data-part-qty=" + item.qty + " data-process_title=" + item.qty + " data-in_previous_process_id=" + item.previous_process_id + ">  <p class='my-auto'>" + (item.part_name == null ? "Previous Process" : item.part_name) + " <b class='bg-warning'>" + (item.process_name ?? "") + "</b> <br> Qty : <span contenteditable='true' class= 'px-2 qty-editable'>" + item.qty + "</span> <span class='badge bg-secondary'>" + item.baseunits + "</span></p>  <button class='btn btn-sm btn-outline-danger border-0 m-0 p-0 px-3' data-id=" + item.id + " data-ori_process-id=" + obj.process_id + "><i class='fa fa-trash' aria-hidden='true'></i></button> </li>"
            })
            console.log(obj.in_tbl);

            const extra = encodeURIComponent(obj.process_details || "[]");
            $("#welding_table").append("<tr class='small'><td class='' data-extra= " + extra + " data-process-id=" + obj.process + " data-ori_process-id=" + obj.process_id + ">" + count + "</td><td > <ul class='list-group small' data-ori_process-id=" + obj.process_id + ">" + in_tbl + " </ul></td><td><ul class='list-group small'><li class='list-group-item' data-process-id=" + obj.process + " data-tr_process=" + obj.process_id + ">" + obj.process_name + "</ul></td><td><button class='btn btn-outline-success border-0 add_pr' data-ori_process-id=" + obj.process_id + "><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td><td><button class='btn btn-outline-danger border-0 delete_pr' data-ori_process-id=" + obj.process_id + "><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>");

            let parsedExtra = [];
            try {
              parsedExtra = JSON.parse(decodeURIComponent(obj.process_details || "[]"));
            } catch (e) {
              parsedExtra = [];
            }
            extra_bom[count - 1] = parsedExtra;

          });

          if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {
            $("#godown_data").removeClass("d-none");
          }
          else {
            $("#godown_data").addClass("d-none");
          }

        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
          // if ($("#update_btn").hasClass("d-none") == false)
          //   $("#update_btn").addClass("d-none")

          if ($("#del_btn").hasClass("d-none") == false)
            $("#del_btn").addClass("d-none")

          if ($("#submit_btn").hasClass("d-none"))
            $("#submit_btn").removeClass("d-none")

          $("#welding_table").append(" <tr class='small'> <td class='tbl_selected'> 1 </td> <td > <ul class='list-group'> </ul> </td> <td><ul class='list-group'> </ul></td>  <td><button class='btn btn-outline-success border-0 add_pr'><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td> <td><button class='btn btn-outline-danger border-0 delete_pr'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
          if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {
            $("#godown_data").removeClass("d-none");
          }
          else {
            $("#godown_data").addClass("d-none");
          }
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_bom_process_details(part_id, component_cat) {


  $.ajax({
    url: "php/get_bom_process_details.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,
      component_cat: component_cat
    },
    success: function (response) {

      console.log(response);

      $("#welding_table").empty()
      extra_bom = [];
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          if ($("#submit_btn").hasClass("d-none") == false)
            $("#submit_btn").addClass("d-none")

          if ($("#del_btn").hasClass("d-none"))
            $("#del_btn").removeClass("d-none")

          // if ($("#update_btn").hasClass("d-none"))
          //   $("#update_btn").removeClass("d-none")


          var obj1 = JSON.parse(response);
          var count = 0



          obj1.forEach(function (obj) {
            count = count + 1;
            console.log(obj.in_tbl);

            const extra = encodeURIComponent(obj.extra || "[]");
            $("#welding_table").append("<tr class='small'><td class='' data-extra=" + extra + ">" + count + "</td><td > <ul class='list-group'>" + obj.in_tbl + " </ul></td><td><ul class='list-group'>" + obj.pr_tbl + "</ul></td><td><ul class='list-group'><li class='list-group-item' > <button class='btn btn-primary btn-sm view_btn' value='" + obj.process + "'> View </button></li></ul></td><td><button class='btn btn-outline-success border-0 add_pr'><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td><td><button class='btn btn-outline-danger border-0 delete_pr'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>");

            let parsedExtra = [];
            try {
              parsedExtra = JSON.parse(decodeURIComponent(obj.extra || "[]"));
            } catch (e) {
              parsedExtra = [];
            }
            extra_bom[count - 1] = parsedExtra;

          });

          if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {
            $("#godown_data").removeClass("d-none");
          }
          else {
            $("#godown_data").addClass("d-none");
          }

        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
          // if ($("#update_btn").hasClass("d-none") == false)
          //   $("#update_btn").addClass("d-none")

          if ($("#del_btn").hasClass("d-none") == false)
            $("#del_btn").addClass("d-none")

          if ($("#submit_btn").hasClass("d-none"))
            $("#submit_btn").removeClass("d-none")

          $("#welding_table").append(" <tr class='small'> <td class='tbl_selected'> 1 </td> <td > <ul class='list-group'> </ul> </td> <td><ul class='list-group'> </ul></td>  <td><button class='btn btn-outline-success border-0 add_pr'><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td> <td><button class='btn btn-outline-danger border-0 delete_pr'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
          if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {
            $("#godown_data").removeClass("d-none");
          }
          else {
            $("#godown_data").addClass("d-none");
          }
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_bom_count() {


  $.ajax({
    url: "php/get_bom_process_count.php",
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



            $("#pr_sts").text(obj.fin_process + "/" + obj.bom_count)
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

function get_bom_recent() {


  $.ajax({
    url: "php/get_bom_process_recent.php",
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
            count = count + 1;



            $("#bom_recent_list").append("<li data-part_id='" + obj.part_id + "' data-cat='" + obj.component_cat + "' data-part_no='" + obj.part_no + "' class='list-group-item'>" + obj.part_name + "(" + obj.component_cat + ")" + "</li>")
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


function get_bom_list(part_id) {


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
          $("#bom_list_select").append("<option  value='0' disabled selected>Bom  List</option>")

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            //  $("#bom_list_item").append("<li  data-bom_id='"+ obj.bom_id+"' data-part_id='"+obj.part_id+" ' class=' list-group-item'>"+obj.component_cat + "</li>")
            $("#bom_list_select").append("<option value='" + obj.component_cat + "' data-part_id='" + obj.part_id + "' data-process_count='" + obj.process_count + "' data-bom_list='" + obj.bom_list + "'>" + obj.component_cat + "</option>")

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


function get_bom_list_comp(part_id) {


  $.ajax({
    url: "php/get_bom_list_comp.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id

    },
    success: function (response) {
      console.log(response);
      $('#bom_list_item').empty()


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {



          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $("#bom_list_item").append("<li  data-process='" + obj.process + "' data-part_id='" + obj.part_id + " ' class=' list-group-item text-bg-success'>" + obj.component_cat + "<span class='ms-5 badge bg-white text-dark blink'>" + obj.process_count + "</span></li>")

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


function get_bom_process_details_summary(part_id, component_cat) {

  console.log(part_id, component_cat);


  $.ajax({
    // url: "php/get_bom.php",
    url: "php/get_bom_process_details_summary.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,
      component_cat: component_cat
    },
    success: function (response) {
      console.log(response);
      if (response.trim() != "error") {

        $('#multi_process_list').empty()
        if (response.trim() != "0 result") {


          $("#multi_process").modal("show")



          var obj = JSON.parse(response);
          var count = 0

          obj.forEach(function (obj) {

            count = count + 1;
            $("#multi_process_list").append("<li data-part_id='" + obj.output_part + "' data-component_cat='" + obj.component_cat + "' data-process_id='" + obj.process_id + "' data-process_title='" + obj.process_title + "' data-is_default='" + obj.is_default + "' class='list-group-item'>" + component_cat + "(" + obj.process_title + ")" + (obj.is_default > 0 ? "<span class='badge bg-primary blink'>Default</span>" : "") + "</li>")



          });
          // $(".add_new_process_btnnnn").data({ "part_id": part_id, "component_cat": component_cat });
        }
        else {
          // get_bom(part_id, component_cat)
          $('#multi_process_list').append("<li class='list-group-item'>No Process Found</li>")
          $("#welding_table").empty();
          $("#process_title").val('');
          $('#process_default').prop("checked", false);
          // if ($("#update_btn").hasClass("d-none") == false)
          //   $("#update_btn").addClass("d-none")

          if ($("#del_btn").hasClass("d-none") == false)
            $("#del_btn").addClass("d-none")

          if ($("#submit_btn").hasClass("d-none"))
            $("#submit_btn").removeClass("d-none")

          $("#welding_table").append(" <tr class='small'> <td class='tbl_selected'> 1 </td> <td > <ul class='list-group'> </ul> </td> <td><ul class='list-group'> </ul></td>  <td><button class='btn btn-outline-success border-0 add_pr'><i class='fa fa-plus-circle ' aria-hidden='true'></i></button></td> <td><button class='btn btn-outline-danger border-0 delete_pr'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
          if ($('#welding_table').find("tr td:first-child").hasClass("tbl_selected")) {
            $("#godown_data").removeClass("d-none");
          }
          else {
            $("#godown_data").addClass("d-none");
          }
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function get_bom(part_id, component_cat) {

  console.log(part_id, component_cat);


  $.ajax({
    // url: "php/get_bom.php",
    url: "php/get_bom_list_process.php",
    type: "get", //send it through get method
    data: {
      part_id: part_id,
      component_cat: component_cat
    },
    success: function (response) {
      console.log(response);
      $('#bom_list').empty()

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {





          var obj = JSON.parse(response);
          var count = 0
          var pname = ""
          var sub_ass = ""

          obj.forEach(function (obj) {
            if (obj.sub_ass == 1) {
              sub_ass = "<span class='text-bg-secondary rounded-pill px-2 py-1 ms-2 small'>sub</span>"
            }
            else {
              sub_ass = ""
            }
            count = count + 1;
            $("#bom_list").append("<li data-part_id='" + obj.part_id + "' data-part_no='" + obj.part_no + "' data-part_name='" + obj.part_name + "' data-part_qty='" + obj.qty + "' data-bal-qty=' ' data-process_details='" + obj.process_details + "'  data-process_availble='" + obj.process_availble + "' class='list-group-item'>" + obj.part_name + " - <span class='fw-bold'>" + obj.qty + "</span></span>" + sub_ass + "</li>")
            pname = obj.out_part_name

            // $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


          });

          let main_material =
            count = count + 1;
          $("#bom_list").append("<li data-part_id='" + $("#bom_list_select").find("option:selected").data("part_id") + "' data-part_no='" + $("#part_no_out").val() + "' data-part_name='" + $("#part_name_out").val() + "' data-part_qty='" + 1 + "' data-bal-qty=' ' data-process_details='" + JSON.stringify($("#bom_list_select").find("option:selected").data("bom_list")) + "'  data-process_availble='" + $("#bom_list_select").find("option:selected").data("process_count") + "' class='list-group-item bold text-bg-info'>" + $("#part_name_out").val() + " - <span class='fw-bold'>" + 1 + "</span></span></li>")


          $('#outpart_txt').text(pname + "(" + component_cat + ")")
          $("#ma_name").text(pname + "(" + component_cat + ")")
        }
        else {
          $('#bom_list').append("<li class='list-group-item'>No BOM Found</li>")

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function get_title() {


  $.ajax({
    url: "php/get_titles.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {
      console.log(response);
      if (response.trim() != "error") {
        var obj = JSON.parse(response);

        if (response.trim() != "0 result") {
          obj.forEach(function (obj) {

            $('#prs_title').append("<option value='" + obj.id + "' >" + obj.name + "</option>")

          });
        }



      }
    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}




function delete_implement() {

  $.ajax({
    url: "php/delete_implement.php",
    type: "get", //send it through get method
    data: {
      edit_process_id: edit_process_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {

        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function insert_new_process(processId) {

  $.ajax({
    url: "php/insert_nprocess.php",
    type: "get", //send it through get method
    data: {

      process_id: processId,
      edit_process_id: edit_process_id,
      input_part_id: sel_input_part_id,
      output_part_id: sel_output_part_id,
    },
    success: function (response) {
      console.log(response);



      if (response.trim()) {
        sessionStorage.setItem('editProcessId', response.trim());
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function delete_process(mode) {

  $.ajax({
    url: "php/delete_process.php",
    type: "get", //send it through get method
    data: {
      mode: mode,
      delete_process_id: change_process_id,
      edit_process_id: edit_process_id,
      input_part_id: sel_input_part_id,
      output_part_id: sel_output_part_id,


    },
    success: function (response) {
      console.log(response);


      if (response.trim()) {
        sessionStorage.setItem('editProcessId', response.trim());
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function insert_new_input(input_part_id, previous_process_id, qty) {

  $.ajax({
    url: "php/insert_new_input.php",
    type: "get", //send it through get method
    data: {
      input_part_id: input_part_id,
      previous_process_id: previous_process_id,
      process_id: edit_process_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        sessionStorage.setItem('editProcessId', edit_process_id);
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function delete_input_part(change_input_id) {

  $.ajax({
    url: "php/delete_input_part.php",
    type: "get", //send it through get method
    data: {
      change_input_id: change_input_id,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        sessionStorage.setItem('editProcessId', edit_process_id);
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function update_output(edit_process_id, partId) {

  console.log(edit_process_id);


  $.ajax({
    url: "php/update_output_part.php",
    type: "get", //send it through get method
    data: {
      output_part: partId,
      process_id: edit_process_id,


    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        sessionStorage.setItem('editProcessId', edit_process_id);
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function update_process(processId, change_process_id) {

  console.log(change_process_id);

  $.ajax({
    url: "php/update_process.php",
    type: "get", //send it through get method
    data: {
      process: processId,
      process_id: change_process_id,


    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        sessionStorage.setItem('editProcessId', edit_process_id);
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function update_input(partId, processId, change_input_id, qty) {


  $.ajax({
    url: "php/update_input_part.php",
    type: "get", //send it through get method
    data: {
      input_part_id: partId,
      previous_process_id: processId,
      id: change_input_id,
      qty: qty

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        sessionStorage.setItem('editProcessId', edit_process_id);
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());

        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function insert_new_part() {

  var sub_ass = $("#new_sub_ass").is(":checked") ? 1 : 0;

  $.ajax({
    url: "php/insert_new_part.php",
    type: "get", //send it through get method
    data: {
      newPartName: $('#newPartName').val(),
      newPartNo: $('#newPartNo').val(),
      newPartDes: $('#newPartDes').val(),
      sub_ass: sub_ass,

    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        $('#newPartName').val(''),
          $('#newPartNo').val(''),
          $('#newPartDes').val('')
        $("#addNewPartModal").modal('hide');
        shw_toast("Added", "Successfully Added")
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}





function get_implement_process(process_id) {

  $.ajax({
    url: "php/get_implement_process.php",
    type: "get", //send it through get method
    data: {

      process_id: process_id
    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          $('#imp_process').empty()
          var obj = JSON.parse(response);


          var count = 0;
          process_id_array = []
          obj.forEach(function (obj) {

            count = count + 1;
            $('#imp_process').append(" <div class='card mt-1' data-process=" + obj.process + " data-id=" + obj.process_id + " data-previous-process-id=" + obj.previous_process_id + " data-cat=" + obj.cat + " > <div class='card-header'> <h6>" + obj.process_name + "</h6> </div> </div>")
            process_id_array.push(obj.process_id);
          });
          console.log(process_id_array);

          $('#imp_output').removeClass("d-none").addClass("d-flex");
          $('#imp_output').show()
          $('#breadcrumb1').show()
          $('#imp_final_output').removeClass("d-flex").addClass("d-none");
          $('#final_output_btn_grp').removeClass("d-none").addClass("d-flex");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function get_implement_input(process_id) {

  $.ajax({
    url: "php/get_implement_input.php",
    type: "get", //send it through get method
    data: {

      process_id: process_id
    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          $('#imp_input_part').empty()
          var obj = JSON.parse(response);
          console.log(response);

          var count = 0;

          obj.forEach(function (obj) {

            count = count + 1;
            $('#imp_input_part').append(" <div class='card av_nxt mt-1' data-pre-process-id=" + obj.previous_process_id + " data-part-id=" + obj.input_part_id + " data-part-qty=" + obj.qty + " data-id=" + obj.id + " data-part-no=" + obj.part_no + " data-part-name=" + obj.part_name + " data-process=" + obj.process_name + "> <div class='card-header d-flex justify-content-center'>" + obj.part_name + "-" + obj.part_no + "<br> Qty : " + obj.qty + "</div> <div class='card-body'> <i class='fa-solid fa-screwdriver-wrench pe-2'></i>" + obj.process_name + "</div></div>")
            sel_input_part_id = obj.input_part_id
          });
          $('#imp_output').removeClass("d-none").addClass("d-flex");;
          $('#imp_output').show()
          $('#breadcrumb1').show()
          $('#imp_final_output').removeClass("d-flex").addClass("d-none");
          $('#final_output_btn_grp').removeClass("d-none").addClass("d-flex");
          edit_process_id = process_id

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function get_implement_output(process_id) {

  $.ajax({
    url: "php/get_implement_output.php",
    type: "get", //send it through get method
    data: {

      process_id: process_id
    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);


          var count = 0;

          obj.forEach(function (obj) {

            count = count + 1;
            $('#imp_output_part_txt').data('out-part-id', obj.output_part);
            $('#imp_output_part_txt').html(obj.part_name + " - " + obj.part_no)
            sel_output_part_id = obj.output_part
            $('#out_breadcrumb').append("<li class='breadcrumb-item'><a href='#' data-process-id='" + obj.process_id + "'>" + obj.part_name + "</a></li>")

          });
          $('#imp_output').removeClass("d-none").addClass("d-flex");;
          $('#imp_output').show()
          $('#breadcrumb1').show()
          $('#final_output_btn_grp').removeClass("d-none").addClass("d-flex");

          $('#imp_final_output').removeClass("d-flex").addClass("d-none");

        }
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


function get_sel_imp() {


  $.ajax({
    url: "php/get_sel_imp.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {

      console.log(response);
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $('#output_part_sel').empty();
          $('#output_part_sel').append("<option value=0>Choose Options</option>")
          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;


            $('#output_part_sel').append("<option value=" + obj.process_id + ">" + obj.part_name + "</option>")

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




function get_final_imp() {


  $.ajax({
    url: "php/get_sel_process.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {

      console.log(response);
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $('#breadcrumb1').hide()

          $('#final_output_btn_grp').removeClass("d-flex").addClass("d-none");
          $('#imp_final_output').empty()
          $('#final_output_btn_grp').removeClass("d-flex").addClass("d-none");
          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;


            $('#imp_final_output').append("<div class='card av_nxt' data-process-id=" + obj.process_id + " data-part-id=" + obj.output_part + " data-part-no=" + obj.part_no + " data-part-name=" + obj.part_name + " data-process=" + obj.process_name + "> <div class='card-header d-flex justify-content-center'>" + obj.part_name + "-" + obj.part_no + "</div> <div class='card-body'> <i class='fa-solid fa-screwdriver-wrench pe-2'></i>" + obj.process_name + "</div></div>")

            $('#imp_output').removeClass("d-flex").addClass("d-none");
            $('#imp_final_output').removeClass("d-none").addClass("d-flex");
          });
          $('#out_breadcrumb').empty()

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

function get_ava_process() {


  $.ajax({
    url: "php/get_sel_process.php",
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
            count = count + 1;
            $('#pa_nxt_prs').append("<div class='card small my-1 av_nxt' data-process-id=" + obj.process_id + " data-part-id=" + obj.output_part + " data-part-no='" + obj.part_no + "' data-part-name='" + obj.part_name + "' data-process='" + obj.process_name + "'> <div class='card-header d-flex justify-content-center'>" + obj.part_name + "-" + obj.part_no + "</div> <div class='card-body'> <i class='fa-solid fa-screwdriver-wrench pe-2'></i>" + obj.process_name + "</div></div>")




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



function get_all_work() {

  $.ajax({
    url: "php/get_all_work.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);

          var count = 0;

          obj.forEach(function (obj) {

            count = count + 1;
            $("#work_all_table").append("<tr><td>" + count + "</td><td>" + obj.work_type_name + "</td><td>" + "<button value='" + obj.work_type_id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>" + "</td>  </tr> ")
          });
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function delete_work_report(work_type_id) {
  console.log(work_type_id)

  $.ajax({
    url: "php/delete_work_report.php",
    type: "get", //send it through get method
    data: {
      work_type_id: work_type_id
    },
    success: function (response) {
      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 results") {


          location.reload()
        }
        else {
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

function delete_work(work_type_id) {

  $.ajax({
    url: "php/delete_work.php",
    type: "get", //send it through get method
    data: {
      work_type_id: work_type_id
    },
    success: function (response) {
      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 results") {


          location.reload()
        }
        else {
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

function delete_work_type(work_type_id) {

  $.ajax({
    url: "php/delete_work_type.php",
    type: "get", //send it through get method
    data: {
      work_type_id: work_type_id
    },
    success: function (response) {
      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 results") {


          location.reload()
        }
        else {
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

function get_rwork_status(work_type) {
  $.ajax({
    url: "php/get_wstatus.php",
    type: "get", //send it through get method
    data: {
      work_type: work_type


    },
    success: function (response) {


      if (response.trim() != "error") {
        var obj = JSON.parse(response);

        var count = 0
        $("#sel_rsts_in").empty();
        $("#sel_rsts_in").append(" <option value='" + 0 + "'>" + "Select Status..." + "</option>");
        $("#sel_rsts_in").append(" <option value='" + '' + "'>" + "create" + "</option>");
        $("#sel_rsts_in").append(" <option value='" + '' + "'>" + "assign" + "</option>");
        $("#sel_rsts_in").append(" <option value='" + '' + "'>" + "accept" + "</option>");
        obj.forEach(function (obj) {
          count = count + 1

          $("#sel_rsts_in").append(" <option value='" + count + "'>" + obj.work_status + "</option>");

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


function get_work_status(work_type) {
  $.ajax({
    url: "php/get_wstatus.php",
    type: "get", //send it through get method
    data: {
      work_type: work_type


    },
    success: function (response) {


      if (response.trim() != "error") {
        var obj = JSON.parse(response);

        var count = 0
        $("#sel_sts_in").empty();
        $("#sel_sts_in").append(" <option value='" + 0 + "'>" + "Select Status..." + "</option>");
        obj.forEach(function (obj) {
          count = count + 1

          $("#sel_sts_in").append(" <option value='" + count + "'>" + obj.work_status + "</option>");

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

function insert_work_type_sql(status, type, work, reload_p) {


  $.ajax({
    url: "php/insert_work_type.php",
    async: false,
    type: "get", //send it through get method
    data: {



      work_type_name: work,
      work_status: status,
      status_type: type


    },
    success: function (response) {

      console.log(response);
      if (reload_p == "yes") {
        window.location.reload();
      }

    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}

function insert_rwork() {


  $.ajax({
    url: "php/insert_rwork.php",
    async: false,
    type: "get", //send it through get method
    data: {



      work_type: $('#sel_rwt_in :selected').text(),
      work_status: $('#sel_rsts_in :selected').text(),
      report_cat: $('#report_name').val()


    },
    success: function (response) {

      console.log(response);

      //window.location.reload();
      get_all_report_type()

    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}

function insert_pwork() {


  $.ajax({
    url: "php/insert_pwork.php",
    async: false,
    type: "get", //send it through get method
    data: {



      work_type_id: $('#sel_wt_in :selected').val(),
      work_status: $('#sel_sts_in :selected').text(),
      pipeline_work: $('#sel_pwork_in :selected').text()


    },
    success: function (response) {

      console.log(response);

      window.location.reload();


    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}


function get_all_work_type() {

  $.ajax({
    url: "php/get_all_work_type.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);

          var count = 0;

          obj.forEach(function (obj) {

            count = count + 1;
            $("#work_type_all_table").append("<tr><td>" + count + "</td><td>" + obj.work_type_name + "</td><td>" + obj.work_status + "</td><td>" + obj.status_type + "</td> <td>" + obj.pipeline_work + "</td><td>" + "<button value='" + obj.id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>" + "</td>  </tr> ")
          });
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function get_all_report_type() {

  $.ajax({
    url: "php/get_all_report_type.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        $("#report_type_all_table").empty()
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);

          var count = 0;

          obj.forEach(function (obj) {

            count = count + 1;
            $("#report_type_all_table").append("<tr><td>" + count + "</td><td>" + obj.report_cat + "</td><td>" + obj.comments + "</td><td>" + "<button value='" + obj.id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>" + "</td>  </tr> ")
          });
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function get_work_type() {
  $.ajax({
    url: "php/get_work_type.php",
    type: "get", //send it through get method
    data: {



    },
    success: function (response) {


      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);



          obj.forEach(function (obj) {


            $("#sel_wt_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
            $("#sel_pwork_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
            $("#sel_rwt_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");

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


function check_login() {

  if (localStorage.getItem("logemail") == null) {
    window.location.replace("login.html");
  }
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