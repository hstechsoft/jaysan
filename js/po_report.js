
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
                            part: $('#company').val(),
                            term: ""
                        },
                        dataType: "json",
                        success: function (data) {

                            console.log("data : " + data);
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

        var part = '1';
        var company = '1';
        var date = '1';

        if ($("#from_date").val() && $("#to_date").val()) {

            date = "po.date between '" + $("#from_date").val() + "' and '" + $('#to_date').val() + "'"
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

    $("#poreport_table").on("click", "tr", function () {

        get_po_receive_sts($(this).data("po_id"));
    })
    $("#poreport_item_table").on("input", "tr td", function () {
        $("#po_report_input").removeClass("d-none");
        var original_qnty = parseInt($(this).data("org_qty"));
        var enter_qnty = parseInt($(this).text());
        if (isNaN(enter_qnty)) {
            $(this).text('');
        } else if (enter_qnty > original_qnty) {
            $(this).text(original_qnty);
        } else if (enter_qnty < 0) {
            $(this).text(0);
        }
    })

    $("#po_report_btn").on("click", function () {
        let details_po = [];
        $("#poreport_item_table").find("tr").each(function () {

            let po_id = $(this).data("jaysan_po_material_id");
            let po_qty = $(this).find("td").eq(5).text();
            if (po_id && po_qty != '0') {
                details_po.push({
                    jaysan_po_material_id: po_id,
                    qty: po_qty,
                });
            }

        })
        let dc_no = $("#dc_no").val();
        let dc_date = $("#dc_date").val();
        if (dc_no != '' && dc_date != '' && details_po.length > 0) {
            insert_grn(dc_no, dc_date, details_po);
        }
        else {
            shw_toast('empty field', 'enter the fields');
        }
    })
});




function insert_grn(dc_no, dc_date, details_po) {
    $.ajax({
        url: "php/insert_grn.php",
        type: "get", //send it through get method
        data: {
            dc_no: dc_no,
            dc_date: dc_date,
            receive_details: JSON.stringify(details_po),
            received_by: current_user_id,


        },
        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {
                location.reload();

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



function get_po_receive_sts(po_id) {
    $.ajax({
        url: "php/get_po_receive_sts.php",
        type: "get", //send it through get method
        data: {
            po_id: po_id,


        },
        success: function (response) {

            console.log(response);

            if (response.trim() != "error") {
                $("#poreport_item_table").empty();
                var obj = JSON.parse(response);
                var count = 0;



                obj.forEach(function (obj) {
                    count += 1;
                    var rjd = "";
                    var org_qty = parseInt(obj.qty) - parseInt(obj.total_received);
                    console.log(org_qty);

                    if (obj.receive_json_sts == 'nothing received') {
                        rjd = "<li class='list-group-item text-center text-danger'>Nothing Received</li>"
                    }
                    else {
                        var received_data = JSON.parse(obj.receive_json_sts);
                        received_data.forEach(function (item) {
                            rjd += "<li class='list-group-item'>Emp Name: " + item.received_by + '<br>Dc No: ' + item.dc_no + '<br>Dc Date: ' + item.dc_date + '<br>Dc Quantity: ' + item.qty + "</li>"
                        })
                    }

                    $("#poreport_item_table").append("<tr data-jaysan_po_material_id=" + obj.jaysan_po_material_id + "><td>" + count + "</td><td>" + obj.part_name + "</td><td>" + obj.qty + "</td><td><ul class='list-group'  style='height:200px; overflow-y:auto;'>" + rjd + "</ul></td><td>" + obj.total_received + "</td><td contenteditable='true'  data-org_qty=" + org_qty + ">0</td></tr>")
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

            console.log(response);

            if (response.trim() != "error") {
                $("#poreport_table").empty();
                var obj = JSON.parse(response);
                var count = 0;



                obj.forEach(function (obj) {
                    count += 1;
                    var percentage = 0;
                    var status = '';
                    if (obj.inward_qty == null || obj.total_po_qty == 0) {
                        percentage = 0;
                    } else {
                        percentage = (parseFloat(obj.inward_qty) / parseFloat(obj.total_po_qty)) * 100;
                    }
                    percentage = Math.round(percentage);
                    if (percentage != 0) {
                        status = "<div class='progress'> <div class='progress-bar progress-bar-striped' role='progressbar' style='width: " + percentage + "%' aria-valuenow=" + percentage + " aria-valuemin='0' aria-valuemax='100'>" + percentage + "% </div></div>" + percentage + "% Received";
                    }
                    else {
                        status = 'Not Received';
                    }
                    $("#poreport_table").append("<tr data-po_id=" + obj.po_id + "><td>" + count + "</td><td>" + obj.po_id + "</td><td>" + obj.po_date + "</td><td>" + obj.order_to + "</td><td>" + status + "</td></tr>")
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
