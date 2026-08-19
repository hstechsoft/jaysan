
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
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


    $("#material_id").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#nesting_details_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();
    get_nesting_details1('', '', '', '');

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#nesting_name').on('input', function () {

        $(this).data("nesting_id", '');


        //check the value not empty
        if ($('#nesting_name').val() != "") {
            $('#nesting_name').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_nesting_auto.php",
                        type: "get", //send it through get method
                        data: {

                            nesting_name: $("#nesting_name").val(),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.nesting_name,
                                    value: item.nesting_name,
                                    id: item.nes_master_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("nesting_id", ui.item.id);
                    filter();
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
                    filter();
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


    $('#employee').on('input', function () {
        //check the value not empty
        $(this).data("emp_id", '');
        if ($(this).val() != "") {

            $(this).autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_employee_auto.php",
                        type: "get", //send it through get method
                        data: {

                            emp_name: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.emp_name,
                                    value: item.emp_name,
                                    cus_id: item.emp_id,
                                    phone: item.cus_phone,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $("#employee").data("emp_id", ui.item.cus_id);
                    filter();
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });




    $("#work_nesting_details_tbody").on("click", ".view_btn", function () {
        let path = $(this).data("path");

        // open in new tab
        window.open(path, "_blank");
    });


});

$("#pending").change(function(){
    filter();
})


function filter() {
    var nesting_name = $("#nesting_name").val() || '';
    var material_id = $("#material_id").data("part_id") || '';
    var created_by = $("#employee").data("emp_id") || '';
    var remaining_qty = $("#pending").is("checked") ? 1 : 0;
    get_nesting_details1(created_by, nesting_name, material_id, remaining_qty)
}


function get_nesting_details1(created_by, nesting_name, material_id, remaining_qty) {

    console.log(created_by, nesting_name, material_id, remaining_qty);

    $.ajax({
        url: "php/get_nesting_details.php",
        type: "GET",
        data: {
            created_by: created_by,
            nesting_name: nesting_name,
            material_id: material_id,
            remaining_qty: remaining_qty

        },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {

                $("#work_nesting_details_tbody").empty();

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);

                    obj.forEach(function (item, index) {
                        index++;

                        let nesting = JSON.parse(item.nesting_parts_details);
                        let nesting_parts_details = '<ul class="list-group">';

                        nesting.forEach(function (obj) {

                            nesting_parts_details += `<li class="list-group-item p-1">${obj.part_name} <span class='badge bg-secondary'>${obj.qty}</span></li>`;
                        });

                        nesting_parts_details += `</ul>`;

                        let laser_assigned_details = ``;

                        if (item.total_assigned_qty > 0) {

                            let laser = JSON.parse(item.laser_assigned_details);

                            laser_assigned_details = ` <div class="accordion accordion-flush small" id="laserAccordion"> `;

                            laser.forEach(function (l, index) {

                                let statusClass = l.status === 'finished' ? 'bg-success' : 'bg-warning text-dark';

                                let collapseId = `laserCollapse_${index}`;

                                laser_assigned_details += `
                                <div class="accordion-item border rounded mb-1">

                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed py-2 px-3"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#${collapseId}"
                                                aria-expanded="false"
                                                aria-controls="${collapseId}">

                                            <div class="d-flex align-items-center justify-content-between w-100 me-2">

                                                <div>
                                                    <span class="fw-semibold small" style="font-size:11px;">
                                                        Job Card #${l.job_card_id}
                                                    </span>

                                                    <span class="text-muted ms-2 d-none" style="font-size:11px;">
                                                        ${l.assign_date} · ${l.shift.toUpperCase()} · M${l.machine_id}
                                                    </span>
                                                </div>

                                                <span class="badge ${statusClass} ms-2" style="font-size:11px;">
                                                    ${l.status}
                                                </span>

                                            </div>

                                        </button>
                                    </h2>

                                    <div id="${collapseId}"
                                        class="accordion-collapse collapse"
                                        data-bs-parent="#laserAccordion">

                                        <div class="accordion-body py-2 px-0">

                                            <div class="row g-2">

                                                <div class="col-6">
                                                    <div class="text-muted" style="font-size:11px;">
                                                        Assign Date
                                                    </div>
                                                    <div class="fw-semibold">
                                                        ${l.assign_date}
                                                    </div>
                                                </div>

                                                <div class="col-6">
                                                    <div class="text-muted" style="font-size:11px;">
                                                        Shift
                                                    </div>
                                                    <div class="fw-semibold">
                                                        ${l.shift.toUpperCase()}
                                                    </div>
                                                </div>

                                                <div class="col-6">
                                                    <div class="text-muted" style="font-size:11px;">
                                                        Machine
                                                    </div>
                                                    <div class="fw-semibold">
                                                        Machine ${l.machine_id}
                                                    </div>
                                                </div>

                                                <div class="col-6">
                                                    <div class="text-muted" style="font-size:11px;">
                                                        Assigned By
                                                    </div>
                                                    <div class="fw-semibold">
                                                        ${l.assigned_by}
                                                    </div>
                                                </div>

                                                ${l.status === 'finished' ? `
                                                    <div class="col-6">
                                                        <div class="text-muted" style="font-size:11px;">
                                                            Scrap Weight
                                                        </div>
                                                        <div class="fw-semibold">
                                                            <i class="fa-solid fa-weight-hanging me-1"></i>
                                                            ${l.scarp_weight ?? 0}
                                                        </div>
                                                    </div>

                                                    <div class="col-6">
                                                        <div class="text-muted" style="font-size:11px;">
                                                            Scrap Qty
                                                        </div>
                                                        <div class="fw-semibold">
                                                            <i class="fa-solid fa-box me-1"></i>
                                                            ${l.scarp_qty ?? 0}
                                                        </div>
                                                    </div>
                                                ` : ''}

                                            </div>

                                        </div>
                                    </div>

                                </div>
                            `;
                            });

                            laser_assigned_details += `</div>`;

                        }


                        $("#work_nesting_details_tbody").append(`
                            <tr>
                                <td>${index}</td>
                                <td>${item.nesting_name}</td>
                                <td>${item.material_name}</td>
                                <td>
                                   <div class='d-flex justify-content-between'><span class='badge bg-success' title='Total Qty: ${item.material_qty}'>${item.material_qty}</span>
                                    <span class='badge bg-primary' title='Assigned Qty: ${item.total_assigned_qty}'>${item.total_assigned_qty}</span><span class='badge bg-danger' title='Remaining Qty: ${item.remaining_qty}'>${item.remaining_qty}</span></div>
                                </td>
                                <td>${item.run_time}</td>
                                <td><span class='badge ${item.nesting_type == 'std' ? 'bg-success' : 'bg-warning text-dark'}'>${item.nesting_type}</td>
                                <td>${item.emp_name}</td>
                                <td>${nesting_parts_details}</td>
                                <td>${laser_assigned_details}</td>
                                <td>
                                    <div  class='d-flex justify-content-between'>
                                        <button type="button" class="btn btn-outline-primary btn-sm view_btn" onclick="window.location.href='${item.path}'">
                                            <i class="fa-solid fa-eye fa-beat"></i>
                                        </button>
                                    </div>    
                                </td>
                            </tr>
                        `);
                    });

                }
                else {
                    $("#work_nesting_details_tbody").append(`<tr><td colspan='9' class='text-center text-danger'>No Data Found</td></tr>`);
                }
            }
        },
        error: function (xhr) {
            console.log(xhr);
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