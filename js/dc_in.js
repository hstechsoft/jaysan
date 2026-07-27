
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");

// const transport_dc_id = parseInt(urlParams.get("transport_dc_id")) || 0;
// const godown_id = parseInt(urlParams.get("godown_id")) || 0;
// const godown_name = urlParams.get("name") || "";

var attach_id = 0;

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

    Fancybox.bind("[data-fancybox='attachments']", {
        Toolbar: {
            display: [
                "zoom",
                "fullscreen",
                "slideshow",
                "download",
                "close"
            ]
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log("Latitude:", position.coords.latitude);
                console.log("Longitude:", position.coords.longitude);
                console.log("Accuracy:", position.coords.accuracy + " meters");
                get_godown_location_dc_in(position.coords.latitude, position.coords.longitude)
            },
            function (error) {
                console.log(error.message);
                $(".overlay_e").removeClass("d-none")
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
            $("#godown").data("godown_id", godown_id).val(godown_name);
        }
        else {
            salert("Warning", "Data Missing!, Try Again.", "warning");
        }

    })


    $("#part_search").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#dc_parts_tbody tr").each(function () {

            $(this).toggle(
                $(this).text().toLowerCase().indexOf(value) > -1
            );

        });

    });

    check_login();
    get_dc_attachment1('', '', '', 'create');

    // if (transport_dc_id > 0 && godown_id > 0) {
    //     $("#vendor").text(godown_name)
    //     $('#godown').data("godown_id", godown_id).val(godown_name);
    //     get_unassign_indc(transport_dc_id, godown_id);
    // }

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#godown').on('input', function () {
        $(this).removeData("godown_id");
        $("#dc_switch").prop("checked", false);
        $(".dc_details").empty();
        $(".alert_text").text('');
        $("#dc_switch").prop("checked", false);

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
                    get_unassign_indc(0, ui.item.id);
                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#all_parts").on("change", function () {
        $("#parts_tbody").empty();
        if ($(this).is(":checked") && godown_id > 0) {
            get_unassign_indc('', godown_id);
        }
        else {
            get_unassign_indc(transport_dc_id, godown_id);
        }
    });


    // $("#in_dc_no").on("focusout", function () {
    //     $("#dc_no").text($(this).val());
    // });

    // $("#dc_date").on("change focusout", function () {

    //     let value = $(this).val();

    //     if (value) {
    //         let date = new Date(value);

    //         let formatted =
    //             String(date.getDate()).padStart(2, "0") + "-" +
    //             String(date.getMonth() + 1).padStart(2, "0") + "-" +
    //             date.getFullYear() + " " +
    //             date.toLocaleTimeString([], {
    //                 hour: "2-digit",
    //                 minute: "2-digit",
    //                 hour12: true
    //             });

    //         $("#dc_datee").text(formatted);
    //     }
    // });

    // $("#transport_mode").on("focusout", function () {
    //     $("#mode_of_transportt").text($(this).val());
    // });

    // $("#transport_des").on("focusout", function () {
    //     $("#transport_descriptionn").text($(this).val());
    // });

    // $("#vehicle_no").on("focusout", function () {
    //     $("#vehicle_noo").text($(this).val());
    // });

    // Select row by clicking anywhere on it

    $("#dc_parts_tbody").on("click", "tr", function (e) {

        if ($(e.target).is(".check_dc")) return;

        const checkbox = $(this).find(".check_dc");

        if (!checkbox.prop("checked")) {
            checkbox.prop("checked", true).trigger("change");
        }

    });


    $("#dc_parts_tbody").on("change", ".check_dc", function () {

        var table_length = $("#parts_tbody tr:not(.total-row)").length;
        var row = $(this).closest("tr");
        var transport_id = row.data("transport_id");
        var part_pre_process_id = row.data("part_pre_process_id");
        var part_id = row.data("part_id");

        if ($(this).is(":checked")) {

            var count = table_length + 1;

            $("#parts_tbody").append(`
            <tr data-transport_id="${transport_id}" data-part_id="${part_id}" data-part_pre_process_id="${part_pre_process_id}" data-qty="${row.find("td").eq(2).text()}">
                <td>${count}</td>
                <td>${row.find("td").eq(1).find("strong").text()}</td>
                <td>${row.find("td").eq(1).find("span").text()}</td>
                <td>${row.find("td").eq(2).text()}</td>
                <td>
                    <input type="number"
                           class="form-control form-control-sm rounded-3 rate_per"
                           placeholder="Rate/Per">
                </td>
                <td>
                    <input type="number"
                           class="form-control form-control-sm rounded-3 rate"
                           placeholder="Total Amount">
                </td>
                <td>
                    <button type="button"
                            class="btn btn-sm btn-danger"
                            data-transport_id="${transport_id}">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);

            row.find("td").eq(3).find("input").prop("disabled", true);
            row.addClass("d-none");

        } else {

            $("#parts_tbody tr[data-transport_id='" + transport_id + "']").remove();

            row.find("td").eq(3).find("input").prop("disabled", false);
            row.removeClass("d-none");

            $("#parts_tbody tr:not(.total-row)").each(function (index) {
                $(this).find("td:first").text(index + 1);
            });

        }

        calculateTotal();
    });


    $("#parts_tbody").on("input focusout", ".rate, .rate_per", function () {

        var row = $(this).closest('tr');
        var qty = parseFloat(row.find('td').eq(3).text());

        if ($(this).hasClass("rate_per")) {
            var rate_per = parseFloat($(this).val() || 0)
            row.find(".rate").val(qty * rate_per)
        }
        else {
            var rate = parseFloat($(this).val() || 0)
            row.find(".rate_per").val(rate / qty)
        }
        calculateTotal();
    });


    $("#parts_tbody").on("click", "button", function () {

        var transport_id = $(this).data("transport_id");

        $("#parts_tbody tr[data-transport_id='" + transport_id + "']").remove();

        $("#dc_parts_tbody tr").each(function () {

            if ($(this).data("transport_id") == transport_id) {

                $(this)
                    .removeClass("d-none")
                    .find(".check_dc")
                    .prop("checked", false);

            }

        });

        $("#parts_tbody tr:not(.total-row)").each(function (index) {
            $(this).find("td:first").text(index + 1);
        });

        calculateTotal();

    });





    $("#dc_switch").on('change', function () {

        if ($('#godown').data("godown_id") < 1 || $('#godown').data("godown_id") == undefined) {
            $(this).prop("checked", false);
            salert("Warning", "First Select The Godown.", "warning");
            return;
        }

        if ($(this).is(":checked")) {
            $(".dc_title").text("DC Unload Details");
            $(this).next('label').text("DC Load Details");
            $(".alert_text").text('');
            get_transport_unload_parts($('#godown').data("godown_id"));
        }
        else {
            $(".dc_title").text("DC Load Details");
            $(this).next('label').text("DC Unload Details");
            $(".alert_text").text('');
            get_transport_parts_dc($('#godown').data("godown_id"));
        }
    })




    $("#grid").on("change", function () {
        if ($(this).is(":checked")) {
            $(".attech_col").removeClass("col-4").addClass("col-12");
            $("label[for='grid']").addClass("text-warning");
        } else {
            $(".attech_col").removeClass("col-12").addClass("col-4");
            $("label[for='grid']").removeClass("text-warning");
        }
    });

    $("#in_dc_btn").on("click", function () {


        var godown = $("#godown").data("godown_id") || 0;
        var transport_mode = $("#transport_mode").val() || '';
        var dc_date = $("#dc_date").val() || '';
        var transport_des = $("#transport_des").val() || '';
        var vehicle_no = $("#vehicle_no").val() || '';
        var dc_parts = [];
        var in_dc_no = $("#in_dc_no").val() || '';

        var emp_id = current_user_id;

        $("#parts_tbody tr:not(.total-row)").each(function () {
            var part_id = $(this).data("part_id");
            var transport_id = $(this).data("transport_id");
            var part_pre_process_id = $(this).data("part_pre_process_id");
            var rate = $(this).find('td').eq(4).find('input').val();
            var qty = $(this).data("qty");

            dc_parts.push({ part_id: part_id, transport_id: transport_id, part_pre_process_id: part_pre_process_id, rate: rate, qty: qty })
        })

        console.log(godown, dc_date, transport_mode, transport_des, vehicle_no, emp_id, attach_id, dc_parts);

        if (godown < 1 || dc_date == '' || in_dc_no == '') {
            salert("Warning", "In DC/No, Vendor & DC Date Are required.", "warning");
        }

        else if (dc_parts.length < 1) {
            salert("Warning", "Atleast One Part required.", "warning");
        }

        else if (attach_id < 1) {
            salert("Warning", "Select The Attachment.", "warning");
        }

        else {
            insert_indc(godown, dc_date, transport_mode, transport_des, vehicle_no, emp_id, attach_id, in_dc_no, JSON.stringify(dc_parts));
        }
    })


    let pressTimer;

    $("#attachment_list").on("mousedown touchstart", ".attech_col a", function () {

        let ele = $(this);

        pressTimer = setTimeout(function () {

            attach_id = ele.data("attach_id");

            $(".attech_col").removeClass("bg-success");
            ele.closest(".attech_col").addClass("bg-success");

            console.log("Selected:", attach_id);

        }, 600);

    })
        .on("mouseup mouseleave touchend", ".attech_col a", function () {

            clearTimeout(pressTimer);

        });


});

// Calculate Totals
function calculateTotal() {

    $("#parts_tbody .total-row").remove();

    var total_qty = 0;
    var total_amount = 0;

    $("#parts_tbody tr").not(".total-row").each(function () {

        total_qty += parseFloat($(this).find("td").eq(3).text()) || 0;
        total_amount += parseFloat($(this).find(".rate").val()) || 0;

    });

    if ($("#parts_tbody tr").length > 0) {

        $("#parts_tbody").append(`
            <tr class="total-row fw-bold">
                <td colspan="3" class="text-end">Total</td>
                <td>${total_qty}</td>
                <td colspan="2" class="text-end">${total_amount.toFixed(2)}</td>
                <td></td>
            </tr>
        `);

    }

}


function get_unassign_indc(transport_dc_id, godown_id) {

    console.log(transport_dc_id, godown_id);

    $.ajax({
        url: "php/get_unassign_indc.php",
        type: "get",
        data: {
            transport_dc_id: transport_dc_id,
            godown_id: godown_id,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {

                $("#dc_parts_tbody").empty();

                if (response.trim() != "0 result") {

                    let obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count += 1;

                        $("#dc_parts_tbody").append(`<tr data-part_id="${item.part_id}" data-transport_id="${item.transport_id}" data-part_pre_process_id="${item.process_id}" data-qty="${item.qty}"><td>${count}</td><td><strong>${item.output_part}</strong> <br><span class='badge bg-secondary'>${item.process_name}</span></td><td>${item.qty}</td><td class="d-none"><input type='checkbox' class='check_dc'></td></tr>`);

                    });


                } else {

                    $("#dc_parts_tbody").html(`<tr><td colspan='4' class='text-center text-danger'>No Parts Found</td></tr>`);

                }
            }

        }
    })
}


function get_dc_attachment1(emp_id, godown, dc_id, dc_status) {
    $.ajax({
        url: "php/get_dc_attachment.php",
        type: "get",
        data: {
            emp_id: emp_id,
            godown: godown,
            dc_id: dc_id,
            dc_status: dc_status,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {

                $("#attachment_list").empty();

                if (response.trim() != "0 result") {

                    let obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count += 1;

                        $("#attachment_list").append(`
                            <div class="col-4 attech_col">
                                <a href="${item.path}"  data-attach_id=${item.attach_id}
                                data-fancybox="attachments"
                                data-caption="Attachment Date: ${item.dated}">
                                    <img src="${item.path}"
                                        class="img-fluid rounded border shadow-sm"
                                        style="cursor:pointer;">
                                </a>
                            </div>
                        `);

                    });

                    $("#attachment_count").text(count);

                } else {

                    $("#attachment_list").html(`
                        <p class="text-center text-danger">
                            No Attachments Found.
                        </p>
                    `);

                }
            }

        }
    })
}

function insert_indc(godown, dc_date, transport_mode, transport_des, vehicle_no, emp_id, attach_id, in_dc_no, dc_parts) {

    console.log(godown, dc_date, transport_mode, transport_des, vehicle_no, emp_id, attach_id, in_dc_no, dc_parts);

    $.ajax({
        url: "php/insert_indc.php",
        type: "post", //send it through get method
        data: {

            godown: godown,
            dc_date: dc_date,
            transport_mode: transport_mode,
            transport_des: transport_des,
            vehicle_no: vehicle_no,
            emp_id: emp_id,
            attach_id: attach_id,
            in_dc_no: in_dc_no,
            dc_parts: dc_parts,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                // window.location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_godown_location_dc_in(lat, lng) {

    $.ajax({
        url: "php/get_godown_location.php",
        type: "get",
        data: {
            latti: lat,
            longi: lng,
        },

        success: function (response) {
            console.log(response);

            if (response.trim() !== "error") {
                $("#godown_list_tbody").empty();
                if (response.trim() !== "0 result") {
                    var obj = JSON.parse(response);
                    if (obj.length == 1) {
                        obj.forEach(function (item) {
                            $(".dc_filess").prop("disabled", false);
                            $("#godown").data("godown_id", item.creditor_id).val(item.creditor_name);
                        })
                    }
                    else {
                        $("#godown_list_modal").modal("show");
                        var count = 0;
                        obj.forEach(function (item) {
                            count += 1;
                            $("#godown_list_tbody").append(`
                                <li class="list-group-item godown-item">
                                    <div class="godown-details">
                                        <h6 class="godown-name mb-1">${item.creditor_name}</h6>
                                        <span class="godown-distance">
                                            <i class="fa-solid fa-location-dot me-1"></i>
                                            ${item.distance_m} Meters Away
                                        </span>
                                    </div>

                                    <button
                                        class="btn btn-success btn-sm select_btn"
                                        value="${item.creditor_id}"
                                        data-creditor_name="${item.creditor_name}">
                                        <i class="fa-solid fa-circle-check me-1"></i>
                                        Select
                                    </button>
                                </li>
                            `);
                        });
                        $("#godown_status").text('Found ' + count + ' Godown').addClass("bg-success");

                    }
                }
                else {
                    $("#godown_status").text('No Godown').addClass("bg-danger");
                }
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
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