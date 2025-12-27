
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var top_req_count = 0;
var clicked = 0
let stockData = [];
// console.log(current_user_name);

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




    $('#search_stock_part').on('input', function () {
        //check the value not empty
        $('#search_stock_part').data("process_id", '');
        if ($('#search_stock_part').val() != "") {
            $('#search_stock_part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/mrf_partname_autocomplete.php",
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


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });




    $('#search_stock_unit').on('input', function () {
        $('#search_stock_unit').data("godown_id", '');
        //check the value not empty
        if ($('#search_stock_unit').val() != "") {
            $('#search_stock_unit').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_creditors_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: $('#search_stock_unit').val(),


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
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });



    $('#search_stock_dep').on('input', function () {
        $('#search_stock_dep').data("dept_id", "");
        //check the value not empty
        if ($('#search_stock_dep').val() != "") {
            $('#search_stock_dep').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto2.php",
                        type: "get", //send it through get method
                        data: {
                            term: $('#search_stock_dep').val(),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.dep_name,
                                    value: item.dep_name,
                                    id: item.dep_id,
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

    $('#search_stock_sec').on('input', function () {
        $('#search_stock_sec').data("sec_id", '');
        //check the value not empty
        if ($('#search_stock_sec').val() != "") {
            $('#search_stock_sec').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_auto2.php",
                        type: "get", //send it through get method
                        data: {
                            term: $('#search_stock_sec').val(),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.sec_name,
                                    value: item.sec_name,
                                    id: item.dep_sec_id,
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





    $("#stock_table").on("keydown", "input", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            console.log("Enter pressed in:", this.id);

            var part_query = $("#search_stock_part").data('process_id') || $("#search_stock_part").attr('data-process_id') || '';
            var creditor_query = $("#search_stock_unit").data('godown_id') || $("#search_stock_unit").attr('data-godown_id') || '';
            var dep_query = $("#search_stock_dep").data('dept_id') || $("#search_stock_dep").attr('data-dept_id') || '';
            var sec_query = $("#search_stock_sec").data('sec_id') || $("#search_stock_sec").attr('data-sec_id') || '';
            var qty_query = $("#search_stock_qty").val() || '';
            var from_date = $("#search_stock_f_date").val() || '';
            var to_date = $("#search_stock_e_date").val() || '';

            console.log({ part_query, creditor_query, dep_query, sec_query, qty_query, from_date, to_date });
            fetchStock();
            // get_jaysan_stock('', from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query);
        }
        else {
            // get_jaysan_stock();

        }
    });




    $("#clear_stock_insert_btn").on("click", function () {

        $("#search_stock_part").val('');
        $("#search_stock_godown").val('');
        $("#search_stock_department").val('');
        $("#search_stock_section").val('');
        $("#search_stock_qty").val('');
        $("#search_stock_f_date").val('');
        $("#search_stock_e_date").val('');

    })

    let enterPressed = false;

    $("#stock_tbady").on("focus", "span[contenteditable]", function () {
        // Store original value on focus
        $(this).data("original", $(this).text().trim());
        enterPressed = false;
    }).on("keydown", "span[contenteditable]", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            enterPressed = true;

            var part = $(this).data("part_id") || '';
            var godown = $(this).data("unit_id") || '';
            var department = $(this).data("dep_id") || '';
            var section = $(this).data("sec_id") || '';
            var qty = $(this).text().trim();
            var stock_master_json = "{}";

            console.log("part", part, "godown", godown, "department", department, "section", section, "qty", qty);

            insert_jaysan_stock(part, godown, department, section, qty, stock_master_json);

            // remove focus after save
            $(this).blur();
        }
    })
        .on("blur", "span[contenteditable]", function () {
            // If Enter not pressed, restore original value
            if (!enterPressed) {
                $(this).text($(this).data("original"));
            }
        });





    $("#printExcel").on("click", function () {

        if (!stockData || stockData.length === 0) {
            alert("No data to export");
            return;
        }

        let excelData = [];

        stockData.forEach(item => {
            let unitTotals = [];

            try {
                unitTotals = JSON.parse(item.unit_total || "[]");
            } catch {
                unitTotals = [];
            }

            if (unitTotals.length === 0) {
                excelData.push({
                    Part: item.part_name,
                    Unit: "",
                    Department: "",
                    Section: "",
                    Qty: item.total_stock
                });
                return;
            }

            unitTotals.forEach(unit => {
                (unit.department_details || []).forEach(dep => {
                    (dep.section_details || []).forEach(sec => {
                        excelData.push({
                            Part: item.part_name,
                            Unit: unit.unit,
                            Department: dep.department,
                            Section: sec.section,
                            Qty: sec.Section_qty ?? ""
                        });
                    });
                });
            });
        });

        let ws = XLSX.utils.json_to_sheet(excelData);

        ws["!cols"] = Object.keys(excelData[0]).map(k => ({
            wch: Math.max(k.length, ...excelData.map(r => (r[k] || "").toString().length)) + 2
        }));

        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stock Data");

        let today = new Date().toISOString().split("T")[0];
        XLSX.writeFile(wb, `StockData_${today}.xlsx`);
    });






    let reqIdArray = [];
    let totalQty = 0;
    let part_idddd = '';

    $("#stock_tbady").on("click", "#req_details_btn", function () {

        $("#request_modal_body").empty();
        reqIdArray = [];
        totalQty = 0;
        part_idddd = '';

        var requested_detail = $(this).attr("data-req_details");
        // console.log(requested_detail);

        part_idddd = $(this).data('part_id');

        if (requested_detail !== '') {
            requested_detail = JSON.parse(requested_detail);


            reqIdArray = [];
            totalQty = 0;

            requested_detail.forEach(group => {

                group.req_details.forEach(item => {

                    reqIdArray.push(item.req_id);
                    totalQty += Number(item.qty);

                    $("#request_modal_body").append(`
                <li class="list-group-item d-flex justify-content-between" style='font-size: 12px'>
                    <span> ${item.emp} - ${item.store_type} - ${item.store} - ${item.dated}</span>
                    <strong class='text-success'> ${item.qty}</strong>
                </li>
            `);
                });

            });
        }


        // Total Qty at bottom
        $("#request_modal_body").append(`
        <li class="list-group-item list-group-item-info text-end  d-flex justify-content-between"  style='font-size: 12px'>
            <strong>Total Qty:</strong><strong contenteditable id='mrf_req_qty' class='px-3 py-1'> ${totalQty}</strong>
        </li>
    `);

        $("#requestModal").modal("show");
    });

    $("#stock_allocate_btn").on("click", function () {
        $("#requestModal").modal("hide");

        window.open(
            'http://localhost/jaysan/store_stock_allocate.html?part_id=' + part_idddd + '&req=1',
            '_blank'
        );
    });


    $("#req_detai").on("click", function () {

        $("#requestModal").modal("hide");
        var q = $("#mrf_req_qty").text().trim();
        console.log(reqIdArray);
        var r_arr = reqIdArray.length > 0 ? encodeURIComponent(JSON.stringify(reqIdArray)) : '';



        window.location.href =
            'material_request_form.html'
            + '?part_id_para=' + part_idddd
            + '&qty_para=' + q
            + '&req_id_para=' + r_arr;
    });


    //     $("#toggel_stock_part_group").on("change", function () {
    //     var min_order_query = '';
    //     var request_query = '';
    //     var creditor_query = '';
    //     var dep_query = '';
    //     var sec_query = '';
    //     var part_query = '';

    //     if ($(this).is(":checked")) {
    //         min_order_query = 1;
    //     }
    //     if (clicked == 0) {
    //         request_query = 1;
    //     }
    //     if($("#search_stock_unit").data("godown_id") !== undefined){
    //         creditor_query = $("#search_stock_unit").data("godown_id");
    //     }
    //     if($("#search_stock_dep").data("dept_id") !== undefined){
    //         creditor_query = $("#search_stock_dep").data("dept_id");
    //     }
    //     if($("#search_stock_sec").data("sec_id") !== undefined){
    //         creditor_query = $("#search_stock_sec").data("sec_id");
    //     }
    //     if($("#search_stock_part").data("process_id") !== undefined){
    //         creditor_query = $("#search_stock_part").data("process_id");
    //     }
    //     get_jaysan_stock(min_order_query, '', '', creditor_query, dep_query, sec_query, part_query, '', request_query);
    // })



    // $("#reqest_btn_top").on("click", function () {
    //     // top_req_count = 0;

    //     var min_order_query = '';
    //     var request_query = '';
    //     var creditor_query = '';
    //     var dep_query = '';
    //     var sec_query = '';
    //     var part_query = '';

    //     if ($("#toggel_stock_part_group").is(":checked")) {
    //         min_order_query = 1;
    //     }
    //     if ($("#search_stock_unit").data("godown_id") !== undefined) {
    //         creditor_query = $("#search_stock_unit").data("godown_id");
    //     }
    //     if ($("#search_stock_dep").data("dept_id") !== undefined) {
    //         creditor_query = $("#search_stock_dep").data("dept_id");
    //     }
    //     if ($("#search_stock_sec").data("sec_id") !== undefined) {
    //         creditor_query = $("#search_stock_sec").data("sec_id");
    //     }
    //     if ($("#search_stock_part").data("process_id") !== undefined) {
    //         creditor_query = $("#search_stock_part").data("process_id");
    //     }
    //     console.log(top_req_count);

    //     if (clicked == 0) {
    //         var request_query = 1;
    //         get_jaysan_stock(min_order_query, '', '', creditor_query, dep_query, sec_query, part_query, '', request_query);
    //         clicked = 1;
    //         $("#text_span").text("All");
    //         $("#span_req_count").addClass("d-none");

    //     }
    //     else {
    //         get_jaysan_stock(min_order_query, '', '', creditor_query, dep_query, sec_query, part_query, '', request_query);
    //         clicked = 0;
    //         $("#text_span").text("Requested");
    //         $("#span_req_count").removeClass("d-none");
    //     }
    // })


    // $("#toggel_stock_part_reduce").on("change", function () {
    //     var min_order_query = '';
    //     var request_query = '';
    //     var creditor_query = '';
    //     var dep_query = '';
    //     var sec_query = '';
    //     var part_query = '';

    //     if ($("#toggel_stock_part_group").is(":checked")) {
    //         min_order_query = 1;
    //     }
    //     if (clicked == 0) {
    //         request_query = 1;
    //     }
    //     if ($("#search_stock_unit").data("godown_id") !== undefined) {
    //         creditor_query = $("#search_stock_unit").data("godown_id");
    //     }
    //     if ($("#search_stock_dep").data("dept_id") !== undefined) {
    //         creditor_query = $("#search_stock_dep").data("dept_id");
    //     }
    //     if ($("#search_stock_sec").data("sec_id") !== undefined) {
    //         creditor_query = $("#search_stock_sec").data("sec_id");
    //     }
    //     if ($("#search_stock_part").data("process_id") !== undefined) {
    //         creditor_query = $("#search_stock_part").data("process_id");
    //     }
    //     get_jaysan_stock(min_order_query, '', '', creditor_query, dep_query, sec_query, part_query, '', request_query);
    //     console.log($(this).is(":checked"));

    // })


    $("#toggel_stock_part_group").on("change", function () {
        fetchStock();
    });

    $("#reqest_btn_top").on("click", function () {

        if (clicked === 0) {
            clicked = 1;
            $("#text_span").text("All");
            $("#span_req_count").addClass("d-none");
        } else {
            clicked = 0;
            $("#text_span").text("Requested");
            $("#span_req_count").removeClass("d-none");
        }

        fetchStock();
    });

    $("#toggel_stock_part_reduce").on("change", function () {
        fetchStock();
    });






});

function buildStockFilters() {
    return {
        min_order_query: $("#toggel_stock_part_group").is(":checked") ? 1 : '',
        request_query: clicked === 1 ? 1 : '',
        creditor_query: $("#search_stock_unit").data("godown_id") || '',
        dep_query: $("#search_stock_dep").data("dept_id") || '',
        sec_query: $("#search_stock_sec").data("sec_id") || '',
        part_query: $("#search_stock_part").data("process_id") || ''
    };
}
function fetchStock() {
    const f = buildStockFilters();

    get_jaysan_stock(
        f.min_order_query,
        '',
        '',
        f.creditor_query,
        f.dep_query,
        f.sec_query,
        f.part_query,
        '',
        f.request_query
    );
}









function insert_jaysan_stock(part, godown, department, section, qty, stock_master_json, material_type) {
    console.log("part" + part, "godown" + godown, "department" + department, "section" + section, qty, "stock_master " + stock_master_json, "material_type" + material_type);


    $.ajax({
        url: "php/insert_jaysan_stock.php",
        type: "get", //send it through get method
        data: {

            godown: godown,
            dep: department,
            sec: section,
            qty: qty,
            part_id: part,
            batch_id: '',
            finished_godown: '',
            remark: '',
            stock_master: stock_master_json,
            emp_id: current_user_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                get_jaysan_stock();
                $("#stock_part").val('');
                $("#stock_godown").val('');
                $("#stock_department").val('');
                $("#stock_section").val('');
                $("#stock_part").data('process_id', '');
                $("#stock_godown").data('godown_id', '');
                $("#stock_department").data('dep_id', '');
                $("#stock_section").data('sec_id', '');
                $("#stock_qty").val('');

                $("#stock_unit_min_qty").val('');
                $("#stock_unit_max_qty").val('');
                $("#stock_department_min_qty").val('');
                $("#stock_department_max_qty").val('');
                $("#stock_section_min_qty").val('');
                $("#stock_section_max_qty").val('');
                $("#d_min_max").addClass("d-none");
                $("#s_min_max").addClass("d-none");
                $("#u_min_max").addClass("d-none");
                $("#unit_add_btn").addClass("d-none");

                $("#stock_insert_btn").prop("disabled", false);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function get_jaysan_stock(min_order_query, from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query, request_query) {
    console.log("fd " + from_date, "td " + to_date, "g " + creditor_query, "d " + dep_query, "s " + sec_query, "p " + part_query, "q " + qty_query, "min_order_query " + min_order_query);

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
            min_order_query: min_order_query,
            requst_query: request_query,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                $("#stock_tbady").empty();
                top_req_count = 0;
                if (response.trim() != '0 result') {

                    // assume `response` is the JSON string you showed
                    stockData = JSON.parse(response);
                    var obj = stockData;
                    var count = 0;

                    obj.forEach(function (item) {
                        count++;

                        // safe-parse unit_total (it is a JSON string in your API)
                        var unitTotals = [];
                        try {
                            unitTotals = JSON.parse(item.unit_total || "[]");
                        } catch (e) {
                            unitTotals = [];
                        }

                        // compute how many section-rows this item will produce (across all units & departments)
                        var itemRowSpan = 0;
                        unitTotals.forEach(function (u) {
                            if (Array.isArray(u.department_details)) {
                                u.department_details.forEach(function (d) {
                                    if (Array.isArray(d.section_details)) {
                                        itemRowSpan += d.section_details.length;
                                    }
                                });
                            }
                        });

                        console.log(itemRowSpan);

                        // if there are no unit/department/section details, still render one row for the part
                        if (itemRowSpan === 0) {
                            var trEmpty = "<tr>";
                            trEmpty += `<td>${count}</td>`;
                            trEmpty += `<td>${item.part_name || ""} - ${item.total_stock} <span class='badge bg-danger'>${item.total_stock}</span>`;
                            trEmpty += `<td colspan="4">No unit/department/section data</td>`;
                            trEmpty += "</tr>";
                            $("#stock_tbady").append(trEmpty);
                            return;
                        }

                        // iterate units -> departments -> sections and build rows
                        unitTotals.forEach(function (unitObj, unitIndex) {
                            var unitName = unitObj.unit || "";
                            // compute unit rowspan = total sections inside this unit
                            var unitRowSpan = 0;
                            if (Array.isArray(unitObj.department_details)) {
                                unitObj.department_details.forEach(function (d) {
                                    if (Array.isArray(d.section_details)) unitRowSpan += d.section_details.length;
                                });
                            }

                            (unitObj.department_details || []).forEach(function (depObj, depIndex) {
                                var depName = depObj.department || "";
                                var sections = depObj.section_details || [];
                                var unit_stock_qty = 0;
                                var dep_stock_qty = 0;

                                sections.forEach(function (secObj, secIndex) {
                                    var tr = `<tr class='text-center align-middle' style='font-size: 12px'>`;

                                    // Part-level cells: only on the very first row for this item
                                    if (unitIndex === 0 && depIndex === 0 && secIndex === 0) {
                                        var blink = '';
                                        var p_req = '';
                                        var p_min_max = '';
                                        var re = '';
                                        var total_stock = item.total_stock ?? 0;
                                        if (item.req_details !== null && ($("#toggel_stock_part_reduce").is(":checked") || clicked != 0)) {
                                            // var req_d = JSON.parse(item.req_details);
                                            // console.log(req_d);

                                            p_req = `data-req_details='${item.req_details}'`;
                                        }
                                        else if (item.req_details == null) {
                                            p_req = `data-req_details='' data-part_id=''`;
                                        }
                                        if (item.total_stock <= item.min_order_qty) { blink = `blink`; }
                                        if ($("#toggel_stock_part_reduce").is(":checked") || clicked != 0) {
                                            p_min_max = `<span class='badge bg-danger ${blink}'>${item.min_order_qty}</span>`;
                                            re = `<button type="button" id='req_details_btn'  data-part_id='${item.part_id}' ${p_req} class="btn p-1" data-bs-toggle="modal" data-bs-target="#requestModal"><i class="fa-regular fa-bell text-success"></i></button>`
                                        }
                                        tr += `<td rowspan="${itemRowSpan}">${count}</td>`;
                                        tr += `<td rowspan="${itemRowSpan}">${re} ${item.part_name || ""} - <span class="border border-primary px-3 py-1 me-2 border-2 rounded-3" contenteditable    data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' >${total_stock}</span>${p_min_max}</td>`;
                                        tr += `<td rowspan="${itemRowSpan}">Purchase</td>`;
                                    }

                                    // Unit cell: only for first department/first section inside this unit
                                    if (depIndex === 0 && secIndex === 0) {
                                        var blink = '';
                                        var req = '';
                                        var g_min_max = '';
                                        let godown_min = unitObj.godown_min ?? 0;
                                        let godown_max = unitObj.godown_max ?? 0;
                                        let final_unit_qty = 0;

                                        // if no-department exists, override
                                        unitObj.department_details.forEach(depObj => {
                                            if (depObj.department === 'no-department') {
                                                final_unit_qty = depObj.department_qty;
                                            }
                                        });
                                        if (unitObj.godown_req !== null && ($("#toggel_stock_part_reduce").is(":checked") || clicked != 0)) {
                                            var g_req_count = 0;
                                            unitObj.godown_req.forEach(function (greq) {
                                                g_req_count++;
                                                if (greq.status === 'create') {
                                                    req = `<span class='badge blink bg-warning me-2'><i class="fa-regular fa-bell"></i> ${g_req_count}</span>`
                                                }
                                                else if (greq.status === 'allocated') {
                                                    req = `<span class='badge bg-secondary'>Allocated</span>`
                                                }
                                                else if (greq.status === 'delivered') {
                                                    req = `<span class='badge bg-success'>Delivered</span>`
                                                }
                                                else {
                                                }
                                            })
                                            top_req_count += g_req_count;
                                            console.log(top_req_count);
                                        } else if (unitObj.godown_req !== null) {
                                            var g_req_count = 0;
                                            unitObj.godown_req.forEach(function (greq) {
                                                g_req_count++;
                                            })
                                            top_req_count += g_req_count;
                                        }


                                        if (unitObj.godown_qty <= unitObj.godown_min) { blink = `blink`; }
                                        if ($("#toggel_stock_part_reduce").is(":checked") || $("#toggel_stock_part_group").is(":checked")) {
                                            g_min_max = `<span class='badge bg-danger ${blink}'>${godown_min}</span><span class='badge bg-success ms-1'>${godown_max}</span>`;
                                        }
                                        tr += `<td rowspan="${unitRowSpan}">${req} ${unitName} (${unitObj.godown_qty}) - <span contenteditable class="border border-primary px-3 py-1 me-2 border-2 rounded-3"   data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown_id}'>${final_unit_qty}</span>${g_min_max} </td>`;
                                    }

                                    // Department cell: only for first section of this department
                                    if (secIndex === 0) {
                                        var blink = '';
                                        var dd_req = '';
                                        var d_min_max = '';
                                        var editt_span = '';
                                        let dep_min = depObj.dep_min ?? 0;
                                        let dep_max = depObj.dep_max ?? 0;
                                        let final_dep_qty = 0;

                                        // if no-section exists, override
                                        depObj.section_details.forEach(secObj => {
                                            if (secObj.section === 'no-section') {
                                                final_dep_qty = secObj.Section_qty;
                                            }
                                        });
                                        if (depObj.dep_req !== null && ($("#toggel_stock_part_reduce").is(":checked") || clicked != 0)) {
                                            var d_req_count = 0;
                                            depObj.dep_req.forEach(function (greq) {
                                                d_req_count++;
                                                if (greq.status === 'create') {
                                                    dd_req = `<span class='badge blink bg-warning me-2'><i class="fa-regular fa-bell"></i> ${d_req_count}</span>`
                                                }
                                                else if (greq.status === 'allocated') {
                                                    dd_req = `<span class='badge bg-secondary'>Allocated</span>`
                                                }
                                                else if (greq.status === 'delivered') {
                                                    dd_req = `<span class='badge bg-success'>Delivered</span>`
                                                }
                                                else {
                                                }

                                            })
                                            top_req_count += d_req_count;
                                        }
                                        else if (depObj.dep_req !== null) {
                                            var d_req_count = 0;
                                            depObj.dep_req.forEach(function (greq) {
                                                d_req_count++;

                                            })
                                            top_req_count += d_req_count;
                                        }
                                        console.log(top_req_count);
                                        if (depObj.department_qty <= depObj.dep_min) { blink = `blink`; }
                                        if ($("#toggel_stock_part_reduce").is(":checked") || $("#toggel_stock_part_group").is(":checked")) {
                                            d_min_max = ` <span class='badge bg-danger ${blink}'>${dep_min}</span><span class='badge bg-success ms-1'>${dep_max}</span>`;
                                        }
                                        if (depName != 'no-department') {
                                            editt_span = `(${depObj.department_qty}) -  <span contenteditable class="border border-primary px-3 py-1 me-2 border-2 rounded-3"  data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown_id}' data-dep_id='${depObj.dep_id}'>${final_dep_qty}</span>`
                                        } else {
                                            unit_stock_qty = depObj.department_qty;
                                        }
                                        tr += `<td rowspan="${sections.length}">${dd_req}  ${depName != 'no-department' ? depName : ""}${editt_span}${d_min_max}</td>`;
                                    }

                                    // Section and Section_qty
                                    var blink = '';
                                    var ss_req = '';
                                    var s_min_max = '';
                                    let sec_min = secObj.sec_min ?? 0;
                                    let sec_max = secObj.sec_max ?? 0;
                                    if (secObj.sec_req !== null && ($("#toggel_stock_part_reduce").is(":checked") || clicked != 0)) {
                                        var s_req_count = 0;
                                        secObj.sec_req.forEach(function (greq) {
                                            s_req_count++;
                                            if (greq.status === 'create') {
                                                ss_req = `<span class='badge blink bg-warning me-2'><i class="fa-regular fa-bell"></i> ${s_req_count}</span>`;
                                            }
                                            else if (greq.status === 'allocated') {
                                                ss_req = `<span class='badge bg-secondary'>Allocated</span>`
                                            }
                                            else if (greq.status === 'delivered') {
                                                ss_req = `<span class='badge bg-success'>Delivered</span>`
                                            }
                                            else {
                                            }
                                        })
                                        top_req_count += s_req_count;
                                    } else if (secObj.sec_req !== null) {
                                        var s_req_count = 0;
                                        secObj.sec_req.forEach(function (greq) {
                                            s_req_count++;
                                        })
                                        top_req_count += s_req_count;
                                    }
                                    console.log(top_req_count);

                                    if (secObj.Section_qty <= secObj.sec_min) { blink = `blink`; }
                                    if ($("#toggel_stock_part_reduce").is(":checked") || $("#toggel_stock_part_group").is(":checked")) {
                                        s_min_max = `<span class='badge bg-danger ${blink}'>${sec_min}</span><span class='badge bg-success ms-1'>${sec_max}</span>`;
                                    }
                                    if (secObj.section == 'no-section') { dep_stock_qty = secObj.Section_qty };
                                    tr += `<td>${ss_req} ${secObj.section != 'no-section' ? `${secObj.section || ""} ${s_min_max}` : ''}</td>`;
                                    tr += `<td class="border border-primary  border-2 rounded-3"><span contenteditable class='px-3 py-1' data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown_id}' data-dep_id='${depObj.dep_id}' data-sec_id='${secObj.sec_id}'>${secObj.Section_qty != null ? secObj.Section_qty : ""}</span></td>`;

                                    tr += "</tr>";
                                    $("#stock_tbady").append(tr);
                                });
                            });
                        });
                    });

                    if(top_req_count > 0 ){
                        $("#span_req_count").addClass("blink")
                    }
                    $("#span_req_count").text(top_req_count)

                }

                else {
                    $("#stock_tbady").append(
                        `<tr><td class='text-danger text-center' colspan='6'>No stock</td></tr>`
                    );
                }
            }






        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}






function insert_creditors(unit) {

    $.ajax({
        url: "php/insert_creditors.php",
        type: "get", //send it through get method
        data: {
            creditor_name: unit,
            creditor_phone: "",
            creditor_gst: "",
            creditors_email: "",

        },
        success: function (response) {


            if (response.trim() > 0) {
                $("#stock_godown").data("godown_id", response);
                $("#unit_add_btn").addClass("d-none");
                $("#dep_add_btn").removeClass("d-none")
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_department(go_id, dept_name) {
    console.log(go_id);

    $.ajax({
        url: "php/insert_department.php",
        type: "get", //send it through get method
        data: {
            godown_id: go_id,
            dep_name: dept_name,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() > 0) {
                $("#stock_department").data("dept_id", response);
                shw_toast("success", "Department Added")
                $("#dep_add_btn").addClass("d-none")
                $("#sec_add_btn").removeClass("d-none")

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });
}

function insert_dep_section(dept_id, sec_name) {
    $.ajax({
        url: "php/insert_dep_section.php",
        type: "get", //send it through get method
        data: {
            dep_id: dept_id,
            sec_name: sec_name,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() > 0) {
                $("#stock_section").data("sec_id", response);
                shw_toast("success", "Section Added");
                $("#sec_add_btn").addClass("d-none");
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