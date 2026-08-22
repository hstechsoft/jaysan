
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

        $("#nesting_job_card_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))







    get_all_machine();

    $("#shift").on("change", function () {
        $("#machine").val('');
        $("#operator_job_card_tbody").empty();
        $(".operator_job_card_mobile").empty();
    })

    $("#machine").on("change", function () {

        if ($(this).val() > 0) {
            $("#submit_btn").trigger("click");
        }
    })

    $("#submit_btn").on("click", function () {
        var shift = $("#shift").val();
        var machine = $("#machine").val();

        if (shift && machine > 0) {
            get_operator_job_card(shift, machine);
        }
        else {
            salert("Warning", "Fill Both Field", "warning");
        }
    })

    $("#operator_job_card_tbody, .operator_job_card_mobile").on("click", ".laser_work_entry_btn", function () {

        $("#assignedWorkModal").modal("show");


        var machine_id = $(this).data("machine_id");
        var job_card_id = $(this).data("job_card_id");
        var nesting = $(this).data("nesting_parts_details");

        $("#assign_Work_entry_btn").data({
            "machine_id": machine_id,
            "job_card_id": job_card_id
        });


        try {
            if (typeof nesting === "string") {
                nesting = decodeURIComponent(nesting);


                if (typeof nesting === "string") {
                    nesting = JSON.parse(nesting);
                }
            }
        } catch (e) {
            console.error("JSON Error:", e);
            nesting = [];
        }


        let html = '<ul class="list-group">';

        if (nesting && nesting.length > 0) {

            nesting.forEach(function (obj) {

                html += `
            <li class="list-group-item p-2" data-part_id="${obj.part_id}" data-qty="${obj.qty}">
                
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-semibold">${obj.part_name}</span>
                    <span class="badge bg-primary">Qty: ${obj.qty}</span>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <input type="number"  min='1'
                        class="form-control form-control-sm li_scrap_qty" 
                        placeholder="Enter scrap" data-qty="${obj.qty}">

                    <label class="form-check-label small">
                        <input class="form-check-input chech_field me-1" type="checkbox">
                        Done
                    </label>
                </div>

            </li>
            `;
            });

        } else {
            html += `<li class="list-group-item text-danger">No Parts Found</li>`;
        }

        html += `</ul>`;


        $("#nested_parts").html(html);

    });

    $("#nested_parts").on("focusout", ".li_scrap_qty", function(){
        var qty = $(this).attr("data-qty");
        var entered_qty = $(this).val();

        if(entered_qty > qty){
            $(this).val(qty);
        }
    })

    $("#assign_Work_entry_btn").on("click", function () {

        var job_card_id = $(this).data("job_card_id");
        var machine_id = $(this).data("machine_id");

        var scrap_weight = $("#scarp_weight").val() || 0;
        var scarp_qty = $("#scarp_qty").val() || 0;
        var remark = $("#remark").val() || '';

        var produced_parts = [];
        var isValid = true;

        $("#nested_parts li").each(function () {

            let part_id = $(this).data("part_id");
            let quantity = $(this).data("qty");
            let scrap_qty = $(this).find(".li_scrap_qty").val() || 0;


            let is_checked = $(this).find(".chech_field").is(":checked") ? 1 : 0;


            if (part_id && is_checked === 1) {

                produced_parts.push({
                    part_id: part_id,
                    quantity: quantity,
                    scarp_qty: scrap_qty
                });

            } else {
                isValid = false;
            }

        });

        console.log(job_card_id, machine_id, scrap_weight, scarp_qty, remark, produced_parts);


        if (!isValid) {
            salert("Warning", "Work is pending. Please complete all parts.", "warning");
            return;
        }

        if (job_card_id > 0 && machine_id > 0 && produced_parts.length > 0) {
            finish_operator_job_card(
                job_card_id,
                current_user_id,
                scrap_weight,
                scarp_qty,
                remark,
                JSON.stringify(produced_parts)
            );
        } else {
            salert("Warning", "Data Missing! Kindly fill all fields.", "warning");
        }

    });

        $("#operator_job_card_tbody, .operator_job_card_mobile").on("click", ".view_btn", function () {
        let path = $(this).data("path");


        window.open(path, "_blank");
    });

});




function finish_operator_job_card(job_card_id, current_user_id, scrap_weight, scarp_qty, remark, produced_parts) {

    console.log(job_card_id, current_user_id, scrap_weight, scarp_qty, remark, produced_parts);

    $.ajax({
        url: "php/finish_operator_job_card.php",
        type: "post",
        data: {
            job_card_id: job_card_id,
            operator_id: current_user_id,
            scarp_weight: scrap_weight,
            scarp_qty: scarp_qty,
            remark: remark,
            produced_parts: produced_parts,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                window.location.reload();
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function get_operator_job_card(shift, machine_id) {

    console.log(shift, machine_id);

    $.ajax({
        url: "php/get_operator_job_card.php",
        type: "GET",
        data: {
            shift: shift,
            machine_id: machine_id,
            status: 'all'
        },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {


                $("#operator_job_card_tbody").empty();
                $(".operator_job_card_mobile").empty();

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);


                    obj.forEach(function (item, index) {
                        index++;

                        let nesting = JSON.parse(item.nesting_parts_details);
                        let nesting_parts_details = '<ul class="list-group">';
                        nesting.forEach(function (obj) {

                            nesting_parts_details += `<li class="list-group-item">${obj.part_name} <span class='badge bg-secondary'>${obj.qty}</span></li>`;
                        })

                        nesting_parts_details += `</ul>`;

                        $("#operator_job_card_tbody").append(`
                            <tr>
                                <td>${index}</td>
                                <td>${item.nesting_name}</td>
                                <td>${item.part_name}</td>
                                <td>
                                    <span class='badge bg-success d-none pe-2'>${item.material_qty}</span> <strong>Assigned Date: ${item.assign_date}</strong>
                                </td>
                                
                                <td>${item.master_run_time}</td>
                                <td>${item.emp_name}</td>
                                <td>${nesting_parts_details}</td>
                                <td>
                                    <button class="btn btn-outline-primary view_btn" data-path="${item.path}"><i class="fa-solid fa-eye fa-beat"></i></button>
                                    <button class="btn btn-outline-success laser_work_entry_btn" 
                                        data-job_card_id="${item.job_card_id}" 
                                        data-nesting_parts_details="${encodeURIComponent(item.nesting_parts_details)}" 
                                        data-machine_id="${item.machine_id}">
                                        <i class="fa-solid fa-person-running fa-bounce"></i>
                                    </button>
                                </td>
                            </tr>
                        `);


                        $(".operator_job_card_mobile").append(`
                            <div class="card mb-3 shadow-sm border-0 rounded-3">
                                <div class="card-body p-3">

                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="mb-0 fw-bold">${item.nesting_name}</h6>
                                        <span class="badge bg-primary">${index}</span>
                                    </div>

                                    <div class="small text-muted mb-2">${item.part_name}</div>

                                    <div class="mb-2">
                                        <span class='badge bg-success d-none pe-2'>Remain: ${item.total_material_qty}</span>
                                        <strong> Assigned Date: ${item.assign_date}</strong>
                                    </div>

                                    <div class="d-flex justify-content-between small mb-2">
                                        <span>⏱ ${item.master_run_time}</span>
                                        <span>👤 ${item.emp_name}</span>
                                    </div>


                                    ${nesting_parts_details}

                                    <div class=" d-flex justify-content-between mt-2">
                                        <button class="btn btn-sm btn-outline-primary view_btn" data-path="${item.path}">
                                            <i class="fa-solid fa-eye fa-beat"></i>
                                        </button>
                                         <button class="btn btn-outline-success laser_work_entry_btn" 
                                            data-job_card_id="${item.job_card_id}" 
                                            data-nesting_parts_details="${encodeURIComponent(item.nesting_parts_details)}" 
                                            data-machine_id="${item.machine_id}">
                                            <i class="fa-solid fa-person-running fa-bounce"></i>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        `);

                    });

                } else {
                    $("#operator_job_card_tbody").html(`<tr><td colspan='8' class='text-center text-danger'>No Data Found</td></tr>`);
                    $(".operator_job_card_mobile").html(`<div class='text-center text-danger'>No Data Found</div>`);
                }
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function get_all_machine() {

    console.log();

    $.ajax({
        url: "php/get_all_machine.php",
        type: "GET",
        data: {},
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {

                $("#machine").empty();

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);
                    $("#machine").append(`<option selected disabled value="">Choose...</option>`);

                    obj.forEach(function (item, index) {
                        index++;

                        // convert path to web path

                        $("#machine").append(`<option value="${item.machine_id}">${item.machine_name}</option>
                        `);
                    });

                } else {
                    $("#machine").append(`<option selected disabled value="">Choose...</option>`);
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