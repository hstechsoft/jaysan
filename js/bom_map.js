
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {


    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });


    var allWeldingData = [];

    var processData = {
        process_id: "297",

    };


    var arr_obj = []
    arr_obj[1] = [];
    arr_obj[0] = [];
    arr_obj[1].push({
        godown_id: "1",
        dep_id: "1",
        dep_sec_id: "",
        dep_sec_machine_id: "",
        min_time: "",
        max_time: "",
        cost: ""

    });

    arr_obj[1].push({
        godown_id: "10",
        dep_id: "1",
        dep_sec_id: "",
        dep_sec_machine_id: "",
        min_time: "",
        max_time: "",
        cost: ""
    });

    allWeldingData.push({
        input_parts: arr_obj[0],
        process: processData,


    });

    processData = {
        process_id: "298",

    };
    allWeldingData.push({
        input_parts: arr_obj[1],
        process: processData,


    });

    console.log(allWeldingData);


    $.ajax({
        url: "php/ref_delete.php",
        type: "POST", //send it through get method
        data: {
            allWeldingData: JSON.stringify(allWeldingData),
        },
        success: function (response) {


            if (response.trim() != "error") {
                console.log(response);

                if (response.trim() != "0 result") {




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


    $('#bom_part_search').on('input', function () {

        $("#back").empty();
        $("#bom_list_table").addClass("d-none");
        $("#bom_process_table").addClass("d-none");
        $("#bom_material_table").addClass("d-none");
        $("#bom_process_summary_table").addClass("d-none");


        //check the value not empty
        if ($('#bom_part_search').val() != "") {
            $('#bom_part_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {

                            part: $("#bom_part_search").val(),
                            term: ""

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
                    get_bom_list(ui.item.id);
                    console.log(ui.item.id);



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $("#bom_list_table_body").on("click", "li", function () {
        var part_id = $(this).data("part_id");
        var component_cat = $(this).data("component_cat");
        if ($(this).data("process") == 1) {
            $("#back").append(`<li class="breadcrumb-item" data-part_id='${part_id}'><a href="#">${$('#bom_part_search').val()}</a></li>`);
            $("#bom_process_table_cardHeader").empty();
            get_process_graph(part_id, component_cat);
            get_process_summary(part_id, component_cat);
            get_bom(part_id, component_cat);
        }
    })


    $("#bom_material_table_body").on("click", "tr", function () {
        var part_id = $(this).data("part_id");
        if (part_id !== undefined) {

            $("#bom_list_table").addClass("d-none");
            $("#bom_process_table").addClass("d-none");
            $("#bom_material_table").addClass("d-none");
            $("#bom_process_summary_table").addClass("d-none");



            $("#bom_part_search").val($(this).find("td").eq(0).text());
            $("#bom_part_search").data("part_id", part_id);
            get_bom_list(part_id);

        }
    })


    $("#back").on("click", "li", function () {
        var part_id = $(this).data("part_id");
        if (part_id !== undefined) {



            $("#bom_list_table").addClass("d-none");
            $("#bom_process_table").addClass("d-none");
            $("#bom_material_table").addClass("d-none");
            $("#bom_process_summary_table").addClass("d-none");

            var index = $(this).nextAll().length;
            for (var i = 0; i <= index; i++) {
                $("#back").children().last().remove();
            }


            $("#bom_part_search").val($(this).text());
            $("#bom_part_search").data("part_id", part_id);
            get_bom_list(part_id);

        }
    })



});









function get_process_summary(part_id, component_cat) {
    $.ajax({
        url: "php/get_process_summary.php",
        type: "get",
        data: { part_id, component_cat },

        success: function (response) {

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#bom_process_summary_table").html(
                    `<div class="alert alert-warning">No Process Summary Found</div>`
                ).removeClass("d-none");
                return;
            }

            const data = JSON.parse(response);
            let html = `<div class="card shadow-sm p-1">`;
            let totalCost = 0;
            let totalMinTime = 0;
            let totalMaxTime = 0;
            let ex_pro_count = 0;

            data.forEach((p, index) => {

                const extraItems = JSON.parse(p.extra);

                totalCost += parseFloat(p.cost);
                totalMinTime += parseFloat(p.min_time);
                totalMaxTime += parseFloat(p.max_time);

                html += `
                    <div class="process-card shadow-sm rounded p-1 mb-2">

                        <!-- TITLE + EXTRA COUNT -->
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="process-title m-0">
                                <span class="step-index">${index + 1}.</span> ${p.process_name}
                            </h6>

                            <span class="badge bg-danger rounded-pill px-2 py-1">
                                ${p.process_extra_count}
                            </span>
                        </div>

                        <!-- COST + TIME -->
                        <div class="small mt-2">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="label">Cost <span class="value text-success fw-bold">₹${p.cost}</span></span>
                                
                                <span class="label">Time <span class="value text-primary fw-bold">${p.min_time} – ${p.max_time} mins</span></span>
                                
                            </div>


                            <div class="d-flex justify-content-between align-items-center">
                                <span class="label">Creditor <span class="value fw-semibold">${p.creditor_name}</span></span>

                                <button class="btn btn-sm btn-outline-primary toggle-details rounded-pill ms-2 px-3"
                                    data-target="#details-${index}">
                                    Details
                                </button>
                            </div>
                        </div>

                        <!-- HIDDEN DETAILS SECTION -->
                        <div id="details-${index}" class="details-box d-none mt-2 px-1 py-1 rounded shadow-sm">

                            <div class="fw-semibold text-secondary mb-0  text-center">Process Details</div>

                            <div class="detail-item"><b>Department:</b> ${p.dep_name}</div>
                            <div class="detail-item d-flex justify-content-between"><div><b>Section:</b> ${p.sec_name}</div><div> <b>Machine:</b> ${p.machine_name}</div></div>

                            <!-- EXTRA PROCESS -->
                            ${extraItems.length > 0 ? `
                            <div class="fw-semibold text-secondary mt-1  text-center">Extra Processes</div>
                            <ul class="list-group mt-0">
                                ${extraItems
                            .map(
                                ex => `
                                    <li class="list-group-item extra-item">
                                        <div class="fw-bold">${ex.creditor_name}</div>
                                        <small>${ex.dep_name} • ${ex.sec_name} • ${ex.machine_name} • <span class="text-primary fw-semibold">${ex.min_time}–${ex.max_time} mins</span> • <span class="text-success fw-bold ms-2">₹${ex.cost}</span></small>
                                    </li>`
                            )
                            .join("")}
                            </ul>
                            ` : ""}
                        </div>

                    </div>
                    `;
            });

            // TOTAL SUMMARY
            html += `
                <div class="total-summary-card mt-0 p-1 rounded shadow-sm">
                    <h6 class="fw-bold text-center text-primary mb-1">TOTAL SUMMARY</h6>

                    <div class="summary-row d-flex justify-content-between px-2">
                        <div class="summary-label text-secondary fw-semibold">Total Cost</div>
                        <div class="summary-value text-success fw-bold">₹${totalCost}</div>
                    </div>

                    <div class="summary-row d-flex justify-content-between px-2 mt-2">
                        <div class="summary-label text-secondary fw-semibold">Total Time</div>
                        <div class="summary-value text-primary fw-bold">${totalMinTime} – ${totalMaxTime} mins</div>
                    </div>
                </div>
            </div>`;


            $("#bom_process_summary_table").html(html).removeClass("d-none");

            // CLICK HANDLER FOR SHOW/HIDE DETAILS
            $(".toggle-details").on("click", function () {
                let target = $(this).data("target");
                $(target).toggleClass("d-none");
                $(this).text($(target).hasClass("d-none") ? "Show Details" : "Hide Details");
            });
        }
    });
}


function get_process_graph(part_id, component_cat) {
    $.ajax({
        url: "php/get_process_graph.php",
        type: "get", //send it through get method
        data: {
            part_id: part_id,
            component_cat: component_cat,


        },
        success: function (response) {


            console.log(response);

            if (response.trim() != "error") {
                $("#bom_process_table_cardHeader").text($("#bom_part_search").val() + " - " + component_cat + " process flow")

                $("#bom_process_table_body").empty();
                if (response.trim() != "0 result") {

                    $("#bom_process_table").removeClass("d-none");



                    const data = JSON.parse(response);
                    const container = document.getElementById("processFlow");
                    container.innerHTML = "";

                    const icons = ["⚙️", "🛠️", "🔩", "📦", "📐", "🧩", "🔧", "🧪"];
                    var prev_process_name = '';
                    data.forEach((p, i) => {

                        const step = document.createElement("div");
                        step.className = "flow-step";

                        // Prepare materials list
                        var parts = JSON.parse(p.parts);
                        let materialsHTML = "<ul>";
                        var m_count = 0;
                        parts.forEach(part => {
                            materialsHTML += `<li>${m_count + 1} • ${part.part_name !== null ? part.part_name : prev_process_name} - Qty: ${part.qty}</li>`
                            m_count++;
                        })


                        step.innerHTML = `
                            <div class="flow-step-header position-relative">

                                <div class="flow-title">STEP ${i + 1}</div>
                                <div class="flow-icon">${icons[i] || "⚙️"}</div>
                                <div class="flow-title">${p.process_name}</div>

                                <!-- TOP RIGHT ICON + COUNT -->
                                <div class="top-right-wrapper">
                                    <span class="extra-count badge bg-success">₹${p.cost !== null ? p.cost : 0}</span>
                                    <span class="extra-count badge bg-secondary d-flex"><i class="fa fa-clock"></i>${p.max_time !== null ? p.max_time : 0} mins</span>
                                </div>

                            </div>

                            <div class="accordion-body">
                                <div class="flow-materials">${materialsHTML}</div>
                            </div>
                        `;

                        prev_process_name = `<b class='text-primary'>${p.process_name}</b>`;

                        container.appendChild(step);

                        // Accordion toggle
                        step.querySelector(".flow-step-header").onclick = () => {

                            const body = step.querySelector(".accordion-body");

                            const isOpen = body.classList.contains("open");

                            // Close all
                            document.querySelectorAll(".accordion-body").forEach(b => {
                                b.classList.remove("open");
                                b.style.maxHeight = 0;
                            });

                            // Toggle
                            if (!isOpen) {
                                document.querySelectorAll(".accordion-body").forEach(b => {
                                    b.classList.add("open");
                                    b.style.maxHeight = b.scrollHeight + "px";
                                });
                            }
                        };

                    });








                    var obj = JSON.parse(response);


                    console.log(response);




                    //    get_sales_order()
                }
                else {
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


function get_bom(part_id, component_cat) {
    $.ajax({
        url: "php/get_bom.php",
        type: "get",
        data: {

            part_id: part_id,
            component_cat: component_cat,
        },

        success: function (response) {

            $("#bom_material_table_body").empty();

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#bom_material_table_body").append("<tr><td>No BOM Material</td></tr>")

                return;
            }

            $("#bom_material_table").removeClass("d-none");

            var obj = JSON.parse(response);

            var materials = '';
            var count = 0;
            obj.forEach(function (pr) {
                count += 1;
                if (pr.process_availble != null) {
                    materials += `<tr data-part_id='${pr.part_id}'><td  class='table-success'>${pr.part_name}</td><td>${pr.qty}</td></tr>`
                } else {
                    materials += `<tr><td>${pr.part_name}</td><td>${pr.qty}</td></tr>`
                }
            });
            $("#m_count").text(count);
            $("#bom_material_table_body").append(`${materials}`);


        },

        error: function () {
            salert("Error", "Network issue", "error");
        }
    });
}



function get_bom_list(part) {
    console.log(part);

    $.ajax({
        url: "php/get_bom_list.php",
        type: "get",
        data: { part_id: part },

        success: function (response) {

            $("#bom_list_table_body").empty();

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#bom_list_table").removeClass("d-none");
                $("#bom_list_table_body").append(
                    "<li class='list-group-item text-muted'>No BOM List</li>"
                );
                $("#collapseOne").collapse("show");
                return;
            }

            var list = JSON.parse(response);

            $("#bom_list_table").removeClass("d-none");

            list.forEach(item => {
                const html = `
                    <li class="list-group-item d-flex justify-content-between align-items-center"
                        ${item.process !== null ?
                        `data-part_id="${item.part_id}" data-process="1" data-component_cat="${item.component_cat}"`
                        : ""}>

                        <span>
                            ${item.component_cat}
                            ${item.process !== null
                        ? `<span class="status-dot bg-success"></span>`
                        : ``}
                        </span>

                    </li>`;
                $("#bom_list_table_body").append(html);
                if (item.process !== null) {
                    
                    $("#bom_list_table_body").find("li").trigger("click")

                }
            });

            $("#collapseOne").collapse("show");
            $(".accordion-button").removeClass("collapsed");
        },

        error: function () {
            salert("Error", "Network issue", "error");
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