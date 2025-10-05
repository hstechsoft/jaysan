
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

    $('#company').on('input', function () {
        //check the value not empty

        if ($('#company').val() != "") {
            $('#company').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {

                    console.log(response);
                    $.ajax({
                        url: "php/get_po_report_search_auto.php",
                        type: "get", //send it through get method
                        data: {

                            term: ""
                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.creditor_name,
                                    value: item.creditor_name,
                                    id: item.po_order_to,

                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("po_order_to", ui.item.id);



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> </div>")
                    .appendTo(ul);
            };
        }

    });

    $('#part').on('input', function () {

        // check the values not empty
        if ($('#part').val() !== "") {

            $('#part').autocomplete({
                source: function (request, response) {
                    console.log(response);

                    $.ajax({
                        url: "php/get_po_report_search_auto.php",
                        type: "get",
                        dataType: "json",
                        data: {
                            part: $('#part').val(),
                            term: "part"
                        },
                        success: function (data) {
                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name,
                                    value: item.part_name,
                                    id: item.po_material_id
                                };
                            }));
                        },
                        error: function (xhr, status, error) {
                            console.error("Autocomplete error:", error);
                        }
                    });
                },
                select: function (event, ui) {
                    // When a user selects a suggestion
                    $(this).data("po_material_id", ui.item.id);
                    console.log("po_material_id :", ui.item);
                }
            })
                // ✅ Custom rendering of autocomplete dropdown
                .autocomplete("instance")._renderItem = function (ul, item) {
                    return $("<li>")
                        .append("<div><strong>" + item.label + "</strong></div>")
                        .appendTo(ul);
                };
        }
    });



    $("#poreport_search").on("click", function () {

        var part = '';
        var company = '';
        var date = '';

        if ($("#from_date").val() && $("#to_date").val()) {

            date = "date between '" + $("#from_date").val() + "' and '" + $('#to_date').val() + "'"
        }
        if ($("#part").val()) {
            part = $("#part").val();
        }
        if ($("#company").val()) {
            company = $("#company").val();
        }
        console.log(part);
        console.log(company);
        console.log(date);

        get_po_report(part, company, date);
    })

    $("#po_report_reset").on("click", function () {
        $("#poreport_table").empty();
    })
});








function get_po_report(part, company, date) {
    $.ajax({
        url: "php/get_po_report.php",
        type: "get", //send it through get method
        data: {
            material_query: part,
            date_query: date,
            order_to_query: company


        },
        success: function (response) {


            if (response.trim() != "error") {
                var obj = JSON.parse(response);
                var count = 0;

                console.log(response);


                obj.forEach(function (obj) {
                    count += 1;
                    $("#poreport_table").append("<tr><td>" + count + "</td><td>" + obj.po_no + "</td><td>" + obj.po_date + "</td><td>" + obj.order_to + "</td><td></td></tr>")
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
