
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var top_req_count = 0;
var clicked = 0
let stockData = [];
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

    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       function (position) {
    //         console.log("Latitude:", position.coords.latitude);
    //         console.log("Longitude:", position.coords.longitude);
    //         console.log("Accuracy:", position.coords.accuracy + " meters");
    //         get_godown_locations(position.coords.latitude, position.coords.longitude)
    //       },
    //       function (error) {
    //         console.log(error.message);
    //       }
    //     );
    //   } else {
    //     console.log("Geolocation is not supported.");
    //   }

    $("#summary_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#all_bom_table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();
    get_jaysan_physical_stock('', '', '', '', '', '', '', '');

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#stock_part').on('input', function () {
        //check the value not empty
        $(this).data({ 'process_id': '', 'part_id': '' })
        $("#search_stock_part").data('process_id', "");
        $("#unit_add_btn").addClass('d-none');
        $('#stock_godown').val('').data('godown_id', '');
        $('#stock_department').val('').data('dept_id', '');
        $('#stock_section').val('').data("sec_id", '');

        if ($('#stock_part').val() != "") {
            $('#stock_part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_semi_auto.php",
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
                    $("#unit_add_btn").removeClass('d-none');
                    $("#search_stock_part").data('process_id', ui.item.process_id);
                    $("#search_stock_part").data('part_id', ui.item.id);
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
        $("#dep_add_btn").addClass("d-none");
        $("#sec_add_btn").addClass("d-none");
        $("#unit_add_btn").removeClass("d-none");

        //check the value not empty
        if ($('#stock_godown').val() != "") {

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
                        $("#unit_add_btn").addClass("d-none");
                        $("#dep_add_btn").removeClass("d-none");
                    }
                    console.log(ui.item.min, ui.item.max);


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
            insert_creditors1(unit);
        }
    })

    $("#dep_add_btn").on("click", function () {
        var go_id = $('#stock_godown').data("godown_id");
        var dept_name = $('#stock_department').val();
        if (go_id == undefined || dept_name == '') {
            salert('Warning', "Data Missing", "warning");
            return;
        }
        insert_department1(go_id, dept_name);
    })

    $('#stock_department').on('input', function () {
        console.log($("#stock_godown").data("godown_id"));

        $(this).data("dept_id", '');
        $('#stock_section').val('').data("sec_id", '');
        $("#sec_add_btn").addClass("d-none");
        $("#dep_add_btn").removeClass('d-none')

        //check the value not empty
        if ($('#stock_department').val() != "") {

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
                        $("#dep_add_btn").addClass('d-none')
                        $("#sec_add_btn").removeClass('d-none')
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
        insert_dep_section1(dept_id, sec_name);
    })

    $('#stock_section').on('input', function () {


        $(this).data("sec_id", '');
        $("#sec_add_btn").removeClass('d-none');

        //check the value not empty
        if ($('#stock_section').val() != "") {
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
                        $("#sec_add_btn").addClass('d-none')
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

        var process_id = $("#stock_part").data('process_id') || '';
        var part_id = $("#stock_part").data('part_id') || '';
        var godown = $("#stock_godown").data('godown_id') || '';
        var department = $("#stock_department").data('dept_id') || '';
        var section = $("#stock_section").data('sec_id') || '';
        var qty = $("#stock_qty").val() || 0;
        // var material_type = $("#material_type").val();

        // let stock_master = [];

        // if (godown && u_min != 0 && u_max != 0) {
        //     stock_master.push({
        //         store_type: "godown",
        //         store_id: godown,
        //         min_qty: u_min,
        //         max_qty: u_max
        //     });
        // }

        // if (department && d_min != 0 && d_max != 0) {
        //     stock_master.push({
        //         store_type: "dep",
        //         store_id: department,
        //         min_qty: d_min,
        //         max_qty: d_max
        //     });
        // }

        // if (section && s_min != 0 && s_max != 0) {
        //     stock_master.push({
        //         store_type: "sec",
        //         store_id: section,
        //         min_qty: s_min,
        //         max_qty: s_max
        //     });
        // }

        // let stock_master_json = JSON.stringify(stock_master);

        // console.log("Sending:", stock_master_json);

        if (!process_id || !godown || qty == '') {
            salert('Warning', "Please fill all fields", 'warning');
            return;
        }

        $(this).prop('disabled', true);
        insert_jaysan_physical_stock(part_id, process_id, godown, department, section, qty);
    });




    $('#search_stock_part').on('input', function () {
        //check the value not empty
        $('#search_stock_part').data({ "process_id": '', 'part_id': '' });
        if ($('#search_stock_part').val() != "") {
            $('#search_stock_part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_semi_auto.php",
                        type: "get", //send it through get method
                        data: {

                            part: $('#search_stock_part').val(),
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

            fetchStock();
            // get_jaysan_stock('', from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query);
        }
        else {
            // get_jaysan_stock();

        }
    });

     let enterPressed = false;

    $("#stock_tbady").on("focus", "span[contenteditable]", function () {
        // Store original value on focus
        $(this).data("original", $(this).text().trim());
        enterPressed = false;
    }).on("keydown", "span[contenteditable]", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            enterPressed = true;

            var part_id = $(this).data("part_id") || '';
            var process_id = $(this).data("process_id") || '';
            var godown = $(this).data("unit_id") || '';
            var department = $(this).data("dep_id") || '';
            var section = $(this).data("sec_id") || '';
            var qty = $(this).text().trim();

            console.log("part", part_id, "process_id", process_id, "godown", godown, "department", department, "section", section, "qty", qty);
            insert_jaysan_physical_stock(part_id, process_id, godown, department, section, qty);

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


function buildStockFilters() {
    return {
        godown: $("#search_stock_unit").data("godown_id") || '',
        department: $("#search_stock_dep").data("dept_id") || '',
        section: $("#search_stock_sec").data("sec_id") || '',
        part_id: $("#search_stock_part").data("part_id") || '',
        process_id: $("#search_stock_part").data("process_id") || ''
    };
}
function fetchStock() {
    const f = buildStockFilters();

    get_jaysan_physical_stock(
        f.process_id,
        f.godown,
        f.department,
        f.section,
        '',
        f.part_id,
        ''
    );
}


function insert_jaysan_physical_stock(part_id, process_id, godown, department, section, qty) {
    console.log("part" + part_id, "process_id"+ process_id, "godown" + godown, "department" + department, "section" + section, qty);


    $.ajax({
        url: "php/insert_jaysan_physical_stock.php",
        type: "post", //send it through get method
        data: {

            godown: godown,
            dep: department,
            sec: section,
            qty: qty,
            part_id: part_id,
            process_id: process_id,
            emp_id: current_user_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                get_jaysan_physical_stock('', '', '', '', '', '', '', '');
                $("#stock_part").val('');
                $("#stock_godown").val('');
                $("#stock_department").val('');
                $("#stock_section").val('');
                $("#stock_part").data('process_id', '');
                $("#stock_part").data('part_id', '');
                $("#stock_godown").data('godown_id', '');
                $("#stock_department").data('dep_id', '');
                $("#stock_section").data('sec_id', '');
                $("#stock_qty").val('');

                $("#unit_add_btn").addClass("d-none");

                $("#stock_insert_btn").prop("disabled", false);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function get_jaysan_physical_stock(process_id, godown, dep, sec, qty, part_id, emp_id) {
    console.log("fd " + godown, "td " + dep, "g " + sec, "d " + qty, "s " + part_id, "p " + emp_id);

    $.ajax({
        url: "php/get_jaysan_physical_stock.php",
        type: "get", //send it through get method
        data: {

            process_id: process_id,
            godown: godown,
            dep: dep,
            sec: sec,
            qty: qty,
            part_id: part_id,
            emp_id: emp_id,
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
                            unitTotals = JSON.parse(item.stock_details || "[]");
                        } catch (e) {
                            unitTotals = [];
                        }

                        // compute how many section-rows this item will produce (across all units & departments)
                        var itemRowSpan = 0;
                        unitTotals.forEach(function (u) {
                            if (Array.isArray(u.stock_details)) {
                                u.stock_details.forEach(function (d) {
                                    if (Array.isArray(d.stock_details)) {
                                        itemRowSpan += d.stock_details.length;
                                    }
                                });
                            }
                        });

                        console.log(itemRowSpan);

                        // if there are no unit/department/section details, still render one row for the part
                        if (itemRowSpan === 0) {
                            var trEmpty = `<tr style="${(count/2)== 0 ? 'background-color: #e7e7e7' : ''}">`;
                            trEmpty += `<td>${count}</td>`;
                            trEmpty += `<td>${item.part_name || ""} - ${item.qty} <span class='badge bg-danger'>${item.qty}</span>`;
                            trEmpty += `<td colspan="4">No unit/department/section data</td>`;
                            trEmpty += "</tr>";
                            $("#stock_tbady").append(trEmpty);
                            return;
                        }

                        // iterate units -> departments -> sections and build rows
                        unitTotals.forEach(function (unitObj, unitIndex) {
                            var unitName = unitObj.godown_name;
                            // compute unit rowspan = total sections inside this unit
                            var unitRowSpan = 0;
                            if (Array.isArray(unitObj.stock_details)) {
                                unitObj.stock_details.forEach(function (d) {
                                    if (Array.isArray(d.stock_details)) unitRowSpan += d.stock_details.length;
                                });
                            }

                            (unitObj.stock_details || []).forEach(function (depObj, depIndex) {
                                var depName = depObj.dep_name;
                                var sections = depObj.stock_details || [];
                                var unit_stock_qty = 0;
                                var dep_stock_qty = 0;

                                sections.forEach(function (secObj, secIndex) {
                                    var tr = `<tr class='text-center align-middle' style='font-size: 12px; ${(count%2)== 0 ? 'background-color: #e7e7e7' : ''}'>`;

                                    if (unitIndex === 0 && depIndex === 0 && secIndex === 0) {

                                        var total_stock = unitObj.qty ?? 0;

                                        tr += `<td rowspan="${itemRowSpan}">${count}</td>`;

                                        tr += `<td rowspan="${itemRowSpan}">${item.part_name || ""} (${item.qty})- <span class="border border-primary px-3 py-1 me-2 border-2 rounded-3" contenteditable    data-stock_id='${secObj.stock_id}' data-part_id='${item.part_id}'  data-process_id='${item.process_id}' >${total_stock}</span></td>`;
                                        // tr += `<td rowspan="${itemRowSpan}">Purchase</td>`;
                                    }
                                    if (depIndex === 0 && secIndex === 0) {
                                        let final_unit_qty = 0;

                                        unitObj.stock_details.forEach(depObj => {
                                            if (depObj.dep === null) {
                                                final_unit_qty = depObj.qty;
                                            }
                                        });

                                        if (unitName !== null) {
                                        tr += `<td rowspan="${unitRowSpan}"> ${unitName} (${unitObj.qty}) - <span contenteditable class="border border-primary px-3 py-1 me-2 border-2 rounded-3"   data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-process_id='${item.process_id}' data-unit_id='${unitObj.godown}'>${final_unit_qty}</span> </td>`;
                                        }
                                        else{
                                            tr += `<td rowspan="${unitRowSpan}">  ${unitName !== null ? unitName : "No-Godown"}</td>`;
                                        }
                                    }

                                    if (secIndex === 0) {
                                        let final_dep_qty = 0;
                                        var editt_span = '';

                                        depObj.stock_details.forEach(secObj => {
                                            if (secObj.sec === null) {
                                                final_dep_qty = secObj.qty;
                                            }
                                        });

                                        if (depName !== null) {
                                            editt_span = `(${depObj.qty}) -  <span contenteditable class="border border-primary px-3 py-1 me-2 border-2 rounded-3"  data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown}' data-dep_id='${depObj.dep}' data-process_id='${item.process_id}'>${final_dep_qty}</span>`
                                        } else {
                                            unit_stock_qty = depObj.department_qty;
                                        }
                                        tr += `<td rowspan="${sections.length}">  ${depName !== null ? depName : "No-Department"}${editt_span}</td>`;
                                    }

                                    // Section and Section_qty

                                    if (secObj.section === null) { dep_stock_qty = secObj.qty };

                                    tr += `<td> ${secObj.sec !== null ? secObj.sec_name : `No-section`}</td>`;

                                    tr += `<td class="border border-primary  border-2 rounded-3"><span contenteditable class='px-3 py-1' data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown}' data-dep_id='${depObj.dep}' data-sec_id='${secObj.sec}' data-process_id='${item.process_id}'>${secObj.qty != null ? secObj.qty : ""}</span></td>`;

                                    tr += "</tr>";
                                    $("#stock_tbady").append(tr);
                                });
                            });
                        });
                    });


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






function insert_creditors1(unit) {

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

function insert_department1(go_id, dept_name) {
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

function insert_dep_section1(dept_id, sec_name) {
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