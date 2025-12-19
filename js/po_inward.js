
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

    $('#section_autoo').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#section_autoo').val() !== "") {
            $('#section_autoo').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_full_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.sec_name,
                                    value: item.sec_name,
                                    id: item.dep_sec_id,
                                    dep: item.dep_id,
                                    godown: item.godown_id,
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
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#department_autoo').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#department_autoo').val() !== "") {
            $('#department_autoo').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto2.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.dep_name,
                                    value: item.dep_name,
                                    id: item.dep_id,
                                    godown: item.godown_id,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("dep_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#unit_autoo').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#unit_autoo').val() !== "") {
            $('#unit_autoo').autocomplete({
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
                                    id: item.creditor_id,
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
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });



    $('#section_auto').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#section_auto').val() !== "") {
            $('#section_auto').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_full_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.sec_name,
                                    value: item.sec_name,
                                    id: item.dep_sec_id,
                                    dep: item.dep_id,
                                    godown: item.godown_id,
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
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#department_auto').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#department_auto').val() !== "") {
            $('#department_auto').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto2.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.dep_name,
                                    value: item.dep_name,
                                    id: item.dep_id,
                                    godown: item.godown_id,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("dep_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#unit_auto').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#unit_auto').val() !== "") {
            $('#unit_auto').autocomplete({
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
                                    id: item.creditor_id,
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
                    .append("<div>" + item.label + "</div>")
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
    let selectedRow = null;

    /* -----------------------------
        ROW CLICK → OPEN MODAL
    ------------------------------ */
    $("#poreport_item_table").on("click", "tr td.clickk", function () {

        selectedRow = $(this).closest("tr");

        // Reset modal fields
        $("#qty").val("");
        $("#unit_auto, #department_auto, #section_auto")
            .data({ godown_id: "", dept_id: "", sec_id: "" })
            .addClass("d-none");

        $(".form-check-input").prop("checked", false);

        $("#inwardModal").modal("show");

        // let original_qty = parseFloat(selectedRow.data("org_qty")) || 0;
        // let entered_qty = parseFloat($(this).text()) || 0;

        // // Clamp value
        // if (entered_qty < 0) entered_qty = 0;
        // if (entered_qty > original_qty) entered_qty = original_qty;

        $("#qty").val(selectedRow.data("org_qty"));
    });

    /* -----------------------------
        ONLY ONE CHECKBOX + SHOW INPUT
    ------------------------------ */
    $(".select_uds").on("change", function () {

        $(".select_uds").not(this).prop("checked", false);

        $("#unit_auto, #department_auto, #section_auto")
            .addClass("d-none")
            .val("");

        if (this.checked) {
            switch (this.id) {
                case "unit_chk":
                    $("#unit_auto").removeClass("d-none");
                    break;
                case "department_chk":
                    $("#department_auto").removeClass("d-none");
                    break;
                case "section_chk":
                    $("#section_auto").removeClass("d-none");
                    break;
            }
        }
    });


    /* -----------------------------
        QTY INPUT VALIDATION (LIVE)
    ------------------------------ */
    $("#qty").on("input", function () {

        if (!selectedRow) return;

        let original_qty = parseFloat(selectedRow.data("org_qty")) || 0;
        let entered_qty = parseFloat($(this).val());

        if (entered_qty < 0) {
            $(this).val(0);
            return;
        }

        if (entered_qty > original_qty) {
            $(this).val(original_qty);
        }
    });

    /* -----------------------------
        UPDATE BUTTON VALIDATION
    ------------------------------ */
    $("#inward_modal_btn").on("click", function () {

        if (!selectedRow) return;

        let qty = parseFloat($("#qty").val());
        let store_id = "";
        let store_type = "";

        // Quantity validation
        if (isNaN(qty) || qty <= 0) {
            salert("Warning", "Quantity must be greater than 0", "warning");
            return;
        }

        // Store selection
        if ($("#unit_chk").is(":checked")) {
            store_id = $("#unit_auto").data("godown_id");
            store_type = "godown";
        }
        else if ($("#department_chk").is(":checked")) {
            store_id = $("#department_auto").data("dep_id");
            store_type = "dep";
        }
        else if ($("#section_chk").is(":checked")) {
            store_id = $("#section_auto").data("sec_id");
            store_type = "sec";
        }

        else {
            salert("Warning", "Please select Unit / Department / Section", "warning");
            return;
        }


        if (!store_id) {
            salert("Warning", "Please select a valid store", "warning");
            return;
        }

        // Update row
        selectedRow.find("td").eq(5).text(qty);
        selectedRow.data({ store_id, store_type });

        $("#inwardModal").modal("hide");
        $("#po_report_input").removeClass("d-none")
    });

    /* -----------------------------
        FINAL SUBMIT
    ------------------------------ */
    $("#po_report_btn").on("click", function () {

        let details_po = [];

        $("#poreport_item_table tr").each(function () {

            let po_id = $(this).data("jaysan_po_material_id");
            let qty = parseFloat($(this).find("td").eq(5).text());
            let store_id = $(this).data("store_id");
            let store_type = $(this).data("store_type");

            if (po_id && qty > 0 && store_id && store_type) {
                details_po.push({
                    jaysan_po_material_id: po_id,
                    qty: qty,
                    store_id: store_id,
                    store_type: store_type
                });
            }
        });

        let dc_no = $("#dc_no").val();
        let dc_date = $("#dc_date").val();
        let dc_type = $("#dc_bill").is(":checked") ? "Invoice" : "dc";

        if (!dc_no || !dc_date || details_po.length === 0) {
            shw_toast("Warning", "Please fill all required fields");
            return;
        }
$("#po_report_btn").prop("disabled", true);
        insert_grn(dc_no, dc_date, details_po, dc_type);
    });





    $("#po_entery_form ").on("change", function () {
        // alert();
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

    $('#entry_company').on('input', function () {
        //check the value not empty
        if ($('#entry_company').val() != "") {
            $('#entry_company').autocomplete({
                //get data from databse return as array of object which contain label,value
                source: function (request, response) {
                    $.ajax({
                        url: "php/get_creditors_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: $("#entry_company").val(),


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.creditor_name,
                                    value: item.creditor_name,
                                    id: item.creditor_id,
                                    address: item.creditors_addr,
                                    // gst: item.gstrate
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("creditor_id", ui.item.id);
                    // $(this).data("gst_rate", ui.item.gst);
                    $('#entry_address').val(ui.item.address);
                    // $('#part_name_out').val(ui.item.part_name)
                    // get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong></div>")
                    .appendTo(ul);
            };
        }

    });

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

    $(".select_po_uds").on("change", function () {

        $(".select_po_uds").not(this).prop("checked", false);

        $("#unit_autoo, #department_autoo, #section_autoo")
            .addClass("d-none")
            .val("");

        if (this.checked) {
            switch (this.id) {
                case "unit_chkk":
                    $("#unit_autoo").removeClass("d-none");
                    break;
                case "department_chkk":
                    $("#department_autoo").removeClass("d-none");
                    break;
                case "section_chkk":
                    $("#section_autoo").removeClass("d-none");
                    break;
            }
        }
    });

    // ADD ROW
    let t_price = 0;
    let t_qty = 0;

    $("#entry_po_add_btn").on("click", function () {

        var dc_no = $("#entry_dc_no").val();
        var company_id = $("#entry_company").data("creditor_id");
        var part = $("#entry_part").data("part_id");
        var date = $("#entry_date").val();
        var price = Number($("#entry_price").val());
        var gst = $("#entry_gst").val();
        var qty = Number($("#entry_qty").val());
        var uom = $("#entry_uom").val();
        var e_store_id = '';
        var e_store_type = '';

        // Store selection
        if ($("#unit_chkk").is(":checked")) {
            e_store_id = $("#unit_autoo").data("godown_id");
            e_store_type = "godown";
        }
        else if ($("#department_chkk").is(":checked")) {
            e_store_id = $("#department_autoo").data("dep_id");
            e_store_type = "dep";
        }
        else if ($("#section_chkk").is(":checked")) {
            e_store_id = $("#section_autoo").data("sec_id");
            e_store_type = "sec";
        }
        else {
            salert("Warning", "Please select Unit / Department / Section", "warning");
            return;
        }

        if (!e_store_id) {
            salert("Warning", "Please select a valid store", "warning");
            return;
        }

        if (!dc_no || !company_id || !part || !date || !price || !gst || !qty || uom == "null") {
            salert("Warning", "Fill the fields", "warning");
            return;
        }

        $("#company_details").html(`<strong>Invoice From</strong><br>${$("#entry_company").val()} - ${$("#entry_address").val()}</td>`);
        $("#company_details").data("comp_id", company_id);
        $("#dc_no_head").text($("#entry_dc_no").val());
        $("#dc_date_head").text($("#entry_date").val());
        $("#vehicle_head").text($("#entry_vehicle").val());
        $("#received_by_head").text(current_user_name);

        t_price += price;
        t_qty += qty;

        let rowCount = $("#po_entery_form_table tr:not(.total-row)").length;
        rowCount = rowCount + 1;

        $("#po_entery_form_table").append(`
                <tr data-discount='${$("#entry_discount").val()}' data-part_id="${part}" data-store_id="${e_store_id}" data-store_type="${e_store_type}">
                    <td>${rowCount}</td>
                    <td>${$("#entry_part").val()}</td>
                    <td>${price}</td>
                    <td>${gst}</td>
                    <td>${qty}</td>
                    <td>${uom}</td>
                    <td>
                        <button type="button" class="btn btn-warning edit_po_c_btn"><i class="fa fa-edit"></i></button>
                        <button type="button" class="btn btn-danger delete_po_c_btn"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>
                `);


        // Remove old total row
        $("#po_entery_form_table tr.total-row").remove();

        // Append updated total
        $("#po_entery_form_table").append(`
        <tr class="total-row">
            <td colspan="2" class='text-center'><strong>Total</strong></td>
            <td>${t_price}</td>
            <td></td>
            <td>${t_qty}</td>
            <td colspan="2"></td>
        </tr>
    `);

        $("#entry_po_submit_btn").removeClass("d-none")
        clearForm();
    });


    $("#entry_po_submit_btn").on("click", function () {

        var a = 0;
        var comp = $("#company_details").data("comp_id");
        var dc = $("#dc_no_head").text();
        var datee = $("#dc_date_head").text();
        var vec = $("#vehicle_head").text();
        var rev_by = current_user_id;
        var po_material = [];

        $("#po_entery_form_table tr").each(function () {

            if ($(this).is(":last-child")) {
                return;
            }
            const rate = $(this).find("td").eq(2).text().trim();
            const qty = $(this).find("td").eq(4).text().trim();
            const part_id_m = $(this).data("part_id");
            const store_id = $(this).data("store_id");
            const store_type = $(this).data("store_type");

            if (rate != "" && qty != "" && part_id_m != "") {
                po_material.push({
                    po_material_id: part_id_m,
                    material_rate: rate,
                    qty: qty,
                    batch_id: "",
                    is_approved: "",
                    disc: $(this).data("discount"),
                    due_on: "",
                    store_id: store_id,
                    store_type: store_type,
                });
            } else {
                salert("Warning", "Table data missing", "warning");
            }
        });

        console.log(comp, dc, datee, rev_by, po_material);

        if (comp != "" && dc != "" && datee != "" && rev_by != "" && po_material.length > 0) {
            insert_purchase_order(comp, dc, datee, rev_by, po_material);
        }
        else {
            alert()
        }

    })

    // EDIT ROW (delegated)
    $(document).on("click", ".edit_po_c_btn", function () {

        $("#entry_po_add_btn").addClass("d-none");
        $("#entry_po_update_btn").removeClass("d-none");

        let row = $(this).closest("tr");
        $("#entry_po_update_btn").data("row", row);

        // Fill form with row values
        $("#entry_part").val(row.find("td").eq(1).text());
        $("#entry_price").val(row.find("td").eq(2).text());
        $("#entry_gst").val(row.find("td").eq(3).text());
        $("#entry_qty").val(row.find("td").eq(4).text());
        $("#entry_uom").val(row.find("td").eq(5).text());
        $("#entry_discount").val(row.data("discount"));
    });

    $("#entry_po_update_btn").on("click", function () {

        let row = $(this).data("row");

        row.find("td").eq(1).text($("#entry_part").val());
        row.find("td").eq(2).text($("#entry_price").val());
        row.find("td").eq(3).text($("#entry_gst").val());
        row.find("td").eq(4).text($("#entry_qty").val());
        row.find("td").eq(5).text($("#entry_uom").val());

        // Update row data attributes
        row.data("discount", $("#entry_discount").val());
        row.data("part_id", $("#entry_part").data("part_id"));

        // Reset UI
        $("#entry_po_add_btn").removeClass("d-none");
        $("#entry_po_update_btn").addClass("d-none");

        clearForm();

        recalcTotals();
    });

    // DELETE ROW
    $(document).on("click", ".delete_po_c_btn", function () {

        let btn = this;

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

                $("#po_entery_form_table tr:not(.total-row)").each(function (index) {
                    $(this).find("td").eq(0).text(index + 1);
                });

                recalcTotals();

            }

        });
    });



    //  CLEAR FORM FUNCTION
    function clearForm() {
        // $("#entry_dc_no").val("");
        // $("#entry_company").val("");
        $("#entry_part").val("");
        // $("#entry_date").val("");
        $("#entry_price").val("");
        $("#entry_gst").val("");
        $("#entry_qty").val("");
        $("#entry_uom").val("null");
        $("#entry_discount").val("");
        $("#entry_address").val("");
    }

    function recalcTotals() {

        let t_price = 0;
        let t_qty = 0;

        // Loop through all item rows except total-row
        $("#po_entery_form_table tr:not(.total-row)").each(function () {
            let price = Number($(this).find("td").eq(2).text());
            let qty = Number($(this).find("td").eq(4).text());

            t_price += price;
            t_qty += qty;
        });

        // Remove old total row
        $("#po_entery_form_table tr.total-row").remove();

        // Append updated total
        $("#po_entery_form_table").append(`
        <tr class="total-row">
            <td colspan="2" class="text-center"><strong>Total</strong></td>
            <td>${t_price}</td>
            <td></td>
            <td>${t_qty}</td>
            <td colspan="2"></td>
        </tr>
    `);
    }


});



function insert_purchase_order(comp, dc, datee, rev_by, po_material) {

    console.log(comp);
    console.log(dc);
    console.log(datee);
    console.log(rev_by);
    console.log("sds" + po_material);


    $.ajax({
        url: "php/insert_purchase_order.php",
        type: "post", //send it through get method
        data: {
            po_order_to: comp,
            is_ext_po: "1",
            received_by: rev_by,
            dc_no: dc,
            dc_date: datee,
            po_materials: po_material


        },
        success: function (response) {


            console.log(response);
            if (response.trim() == "ok") {
                location.reload();
                // alert("success")

            }

            else {
                salert("Error", "User ", "error");
                // location.reload();
            }



        },
        error: function (xhr) {
            //Do Something to handle error
        },
        complete: function () {
            //  Hide overlay and re-enable button
            $("#overlay").fadeOut();
            $("#mail_print").prop("disabled", false);
        }
    });
}


function insert_grn(dc_no, dc_date, details_po, dc_type) {
    console.log(details_po, dc_date, dc_no, dc_type, current_user_id);
    $.ajax({
        url: "php/insert_grn.php",
        type: "get", //send it through get method
        data: {
            dc_no: dc_no,
            dc_date: dc_date,
            receive_details: JSON.stringify(details_po),
            received_by: current_user_id,
            dc_type: dc_type,


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


                        $("#poreport_item_table").append("<tr data-org_qty=" + org_qty + " data-jaysan_po_material_id=" + obj.jaysan_po_material_id + " style='font-size: 12px'><td>" + count + "</td><td>" + obj.part_name + "</td><td>" + obj.qty + "</td><td><ul class='list-group'  style='height:auto; overflow-y:auto;'>" + rjd + "</ul></td><td>" + obj.total_received + "</td><td class='clickk'>0</td></tr>")
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
