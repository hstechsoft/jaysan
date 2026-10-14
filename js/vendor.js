
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

    // Current Location

    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       function (position) {
    //         console.log("Latitude:", position.coords.latitude);
    //         console.log("Longitude:", position.coords.longitude);
    //         console.log("Accuracy:", position.coords.accuracy + " meters");
    //         get_godown_locations_demand(position.coords.latitude, position.coords.longitude)
    //       },
    //       function (error) {
    //         console.log(error.message);
    //       }
    //     );
    //   } else {
    //     console.log("Geolocation is not supported.");
    //   }

    //   $("#godown_list_tbody").on("click", ".select_btn", function () {
    //     let godown_name = $(this).data("creditor_name");
    //     let godown_id = $(this).val();

    //     if (godown_id && godown_name) {
    //       $("#godown_list_modal").modal("hide");
    //       // $("#godown").data("godown_id", godown_id).val(godown_name);
    //       // get_demand_work_report('all', 'all', godown_id, '', '');

    //     }
    //     else {
    //       salert("Warning", "Data Missing!, Try Again.", "warning");
    //     }

    //   })


    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#planed_work_order_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();


    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#godown').on('input', function () {
        $(this).data("godown_id", '');
        $('#department').val('').data('dept_id', '');
        $('#section').val('').data("sec_id", '');
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
                                    id: item.creditor_id,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("godown_id", ui.item.id);
                    get_vendor_report(ui.item.id);

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#department').on('input', function () {
        console.log($("#stock_godown").data("godown_id"));

        $(this).data("dept_id", '');
        $('#section').val('').data("sec_id", '');

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
                            godown_id: $("#godown").data("godown_id"),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.dep_name,
                                    value: item.dep_name,
                                    id: item.dep_id,
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


        $(this).data("sec_id", '');
        //check the value not emptyFF
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
                                    id: item.dep_sec_id,
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

    $('#part').on('input', function () {
        //check the value not empty
        $(this).removeData("part_id");


        if ($('#part').val() != "") {
            $('#part').autocomplete({
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
                    $(this).data("part_id", ui.item.id);
                },
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
        }
    });

    $("#godown, #department, #section, #part").on("focusout", function () {
        var godown_id = $("#godown").data("godown_id") || '';
        var dep_id = $("#department").data("dept_id") || '';
        var dep_sec_id = $("#section").data("sec_id") || '';
        var process_id = "all";
        var final_part_id = $("#part").data("part_id") || 'all';

        // get_demand_work_report(final_part_id, process_id, godown_id, dep_id, dep_sec_id);

    });

    $("#vendor_work_order_tbody").on("click", ".work_order_btn", function () {

        var work_order_details = $(this).data("work_order_details");

        // Handle both an array and a JSON string
        if (typeof work_order_details === "string") {
            try {
                work_order_details = JSON.parse(work_order_details);
            } catch (error) {
                console.error("Invalid work order JSON:", error);
                work_order_details = [];
            }
        }

        work_order_details = Array.isArray(work_order_details)
            ? work_order_details
            : [];

        var tbody = $("#work_order_details_tbody");
        tbody.empty();

        if (work_order_details.length === 0) {
            tbody.html(`
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No work orders found
                </td>
            </tr>
        `);
        } else {

            work_order_details.forEach(function (work) {

                var isOverdue = Number(work.due_date_overdue) === 1;

                tbody.append(`
                <tr class="${isOverdue ? 'overdue-work-order' : ''}">

                    <td>
                        <span class="fw-semibold">
                            ${work.work_order_id ?? '-'}
                        </span>
                    </td>

                    <td>${work.qty ?? 0}</td>

                    <td>${work.completed_qty ?? 0}</td>

                    <td>${work.created_date ?? '-'}</td>

                    <td>
                        <span class="badge bg-primary">
                            ${work.hour_since ?? 0} hrs
                        </span>
                    </td>

                    <td>
                        <span class="badge ${isOverdue ? 'bg-danger' : 'bg-success'}">
                            ${isOverdue ? '<i class="fa fa-exclamation-triangle me-1"></i>' : ''}
                            ${work.due_date && work.due_date !== '00-00-0000'
                        ? work.due_date
                        : 'Not set'}
                        </span>
                    </td>

                </tr>
            `);
            });
        }

        $("#work_order_details_modal").modal("show");
    });

    $("#vendor_work_order_tbody").on("click", ".complete_btn", function () {
        var process_id = $(this).val();
        var godown_id = $("#godown").data("godown_id") || '';
        var dep_id = $("#department").data("dept_id") || '';
        var dep_sec_id = $("#section").data("sec_id") || '';
        var emp_id = current_user_id;
        var qty = $(this).closest("tr").find("td:eq(4)").find("input[type='number']").val();

        if (!process_id) {
            salert("Warning", "Process ID is missing.", "warning");
            return;
        }

        if (!qty || qty <= 0) {
            salert("Warning", "Please enter a valid quantity.", "warning");
            return;
        }

        if (!godown_id) {
            salert("Warning", "Please select a godown.", "warning");
            return;
        }

        insert_vendor_work(process_id, godown_id, dep_id, dep_sec_id, emp_id, qty);
    })

});





function stock_demand_reservation(process_id, godown_id, dep_id, dep_sec_id, emp_id, qty, due_date) {
    console.log(process_id, godown_id, dep_id, dep_sec_id, emp_id, qty, due_date);

    $.ajax({
        url: "php/stock_demand_reservation.php",
        type: "get", //send it through get method
        data: {

            work_process_id: process_id,
            work_order_qty: qty,
            godown: godown_id,
            dep: dep_id,
            sec: dep_sec_id,
            emp_id: emp_id,
            due_date: due_date
        },
        success: function (response) {
            console.log(response);

            var response = JSON.parse(response);

            if (response.success === true) {

                get_demand_work_report($("#part").data("part_id") || 'all', "all", $("#godown").data("godown_id") || '', $("#department").data("dept_id") || '', $("#section").data("sec_id") || '');
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_vendor_report(godown) {
    console.log(godown);

    $.ajax({
        url: "php/get_vendor_report.php",
        type: "get", //send it through get method
        data: {

            godown: godown,

        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $('#vendor_work_order_tbody').empty();
                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count++;

                        var input_part_details = item.input_parts
                            ? JSON.parse(item.input_parts)
                            : [];

                        var input_part = input_part_details
                            .map(part => part.part)
                            .join(', ');

                        var work_order_details = item.work_order_details
                            ? JSON.parse(item.work_order_details)
                            : [];

                        var work_orders = work_order_details.flatMap(group =>
                            Array.isArray(group.work_order_details)
                                ? group.work_order_details
                                : []
                        );

                        var work_order_count = work_orders.length;

                        console.log("Work orders:", work_orders);
                        console.log("Work order count:", work_order_count);

                        $('#vendor_work_order_tbody').append(`
                            <tr>
                                <td>${count}</td>

                                <td>
                                    ${item.final_part}
                                    <br><strong>Total Qty:</strong>
                                    <span class="badge bg-primary">
                                        ${item.total_process}
                                    </span>
                                </td>

                                <td>${item.process_name}</td>

                                <td>
                                    ${input_part}
                                    <br><strong>Total Qty:</strong>
                                    <span class="badge bg-primary">
                                        ${item.total_internal_reserve_qty}
                                    </span>
                                </td>

                                <td>
                                    <input type="number"
                                        class="form-control form-control-sm enter_qty"
                                        value="${parseInt(item.total_pending_process) || 0}"
                                        placeholder="Enter Qty">
                                </td>

                                <td>
                                    <button
                                        class="btn btn-secondary btn-sm work_order_btn"
                                        data-work_order_details='${JSON.stringify(work_orders)}'>
                                        ${work_order_count}
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            class="btn btn-primary btn-sm complete_btn"
                                            value="${item.process_id}">
                                            Submit
                                        </button>
                                    </td>
                                </tr>
                            `);
                    });
                }
                else {
                    $('#vendor_work_order_tbody').append('<tr><td colspan="9" class="text-center">No Parts available</td></tr>');
                }

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_vendor_work(process_id, godown_id, dep_id, dep_sec_id, emp_id, qty) {

    $.ajax({
        url: "php/insert_vendor_work.php",
        type: "post", //send it through get method
        data: {

            process_id: process_id,
            godown_id: godown_id,
            dep_id: dep_id,
            sec_id: dep_sec_id,
            emp_id: emp_id,
            qty: qty
        },
        success: function (response) {
            console.log(response);



            if (response.trim()) {
                salert("Success", "Completed Parts Added Successfully", "success");
                get_vendor_report($("#godown").data("godown_id") || '');
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

// function get_godown_locations_demand(lat, lng) {

//   $.ajax({
//     url: "php/get_godown_location.php",
//     type: "get",
//     data: {
//       latti: lat,
//       longi: lng,
//     },

//     success: function (response) {
//       console.log(response);

//       if (response.trim() !== "error") {
//         $("#godown_list_tbody").empty();
//         if (response.trim() !== "0 result") {
//           var obj = JSON.parse(response);
//           if (obj.length == 1) {
//             obj.forEach(function (item) {
//               // $("#godown").data("godown_id", item.creditor_id).val(item.creditor_name);
//               // get_demand_work_report('all', 'all', item.creditor_id, '', '');
//             })
//           }
//           else {
//             $("#godown_list_modal").modal("show");
//             var count = 0;
//             obj.forEach(function (item) {
//               count += 1;
//               $("#godown_list_tbody").append(`
//                                 <li class="list-group-item godown-item">
//                                     <div class="godown-details">
//                                         <h6 class="godown-name mb-1">${item.creditor_name}</h6>
//                                         <span class="godown-distance">
//                                             <i class="fa-solid fa-location-dot me-1"></i>
//                                             ${item.distance_m} Meters Away
//                                         </span>
//                                     </div>

//                                     <button
//                                         class="btn btn-success btn-sm select_btn"
//                                         value="${item.creditor_id}"
//                                         data-creditor_name="${item.creditor_name}">
//                                         <i class="fa-solid fa-circle-check me-1"></i>
//                                         Select
//                                     </button>
//                                 </li>
//                             `);
//             });
//             $("#godown_status").text('Found ' + count + ' Godown').addClass("bg-success");

//           }
//         }
//         else {
//           $("#godown_status").text('No Godown').addClass("bg-danger");
//         }
//       }
//     },

//     error: function (xhr) {
//       console.log(xhr.responseText);
//     }
//   });
// }

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