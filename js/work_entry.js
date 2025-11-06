

 






var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
   var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var workSts = ""
$(document).ready(function(){
 
 

  $("#menu_bar").load('menu.html',
    function() { 
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
$(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );

$("#unamed").empty();
load_extra_time_table();
      check_login();



        $('#employeeProcessModal').on('show.bs.modal', function () {
    const emp_id = $('#emp').val();
    const emp_name = $('#emp option:selected').text();

    $('#emp_name_modal').text(emp_name);
    $('#process_select').empty().append('<option value="">-- Loading --</option>');

    // Load all processes
    $.getJSON('php/get_processes.php', function (data) {
      $('#process_select').empty().append('<option value="">-- Select Process --</option>');
      data.forEach(proc => {
        $('#process_select').append(`<option value="${proc.process_id}">${proc.process_name}</option>`);
      });
    });

    // Load assigned processes
    $.get('php/get_assigned_processes.php', { emp_id: emp_id }, function (html) {
      $('#assigned_process_list').html(html);
    });
  });

  // Assign button
  $('#assign_process_btn').click(function () {
    const emp_id = $('#emp').val();
    const process_id = $('#process_select').val();
     const machine_id = $('#machine_select').val();


    if (!process_id || !machine_id) {
    salert("Validation Error", "Please select both process and machine", "warning");
    return;
  }

    $.get('php/insert_employee_process.php', { emp_id, process_id, machine_id }, function (response) {
      if (response.trim() === "ok") {
        shw_toast("Success", "Process assigned", "success");
        $('#employeeProcessModal').trigger('show.bs.modal'); // Refresh modal
      } else {
        salert("Error", response, "error");
      }
    });
  });

  // Delete assigned process
  $('#assigned_process_list').on('click', '.delete-process', function () {
    const id = $(this).data('id');
swal({
  title: "Are you sure?",
  text: "This will unassign the process from the employee.",
  icon: "warning",
  buttons: true,
  dangerMode: true,
}).then((willDelete) => {
  if (willDelete) {
    $.get('php/delete_employee_process.php', { id }, function (response) {
      if (response.trim() === "ok") {
        shw_toast("Deleted", "Process removed", "success");
        $('#employeeProcessModal').trigger('show.bs.modal'); // Refresh list
      } else {
        salert("Error", response, "error");
      }
    });
  }
});

  });


  $('#emp').change(function () {
  const empId = $(this).val();
  $('#process').empty().append('<option value="">Loading...</option>');

  if (empId) {
    $.get('php/get_assigned_processes_raw.php', { emp_id: empId }, function (data) {
      $('#process').empty();

      if (data.length === 0) {
        $('#process').append('<option value="">No processes assigned</option>');
      } else {
        $('#process').append('<option value="">Choose...</option>');
        data.forEach(p => {
          $('#process').append('<option value="' +  p.process_id + '">' + p.process_name + '</option>');
        });
      }
    });
  } else {
    $('#process').empty().append('<option value="">Choose...</option>');
  }


  toggleActionButtons();
  get_work_done_recent(empId);
});



    
  $("#unamed").text(localStorage.getItem("ls_uname"))
  let touchStartX = 0;
  let touchEndX = 0;


    $('#extra_time_form').on('submit', function (event) {
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
  });

$('#extra_time_type').change(function () {
  const selected = $(this).val();

  if (selected === "break") {
    $("#extra_start_time").closest(".form-floating").removeClass("d-none");
    $("#extra_end_time").closest(".form-floating").removeClass("d-none");
    $("#ex_time").prop("disabled", true).val("");
  } else {
    // for "other" and "work"
    $("#extra_start_time").closest(".form-floating").addClass("d-none");
    $("#extra_end_time").closest(".form-floating").addClass("d-none");
    $("#ex_time").prop("disabled", true).val("0");
  }
});



// Auto-calculate ex_time from start & end time
$("#extra_start_time, #extra_end_time").on("change", function () {
  const start = $("#extra_start_time").val();
  const end = $("#extra_end_time").val();

  if (start && end) {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;

    let diff = endTotal - startTotal;
    if (diff < 0) diff += 1440; // Handle past midnight

    $("#ex_time").val(diff);
  }
});


$("#add_extra_time_btn").click(function (e) {
  e.preventDefault();

  // Validate
  const ex_name = $("#ex_name").val().trim();
  const ex_type = $("#extra_time_type").val();
  const ex_time = $("#ex_time").val().trim();
  const start_time = $("#extra_start_time").val();
  const end_time = $("#extra_end_time").val();

  if (!ex_name || !ex_type) {
    salert("Error", "Name and Type are required", "error");
    return;
  }

  if (ex_type === "break") {
    if (!start_time || !end_time || !ex_time) {
      salert("Error", "Start time, end time, and duration required for break", "error");
      return;
    }
  } else {
    if (!ex_time) {
      salert("Error", "Duration required for this type", "error");
      return;
    }
  }
const is_payable = $("#is_payable").is(":checked") ? 1 : 0;
  // Prepare data
  const formData = {
    ex_name,
    ex_type,
    start_time: start_time || null,
    end_time: end_time || null,
    ex_time: ex_time,
    is_payable 
  };

  // Send to PHP
  $.post("php/insert_extra_time.php", formData, function (res) {
    if (res.trim() === "ok") {
      salert("Success", "Extra time added", "success");
      $("#extra_time_form")[0].reset(); // Clear form
   load_extra_time_table();

    } else {
      console.log(res);
      
      salert("Error", res, "error");
    }
  });
});


$('#work_time_form').on('submit', function (event) {
  event.preventDefault();

  if (!this.checkValidity()) {
    event.stopPropagation();
    $(this).addClass('was-validated');
    return;
  }

  const start_date = $("#start_date").val();
  const end_date = $("#end_date").val();
  const emp_id = $("#emp").val();
  const startMillis = get_millis(start_date);
  const endMillis = get_millis(end_date);

  // Check 24 hours
  const diff = endMillis - startMillis;
  const diffHours = diff / (1000 * 60 * 60);

  if (diffHours > 24) {
    salert("Error", "Start and end date must be within 24 hours.", "error");
    return;
  }

  if (diffHours < 4) {
    salert("Error", "Minimum duration is 4 hours.", "error");
    return;
  }

$.get("php/check_time_exists.php", {
  emp_id: emp_id,
  start_date: start_date,
  end_date: end_date
}, function (res) {
  
  
  if (res.trim() === "exists") {
    salert("Duplicate Entry", "Time already entered for this employee and date range", "warning");

    $("#work_time_form :input").prop("disabled", true);

  // Display entry and delete button
  const start_date_text = $("#start_date").val().split("T")[0];
  const end_date_text = $("#end_date").val().split("T")[0];

  const listItem = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span class="text-muted"><strong>${start_date_text}</strong> to <strong>${end_date_text}</strong></span>
      <button class="btn btn-sm btn-outline-danger border-0" id="delete_work_entry_btn">
        <i class="fa fa-trash me-1"></i> 
      </button>
    </li>
  `;
  $("#duplicate_entry_list").html(listItem);

$("#delete_work_entry_btn").on("click", function () {
  swal({
    title: "Are you sure?",
    text: "This will delete the existing entry permanently.",
    icon: "warning",
    buttons: true,
    dangerMode: true
  })
  .then((willDelete) => {
    if (willDelete) {
      const emp_id = $("#emp").val();
      const start_date = $("#start_date").val();
      const end_date = $("#end_date").val();

      $.post("php/delete_work_entry.php", {
        emp_id,
        start_date,
        end_date
      }, function (delRes) {
        if (delRes.trim() === "ok") {
          swal("Deleted", "Entry has been deleted", "success");

        location.reload();
        } else {
          swal("Error", delRes, "error");
        }
      });
    }
  });
});

// load data if exists
$.get("php/get_existing_work_data.php", {
  emp_id: emp_id,
  start_date: start_date,
  end_date: end_date
}, function (res) {
  console.log("Existing work data:", res);
  
  const data = JSON.parse(res);

  if (data.status === "found") {
    $("#act_work_time").text(data.act_work_time + " Mins");




    window.currentWorkId = data.work_id;

    // Load work time table
    let workTimeRows = "";
    data.process.forEach((p, i) => {
      workTimeRows += `
        <tr data-min-time="${p.min_time}" data-max-time="${p.max_time}" data-wtid="${p.wtid}"  data-part-id="${p.part_id}" data-part-name="${p.part_name}">
          <td>${i + 1}</td>
          <td>${p.part_name}</td>
          <td>${p.process_name} (${p.machine_name})</td>
          <td>${p.qty}</td>
          <td><button class="btn btn-sm btn-danger remove-work-row"><i class="fa fa-trash"></i></button></td>
        </tr>
      `;
    });
    $("#work_time_table").html(workTimeRows);

    // Load summary table
    let summaryRows = "";
    data.process.forEach((p, i) => {
      summaryRows += `
        <tr data-wtid="${p.wtid}" data-part-id="${p.part_id}">
          <td>${i + 1}</td>
           <td>${p.part_name}</td>
          <td>${p.process_name}</td>
             <td>${p.time}</td>
          <td>${p.qty}</td>
        </tr>
      `;
    });
    $("#work_time_summary_table").html(summaryRows);

    // Load extra time (breaks)
    let breakRows = "";
    data.break.forEach((b, i) => {
      breakRows += `
        <tr data-ext-id="${b.ext_id}">
          <td>${i + 1}</td>
          <td>${b.ex_name}</td>
          <td>${b.break_time}</td>
          <td><button class="btn btn-sm btn-outline-danger delete-extra-row"><i class="bi bi-trash"></i></button></td>
        </tr>
      `;
    });
    $("#extra_time_table1").html(breakRows);


var totalExtra = 0;
  $("#extra_time_table1 tr").each(function () {
    const time =     parseFloat($(this).find("td").eq(2).text()) || 0;
    totalExtra += time;
  });


  
var totalwork = 0;
  $("#work_time_summary_table tr").each(function () {
    const time = parseFloat($(this).find("td").eq(3).text()) || 0;
       const qty = parseInt($(this).find("td").eq(4).text()) || 0;
       const workTime = time * qty;
   totalwork += workTime;
  });
  const unused = Math.round(data.act_work_time - totalwork);


  // Destroy previous chart instance if it exists
if (window.summaryChart instanceof Chart) {
  window.summaryChart.destroy();
}
drawSummaryChart(totalwork, totalExtra, Math.max(unused, 0));



  
// 3. Default status
let processStsText = "";
let processStsIcon = "";

// 4. Logic
if (data.work_sts === "work") {
  processStsText = "Good work";
  processStsIcon = `<i class="fa fa-thumbs-o-up text-success blink" aria-hidden="true"></i>`;
} else {

  processStsText = `You have unused time – ${unused} mins`;
  processStsIcon = `<i class="fa fa-hourglass-end text-warning blink" aria-hidden="true"></i>`;
}

// 5. Update DOM
$("#process_sts").html(`
  <p class="p-0 m-0">${processStsText}</p>
  ${processStsIcon}
`);


  $("#extra_time_text").text(totalExtra);
  var totalTimeText =     parseFloat(data.act_work_time) + totalExtra;
$("#total_time_text").text(totalTimeText + " Mins (" + (totalTimeText / 60).toFixed(2) + " hours)");
    // Load remark
    if (data.remark) {
      $("#free_time_remark").removeClass("d-none");
      $("#remark_text").val(data.remark);
    }

    // Show update button
    $("#submit_btn").text("Update");

    // Show part2
    $("#part2").removeClass("d-none");
    $("#part1").removeClass("d-none");
  }
});



  } else {
    // continue your existing logic:
    // time calculation, show part1, load tables, etc.
     const totalMinutes = Math.round(diff / (60 * 1000));
  const hours = (totalMinutes / 60).toFixed(2);
  $("#total_time_text").text(totalMinutes + " Mins (" + hours + " hours)");

  // ✅ Make #part1 visible
  $("#part1").removeClass("d-none");

loadExtraTimeTable1(start_date, end_date);

  }
  loadExtraWorkDropdown();
});




});




$(document).on("click", ".delete-btn", function () {
  const row = $(this).closest("tr");
  const ext_id = row.data("id");

  swal({
    title: "Are you sure?",
    text: "This record will be deleted!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.post("php/delete_extra_time.php", { ext_id }, function (res) {
        if (res.trim() === "ok") {
          salert("Deleted", "Record deleted successfully", "success");
          load_extra_time_table();
        } else {
          salert("Error", res, "error");
        }
      });
    }
  });
});

$(document).on("click", ".edit-btn", function () {
  const row = $(this).closest("tr");
  const ext_id = row.data("id");

  const name = row.find("td").eq(1).text().trim();
  const type = row.find("td").eq(2).text().trim();
  const start = row.find("td").eq(3).text().trim() === "-" ? "" : row.find("td").eq(3).text().trim();
  const end = row.find("td").eq(4).text().trim() === "-" ? "" : row.find("td").eq(4).text().trim();
  const time = row.find("td").eq(5).text().trim();

  $("#ex_name").val(name);
  $("#extra_time_type").val(type).trigger("change");
  $("#extra_start_time").val(start);
  $("#extra_end_time").val(end);
  $("#ex_time").val(time);

  $("#add_extra_time_btn").addClass("d-none");
  $("#update_extra_time_btn, #cancel_edit_btn").removeClass("d-none");
  $("#update_extra_time_btn").data("id", ext_id); // storing ID for update
});



$("#update_extra_time_btn").click(function () {
  const ext_id = $(this).data("id");

  const ex_name = $("#ex_name").val().trim();
  const ex_type = $("#extra_time_type").val();
  const start_time = $("#extra_start_time").val();
  const end_time = $("#extra_end_time").val();
  const ex_time = $("#ex_time").val().trim();
const is_payable = $("#is_payable").is(":checked") ? 1 : 0;
  if (!ex_name || !ex_type || !ex_time) {
    salert("Error", "All required fields must be filled", "error");
    return;
  }

  $.post("php/update_extra_time.php", {
    ext_id, ex_name, ex_type, start_time, end_time, ex_time,is_payable
  }, function (res) {
    if (res.trim() === "ok") {
      salert("Updated", "Record updated successfully", "success");

      $("#extra_time_form")[0].reset();
      $("#add_extra_time_btn").removeClass("d-none");
      $("#update_extra_time_btn, #cancel_edit_btn").addClass("d-none");
      load_extra_time_table();
    } else {
      salert("Error", res, "error");
    }
  });
});

$("#cancel_edit_btn").click(function () {
  // Clear the form
  $("#extra_time_form")[0].reset();

  // Restore default button visibility
  $("#add_extra_time_btn").removeClass("d-none");
  $("#update_extra_time_btn, #cancel_edit_btn").addClass("d-none");

  // Reset visibility and disabling of time fields
  $("#extra_start_time").closest(".form-floating").addClass("d-none");
  $("#extra_end_time").closest(".form-floating").addClass("d-none");
  $("#ex_time").val("0").prop("disabled", true);
});

$("#add_extra_btn").click(function () {
  const selected = $("#extra_work option:selected");
  const ext_id = selected.val();
  const name = selected.text();
  const time =     parseFloat($("#extra_time_in").val());

  if (!ext_id || !time || isNaN(time)) {
    salert("Error", "Select valid item and enter time", "error");
    return;
  }

  const rowCount = $("#extra_time_table1 tr").length + 1;

  $("#extra_time_table1").append(`
    <tr data-ext-id="${ext_id}">
      <td>${rowCount}</td>
      <td>${name}</td>
      <td>${time}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger delete-extra-row">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `);

    //  Clear input fields for new entry
  $("#extra_work").val("");
  $("#extra_time_in").val("");

  updateExtraTimeSummary();
});

$(document).on("click", ".delete-extra-row", function () {
  $(this).closest("tr").remove();
  updateExtraTimeSummary();
});


  // Print button click
$('#printProcessBtn').click(function () {
  const empName = $('#emp option:selected').text();
  const empId = $('#emp').val();

  $('#print_emp_name').text(empName);
  $('#print_date').text(new Date().toLocaleDateString());
  $('#print_process_rows').empty();

  $.get('php/get_assigned_processes_raw.php', { emp_id: empId }, function (processes) {
    let rowCount = 0;

    // Add assigned process rows
    if (processes.length > 0) {
      processes.forEach(p => {
        $('#print_process_rows').append(`
          <tr>
            <td><input type="checkbox" style="transform: scale(1.2);"></td>
            <td>${p.process_name}</td>
            <td></td>
            <td></td>
          </tr>
        `);
        rowCount++;
      });
    }

    // Add 10 empty rows for manual entries
    for (let i = rowCount; i < rowCount + 10; i++) {
      $('#print_process_rows').append(`
        <tr>
          <td><input type="checkbox" style="transform: scale(1.2);"></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `);
    }

    const printContent = $('#printSection').clone().removeClass('d-none');
    const originalContent = $('body').html();
    $('body').html(printContent);
    window.print();
    location.reload();
  });
});


// When process is selected → load related machines
// $('#process').change(function () {
//   const processId = $(this).val();
//   console.log("Selected process ID:", processId);
  
//   $('#machine').empty().append('<option value="">Loading...</option>');

//   if (processId) {
//     $.getJSON('php/get_machines_by_process.php', { process_id: processId }, function (machines) {
//       console.log(machines);
      
//       $('#machine').empty().append('<option value="">Choose...</option>');
//       machines.forEach(m => {
//         $('#machine').append(`<option value="${m.jmid}">${m.machine_name}</option>`);
//       });
//     });
//   } else {
//     $('#machine').empty().append('<option value="">Choose...</option>');
//   }
// });

// Add row to table on button click
$('#add_work_btn').click(function () {
  const processId = $('#process').val();
  const processText = $('#process option:selected').text();
const machineId = $('#process option:selected').data("machine");
const machineText = "Auto"; // or fetch from machine_name map if needed

  const qty = $('#work_qty').val();
const part_id = $('#selected_part_id').val();
console.log("Selected part ID:", part_id);

const part_name = $('#part').val();

  
  if (!processId || !machineId || !qty || qty <= 0) {
    shw_toast("Validation", "All fields are required and must be valid", "warning");
    return;
  }

  $.getJSON('php/get_work_time.php', { process_id: processId, machine_id: machineId }, function (res) {
    if (!res || res.min_time === undefined) {
      salert("Error", "Work time data not found", "error");
      return;
    }

const index = $('#work_time_table tr:has(td)').length + 1;

$('#work_time_table').append(`
<tr 
    data-min-time="${res.min_time}" 
    data-max-time="${res.max_time}" 
    data-wtid="${res.wtid}"
    data-part-id="${part_id}"
    data-part-name="${part_name}">
    <td>${index}</td>
    <td>${$('#part').val()}</td>
    <td>${processText}</td>
    <td>${qty} </td>
    <td><button class="btn btn-sm btn-danger remove-work-row"><i class="fa fa-trash"></i></button></td>
  </tr>
`);

$('#process').val('');
$('#machine').empty().append('<option selected disabled value="">Choose...</option>');

$('#work_qty').val('');

  });
});

// Optional: Delete row
$(document).on('click', '.remove-work-row', function () {
  const row = $(this).closest('tr');

  swal({
    title: "Are you sure?",
    text: "This will remove the entry from the work table.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      row.remove();

      // Reindex rows after deletion
   $('#work_time_table tr:has(td)').each(function (i) {
  $(this).find('td:first').text(i + 1);  // or use just i if you prefer starting from 0
});

      shw_toast("Deleted", "Work entry removed", "success");
    }
  });
});

$("#summary_btn").click(function () {
  let totalMinTime = 0;
  let totalMaxTime = 0;
  let processList = [];

  $("#work_time_table tr").each(function () {
  
    parseFloat
    const process = $(this).find("td").eq(2).text().trim();
    const qty = parseInt($(this).find("td").eq(3).text().trim()) || 0;
    const minTime =     parseFloat($(this).data("min-time")) || 0;
    const maxTime =     parseFloat($(this).data("max-time")) || 0;
    const part_id = $(this).data('part-id');
const part_name = $(this).data('part-name');
const wtid = $(this).data("wtid") || "unknown";

    totalMinTime += qty * minTime;
    totalMaxTime += qty * maxTime;

    processList.push({
      process,
      qty,
      minTime,
      maxTime,
      wtid,
      part_id,
      part_name
    });
  });


  console.log("Total Min Time:", totalMinTime);
  console.log("Total Max Time:", totalMaxTime);
  
  // Get actual work time
  const actWorkTime =     parseFloat($("#act_work_time").text()) || 0;
 const totalExtra =     parseFloat($("#extra_time_text").text()) || 0;

 var freeTime = 0;
 var totalWorkUsed = 0;
  console.log(actWorkTime);
  
  let statusMsg = "";
  let statusIcon = "";
  let resultRows = "";
  let caseType = "";

  if (actWorkTime < totalMinTime) {
    // ❌ Case 1: Not possible
    statusMsg = "Sorry wrong entry kindly check the input";
    statusIcon = `<i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>`;
    caseType = "case1";

  } else if (actWorkTime <= totalMaxTime) {
    // ✅ Case 2: Within range, buffer distributed
    const buffer = actWorkTime - totalMinTime;
    const totalWeight = processList.reduce((sum, p) => sum + p.qty * p.minTime, 0);

    statusMsg = "Good work";
    statusIcon = `<i class="fa fa-thumbs-o-up text-success blink" aria-hidden="true"></i>`;
    caseType = "case2";

    processList.forEach((p, i) => {
       const baseTime = p.minTime; // Only per unit
  const share = totalWeight ? (p.qty * p.minTime / totalWeight) * buffer : 0;
  const adjustedTime =(baseTime + (share / p.qty)).toFixed(2); // distribute per unit


  totalWorkUsed += adjustedTime * p.qty; // total work used
      resultRows += `
        <tr data-wtid="${p.wtid}" data-part-id="${p.part_id}">
      
          <td>${i + 1}</td>
          <td>${p.part_name}</td>
          <td>${p.process}</td>
          <td>${adjustedTime}</td>
          <td>${p.qty}</td>
        </tr>
      `;
    });

  } else {
    // ⚠️ Case 3: Overtime
    const unused = actWorkTime - totalMaxTime;
freeTime = unused;
    statusMsg = `You have unused time – ${unused} mins`;
    statusIcon = `<i class="fa fa-clock-o text-warning" aria-hidden="true"></i>`;
    caseType = "case3";

    totalWorkUsed += totalMaxTime; // total work used is max time
    processList.forEach((p, i) => {
      const maxUsed = p.maxTime ;
      resultRows += `
          <tr data-wtid="${p.wtid}" data-part-id="${p.part_id}">
          <td>${i + 1}</td>
          <td>${p.part_name}</td>
          <td>${p.process}</td>
          <td>${maxUsed}</td>
          <td>${p.qty}</td>
        </tr>
      `;
    });




    

    
  }


drawSummaryChart(totalWorkUsed, totalExtra, Math.max(freeTime, 0));
  $("#free_time_remark").addClass("d-none"); // default

if (actWorkTime > totalMaxTime) {
  workSts = "free time";
  $("#free_time_remark").removeClass("d-none"); // show textarea
} else {
  workSts = "work";
}
window.currentWorkSts = workSts;

  // Update the summary UI
  $("#process_sts").html(`<p class="p-0 m-0">${statusMsg}</p>${statusIcon}`);
  $("#work_time_summary_table").html(resultRows);
  $("#part2").removeClass("d-none");
});

$("#submit_btn").click(function () {
  $("#submit_btn").prop("disabled", true);

  const summaryRows = $("#work_time_summary_table tr");
  const act_work_time =     parseFloat($("#act_work_time").text().trim()) || 0;

  // determine if insert or update
const action = window.currentWorkId ? "update" : "insert";

  if (summaryRows.length === 0) {
    alert("No process data available to submit.");
    return;
  }

  const start_date = $("#start_date").val();
  const end_date = $("#end_date").val();
  const emp_id = $("#emp").val();
  const work_sts = window.currentWorkSts || "work";
  const remark = $("#remark_text").val() || "";

  // collect work_process entries
  const work_process = [];
  summaryRows.each(function () {
    console.log("Processing row:", $(this).data("part-id"));
    
    const part_id = $(this).data("part-id");
    const wtid = $(this).data("wtid");
    const qty = parseInt($(this).find("td").eq(4).text().trim()) || 0;
    const time = parseFloat($(this).find("td").eq(3).text().trim()) || 0;
    if (wtid && qty > 0) {
      work_process.push({ wtid, qty , time, part_id });
    }
  });

  // collect work_break entries
  const work_break = [];
  $("#extra_time_table1 tr").each(function () {
    const ext_id = $(this).data("ext-id");
    const break_time =     parseFloat($(this).find("td").eq(2).text().trim()) || 0;
    if (ext_id && break_time > 0) {
      work_break.push({ ext_id, break_time });
    }
  });

  // Send to PHP via AJAX
  $.ajax({
    url: "php/insert_work_data.php",
    method: "POST",
    data: {
       action,
  work_id: window.currentWorkId || 0,
      start_date,
      end_date,
      emp_id,
      work_sts,
      remark,
      work_process: JSON.stringify(work_process),
      work_break: JSON.stringify(work_break),
        act_work_time: act_work_time
    },
    success: function (res) {
      if (res.trim() === "ok") {
        alert("Data saved successfully!");
         location.reload();
      } else {
        alert("Error: " + res);
      }
    },
    error: function (err) {
      alert("AJAX error: " + err.responseText);
    }
  });
});

$('#process_select').on('change', function () {
  const process_id = $(this).val();
  if (!process_id) return;

  $.get('php/get_machines_by_process.php', { process_id }, function (res) {
        console.log("Machines for process:", res);
    const data = res;

    
    let options = `<option value="">Select Machine</option>`;
    data.forEach(m => {
      options += `<option value="${m.jmid}">${m.machine_name}</option>`;
    });
    $('#machine_select').html(options);
  });
});

$(function () {
  // Autocomplete for part
  $('#part').on('input', function () {
    const search = $(this).val();
    if (search.length < 2) return;

    $.get('php/search_parts.php', { query: search }, function (data) {
      const results = JSON.parse(data);
      let suggestionBox = $('#part_autocomplete_suggestions');
      if (!suggestionBox.length) {
        suggestionBox = $('<ul id="part_autocomplete_suggestions" class="list-group position-absolute w-100 z-1"></ul>');
        $('#part').after(suggestionBox);
      }
      suggestionBox.empty();
      results.forEach(p => {
        suggestionBox.append(`<li class="list-group-item part-item" data-id="${p.part_id}" data-name="${p.part_name}">${p.part_name}</li>`);
      });
    });
  });

  // Select part
  $(document).on('click', '.part-item', function () {
  
    const part_id = $(this).data('id');
    const part_name = $(this).data('name');
     const emp_id = $('#emp').val();
    $('#part').val(part_name);
    $('#selected_part_id').val(part_id);
    $('#part_autocomplete_suggestions').remove();
console.log("Selected part ID:", part_id);
console.log(emp_id);



    // Load process dropdown based on selected part
    $.get('php/get_recursive_processes.php', { part_id, emp_id }, function (res) {
      console.log("Processes for part:", res);
      
      const data = JSON.parse(res);
      let options = `<option value="">Select process...</option>`;
      data.forEach(p => {
        options += `<option value="${p.process_id}" data-machine="${p.machine_id}" >${p.process_name}</option>`;
      });
      $('#process').html(options);
    });
  });

  // Hide suggestions if clicked outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#part_autocomplete').length) {
      $('#part_autocomplete_suggestions').remove();
    }
  });
});


get_work_done_recent(0);
 $('#recent_entry_list').on('click', 'li', function () {
    const empId = $(this).data('emp_id');
    const startDate = $(this).data('sdate');
    const endDate = $(this).data('edate');


    console.log(startDate);
    
    // Set values in the form
    $('#emp').val(empId).trigger('change');

    // Ensure the date is in "yyyy-MM-ddThh:mm" format for datetime-local input

    $('#start_date').val((startDate));
    $('#end_date').val((endDate));

     $("#ok_btn").trigger("click"); // Trigger the OK button click to load data
});

});

  function get_work_done_recent(emp_id)
   {
    
   
   $.ajax({
     url: "php/get_work_done_recent.php",
     type: "get", //send it through get method
     data: {
     emp_id : emp_id

     },
     success: function (response) {
   console.log(response);
   
   $('#recent_entry_list').empty();
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#recent_entry_list').append(
  `<li data-emp_id="${obj.emp_id}" data-sdate="${obj.start_date_1}" data-edate="${obj.end_date_1}" class='list-group-item'>
    <p class='small m-0 p-0 mb-1'>
      <i class='fa fa-user me-1 text-primary' aria-hidden='true'></i>${obj.emp_name}
    </p>
    <p class='small m-0 p-0 mark'>
      <i class='fa fa-calendar me-1 text-primary' aria-hidden='true'></i>
      ${obj.start_date} - ${obj.end_date}
    </p>
  </li>`
);

     });
   
    
   }
   else{
   $('#recent_entry_list').append( "<li class='list-group-item'>No recent entries found</li>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

function drawSummaryChart(workDone, extraWork, freeTime) {
  const ctx = document.getElementById('summary_chart').getContext('2d');

  const labels = [];
  const data = [];
  const backgroundColors = [];

  if (workDone > 0) {
    labels.push("Work Done");
    data.push(workDone);
    backgroundColors.push("#28a745");
  }

  if (extraWork > 0) {
    labels.push("Extra Work");
    data.push(extraWork);
    backgroundColors.push("#17a2b8");
  }

  if (freeTime > 0) {
    labels.push("Free Time");
    data.push(freeTime);
    backgroundColors.push("#FF0000");
  }

  if (data.length === 0) {
    labels.push("No Data");
    data.push(1);
    backgroundColors.push("#dee2e6");
  }

  // Destroy old chart if exists
  if (window.summaryChart && typeof window.summaryChart.destroy === "function") {
    window.summaryChart.destroy();
  }

  // Create horizontal bar chart
  window.summaryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      indexAxis: 'y',  // ✅ This makes the bar chart horizontal
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw} mins`;
            }
          }
        },
        title: {
          display: true,
          text: "Work Summary Breakdown"
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Minutes"
          }
        }
      }
    }
  });
}







  function toggleActionButtons() {
    const empVal = $('#emp').val();
    const isEnabled = !!empVal;
    $('#openProcessModalBtn').prop('disabled', !isEnabled);
    $('#printProcessBtn').prop('disabled', !isEnabled);
  }


function updateExtraTimeSummary() {
  let totalExtra = 0;

  $("#extra_time_table1 tr").each(function () {
    const time =     parseFloat($(this).find("td").eq(2).text()) || 0;
    totalExtra += time;
  });

  $("#extra_time_text").text(totalExtra);

  // subtract from total_time_text
  const totalTimeText = $("#total_time_text").text();
  const totalMatch = totalTimeText.match(/(\d+)\s+Mins/);
  const totalMinutes = totalMatch ?     parseFloat(totalMatch[1]) : 0;

  const actTime = totalMinutes - totalExtra;
  $("#act_work_time").text(`${actTime} Mins`);
}

function loadExtraTimeTable1(startDate, endDate) {
  console.log("Sending range to PHP:", startDate, endDate);

  $.get("php/get_extra_time_within_range.php", { from: startDate, to: endDate }, function (res) {
    const data = JSON.parse(res);
    let tableRows = "";
    let index = 1;
console.log(res);

    data.forEach(item => {
      tableRows += `
        <tr data-ext-id="${item.ext_id}">
          <td>${index++}</td>
          <td>${item.ex_name}</td>
          <td>${item.ex_time}</td>
          <td>
            <button class="btn btn-sm btn-outline-danger delete-extra-row">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>`;
    });

    $("#extra_time_table1").html(tableRows);
    updateExtraTimeSummary();
  });
}


function loadExtraWorkDropdown() {
  $.get("php/get_all_extra_time.php", function (res) {
    const data = JSON.parse(res);
    let dropdownOptions = `<option disabled selected value="">Choose...</option>`;

    data.forEach(item => {
      if (!item.start_time && !item.end_time) {
        dropdownOptions += `<option value="${item.ext_id}" data-time="${item.ex_time}">${item.ex_name}</option>`;
      }
    });

    $("#extra_work").html(dropdownOptions);
  });
}




function load_extra_time_table() {
  $.get("php/get_all_extra_time.php", function (res) {
    let data = JSON.parse(res);
    let rows = "";

    data.forEach((item, index) => {
      rows += `
        <tr data-id="${item.ext_id}">
          <td>${index + 1}</td>
          <td>${item.ex_name}</td>
          <td>${item.ex_type}</td>
          <td>${item.start_time || "-"}</td>
          <td>${item.end_time || "-"}</td>
          <td>${item.ex_time}</td>
          <td>${item.is_payable == 1 ? "Yes" : "No"}</td>

        <td>
  <div class="d-flex justify-content-center gap-2">
    <button class="btn btn-sm btn-outline-primary edit-btn">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-sm btn-outline-danger delete-btn">
      <i class="bi bi-trash"></i>
    </button>
  </div>
</td>

        </tr>`;
    });

    $("#extra_time_table tbody").html(rows);
  });
}




   function get_employee()
   {
    
   
   $.ajax({
     url: "php/get_all_emp_hi.php",
     type: "get", //send it through get method
     data: {
      emp_id : current_user_id
     
   },
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       
       $("#emp").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
   
   
   
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




  

   



function check_login()
{
 
if (localStorage.getItem("logemail") == null && phone_id == null )  {
 window.location.replace("login.html");
}
else if (localStorage.getItem("logemail") == null && phone_id != null )
 {
get_current_userid_byphoneid();
$('#menu_bar').hide()
 }

 else
 {
   get_employee();
 }
}


function get_current_userid_byphoneid()
   {
     $.ajax({
       url: "php/get_current_employee_id_byphoneid.php",
       type: "get", //send it through get method
       data: {
         phone_id:phone_id,
        
      
      },
       success: function (response) {
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      console.log(response);
      
      
       obj.forEach(function (obj) {
         current_user_id = obj.emp_id;
         current_user_name =  obj.emp_name;
       });
      
 get_employee();
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

  
   function shw_toast(title,des,theme)
   {
   
     
         $('.toast-title').text(title);
         $('.toast-description').text(des);
   var toast = new bootstrap.Toast($('#myToast'));
   toast.show();
   }  

   function get_millis(t)
   {
    
    var dt = new Date(t);
    return dt.getTime();
   }



   function get_cur_millis()
   {
    var dt = new Date();
    return dt.getTime();
   }


   function get_today_date(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  
console.log(mins)

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T"+ hour + ":"+ mins; 
    return today;
   }

   function get_today_start_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T00:00"; 

    return get_millis(today)
     
   }


   function get_today_end_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T23:59"; 

    return get_millis(today)
     
   }

   function salert(title, text, icon) {
  

    swal({
        title: title,
        text: text,
        icon: icon,
    });
}



function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}