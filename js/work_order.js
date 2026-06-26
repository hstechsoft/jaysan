
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];

let current_stock = [];
let historyQueue = [];
let currentIndex = 0;
let output_qty = 0;

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


    $(".part_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#available_part_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("input").on("input", function () {
        let labelText = $(this).siblings("label").text();
        $(this).attr("title", `${labelText}: ${$(this).val()}`);
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#current_godown').on('input', function () {
        $(this).removeData("current_godown_id");

        //check the value not empty
        if ($('#current_godown').val() != "") {
            $('#current_godown').autocomplete({
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

                    $(this).data("current_godown_id", ui.item.id);


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#godown').on('input', function () {
        $(this).removeData("godown_id");

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
                    get_work_order_company_dc(ui.item.id);
                    get_work_order(ui.item.id, '', '', '');
                    get_demand_material(ui.item.id, '', '', '');


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#to_godown').on('input', function () {
        $(this).removeData("to_godown_id");
        $("#work_order_tbody").empty();

        //check the value not empty
        if ($('#to_godown').val() != "") {
            $('#to_godown').autocomplete({
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

                    $(this).data("to_godown_id", ui.item.id);


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

    $("#work_order_tbody").on("click", ".add_btn", function () {

        let process_id = $(this).parent().parent().find(".process_select").val();
        let godown_id = $('#godown').data("godown_id");
        let dept = null;
        let sec = null;
        let output_qty = $(this).parent().parent().find(".output_qty").val();

        let emp_id = current_user_id;

        if (process_id == null || process_id == "") {
            salert("Warning", "Please select process", "warning");
        }
        else if (godown_id == null || godown_id == "") {
            salert("Warning", "Please select Vendor", "warning");
        }
        else {
            $(this).parent().parent().find(".process_select").prop("disabled", true);
            $(this).prop("disabled", true);
            $('html, body').animate({
                scrollTop: 0
            }, 500);

            insert_work_order(process_id, godown_id, dept, sec, output_qty, emp_id);
        }


    });


    $("#map_btn").on("click", function () {
        window.open("https://www.google.com/maps/", "_blank");
        $("#map_modal").modal('show');
    });

    $(".save_map_btn").on("click", function () {

        let coordinates = $("#map_coordinates").val();

        let parts = coordinates.split(',');

        let lati = parts[0]?.trim();
        let long = parts[1]?.trim();

        let godown_id = $("#godown").data("godown_id");

        if (lati && long && godown_id) {
            update_godown_location(lati, long, godown_id);
        } else {
            salert(
                "Warning",
                "Data Is Missing! Please provide map coordinates and vendor.",
                "warning"
            );
        }
    });

    $("#filter_btn").on("click", function () {
        let current_godown = $("#current_godown").data("current_godown_id");
        let godown = $("#to_godown").data("to_godown_id") || '';
        let part_id = $("#part").data("part_id") || '';
        let process_id = $("#process").data("process_id") || '';
        let sec = '';
        let dc_sts = $("#dc_sts").val();

        if (!current_godown) {
            salert("Warning", "Select The From Godown", "warning");
            return;
        }

        get_dc_report(current_godown, godown, part_id, process_id, sec, dc_sts);
    })

});



function update_godown_location(lati, long, godown_id) {

    console.log(lati, long, godown_id);

    $.ajax({
        url: "php/update_godown_location.php",
        type: "post", //send it through get method
        data: {

            latti: lati,
            longi: long,
            creditor_id: godown_id,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                $("#map_modal").modal('hide');
                $("#map_coordinates").val('');
                salert("Success", "Location Saved Successfully.", "success");
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

// function processNextPart() {

//     if (currentIndex >= historyQueue.length) {
//         return;
//     }

//     let data = historyQueue[currentIndex];

//     console.log(data.item)
//     let row = $(`
//         <tr data-in_previous_process_id='${data.part.in_previous_process_id}' data-part_id='${data.part.part_id}' data-process_id='${data.item.process_id}'>
//             <td>${data.part.part_name}</td>
//             <td>${data.item.process_name}</td>
//             <td>${data.part.total_stock_qty ?? 0}</td>
//             <td>${data.part.reserved_qty ?? 0}</td>

//             <td>
//                 <input type="number"
//                     class="form-control form-control-sm qty_input"
//                     value="${parseFloat(data.part.qty) * output_qty}" >
//             </td>

//             <td>
//                 <input type="number"
//                     class="form-control form-control-sm rate_input"
//                     value="0" >
//             </td>

//             <td class="amount_td">0</td>

//             <td>
//                 <input type="checkbox" checked class="form-check-input">

//                 <button
//                     type="button"
//                     class="btn btn-secondary btn-sm History_btn "
//                     data-stock_reserve_details='${JSON.stringify(data.part.stock_reserve_details)}'
//                     data-work_time_details='${JSON.stringify(data.item.work_time_details)}'
//                     data-part_name='${data.part.part_name}'
//                     data-output_part_name='${data.item.out_part_name}'
//                     data-output_part_qty='${data.item.out_part_qty}'
//                     data-need_qty='${parseFloat(data.part.qty) * output_qty}'>
//                     <i class="fas fa-clock"></i>
//                 </button>
//             </td>
//         </tr>
//     `);

//     $("#selected_part_tbody").append(row);
//     setTimeout(function () {
//         row.find(".History_btn").trigger("click");
//     }, 800);
// }

// function get_parts_dc(process_id, godown_id, f_godown_id, output_qtyy) {

//     console.log(process_id, godown_id, f_godown_id, output_qtyy);

//     $.ajax({
//         url: "php/get_parts_dc.php",
//         type: "get", //send it through get method
//         data: {

//             godown_id: f_godown_id,
//             process_id: process_id,
//             dest_godown_id: godown_id
//         },
//         success: function (response) {
//             console.log(response);



//             if (response.trim() != "error") {

//                 if (response.trim() != "0 result") {

//                     var obj = JSON.parse(response);

//                     historyQueue = [];
//                     currentIndex = 0;
//                     output_qty = parseFloat(output_qtyy) || 0;

//                     obj.forEach(function (item) {

//                         if (item.part_details != null && item.part_details != "" && item.has_godown == "1") {

//                             let part_details = JSON.parse(item.part_details);

//                             part_details.forEach(function (part) {

//                                 historyQueue.push({
//                                     item: item,
//                                     part: part
//                                 });

//                             });
//                         }
//                     });

//                     if (historyQueue.length <= 0) {
//                         salert("Warning", "The Parts For Process Are Not Mapped To the From Godown You Selected.", "warning");
//                         return;
//                     }
//                     processNextPart();
//                 }
//                 else {
//                     salert("Warning", "No Data Found ", "warning");
//                 }
//             }





//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });




// }

function insert_work_order(process_id, godown_id, dept, sec, output_qty, emp_id) {

    console.log(process_id, godown_id, dept, sec, output_qty, emp_id);

    $.ajax({
        url: "php/insert_work_order.php",
        type: "post", //send it through get method
        data: {

            godown: godown_id,
            dep: dept,
            sec: sec,
            qty: output_qty,
            process_id: process_id,
            created_by: emp_id,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                get_work_order('', '', '', '');
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

function get_work_order(godown, dep, sec, work_order_id) {

    console.log(godown, dep, sec, work_order_id);

    $.ajax({
        url: "php/get_work_order.php",
        type: "get", //send it through get method
        data: {

            godown: godown,
            dep: dep,
            sec: sec,
            work_order_id: work_order_id
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {

                $("#work_order_part_tbody").empty();
                $("#vendor_name").text($('#godown').val());

                if (response.trim() != "0 result") {
                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count += 1;

                        $("#work_order_part_tbody").append(`<tr><td>${count}</td><td>${item.final_part}</td><td>${item.qty}</td><td>${item.work_order_id}</td><td>${item.work_order_no ?? ''}</td><td></td></tr>`)

                    });

                }
                else {
                    $("#work_order_part_tbody").append(`<tr><td colspan='6' class='text-center text-danger'>No Work Order Found.</td></tr>`)
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_demand_material(godown, dep, sec) {

    console.log(godown, dep, sec);

    $.ajax({
        url: "php/get_demand_material.php",
        type: "get", //send it through get method
        data: {

            godown: godown,
            dep: dep,
            sec: sec,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {

                $("#work_order_req_part_tbody").empty();

                if (response.trim() != "0 result") {
                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count += 1;

                        $("#work_order_req_part_tbody").append(`<tr><td>${count}</td><td>${item.part_name}</td><td>${item.process_name}</td><td>${item.demand_qty}</td></tr>`)

                    });

                }
                else {
                    $("#work_order_req_part_tbody").append(`<tr><td colspan='5' class='text-center text-danger'>No Work Order Found.</td></tr>`)
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_dc_report(current_godown, godown, part_id, process_id, sec, dc_sts) {

    console.log(current_godown, godown, part_id, process_id, sec, dc_sts);

    $.ajax({
        url: "php/get_dc_report.php",
        type: "get", //send it through get method
        data: {

            current_godown: current_godown,
            godown: godown,
            part_id: part_id,
            process_id: process_id,
            sec: sec,
            dc_sts: dc_sts
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {

                $("#dc_status_tbody").empty();

                if (response.trim() != "0 result") {
                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count += 1;

                        $("#dc_status_tbody").append(`
                            <tr>
                                <td>${count}</td>
                                <td>${item.source}</td>
                                <td>${item.destination}</td>
                                <td>${item.dated}</td>
                                <td>${item.dc_type}</td>
                                <td><span class="badge bg-secondary">${item.sts}</span></td>
                                <td>
                                    ${item.dc_inout_sts == 'ok' ? '<span class="badge bg-success">Completed</span>' : `<span class="badge bg-danger">${item.dc_inout_sts} Not Completed</span>` }
                                </td>
                            </tr>
                        `);

                    });

                }
                else {
                    $("#dc_status_tbody").append(`<tr><td colspan='7' class='text-center text-danger'>No DC Found.</td></tr>`)
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}



function get_work_order_company_dc(godown_id) {

    $.ajax({
        url: "php/get_company_dc.php",
        type: "get", //send it through get method
        data: {

            godown_id: godown_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $("#work_order_tbody").empty();
                current_stock = [];

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count++;

                        let process_title = `<select class="form-select form-select-sm process_select"><option value="" disabled selected>Select Process</option>`;

                        if (item.process_details != null && item.process_details != "") {

                            let process_details = JSON.parse(item.process_details);

                            process_details.forEach(function (process) {

                                process_title += `<option value="${process.process_id}" data-is_default="${process.is_default}">${process.process_title}</option>`;

                            });

                        } else {

                            process_title += `<option value="" data-is_default="0">No Process</option>`;

                        }

                        process_title += `</select>`;

                        $("#work_order_tbody").append(`<tr><td>${count}</td><td>${item.part_name}</td><td>${process_title}</td><td><input type="number" class="form-control form-control-sm output_qty" value="1"></td><td>
                    <button type="button" class="btn btn-primary btn-sm add_btn" data-part="${item.part_name}" data-output_part="${item.output_part}" data-cat="${item.cat}" data-component_cat="${item.component_cat}" data-part_name="${item.part_name}">Add</button></td></tr>`);

                    });

                }
                else {
                    salert("Warning", "No DC Found for this Vendor ", "warning");
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

// function insert_dc_trip(emp_id, from_godown_id, godown_id, dc_parts_location, transport_dc_id) {

//     console.log(emp_id, from_godown_id, godown_id, dc_parts_location, transport_dc_id);

//     $.ajax({
//         url: "php/insert_dc_trip.php",
//         type: "post", //send it through get method
//         data: {

//             emp_id: emp_id,
//             destination: godown_id,
//             source_godown: from_godown_id,
//             dc_parts_location: dc_parts_location,
//             transport_dc_id: transport_dc_id,
//         },
//         success: function (response) {
//             console.log(response);
//             console.log(typeof response);

//             // var le = response;

//             // le.forEach(function (i) {

//             //     if (i.status === 'ok') {


//             //         const project = window.location.pathname.split('/')[1];

//             //         window.open(`${window.location.origin}/${project}/${i.download_url}`, '_blank');

//             //         setTimeout(()=>{
//             //             window.location.reload();
//             //         },500);

//             //     }

//             // });
//             if (response.trim() == "ok") {
//                 window.location.reload();
//             }
//             else {
//                 salert("Warning", response, "warning");
//             }






//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });




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