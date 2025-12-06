
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {


    $("#stock_tabel_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#stock_tbady tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
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
    get_jaysan_stock();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#stock_part').on('input', function () {
        //check the value not empty
        if ($('#stock_part').val() != "") {
            $('#stock_part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_process_part_auto.php",
                        type: "get", //send it through get method
                        data: {

                            part_name: $('#stock_part').val(),


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name,
                                    value: item.part_name,
                                    id: item.process_id,
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


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#stock_godown').on('input', function () {
        $("#department_add_btn").addClass("d-none");

        //check the value not empty
        if ($('#stock_godown').val() != "") {
            $('#stock_godown').autocomplete({
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
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#stock_department').on('input', function () {
        console.log($("#stock_godown").data("godown_id"));

        //check the value not empty
        if ($('#stock_department').val() != "") {
            $('#stock_department').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            godown_id: $("#stock_godown").data("godown_id"),

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
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#stock_section').on('input', function () {

        //check the value not empty
        if ($('#stock_section').val() != "") {
            $('#stock_section').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            dep_id: $("#stock_department").data("dept_id"),

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
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


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
        console.log(part, godown, department, section, qty);

        // if (part === undefined || godown === undefined || department === undefined || section === undefined || qty == '') {
        //     salert('Warning', "Please fill all fields", 'warning');
        // }
        // else {
        insert_jaysan_stock(part, godown, department, section, qty);
        // }
    })



    $('#search_stock_part').on('input', function () {
        //check the value not empty
        if ($('#search_stock_part').val() != "") {
            $('#search_stock_part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_process_part_auto.php",
                        type: "get", //send it through get method
                        data: {

                            part_name: $('#search_stock_part').val(),


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name,
                                    value: item.part_name,
                                    id: item.process_id,
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


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#search_stock_godown').on('input', function () {

        //check the value not empty
        if ($('#search_stock_godown').val() != "") {
            $('#search_stock_godown').autocomplete({
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
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#search_stock_department').on('input', function () {

        //check the value not empty
        if ($('#search_stock_department').val() != "") {
            $('#search_stock_department').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            godown_id: $("#search_stock_godown").data("godown_id")

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
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#search_stock_section').on('input', function () {

        //check the value not empty
        if ($('#search_stock_section').val() != "") {
            $('#search_stock_section').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            dep_id: $("#search_stock_department").data("dept_id"),

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
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $("#toggel_stock").change(function () {
        if ($(this).is(":checked")) {
            $("#search_stock_insert_card").removeClass("d-none");
            $("#stock_insert_card").addClass("d-none");
        } else {
            $("#search_stock_insert_card").addClass("d-none");
            $("#stock_insert_card").removeClass("d-none");
        }
    })


    $("#search_stock_insert_btn").on("click", function () {

        var part_query = $("#search_stock_part").data('process_id') || '';
        var creditor_query = $("#search_stock_godown").data('godown_id') || '';
        var dep_query = $("#search_stock_department").data('dept_id') || '';
        var sec_query = $("#search_stock_section").data('sec_id') || '';
        var qty_query = $("#search_stock_qty").val() || '';
        var from_date = $("#search_stock_f_date").val() || '';
        var to_date = $("#search_stock_e_date").val() || '';
        get_jaysan_stock(from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query)
    })


    $("#clear_stock_insert_btn").on("click", function () {

        $("#search_stock_part").val('');
        $("#search_stock_godown").val('');
        $("#search_stock_department").val('');
        $("#search_stock_section").val('');
        $("#search_stock_qty").val('');
        $("#search_stock_f_date").val('');
        $("#search_stock_e_date").val('');

    })


});








function insert_jaysan_stock(part, godown, department, section, qty) {
    console.log("part" + part, "godown" + godown, "department" + department, "section" + section, qty);


    $.ajax({
        url: "php/insert_jaysan_stock.php",
        type: "get", //send it through get method
        data: {

            godown: godown,
            dep: department,
            sec: section,
            qty: qty,
            finished_process_no: part,
            batch_id: '',
            finished_godown: '',
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                get_jaysan_stock();
                $("#stock_part").val('');
                $("#stock_godown").val('');
                $("#stock_department").val('');
                $("#stock_section").val('');
                $("#stock_qty").val('');
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function get_jaysan_stock(from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query) {
console.log(from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query);

    $.ajax({
        url: "php/get_jaysan_stock.php",
        type: "get", //send it through get method
        data: {

            from_date: from_date,
            to_date: to_date,
            creditor_query: creditor_query,
            dep_query: dep_query,
            sec_query: sec_query,
            part_query: part_query,
            qty_query: qty_query,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                $("#stock_tbady").empty();
                if (response.trim() != '0 result') {


                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {
                        count +=1;
                        $("#stock_tbady").append(`<tr><td>${count}</td><td>${item.part_name}</td><td>${item.creditor_name}</td><td>${item.dep_name}</td><td>${item.sec_name}</td><td>${item.qty}</td></tr>`)
                    })

                }
                else {
                    $("#stock_tbady").append(`<tr><td class='text-danger text-center' colspan='6'>No stock</td></tr>`)
                }

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