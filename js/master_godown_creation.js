
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
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



    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


        $('#stock_part').on('input', function () {
        //check the value not empty
        $("#search_stock_part").data('process_id', "");
        $("#unit_add_btn").addClass('d-none');
        $('#stock_godown').val('').data('godown_id', '');
        $('#stock_department').val('').data('dept_id', '');
        $('#stock_section').val('').data("sec_id", '');
        $("#d_min_max").addClass("d-none");
        $("#s_min_max").addClass("d-none");
        $("#u_min_max").addClass("d-none");

        if ($('#stock_part').val() != "") {
            $('#stock_part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto1.php",
                        type: "get", //send it through get method
                        data: {

                            part: $('#stock_part').val(),
                            term: 'part',


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

                    $(this).data("process_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)
                    $("#unit_add_btn").removeClass('d-none');
                    $("#search_stock_part").data('process_id', ui.item.id);
                    $("#stock_table input").first().trigger(
                        $.Event("keydown", {
                            key: "Enter",
                            keyCode: 13,
                            which: 13
                        })
                    );



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $('#stock_godown').on('input', function () {
        $(this).data("godown_id", '');
        $('#stock_department').val('').data('dept_id', '');
        $('#stock_section').val('').data("sec_id", '');
        $("#d_min_max").addClass("d-none");
        $("#s_min_max").addClass("d-none");
        $("#u_min_max").addClass("d-none");
        $("#dep_add_btn").addClass("d-none");
        $("#sec_add_btn").addClass("d-none");
        //check the value not empty
        if ($('#stock_godown').val() != "") {
            $("#stock_unit_min_qty").val("");
            $("#stock_unit_max_qty").val("");
            $('#stock_godown').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_creditors_auto1.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            part_id: $("#stock_part").data("process_id"),


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.creditor_name,
                                    value: item.creditor_name,
                                    id: item.creditor_id,
                                    min: item.min_qty,
                                    max: item.max_qty,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("godown_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    if ($(this).data("godown_id") != '') {
                        $("#u_min_max").removeClass("d-none");
                        $("#dep_add_btn").removeClass("d-none");
                    }
                    console.log(ui.item.min, ui.item.max);

                    if (ui.item.min != null && ui.item.max != null) {
                        $("#stock_unit_min_qty").val(ui.item.min);
                        $("#stock_unit_max_qty").val(ui.item.max);
                    }


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#unit_add_btn").on("click", function () {
        var unit = $("#stock_godown").val();
        if (unit !== '') {
            insert_creditors(unit);
        }
    })

    $("#dep_add_btn").on("click", function () {
        var go_id = $('#stock_godown').data("godown_id");
        var dept_name = $('#stock_department').val();
        if (go_id == undefined || dept_name == '') {
            salert('Warning', "Data Missing", "warning");
            return;
        }
        insert_department(go_id, dept_name);
    })

    $('#stock_department').on('input', function () {
        console.log($("#stock_godown").data("godown_id"));

        $(this).data("dept_id", '');
        $('#stock_section').val('').data("sec_id", '');
        $("#d_min_max").addClass("d-none");
        $("#s_min_max").addClass("d-none");
        $("#sec_add_btn").addClass("d-none");

        //check the value not empty
        if ($('#stock_department').val() != "") {

            $("#stock_department_min_qty").val("");
            $("#stock_department_max_qty").val("");
            $('#stock_department').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto1.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            godown_id: $("#stock_godown").data("godown_id"),
                            part_id: $("#stock_part").data("process_id"),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.dep_name,
                                    value: item.dep_name,
                                    id: item.dep_id,
                                    min: item.min_qty,
                                    max: item.max_qty,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("dept_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    if ($(this).data("dept_id") != '') {
                        $("#d_min_max").removeClass('d-none');
                        $("#dep_add_btn").addClass('d-none')
                        $("#sec_add_btn").removeClass('d-none')
                    }
                    if (ui.item.min != null && ui.item.max != null) {
                        $("#stock_department_min_qty").val(ui.item.min);
                        $("#stock_department_max_qty").val(ui.item.max);
                    }



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#sec_add_btn").on("click", function () {

        var dept_id = $('#stock_department').data("dept_id");
        console.log(dept_id);

        var sec_name = $('#stock_section').val();
        if (dept_id == undefined || sec_name == '') {
            salert('Warning', "Data Missing", "warning");
            return;
        }
        insert_dep_section(dept_id, sec_name);
    })

    $('#stock_section').on('input', function () {


        $(this).data("sec_id", '');
        $("#s_min_max").addClass("d-none");
        //check the value not empty
        if ($('#stock_section').val() != "") {
            $("#stock_section_min_qty").val('');
            $("#stock_section_max_qty").val('');
            $('#stock_section').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_auto1.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            dep_id: $("#stock_department").data("dept_id"),
                            part_id: $("#stock_part").data("process_id"),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.sec_name,
                                    value: item.sec_name,
                                    id: item.dep_sec_id,
                                    min: item.min_qty,
                                    max: item.max_qty,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("sec_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    if ($(this).data("sec_id") != '') {
                        $("#s_min_max").removeClass("d-none");
                        $("#sec_add_btn").addClass('d-none')
                    }
                    if (ui.item.min != null && ui.item.max != null) {
                        $("#stock_section_min_qty").val(ui.item.min);
                        $("#stock_section_max_qty").val(ui.item.max);
                    }


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#stock_insert_btn").on("click", function () {

        var part = $("#stock_part").data('process_id') || '';
        var godown = $("#stock_godown").data('godown_id') || '';
        var department = $("#stock_department").data('dept_id') || '';
        var section = $("#stock_section").data('sec_id') || '';
        var qty = $("#stock_qty").val() || 0;
        var material_type = $("#material_type").val();

        var u_min = $("#stock_unit_min_qty").val() || 0;
        var u_max = $("#stock_unit_max_qty").val() || 0;

        var d_min = $("#stock_department_min_qty").val() || 0;
        var d_max = $("#stock_department_max_qty").val() || 0;

        var s_min = $("#stock_section_min_qty").val() || 0;
        var s_max = $("#stock_section_max_qty").val() || 0;

        let stock_master = [];

        if (godown && u_min != 0 && u_max != 0) {
            stock_master.push({
                store_type: "godown",
                store_id: godown,
                min_qty: u_min,
                max_qty: u_max
            });
        }

        if (department && d_min != 0 && d_max != 0) {
            stock_master.push({
                store_type: "dep",
                store_id: department,
                min_qty: d_min,
                max_qty: d_max
            });
        }

        if (section && s_min != 0 && s_max != 0) {
            stock_master.push({
                store_type: "sec",
                store_id: section,
                min_qty: s_min,
                max_qty: s_max
            });
        }

        let stock_master_json = JSON.stringify(stock_master);

        console.log("Sending:", stock_master_json);

        if (!part || !godown || qty == '' || material_type == "null") {
            salert('Warning', "Please fill all fields", 'warning');
            return;
        }

        $(this).prop('disabled', true);
        insert_jaysan_stock(part, godown, department, section, qty, stock_master_json);
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