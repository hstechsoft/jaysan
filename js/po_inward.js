
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
                                    id: item.part_id
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
                    $(this).data("part_id", ui.item.id);
                    console.log("part_id :", ui.item);
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

        $("#poreport_item_table").empty();
        $("#po_report_input").addClass('d-none');

        if ($("#from_date").val() && $("#to_date").val()) {

            var from_date = $("#from_date").val();
            var to_date = $('#to_date').val();
        }
        if ($("#part").data("part_id")) {
            var part = $("#part").data("part_id");
        }
        if ($("#company").data("po_order_to")) {
            var company = $("#company").data("po_order_to");
        }
        console.log(part);
        console.log(company);
        console.log(from_date);
        console.log(to_date);

        get_po_report(part, company, from_date, to_date);
    })

    $("#po_report_reset").on("click", function () {
        window.location.reload();
    })

    $("#poreport_table").on("click", "tr", function () {
        $("#po_report_input").addClass('d-none');
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
            if (po_id && po_qty != '0' && po_qty != '') {
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


    $("#po_entery_form ").on("change", function () {
        $("#poreport_table").empty();
        $("#poreport_item_table").empty();
        $("#po_report_input").addClass("d-none");
        if ($(this).is(":checked")) {
            $("#filter_section1").addClass("d-none");
            $("#filter_section2").addClass("d-none");
            $("#entry_po").removeClass("d-none");
        }
        else {
            $("#entry_po").addClass("d-none");
            $("#filter_section1").removeClass("d-none");
            $("#filter_section2").removeClass("d-none");
        }
    })

    $('#entry_part').on('input', function () {
        //check the value not empty
        if ($('#entry_part').val() != "") {
            $('#entry_part').autocomplete({
                //get data from databse return as array of object which contain label,value
                source: function (request, response) {
                    $.ajax({
                        url: "php/mrf_partname_autocomplete.php",
                        type: "get", //send it through get method
                        data: {
                            part_name: $("#entry_part").val(),


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name,
                                    value: item.part_name,
                                    id: item.part_id,
                                    part_name: item.part_name,
                                    gst: item.gstrate
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("part_id", ui.item.id);
                    // $(this).data("gst_rate", ui.item.gst);
                    $('#entry_gst').val(ui.item.gst);
                    // $('#part_name_out').val(ui.item.part_name)
                    // get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.part_name + "</strong></div>")
                    .appendTo(ul);
            };
        }

    });

    // ADD ROW
    $("#entry_po_submit_btn").on("click", function () {

        let rowCount = $("#po_entery_form_table tr").length + 1;

        $("#po_entery_form_table").append(`
        <tr>
            <td>${rowCount}</td>
            <td>${$("#entry_dc_no").val()}</td>
            <td>${$("#entry_company").val()}</td>
            <td>${$("#entry_part").val()}</td>
            <td>${$("#entry_date").val()}</td>
            <td>${$("#entry_price").val()}</td>
            <td>${$("#entry_gst").val()}</td>
            <td>${$("#entry_qty").val()}</td>
            <td>${$("#entry_uom").val()}</td>
            <td>
                <button type="button" class="btn btn-warning" id="edit_po_c_btn"><i class="fa fa-edit"></i></button>
                <button type="button" class="btn btn-danger" id="delete_po_c_btn"><i class="fa fa-trash"></i></button>
            </td>
        </tr>`);

        clearForm();
    });


    // EDIT ROW (delegated)
    $(document).on("click", "#edit_po_c_btn", function () {

        $("#entry_po_submit_btn").addClass("d-none");
        $("#entry_po_update_btn").removeClass("d-none");

        var row = $(this).closest("tr");
        $("#entry_po_update_btn").data("row", row);

        $("#entry_dc_no").val(row.find("td").eq(1).text());
        $("#entry_company").val(row.find("td").eq(2).text());
        $("#entry_part").val(row.find("td").eq(3).text());
        $("#entry_date").val(row.find("td").eq(4).text());
        $("#entry_price").val(row.find("td").eq(5).text());
        $("#entry_gst").val(row.find("td").eq(6).text());
        $("#entry_qty").val(row.find("td").eq(7).text());
        $("#entry_uom").val(row.find("td").eq(8).text());
    });


    // UPDATE ROW
    $("#entry_po_update_btn").on("click", function () {

        var row = $(this).data("row");

        row.find("td").eq(1).text($("#entry_dc_no").val());
        row.find("td").eq(2).text($("#entry_company").val());
        row.find("td").eq(3).text($("#entry_part").val());
        row.find("td").eq(4).text($("#entry_date").val());
        row.find("td").eq(5).text($("#entry_price").val());
        row.find("td").eq(6).text($("#entry_gst").val());
        row.find("td").eq(7).text($("#entry_qty").val());
        row.find("td").eq(8).text($("#entry_uom").val());

        $("#entry_po_submit_btn").removeClass("d-none");
        $("#entry_po_update_btn").addClass("d-none");

        clearForm();
    });
    // DELETE ROW
    $(document).on("click", "#delete_po_c_btn", function () {

        let btn = this; // store button reference

        Swal.fire({
            title: "Are you sure?",
            text: "This row will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel"
        }).then((result) => {

            if (result.isConfirmed) {
                $(btn).closest("tr").remove();
            }

        });
    });


    //  CLEAR FORM FUNCTION
    function clearForm() {
        $("#entry_dc_no").val("");
        $("#entry_company").val("");
        $("#entry_part").val("");
        $("#entry_date").val("");
        $("#entry_price").val("");
        $("#entry_gst").val("");
        $("#entry_qty").val("");
        $("#entry_uom").val("null");
    }


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
        type: "get", //send /it through get method
        data: {
            po_id: po_id,


        },
        success: function (response) {

            console.log(response);

            if (response.trim() != "error") {
                $("#poreport_item_table").empty();
                if (response.trim() != "0 result") {
                    var obj = JSON.parse(response);
                    var count = 0;



                    obj.forEach(function (obj, index) {
                        count += 1;
                        var rjd = "";
                        var org_qty = parseInt(obj.qty) - parseInt(obj.total_received);
                        console.log(org_qty);

                        if (obj.receive_json_sts == 'nothing received') {
                            rjd = "<li class='list-group-item text-center text-danger' style='font-size: 12px'>Nothing Received</li>"
                        }
                        else {
                            var received_data = JSON.parse(obj.receive_json_sts);

                            rjd += `
                                <div class="accordion" id="receiveAccordion">
                            `;

                            let headId = "recHead" + index;
                            let collapseId = "recCollapse" + index;
                            received_data.forEach(function (item, index) {

                                headId += index;
                                collapseId += index;
                                rjd += `
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="${headId}">
                                        <button class="accordion-button collapsed" 
                                                type="button" 
                                                data-bs-toggle="collapse" 
                                                data-bs-target="#${collapseId}" 
                                                aria-expanded="false"
                                                aria-controls="${collapseId}"
                                                style="font-size: 12px;">
                                            <strong>${item.received_by}</strong> &nbsp; • &nbsp; Quantity:  <strong> ${item.qty}</strong>
                                        </button>
                                    </h2>

                                    <div id="${collapseId}" 
                                        class="accordion-collapse collapse" 
                                        aria-labelledby="${headId}" 
                                        data-bs-parent="#receiveAccordion">
                                        
                                        <div class="accordion-body py-2 px-2" style="font-size: 12px;">
                                            <div><strong>DC Date:</strong> ${item.dc_date}</div>
                                            <div><strong>DC No:</strong> ${item.dc_no}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            });

                            rjd += `</div>`;
                        }


                        $("#poreport_item_table").append("<tr data-jaysan_po_material_id=" + obj.jaysan_po_material_id + " style='font-size: 12px'><td>" + count + "</td><td>" + obj.part_name + "</td><td>" + obj.qty + "</td><td><ul class='list-group'  style='height:auto; overflow-y:auto;'>" + rjd + "</ul></td><td>" + obj.total_received + "</td><td contenteditable='true'  data-org_qty=" + org_qty + ">0</td></tr>")
                    });
                }
                else {
                    $("#poreport_item_table").append("<tr><td class='text-center text-danger'colspan='6'>No Po Available</td></tr>")
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



function get_po_report(part, company, fdate, tdate) {
    $.ajax({
        url: "php/get_po_report.php",
        type: "get", //send it through get method
        data: {
            material_query: part,
            order_to_query: company,
            from_date: fdate,
            to_date: tdate,


        },
        success: function (response) {

            console.log(response);

            if (response.trim() != "error") {
                $("#poreport_table").empty();
                if (response.trim() != "0 result") {


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
                        percentage = Math.round(percentage * 100) / 100;
                        if (percentage > 0) {
                            status = "<div class='progress'> <div class='progress-bar progress-bar-striped' role='progressbar' style='width: " + percentage + "%' aria-valuenow=" + percentage + " aria-valuemin='0' aria-valuemax='100'>" + percentage + "% </div></div>" + percentage + "% Received";
                        }
                        else {
                            status = 'Not Received';
                        }
                        $("#poreport_table").append("<tr data-po_id=" + obj.po_id + "  style='font-size: 12px'><td>" + count + "</td><td>" + obj.po_no + "</td><td>" + obj.po_date + "</td><td>" + obj.order_to + "</td><td>" + status + "</td><td>" + obj.inward_qty + "/" + obj.total_po_qty + "</td></tr>")
                    });

                }
                else {
                    $("#poreport_table").append("<tr><td class='text-center text-danger'colspan='6'>No Po Available</td></tr>")
                    console.log("0 result");
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
