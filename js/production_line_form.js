
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {
    var allWeldingData = [];

    var processData = {
        process_id: "297",

    };


    var arr_obj = []
    arr_obj[1] = [];
    arr_obj[0] = [];
    arr_obj[1].push({
        godown_id: "1",
        dep_id: "1",
        dep_sec_id: "",
        dep_sec_machine_id: "",
        min_time: "",
        max_time: "",
        cost: ""

    });

    arr_obj[1].push({
        godown_id: "10",
        dep_id: "1",
        dep_sec_id: "",
        dep_sec_machine_id: "",
        min_time: "",
        max_time: "",
        cost: ""
    });

    allWeldingData.push({
        input_parts: arr_obj[0],
        process: processData,


    });

    processData = {
        process_id: "298",

    };
    allWeldingData.push({
        input_parts: arr_obj[1],
        process: processData,


    });

    console.log(allWeldingData);


    $.ajax({
        url: "php/ref_delete.php",
        type: "POST", //send it through get method
        data: {
            allWeldingData: JSON.stringify(allWeldingData),
        },
        success: function (response) {


            if (response.trim() != "error") {
                console.log(response);

                if (response.trim() != "0 result") {




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



    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $("#helper_checkbox").on("change", function () {
        if ($(this).is(":checked")) {
            $("#helper").prop("disabled", false);
            $("#add_employee").removeClass("d-none")
        }
        else {
            $("#helper").prop("disabled", true);
            $("#add_employee").addClass("d-none")
            $(".form-group .row .help").remove();
        }
    })

    $("#add_employee").on("click", function () {
        $(".form-group .row").append(`<div class="col-md-6 help"><div class="form-floating mb-3"><select class="form-select" id="helper" required><option selected disabled value="">Choose...</option></select><label for="helper">Helper</label><div class="invalid-feedback">Kindly Select Vaild </div></div></div>`)
    })

    $("#work_entry_btn").on("click", function () {
        // $("#work_form").addClass("d-none")
        $("#work_update").removeClass("d-none")
    })

    $("#pause_reason_btn").on("click", function () {
        $("#resume_btn").removeClass("d-none")
        $("#pause_btn").addClass("d-none")
    })

    $("#resume_btn").on("click", function () {
        $("#pause_btn").removeClass("d-none")
        $("#resume_btn").addClass("d-none")
    })

    $("#rework_reason_btn").on("click", function () {
        $("#rework_end_btn").removeClass("d-none")
        $("#rework_btn").addClass("d-none")
    })

    $("#rework_end_btn").on("click", function () {
        $("#rework_btn").removeClass("d-none")
        $("#rework_end_btn").addClass("d-none")
    })

    $("#other_work").on("change", function () {
        if ($(this).is(":checked")) {
            $("#extra_work_div").removeClass("d-none")
        }
        else {
            $("#extra_work_div").addClass("d-none")
        }
    })

    $("#work_update_btn").on("click", function () {
        let invalidFound = false;

        $(".employee-select").each(function () {
            if ($(this).val() === "" || $(this).val() === null) {
                // $(this).addClass("is-invalid");
                $(this).attr("data-bs-toggle", "modal");
                $(this).attr("data-bs-target", "#endWorkModal");
            $(this).trigger("click"); // open modal

                invalidFound = true;
            } else {
                // $(this).removeClass("is-invalid");
                alert("All employees selected successfully!");
            }
        });

        // if (invalidFound) {
        //     If any dropdown is not selected → open modal
        //     $(this).attr("data-bs-toggle", "modal");
        //     $(this).attr("data-bs-target", "#endWorkModal");
        //     $(this).trigger("click"); // open modal
        // } else {
        //     Optional: if all are valid, you can proceed normally
        //     alert("All employees selected successfully!");
        // }
    });

});






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