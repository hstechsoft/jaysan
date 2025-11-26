
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
console.log(current_user_id);
var calendar = ""
var csdate = ""
var cedate = ""
var selected_date = ""
var selected_type = ""

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: 'dayGridMonth',


        headerToolbar: {
            left: 'prev,next today',
            right: 'title',

        },


        themeSystem: 'bootstrap',  // Use Bootstrap theme if you are using Bootstrap
        height: 'auto',
        // Event to trigger when calendar starts rendering

        dayCellDidMount: function (info) {
            let dayNumber = info.date.getDay(); // 0 = Sunday
            if (dayNumber === 0) {
                info.el.style.backgroundColor = '#ebe5e5'; // Light red for Sundays
            }
        },
        datesSet: function (info) {
            csdate = info.startStr; // First visible day of the month
            cedate = info.endStr;     // Last visible day of the month




            // Call your custom function to get the events for the whole month
            get_calender_assign(format_date_mysql(format_date_start(csdate)), format_date_mysql(format_date_start(cedate)))
        },
        dateClick: function (info) {
            // Display the clicked date
            removeHighlightedDates();

            // Highlight the clicked date
            highlightSelectedDate(info.dateStr);

            // $('#selected_date_div').removeClass('d-none')
            // $('#selected_date').html(info.dateStr)
            console.log((info.dateStr));

            // $("#assign_date").modal('hide');
            $('#production_date').val(info.dateStr)
            selected_date = info.dateStr
            get_cal_assign_report(selected_date)


        },

    });

});

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


    calendar.render();
    check_login();

    assign_product_get_product_list();

    assign_product_get_sub_type_list();

    get_godown_name();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#customer').on('input', function () {
        //check the value not empty
        if ($('#customer').val() != "") {
            $('#customer').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/assign_product_customer_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            term: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.cus_name,
                                    value: item.cus_name,
                                    cus_id: item.cus_id,
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

                    $(this).data("cus_id", ui.item.cus_id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)
                    console.log($("#customer").data("selected-cus_id"));


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.phone + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#product").on("change", function (event) {
        event.preventDefault();

        assign_product_get_model_list($(this).val());

    });


    $("#model").on("change", function (event) {
        event.preventDefault();

        assign_product_get_type_list($(this).val());

    });


    $("#search_btn").on("click", function (event) {
        event.preventDefault();
        $(".production, .waiting, .godown").addClass("d-none");

        var production_date = "";
        if ($("#form_date").val() != "" && $("#to_date").val() != "") {
            production_date = $("#form_date").val() + " and " + $("#to_date").val();
        }

        var sale_date = "";
        if ($("#s_form_date").val() != "" && $("#e_to_date").val() != "") {
            sale_date = $("#s_form_date").val() || + " and " + $("#e_to_date").val();
        }
        get_sale_order_mreport(sale_date, production_date);

    });

    // $("#clear_btn").on("click", function (event){
    //     $("#machine_production_form").empty()
    // })

    let selectedAssignIds = [];

    $(document).on('change', '.ass-check', function () {

        let status_type = $(this).data("type");
        let id = $(this).data("ass_id");

        let parent = $(this).closest("td").find(".order-check");
        let allChild = $(this).closest("ul").find(".ass-check");
        let checkedChild = $(this).closest("ul").find(".ass-check:checked");


        if ($(this).is(":checked")) {
            if (!selectedAssignIds.includes(id)) selectedAssignIds.push(id);
        } else {
            selectedAssignIds = selectedAssignIds.filter(x => x !== id);
        }

        parent.prop("checked", allChild.length === checkedChild.length);


        $(".production, .waiting, .godown").addClass("d-none");

        if (status_type == "Production")
            $(".production").removeClass("d-none");

        else if (status_type == "Waiting")
            $(".waiting").removeClass("d-none");

        else if (status_type == "Finshed")
            $(".godown").removeClass("d-none");


        $("#date_change").on("change", function () {
            $("#pro_date").removeClass("d-none");
            $("#pro_godown").addClass("d-none");
        });
        $("#godown_change").on("change", function () {
            $("#pro_date").addClass("d-none");
            $("#pro_godown").removeClass("d-none");
        });

        $("#wait_date_change").on("change", function () {
            $("#wait_date").removeClass("d-none");
            $("#wait_godown").addClass("d-none");
        });
        $("#wait_godown_change").on("change", function () {
            $("#wait_date").addClass("d-none");
            $("#wait_godown").removeClass("d-none");
        });

        console.log("Selected IDs => ", selectedAssignIds);
    });


    $(document).on('change', '.order-check', function () {
        let check = $(this).is(":checked");
        $(this).closest("td").find(".ass-check").prop("checked", check).trigger("change");
    });




});


function get_godown_name() {


    $.ajax({
        url: "php/get_godown_name.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {
            $('#godown, #pro_godownn, #wait_godownn, #finish_godownn ').empty()
            $('#godown, #pro_godownn, #wait_godownn, #finish_godownn ').append("<option disabled  selected>Choose Godown...</option>")

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#godown').append("<option data-des = '" + obj.des + "' value = '" + obj.gid + "'>" + obj.godown_name + "</option>")
                        $('#pro_godownn').append("<option data-des = '" + obj.des + "' value = '" + obj.gid + "'>" + obj.godown_name + "</option>")
                        $('#wait_godownn').append("<option data-des = '" + obj.des + "' value = '" + obj.gid + "'>" + obj.godown_name + "</option>")
                        $('#finish_godownn').append("<option data-des = '" + obj.des + "' value = '" + obj.gid + "'>" + obj.godown_name + "</option>")

                    });


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




}

function get_calender_assign(sdate, edate) {

    $.ajax({
        url: "php/get_assign_cal_details.php",
        type: "get", //send it through get method
        data: {


            astart_date: sdate.split(' ')[0],
            aend_date: edate.split(' ')[0]
        },
        success: function (response) {

            console.log(response);

            if (response.trim() != "error") {

                var title = ""
                var color = ""
                var customClass = ""
                if (response.trim() != "0 result") {
                    var obj = JSON.parse(response);

                    // Clear previous events before adding new ones
                    calendar.getEvents().forEach(event => event.remove());
                    obj.forEach(function (obj) {
                        if (obj.tot == '0') {
                            title = "0"
                            color = "gray"
                            customClass = "no_qty"; // Default styling
                        }
                        else if (obj.tot > 20) {
                            title = obj.tot
                            color = "#008000 "
                            customClass = "above_qty"; // Default styling
                        }
                        else {
                            title = obj.tot
                            color = "#008000 "
                            customClass = "below_qty"; // Default styling
                        }



                        calendar.addEvent({
                            title: title,
                            start: obj.Date,
                            color: 'white', // Use color from data or default to blue
                            textColor: color, // Text color
                            classNames: customClass
                        });



                    });

                    $(".his").fadeToggle(0);
                }


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


function format_date_mysql(date) {
    let formattedDate = date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);
    return formattedDate

}

// get data from database
function assign_product_get_product_list() {


    $.ajax({
        url: "php/assign_product_get_product_list.php",
        type: "get", //send it through get method
        data: {
            // key : value

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        // append logic here

                        $("#product").append("<option value=\"" + obj.product_id + "\">" + obj.pname + "</option>")
                    });



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




}

// get data from database
function assign_product_get_model_list(product_id) {


    $.ajax({
        url: "php/assign_product_get_model_list.php",
        type: "get", //send it through get method
        data: {
            product_id: product_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        // append logic here

                        $("#model").append("<option value=\"" + obj.model_id + "\">" + obj.model_name + "</option>")
                    });



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




}

function assign_product_get_type_list(product_id) {


    $.ajax({
        url: "php/assign_product_get_type_list.php",
        type: "get", //send it through get method
        data: {
            pid: product_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        // append logic here

                        $("#type_drop").append("<option value=\"" + obj.type_id + "\">" + obj.type_name + "</option>")
                    });



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




}


function assign_product_get_sub_type_list() {


    $.ajax({
        url: "php/assign_product_get_sub_type_list.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        // append logic here

                        $("#sub_type").append("<option value=\"" + obj.sub_type + "\">" + obj.sub_type + "</option>")
                    });



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




}

function get_cal_assign_report(cal_date) {


    $.ajax({
        url: "php/get_cal_assign_report.php",
        type: "get", //send it through get method
        data: {

            dated: cal_date

        },
        success: function (response) {
            $('#production_table_cal').empty()

            console.log(response);

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;


                        $('#production_table_cal').append(" <tr data-opid ='" + obj.opid + "'   data-dated ='" + cal_date + "'  data-qty ='" + obj.aqty + "'  class='small'> <td  style='max-width: 50px;'>" + count + "</td> <td style='max-width: 150px;'>" + obj.customer + "</td> <td>" + obj.product + "</td> </tr>")
                        if (parseInt(obj.modify_qty) > 0) {
                            $('#production_table_cal tr:last').find("td").eq(2).append(obj.date_info);

                        }

                        $("#report_date").text(
                            selected_date
                                ? new Date(selected_date).toLocaleDateString('en-GB')
                                : ""
                        )
                    })

                }
                else {
                    $('#production_table_cal').append("<tr class = 'small text-bg-secondary'><td colspan='5' scope='col'>No Data</td></tr>");

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });


}

function get_sale_order_mreport(sale_date, production_date) {

    var godown = $("#godown").val() || "";
    var customer_id = $("#customer").data("cus_id") || "";
    var sub_type = $("#sub_type").val() || "";
    var model_id = $("#model").val() || "";
    var type_id = $("#type_drop").val() || "";
    var product_id = $("#product").val() || "";
    var assign_type = $("#ass_type").val() || "";
    var order_no = $("#order").val() || "";
    var emp_id = $("#emp").data("emp_id") || "";

    $.ajax({
        url: "php/get_sale_order_mreport.php",
        type: "get", //send it through get method
        data: {

            godown: godown,
            assign_type: assign_type,
            order_no: order_no,
            production_date: production_date,
            product_id: product_id,
            type_id: type_id,
            model_id: model_id,
            sub_type: sub_type,
            customer_id: customer_id,
            sale_order_date: sale_date,
            emp_id: emp_id,

        },
        success: function (response) {
            console.log(response);
            $("#report_tbl").empty();

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count++;

                        var ass = JSON.parse(obj.assign_details);
                        var ass_d = "";

                        ass.forEach(function (item) {

                            if (item.assign_type == 'Production') {
                                ass_d += `<li class="list-group-item">
                                Production - ${item.dated} 
                                    <input class="form-check-input float-end ass-check" type="checkbox" id="ass_${item.ass_id}"  data-type='Production' data-ass_id='${item.ass_id}'>
                                </li>`;
                            }
                            if (item.assign_type == 'Finshed') {
                                ass_d += `<li class="list-group-item">
                                    Finished - ${item.godown_name} 
                                    <input class="form-check-input float-end ass-check" type="checkbox" id="ass_${item.ass_id}"  data-type='Finshed' data-ass_id='${item.ass_id}'>
                                </li>`;
                            }
                            if (item.assign_type == 'Waiting') {
                                ass_d += `<li class="list-group-item" >
                                    Waiting 
                                    <input class="form-check-input float-end ass-check" type="checkbox" id="ass_${item.ass_id}" data-type='Waiting' data-ass_id='${item.ass_id}'>
                                </li>`;
                            }
                        });

                        var pro_d = `<div class="card">
                            <div class="card-header">${obj.product} - ${obj.model_name} - ${obj.type_name}</div>
                            <div class="card-body">${obj.sub_type}</div>
                        </div>`;

                        $("#report_tbl").append(`
                            <tr style='font-size: 13px'>
                                <td>${count}</td>
                                <td>${obj.cus_name} - ${obj.cus_phone}</td>
                                <td>${pro_d}</td>
                                <td>
                                    <input class="form-check-input mb-2 order-check" type="checkbox" id="order_${obj.oid}">
                                    <ul class="list-group" style='height:80px; overflow-y:auto'>${ass_d}</ul>
                                </td>
                            </tr>
                        `);
                    });




                }
                else {
                    $("#report_tbl").append("<tr><td colspan='4' scope='col' class=\"text-center\">No Data</td></tr>");

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


$('#emp').on('input', function () {
    //check the value not empty
    if ($('#emp').val() != "") {
        $('#emp').autocomplete({
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

                $(this).data("emp_id", ui.item.cus_id);
                //   $('#part_name_out').data("selected-part_id", ui.item.id);
                //   $('#part_name_out').val(ui.item.part_name)
                //  get_bom(ui.item.id)
                $("#cust_phone_auto").val(ui.item.phone);
                console.log($("#cust_auto").data("selected-cus_id"));



            },

        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<div style='font-size:12px;'><strong>" + item.label + "</strong></div>")
                .appendTo(ul);
        };
    }

});


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


function format_date_start(date) {
    let date_temp = new Date(date);
    let startOfDay = new Date(date_temp.getFullYear(), date_temp.getMonth(), date_temp.getDate(), 0, 0, 0);
    return startOfDay
}

function format_date_end(date) {
    let date_temp = new Date(date);
    let endOfDay = new Date(date_temp.getFullYear(), date_temp.getMonth(), date_temp.getDate(), 23, 59, 59);
    return endOfDay
}

function removeHighlightedDates() {
    var highlightedDates = document.querySelectorAll('.fc-day-selected');
    highlightedDates.forEach(function (dayEl) {
        dayEl.classList.remove('fc-day-selected');
    });
}

function highlightSelectedDate(dateStr) {
    var selectedDateEl = document.querySelector('[data-date="' + dateStr + '"]');
    if (selectedDateEl) {
        selectedDateEl.classList.add('fc-day-selected');
    }
}