
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



    // Current Location

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log("Latitude:", position.coords.latitude);
                console.log("Longitude:", position.coords.longitude);
                console.log("Accuracy:", position.coords.accuracy + " meters");
                // get_godown_locations(position.coords.latitude, position.coords.longitude)
            },
            function (error) {
                console.log(error.message);
            }
        );
    } else {
        console.log("Geolocation is not supported.");
    }

    $("#godown_list_tbody").on("click", ".select_btn", function () {
        let godown_name = $(this).data("creditor_name");
        let godown_id = $(this).val();

        if (godown_id && godown_name) {
            $("#godown_list_modal").modal("hide");
            $("#current_godown").data("current_godown_id", godown_id).val(godown_name).prop("disabled", true);
        }
        else {
            salert("Warning", "Data Missing!, Try Again.", "warning");
        }

    })


    $(".part_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#available_part_tbody tr").filter(function () {
        });
    });

    $("input").on("input", function () {
        let labelText = $(this).siblings("label").text();
        $(this).attr("title", `${labelText}: ${$(this).val()}`);
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#to_godown').on('input', function () {

        $(this).removeData("godown_id");

        $('#to_department').val('').removeData("dept_id");
        $('#to_section').val('').removeData("sec_id");

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

                    $(this).data("godown_id", ui.item.id);

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#to_department').on('input', function () {

        $(this).removeData("dept_id");
        $('#to_section').val('').removeData("sec_id");

        //check the value not empty
        if ($('#to_department').val() != "") {
            $('#to_department').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            godown_id: $("#to_godown").data("godown_id")

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

    $('#to_section').on('input', function () {

        $(this).removeData("sec_id");

        //check the value not empty
        if ($('#to_section').val() != "") {
            $('#to_section').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            dep_id: $("#to_department").data("dept_id"),
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

    $('#part').on('input', function () {
        //check the value not empty

        $(this).removeData("process_id");
        $(this).removeData("part_id");

        if ($('#part').val() != "") {
            $('#part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_semi_auto.php",
                        type: "get", //send it through get method
                        data: {

                            part: $('#part').val(),
                            term: 'part',


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.final_part,
                                    value: item.final_part,
                                    id: item.output_part,
                                    process_id: item.process_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("process_id", ui.item.process_id);
                    $(this).data("part_id", ui.item.id);
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

    $("#submit_button").on("click", function (e) {

        e.preventDefault();

        var godown = $('#to_godown').data("godown_id");
        var dep = $('#dep').data("dept_id");
        var sec = $('#sec').data("sec_id");
        var qty = $('#quantity').val();
        var plan_name = $('#plan_name').val();
        var remark = $('#remarks').val();
        var part_id = $('#part').data("part_id");
        var process_id = $('#part').data("process_id");
        var due_date = $('#due_date').val();
        var created_by = current_user_id;

        if (!plan_name || !due_date || (!part_id && !process_id) || !qty || !godown || !created_by) {
            salert("Warning", "Required fields are missing.", "warning");
            return;
        }

        insert_manual_work_order(plan_name, due_date, remark, created_by, part_id, process_id, qty, godown, dep, sec);
    });

});

function insert_manual_work_order(plan_name, due_date, remark, created_by, part_id, process_id, qty, godown, dep, sec) {
    console.log(plan_name, due_date, remark, created_by, part_id, process_id, qty, godown, dep, sec);

    $.ajax({
        url: "php/insert_manual_work_order.php",
        type: "post",
        data: {
            plan_name: plan_name,
            due_date: due_date,
            remark: remark,
            created_by: created_by,
            part_id: part_id,
            process_id: process_id,
            qty: qty,
            godown: godown,
            dep: dep,
            sec: sec
        },
        success: function (response) {

            console.log("Server Response:", response);

            response = response.trim();

            if (response === "ok") {

                salert("Success", "Work order inserted successfully.", "success");

            } else {

                salert("Error", response, "error");

            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert(xhr.responseText);
            salert("Error", "An error occurred while inserting the work order.", "error");
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