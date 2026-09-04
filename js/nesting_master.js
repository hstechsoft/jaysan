
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];
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


  $("#summary_search").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $("#all_bom_table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  check_login();
  get_nesting_master();

  $("#unamed").text(localStorage.getItem("ls_uname"))


  $('#material_id').on('input', function () {


    $(this).data("part_id", '');


    //check the value not empty
    if ($('#material_id').val() != "") {
      $('#material_id').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto_wel.php",
            type: "get", //send it through get method
            data: {

              part: $("#material_id").val(),
              term: ""

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.part_name,
                  value: item.part_name,
                  id: item.part_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("part_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          console.log(ui.item.id);



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#nested_parts').on('input', function () {


    $(this).data("part_id", '');


    //check the value not empty
    if ($('#nested_parts').val() != "") {
      $('#nested_parts').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto_wel.php",
            type: "get", //send it through get method
            data: {

              part: $("#nested_parts").val(),
              term: ""

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.part_name,
                  value: item.part_name,
                  id: item.part_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("part_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          console.log(ui.item.id);



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#godown').on('input', function () {
    
    $(this).removeData("godown_id");
    if ($(this).val().trim() === '') {
      $(this).removeData("godown_id");
    }

    $('#department').val('').removeData("dept_id");
    $('#section').val('').removeData("sec_id");
    $('#machine').val('').removeData("mach_id");

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
    $('#section').val('').removeData("sec_id");
    $('#machine').val('').removeData("mach_id");

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

        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#section').on('input', function () {
    
    $(this).data("sec_id", "");


    $('#machine').val('').removeData("mach_id");

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
              dep_id: $("#department").data("dept_id"),
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

        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#machine').on('input', function () {

    $(this).data("mach_id", "");

    if ($('#machine').val() != "") {

      $('#machine').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_sec_machine_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              sec_id: $("#section").data("sec_id"),

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.machine_name,
                  value: item.machine_name,
                  id: item.jmid
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



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $("#weight").on("focusout", function () {
    scrap_weight();
  })

  $("#nest_file").on("change", function () {
    var nes_master_id = $("#update_nesting_btn").val() || 0;
    var file = $(this)[0].files[0];

    if (file && file.type !== "application/pdf") {
      $("#nest_file").val("");
      salert("Warning", "PDF Files Only.", "warning");
    }

    if (!file) {
      salert("Warning", "Please select a file.", "warning");
      return;
    }

    if (nes_master_id > 0) {
      upload_nesting(nes_master_id, file);
    }

  });

  $("#nested_machine_add_btn").on("click", function (){

    var godown_id = $("#godown").data("godown_id") || 0;
    var department_id = $("#department").data("dept_id") || 0;
    var section_id = $("#section").data("sec_id") || 0;
    var machine_id = $("#machine").data("mach_id") || 0;
    var machine = $("#machine").val() || '';
    var runtime = $("#run_timee").val() || 0;
    var handling_time = $("#handling_time").val() || 0;
console.log(godown_id, department_id, section_id, machine_id, machine, runtime, handling_time);
    if(godown_id <= 0 || department_id <= 0 || section_id <= 0 || machine_id <=0 || machine == '' || runtime <= 0 || handling_time <= 0){
      salert('warning', 'Please Fill All Fields.', 'warning');
      return;
    }
    else{
      $("#nesting_machine_tbody").append(`<tr data-godown_id="${godown_id}" data-department_id="${department_id}" data-section_id="${section_id}" data-machine_id="${machine_id}"><td>${machine}</td><td>${runtime}</td><td>${handling_time}</td><td><button type='button' class='btn btn-sm delete_btn btn-outline-danger'><i class='fa fa-trash'></i></button></td></tr>`);

      $("#godown, #department, #section, #machine, #run_timee, #handling_time").val('').removeData("godown_id").removeData("dept_id").removeData("sec_id").removeData("mach_id");
    }

  });

  $("#nesting_machine_tbody").on("click", ".delete_btn", function () {

    var row = $(this).closest('tr');
    // var nes_part_id = $(this).val() || 0;

    Swal.fire({
      title: "Are You Sure?",
      text: "Do You Want To Delete This?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!"
    }).then((result) => {

      if (result.isConfirmed) {

        // if (nes_part_id > 0) {
        //   $("#scrap_weight").val(scrap_weigth);

        //   row.remove();
        //   delete_nesting_parts_master(nes_part_id);
        //   $("#update_nesting_btn").trigger("click");
        // }
        // else {
          row.remove();
        //   scrap_weight();
        // }
        // scrap_weight();
      }

    });

  });

  $("#nested_part_add_btn").on("click", function () {

    var nes_master_id = $(this).val() || 0;

    var part_id = $("#nested_parts").data("part_id") || 0;
    var nested_parts = $("#nested_parts").val() || '';
    var nested_part_qty = $("#nested_part_qty").val() || 0;
    var nested_part_weight = $("#nested_part_weight").val() || 0;
    var total_weight = Number(nested_part_qty) * Number(nested_part_weight);

    if ($("#weight").val() == '' || $("#weight").val() == undefined) {
      salert("Warning", "Enter the Raw Material Weight First", "warning");
      return;
    }

    if (part_id > 0 && nested_part_qty > 0 && nes_master_id == 0 && nested_part_weight > 0) {
      $("#nesting_parts_tbody").append(`<tr data-total_weight="${total_weight}" data-part_id="${part_id}" data-qty="${nested_part_qty}" data-weight="${nested_part_weight}"><td>${nested_parts}</td><td>${nested_part_qty}</td><td>${nested_part_weight}</td><td><button type='button' class='btn btn-sm delete_btn btn-outline-danger'><i class='fa fa-trash'></i></button></td></tr>`);

      var sw = scrap_weight();

      if (sw !== false && sw >= 0) {

        $("#nested_parts").data("part_id", '').val('');
        $("#nested_part_qty, #nested_part_weight").val('');

      }

    }
    else if (part_id > 0 && nested_part_qty > 0 && nes_master_id > 0 && nested_part_weight > 0) {

      $("#nesting_parts_tbody").append(`<tr data-total_weight="${total_weight}" data-part_id="${part_id}" data-qty="${nested_part_qty}" data-weight="${nested_part_weight}"><td>${nested_parts}</td><td>${nested_part_qty}</td><td>${nested_part_weight}</td><td><button type='button' class='btn btn-sm delete_btn btn-outline-danger'><i class='fa fa-trash'></i></button></td></tr>`);

      var sw = scrap_weight();

      if (sw !== false && sw >= 0) {

        insert_nesting_parts_master(nes_master_id, part_id, nested_part_qty, nested_part_weight);
        setTimeout(() => {
          $("#update_nesting_btn").trigger("click");
        }, 1000);

        $("#nested_parts").data("part_id", '').val('');
        $("#nested_part_qty, #nested_part_weight").val('');
      }

    }
    else {
      salert("Warning", "Need All Three Fields.", "warning");
    }
  });

  $("#nesting_parts_tbody").on("click", ".delete_btn", function () {

    var row = $(this).closest('tr');
    var part_weight = row.data("total_weight") || 0;
    var scrap_weigth = parseFloat($("#scrap_weight").val() || 0) + parseFloat(part_weight)
    var nes_part_id = $(this).val() || 0;

    Swal.fire({
      title: "Are You Sure?",
      text: "Do You Want To Delete This?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!"
    }).then((result) => {

      if (result.isConfirmed) {

        if (nes_part_id > 0) {
          $("#scrap_weight").val(scrap_weigth);

          row.remove();
          delete_nesting_parts_master(nes_part_id);
          $("#update_nesting_btn").trigger("click");
        }
        else {
          row.remove();
          scrap_weight();
        }
        scrap_weight();
      }

    });

  });

  $("#nesting_details_tbody").on("click", ".delete_btn", function () {

    var row = $(this).closest('tr');
    var nes_master_id = $(this).val() || 0;

    Swal.fire({
      title: "Are You Sure?",
      text: "Do You Want To Delete This Nesting Master?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!"
    }).then((result) => {

      if (result.isConfirmed) {
        if (nes_master_id > 0) {
          delete_nesting_master(nes_master_id);
        }
        else {
          salert("Warning", "Data Missing!, Try Later.", "warning");
        }
      }

    });

  });

  $("#nesting_details_tbody").on("click", ".edit_btn", function () {

    var row = $(this).closest('tr');
    var nes_master_id = $(this).val() || 0;

    if (nes_master_id <= 0) {
      salert("Warning", "Data Missing!, Try Later.", "warning");
      return;
    }

    get_nesting_master_single(nes_master_id)

  });

  $("#add_nesting_btn").on("click", function () {

    var nesting_name = $("#nesting_name").val() || '';
    var part_id = $("#material_id").data("part_id") || 0;
    var run_time = $("#run_time").val() || 0;
    var dimension = $("#dimension").val() || 0;
    var file = $("#nest_file")[0].files[0];
    var weight = $("#weight").val() || 0;
    var scrap_weight = $("#scrap_weight").val() || 0;

    // if (!file) {
    //   salert("Warning", "Please select a file.", "warning");
    //   return;
    // }

    var parts = [];

    $("#nesting_parts_tbody tr").each(function () {
      var part_id = $(this).data('part_id') || 0;
      var qty = $(this).data('qty') || 0;
      var weight = $(this).data("weight") || 0;

      if (part_id > 0 && qty > 0 && weight > 0) {
        parts.push({ part_id: part_id, qty: qty, weight: weight });
      }
      else {
        salert("Warning", "Data Missing!, Try Again.", "warning");
      }

    });

    console.log(nesting_name, part_id, run_time, dimension, parts, weight, scrap_weight);


    if (nesting_name == '' || part_id <= 0 || run_time <= 0 || dimension <= 0 || parts.length <= 0 || weight <= 0) {
      salert("Warning", "All Fields Are Required.", "warning");
      return;
    }

    insert_nesting_master(nesting_name, part_id, run_time, dimension, file, weight, scrap_weight, JSON.stringify(parts));
  })

  $("#update_nesting_btn").on("click", function () {

    var nes_master_id = $(this).val() || 0;

    var nesting_name = $("#nesting_name").val() || '';
    var part_id = $("#material_id").data("part_id") || 0;
    var run_time = $("#run_time").val() || 0;
    var dimension = $("#dimension").val() || 0;
    var weight = $("#weight").val() || 0;
    var scrap_weight = $("#scrap_weight").val() || 0;

    console.log(nesting_name, part_id, run_time, dimension, weight, scrap_weight);


    if (nesting_name == '' || part_id <= 0 || run_time <= 0 || dimension <= 0 || nes_master_id <= 0 || weight <= 0) {
      salert("Warning", "All Fields Are Required.", "warning");
      return;
    }

    update_nesting_master(nes_master_id, nesting_name, part_id, run_time, dimension, weight, scrap_weight);
  });

  $("#view_file").on("click", function () {
    var path = $(this).val() || 'attachment/laser/nesting/laser_10.pdf'
    if (path == '') {
      salert("Warning", 'Path Not Fetched, Try Later.', 'warning');
      return;
    }

    window.open(path, "_blank");
  })

  $("#clear_btn").on("click", function () {


    $("#update_nesting_btn, #view_file").addClass("d-none");
    $("#add_nesting_btn").removeClass("d-none");

    $("#nesting_name").val('');
    $("#material_id").data("part_id", '').val('');
    $("#run_time").val('');
    $("#dimension").val('');
    $("#weight").val('');
    $("#scrap_weight").val('');

    $("#nested_parts").val('').removeData("part_id");
    $("#nested_part_qty").val('');
    $("#nested_part_weight").val('');

    $("#update_nesting_btn, #nested_part_add_btn, #view_file").val('');
    $("#nesting_parts_tbody").empty();

  })



});

function scrap_weight() {

  var scrap_weight = 0;
  var weight = 0;
  var material_weight = parseFloat($("#weight").val()) || 0;
  $("#nesting_parts_tbody tr").each(function () {
    weight += parseFloat($(this).data("total_weight")) || 0;
  });

  scrap_weight = material_weight - weight;

  if (material_weight < weight) {
    salert("Warning", "Scrap Weight Is More Than Raw Material Weight!, Recently Added Part Isn't Added.", "warning");
    $("#nesting_parts_tbody").find("tr:last").remove();
    return false;
  }
  $("#scrap_weight").val(parseFloat(scrap_weight).toFixed(2));
  return scrap_weight;

}

function get_nesting_master_single(nes_master_id) {

  $.ajax({
    url: "php/get_nesting_master.php",
    type: "get", //send it through get method
    data: {

      nes_master_id: nes_master_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != 'error') {

        if (response.trim() != '0 result') {

          var obj = JSON.parse(response);
          var count = 0;

          $("#add_nesting_btn").addClass("d-none");
          $("#update_nesting_btn, #view_file").removeClass("d-none");

          obj.forEach(function (item) {

            count += 1;

            var part = JSON.parse(item.nesting_parts) || ''
            var parts = ``;

            if (part != '') {
              $("#nesting_parts_tbody").empty();

              part.forEach(function (p) {

                parts += `<tr data-total_weight="${parseFloat(p.qty) * parseFloat(p.weight)}"><td>${p.part_name} </td><td>${p.qty} </td><td>${p.weight}</td><td><button type='button' class='btn btn-sm delete_btn btn-outline-danger' value=${p.nes_part_id}><i class='fa fa-trash'></i></button></td></tr>`;

              });

              $("#nesting_parts_tbody").append(parts);
            }


            $("#nesting_name").val(item.nesting_name);
            $("#material_id").data("part_id", item.material_id).val(item.nesting_material);
            $("#run_time").val(item.run_time);
            $("#dimension").val(item.std_length);
            $("#weight").val(item.weight);
            $("#scrap_weight").val(item.scarp_weight);

            $("#view_file").val(item.path);
            $("#update_nesting_btn, #nested_part_add_btn").val(item.nesting_id)

          })
        }
        else {

        }
      }
      else {
        salert("Error", response, "error");
      }


    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_nesting_master() {

  $.ajax({
    url: "php/get_nesting_master.php",
    type: "get", //send it through get method
    data: {

      nes_master_id: ''

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != 'error') {
        $("#nesting_details_tbody").empty();
        if (response.trim() != '0 result') {

          var obj = JSON.parse(response);
          var count = 0;

          obj.forEach(function (item) {

            count += 1;

            var part = JSON.parse(item.nesting_parts) || '';
            var parts = ``;

            if (part != '') {
              parts = `<ul class="list-group">`;
              part.forEach(function (p) {

                parts += `<li class="list-group-item p-1"><strong class='small'>${p.part_name}</strong> <span class='badge bg-primary'>${p.qty} Qty</span></li>`;

              });

              parts += `<li class="list-group-item p-1"><strong class='small'>MS Scrap</strong> <span class='badge bg-primary'>${item.scarp_weight} Qty</span></li>`;
              parts += `</ul>`;
            };

            $("#nesting_details_tbody").append(`
              <tr>
                <td>${count}</td>
                <td>${item.nesting_name}</td>
                <td>${item.nesting_material}</td>
                <td>${item.run_time}</td>
                <td>${item.std_length}</td>
                <td><span class='badge ${item.nesting_type == 'std' ? 'bg-success' : 'bg-warning text-dark'}'>${item.nesting_type}</span> <br> <span class="badge bg-secondary">${item.created_by_name}</span></td>
                <td>${parts}</td>
                <td>
                  <div class='d-flex justify-content-between'>
                    <button type='button' class='btn btn-sm edit_btn btn-outline-warning mx-2' value=${item.nesting_id}><i class='fa fa-pen'></i></button>
                    <button type='button' class='btn btn-sm delete_btn btn-outline-danger' value=${item.nesting_id}><i class='fa fa-trash'></i></button>
                  </div>
                </td>
              </tr>
            `);
          })
        }
        else {
          $("#nesting_details_tbody").append(`<tr><td colspan='7' class='text-center text-dange'>No Standard Nesting Found.</td></tr>`);
        }
      }
      else {
        salert("Error", response, "error");
      }


    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function insert_nesting_master(nesting_name, part_id, run_time, dimension, file, weight, scrap_weight, parts) {


  let formData = new FormData($("#nesting_entry_form")[0]);

  formData.append("created_by", current_user_id);
  formData.append("nesting_name", nesting_name);
  formData.append("material_id", part_id);
  formData.append("nesting_type", "std");
  formData.append("std_length", dimension);
  formData.append("run_time", run_time);
  formData.append("weight", weight);
  formData.append("scarp_weight", scrap_weight);
  formData.append("laser_parts", parts);
  formData.append("file", file);

  $.ajax({
    url: "php/insert_nesting_master.php",
    type: "post",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      console.log(response);



      if (response.trim() == 'ok') {
        salert("Success", "Standard Nesting Add.", "success");
        get_nesting_master();
        $("#clear_btn").trigger("click");
      }
      else {
        salert("Error", response, "error");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function upload_nesting(nes_master_id, file) {


  let formData = new FormData($("#nesting_entry_form")[0]);

  formData.append("nes_master_id", nes_master_id);
  formData.append("file", file);

  $.ajax({
    url: "php/upload_nesting.php",
    type: "post", //send it through get method
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      console.log(response);



      if (response.trim() == 'ok') {
        salert("Success", "Standard Nesting File Updated.", "success");
        get_nesting_master();
        get_nesting_master_single(nes_master_id)
        $("#clear_btn").trigger("click");
      }
      else {
        salert("Error", response, "error");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function update_nesting_master(nes_master_id, nesting_name, part_id, run_time, dimension, weight, scrap_weight) {

  $.ajax({
    url: "php/update_nesting_master.php",
    type: "post", //send it through get method
    data: {

      nes_master_id: nes_master_id,
      created_by: current_user_id,
      nesting_name: nesting_name,
      material_id: part_id,
      nesting_type: 'std',
      std_length: dimension,
      run_time: run_time,
      weight: weight,
      scarp_weight: scrap_weight,
    },
    success: function (response) {
      console.log(response);



      if (response.trim() == 'ok') {
        salert("Success", "Standard Nesting Updated.", "success");
        get_nesting_master();
        get_nesting_master_single(nes_master_id)
        $("#clear_btn").trigger("click");
      }
      else {
        salert("Warning", response, 'warning');
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function insert_nesting_parts_master(nes_master_id, part_id, qty, nesting_part_weight) {

  $.ajax({
    url: "php/insert_nesting_parts_master.php",
    type: "get", //send it through get method
    data: {

      nes_master_id: nes_master_id,
      part_id: part_id,
      qty: qty,
      weight: nesting_part_weight
    },
    success: function (response) {
      console.log(response);



      if (response.trim()) {
        salert("Success", "Standard Nesting Parts Updated.", "success");
        // get_nesting_master();
        // get_nesting_master_single(nes_master_id)
        // $("#clear_btn").trigger("click");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function delete_nesting_master(nes_master_id) {

  $.ajax({
    url: "php/delete_nesting_master.php",
    type: "get", //send it through get method
    data: {

      nes_master_id: nes_master_id,
    },
    success: function (response) {
      console.log(response);



      if (response.trim()) {
        salert("Success", "Standard Nesting Deleted.", "success");
        get_nesting_master();
        $("#clear_btn").trigger("click");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function delete_nesting_parts_master(nes_part_id) {

  $.ajax({
    url: "php/delete_nesting_parts_master.php",
    type: "get", //send it through get method
    data: {

      nes_part_id: nes_part_id,
    },
    success: function (response) {
      console.log(response);



      if (response.trim()) {
        salert("Success", "Standard Nesting Part Deleted.", "success");
        // get_nesting_master();
        // get_nesting_master_single($("#update_nesting_btn").val())
        // $("#clear_btn").trigger("click");
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