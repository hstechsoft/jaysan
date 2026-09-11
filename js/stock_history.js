
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


    $("#stock_history_search").on("keyup", function () {
        const value = $(this).val().toLowerCase();

        $("#stock_history_tbody tr").each(function () {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.indexOf(value) !== -1);
        });
    });


    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    get_stock_log();
    get_jaysan_stock_report('', '', '', '', '');

    $('#godown').on('input', function () {

        $(this).removeData("godown_id");

        $('#department').val('').removeData("dept_id");
        $('#section').val('').removeData("sec_id");

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

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#department').on('input', function () {

        $(this).removeData("dept_id");
        $('#section').val('').removeData("sec_id");

        //check the value not empty
        if ($('#department').val() != "") {
            $('#department').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            godown_id: $("#godown").data("godown_id")

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

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#section').on('input', function () {

        $(this).removeData("sec_id");

        //check the value not empty
        if ($('#section').val() != "") {
            $('#section').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            dep_id: $("#department").data("dept_id"),
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

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#part_name').on('input', function () {
        //check the value not empty

        $(this).removeData("process_id");
        $(this).removeData("part_id");

        if ($('#part_name').val() != "") {
            $('#part_name').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_semi_auto.php",
                        type: "get", //send it through get method
                        data: {

                            part: $('#part_name').val(),
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


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#part_search').on('input', function () {
        //check the value not empty
        $(this).data("part_id", "");
        if ($('#part_search').val() != "") {
            $('#part_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/mrf_partname_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            part_name: request.term,

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

    $('#part_search').on("change", function () {
        alert("c")
        if ($(this).data('part_id') != '') {
            alert()
            get_stock_log($(this).data("part_id"))
        }
    })


    $('#emp_search').on('input', function () {
        //check the value not empty
        $(this).data("emp_id", "");
        if ($('#emp_search').val() != "") {
            $('#emp_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_emp_auto.php",
                        type: "get", //send it through get method
                        data: {

                            emp_name: $('#emp_search').val(),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.emp_name,
                                    value: item.emp_name,
                                    id: item.emp_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("emp_id", ui.item.id);
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

    $('#emp_search').on("change", function () {
        if ($(this).data('part_id') != '') {
            get_stock_log($(this).data("part_id"))
        }
    })

    $("#excel_bnt").on("click", function () {

        let csv = [];
        $(".table tr").each(function () {
            let row = [];
            $(this).find("th, td").each(function () {
                row.push(`"${$(this).text().trim()}"`);
            });
            csv.push(row.join(","));
        });

        if (csv.length <= 1) {
            alert("No data to export");
            return;
        }

        const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
        const downloadLink = document.createElement("a");

        downloadLink.download = "stock_history.csv";
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    $("#filter_btn").on("click", function () {

        var godown = $("#godown").data("godown_id") || '';
        var dep = $("#department").data("dept_id") || '';
        var sec = $("#section").data("sec_id") || '';

        var part_id = $("#part_name").data("part_id") || '';

        var process_id = $("#part_name").data("process_id") || '';

        if (godown == '' && part_id == '' && process_id == '') {

            salert("Warning", "Select Atleast One Field.", "warning");

            return;
        }

        get_jaysan_stock_report(godown, dep, sec, part_id, process_id)
    })

    $("#opening_qty").on("keydown", function (e) {

        if (e.key !== "Enter") {
            return;
        }

        e.preventDefault();

        var godown = $("#godown").data("godown_id") || '';
        var dep = $("#department").data("dept_id") || '';
        var sec = $("#section").data("sec_id") || '';

        var manual_part_id = $("#part_name").data("part_id") || '';

        var process_id = $("#part_name").data("process_id") || '';

        var qty = parseFloat($(this).val()) || 0;


        if (godown == '' || qty <= 0) {

            salert("Warning", "Select Godown and Qty must be greater than 0.", "warning");

            return;
        }

        if (manual_part_id == '' && process_id == '') {

            salert("Warning", "Select the Part.", "warning");

            return;
        }

        update_manual_stock(godown, dep, sec, process_id, qty, manual_part_id);

    });

});





function get_jaysan_stock_report(godown, dep, sec, part_id, process_id) {
    console.log(godown, dep, sec, part_id, process_id);
    
    $.ajax({
        url: "php/get_jaysan_stock_report.php",
        type: "get",
        data: {
            godown: godown,
            dep: dep,
            sec: sec,
            part_id: part_id,
            process_id: process_id
        },
        success: function (response) {

            console.log(response);
            

            if (response.trim() !== "error") {
                $("#stock_dashboard_tboady").empty();
                if (response.trim() !== "0 result") {

                    const data = JSON.parse(response);

                    $("#stock_dashboard_tboady").empty();

                    data.forEach(function (row, index) {

                        let stock_details = "";
                        let stock_details_json = [];

                        try {
                            stock_details_json = row.stock_details
                                ? JSON.parse(row.stock_details)
                                : [];
                        } catch (e) {
                            console.error("Invalid stock_details JSON:", e);
                            stock_details_json = [];
                        }

                        if (stock_details_json.length > 0) {

                            const accordionId = `stockAccordion_${index}`;

                            stock_details += `<div class="accordion" id="${accordionId}">`;

                            stock_details_json.forEach(function (item, stockIndex) {

                                const collapseId = `stockCollapse_${index}_${stockIndex}`;
                                const headingId = `stockHeading_${index}_${stockIndex}`;

                                let stock_log = "";

                                if (item.stock_log !== null && item.stock_log !== "") {

                                    try {

                                        let stock_log_json = item.stock_log;

                                        if (Array.isArray(stock_log_json) && stock_log_json.length > 0) {

                                            stock_log += `
                                                <div class="mb-3">
                                                    <div class="fw-bold mb-2">
                                                        <i class="bi bi-clock-history"></i>
                                                        Stock Log
                                                    </div>

                                                    <ul class="list-group">
                                            `;

                                            stock_log_json.forEach(function (sdj) {

                                                stock_log += `
                                                    <li class="list-group-item">

                                                        <div class="d-flex justify-content-between align-items-start flex-wrap">

                                                            <div>
                                                                <span class="fw-semibold">
                                                                    ${sdj.dated ?? ""}
                                                                </span>

                                                                <span class="mx-2 badge bg-secondary">
                                                                    ${sdj.update_type ?? ""}
                                                                </span>

                                                                <span>
                                                                    ${sdj.remark ?? ""}
                                                                </span>
                                                            </div>

                                                            <div class="mt-1">

                                                                <span
                                                                    class="mx-1 badge bg-success"
                                                                    title="Updated Qty">
                                                                    Updated: ${sdj.new_qty ?? 0}
                                                                </span>

                                                                <span
                                                                    class="mx-1 badge bg-warning text-dark"
                                                                    title="Old Qty">
                                                                    Old: ${sdj.old_qty ?? 0}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </li>
                                                `;
                                            });

                                            stock_log += `</ul></div>`;
                                        }

                                    } catch (e) {
                                        console.error("Invalid stock_log JSON:", e);
                                    }
                                }


                                let reserve_details = "";

                                if (
                                    item.reserve_details !== null &&
                                    item.reserve_details !== ""
                                ) {

                                    try {

                                        let reserve_details_json = item.reserve_details;

                                        if (
                                            Array.isArray(reserve_details_json) &&
                                            reserve_details_json.length > 0
                                        ) {

                                            reserve_details += `
                                                <div class="mb-3">

                                                    <div class="fw-bold mb-2">
                                                        <i class="bi bi-bookmark-check"></i>
                                                        Reserved Stock
                                                    </div>

                                                    <ul class="list-group">
                                            `;

                                            reserve_details_json.forEach(function (rdj) {

                                                let reserve_details1 = [];

                                                try {
                                                    reserve_details1 = rdj.reserve_details;
                                                } catch (e) {
                                                    console.error(
                                                        "Invalid reserve_details JSON:",
                                                        e
                                                    );
                                                }

                                                if (Array.isArray(reserve_details1)) {

                                                    reserve_details1.forEach(function (obj) {

                                                        reserve_details += `
                                                            <li class="list-group-item">

                                                                <div class="d-flex justify-content-between align-items-center flex-wrap">

                                                                    <div>

                                                                        <span class="fw-semibold">
                                                                            ${obj.reserve_date ?? ""}
                                                                        </span>

                                                                        <span
                                                                            class="mx-2 badge bg-secondary"
                                                                            title="Reserved For">
                                                                            ${rdj.reserve_type ?? ""}
                                                                        </span>

                                                                        <span>
                                                                            ${obj.document_no ?? ""}
                                                                        </span>

                                                                    </div>

                                                                    <div class="mt-1">

                                                                        <span
                                                                            class="mx-1 badge bg-warning text-dark"
                                                                            title="Reserved Qty">
                                                                            Qty: ${obj.reserve_qty ?? 0}
                                                                        </span>

                                                                        <span
                                                                            class="mx-1 badge bg-primary"
                                                                            title="Reserved Status">
                                                                            ${obj.reserve_status ?? ""}
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </li>
                                                        `;

                                                    });
                                                }
                                            });

                                            reserve_details += `</ul></div>`;
                                        }

                                    } catch (e) {
                                        console.error(
                                            "Invalid reserve_details JSON:",
                                            e
                                        );
                                    }
                                }


                                let stock_location = `
                                    <div class="mb-3">

                                        <div class="fw-bold mb-2">
                                            <i class="bi bi-geo-alt"></i>
                                            Stock Location
                                        </div>

                                        <div class="border rounded p-2 bg-light">

                                            <div class="row g-2">

                                                <div class="col-md-6">

                                                    <strong>Location:</strong>

                                                    ${item.creditor_name ?? ""}

                                                    ${item.dep_name !== null
                                        ? " - " + item.dep_name
                                        : ""
                                    }

                                                    ${item.sec_name !== null
                                        ? " - " + item.sec_name
                                        : ""
                                    }

                                                </div>

                                                <div class="col-md-6">

                                                    <strong>Stock ID:</strong>
                                                    ${item.stock_id ?? ""}

                                                </div>

                                                <div class="col-md-4">

                                                    <span class="badge bg-primary">
                                                        Qty: ${item.qty ?? 0}
                                                    </span>

                                                </div>

                                                <div class="col-md-4">

                                                    <span class="badge bg-success">
                                                        Available: ${item.available_qty ?? 0}
                                                    </span>

                                                </div>

                                                <div class="col-md-4">

                                                    <span class="badge bg-warning text-dark">
                                                        Reserved: ${item.reserve_qty ?? 0}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                `;



                                stock_details += `

                                    <div class="accordion-item">

                                        <h2
                                            class="accordion-header"
                                            id="${headingId}">

                                            <button
                                                class="accordion-button "
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#${collapseId}"
                                                aria-expanded="false"
                                                aria-controls="${collapseId}">

                                                <div class="w-100">

                                                    <div class="d-flex justify-content-between align-items-center">

                                                        <span class="fw-semibold"> ${item.creditor_name ?? "Stock Location"}

                                                            ${item.dep_name !== null ? " - " + item.dep_name : ""}

                                                            ${item.sec_name !== null ? " - " + item.sec_name : ""}

                                                        </span>

                                                        <span class="me-2">

                                                            <span
                                                                class="badge bg-primary"
                                                                title="Quantity">
                                                                Qty: ${item.qty ?? 0}
                                                            </span>

                                                            <span
                                                                class="badge bg-success"
                                                                title="Available Quantity">
                                                                Available: ${item.available_qty ?? 0}
                                                            </span>

                                                            <span
                                                                class="badge bg-warning text-dark"
                                                                title="Reserved Quantity">
                                                                Reserved: ${item.reserve_qty ?? 0}
                                                            </span>

                                                        </span>

                                                    </div>

                                                </div>

                                            </button>

                                        </h2>

                                        <div
                                            id="${collapseId}"
                                            class="accordion-collapse collapse "
                                            aria-labelledby="${headingId}"
                                            data-bs-parent="#${accordionId}">

                                            <div class="accordion-body">

                                                ${stock_location}

                                                ${stock_log}

                                                ${reserve_details}

                                                ${stock_log === "" && reserve_details === "" ? ` <div class="text-muted"> No stock log or reserved stock details available. </div>` : ""}

                                            </div>

                                        </div>

                                    </div>

                                `;
                            });

                            stock_details += `</div>`;

                        } else {

                            stock_details = `
                                <span class="text-muted">
                                    No stock details available
                                </span>
                            `;
                        }


                        const tr = `
                            <tr>

                                <td>
                                    ${index + 1}
                                </td>

                                <td>
                                    ${row.rpart_name ?? ""}
                                </td>

                                <td>

                                    <span
                                        class="badge bg-success me-1"
                                        title="Available Qty">
                                        ${row.available_qty ?? 0}
                                    </span>

                                    <span
                                        class="badge bg-warning text-dark me-1"
                                        title="Reserved Qty">
                                        ${row.reserve_qty ?? 0}
                                    </span>

                                    <span
                                        class="badge bg-primary"
                                        title="Total Qty">
                                        ${row.qty ?? 0}
                                    </span>

                                </td>

                                <td colspan="3">

                                    ${stock_details}

                                </td>

                            </tr>
                        `;

                        $("#stock_dashboard_tboady").append(tr);

                    });

                }
            } else {
                $("#stock_dashboard_tboady").html(
                    "<tr><td colspan='9' class='text-center text-danger'>No records found</td></tr>"
                );
            }
        }
    });
}


function get_stock_log(part_id) {
    $.ajax({
        url: "php/get_stock_log.php",
        type: "get",
        data: {
            emp_query: "",
            part_query: part_id,
        },
        success: function (response) {

            if (response.trim() !== "error" && response.trim() !== "0 result") {

                const data = JSON.parse(response);
                $("#stock_history_tbody").empty(); // clear old rows

                data.forEach(function (row, index) {

                    const tr = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${row.part_name}</td>
                            <td>${row.dated}</td>
                            <td>${row.action_type}</td>
                            <td>${row.godown ?? "-"}</td>
                            <td>${row.dep_name ?? "-"}</td>
                            <td>${row.sec_name ?? "-"}</td>
                            <td>${row.old_qty ?? "-"} → ${row.new_qty}</td>
                            <td>${row.emp_name}</td>
                            <td>${row.remark}</td>
                        </tr>
                    `;

                    $("#stock_history_tbody").append(tr);
                });

            } else {
                $("#stock_history_tbody").html(
                    "<tr><td colspan='9' class='text-center text-danger'>No records found</td></tr>"
                );
            }
        }
    });
}

function update_manual_stock(godown, dep, sec, process_id, qty, manual_part_id) {
console.log(godown, dep, sec, process_id, qty, manual_part_id);

    $.ajax({
        url: "php/update_manual_stock.php",
        type: "post", //send it through get method
        data: {

            godown: godown,
            dep: dep,
            sec: sec,
            process_id: process_id,
            qty: qty,
            manual_part_id: manual_part_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                window.location.reload();
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
        get_stock_log();
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