
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {
    /* ---------------- FORM NAVIGATION ---------------- */

    const form = document.getElementById("agroForm");
    const formFields = Array.from(
        form.querySelectorAll(
            "input:not([type=hidden]):not([disabled]), select, textarea, button"
        )
    );

    let addBtnEnterCount = 0;
    let modalNextInput = null;
    let selectedFromModal = false;

    formFields.forEach((field, index) => {
        field.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();


                if (field.id === "add_quotation") {
                    addBtnEnterCount++;
                    if (addBtnEnterCount === 2) {
                        addBtnEnterCount = 0;
                        createRow();
                        focusFirstCell();
                    }
                    return;
                }

                const next = formFields[index + 1];
                if (next) next.focus();
            }

            if (e.key === "Escape") {
                e.preventDefault();
                const prev = formFields[index - 1];
                if (prev) prev.focus();
            }
        });
    });

    /* ---------------- TABLE LOGIC ---------------- */

    const tableBody = document.getElementById("quotation_body");

    let count = 1;

    function createRow() {
        const row = document.createElement("tr");

        for (let i = 0; i < 8; i++) {
            const td = document.createElement("td");


            if (i === 0) {
                td.textContent = count++;
                td.classList.add("text-center");
            }
            else if (i === 7) {
                td.textContent = "0.00";
            }
            else {
                const input = document.createElement("input");
                input.type = "text";
                input.className = "form-control table-input";

                if (i === 1) {
                    input.classList.add("quotation_part");
                }

                td.appendChild(input);
            }

            row.appendChild(td);
        }

        tableBody.appendChild(row);
        addTdNavigation(row);
        initPartAutocomplete(row);
    }


    function totalCalculation(row) {


        row = $(row);

        const qty = parseFloat(row.find("td").eq(2).find("input").val()) || 0;
        const discount = parseFloat(row.find("td").eq(5).find("input").val()) || 0;
        const rate = parseFloat(row.find("td").eq(6).find("input").val()) || 0;

        const total =
            (rate - (discount / 100 * rate)) * qty;


        row.find("td").last().text(total.toFixed(2));
    }



    function addTdNavigation(row) {
        const inputs = Array.from(row.querySelectorAll("input"));

        inputs.forEach((input, index) => {
            input.addEventListener("keydown", (e) => {

                // CTRL + A
                if (e.ctrlKey && e.key.toLowerCase() === "a") {
                    e.preventDefault();
                    insert();
                    return;
                }

                // ENTER
                if (e.key === "Enter") {
                    e.preventDefault();

                    const next = inputs[index + 1];

                    // PART COLUMN LOGIC
                    if (input.classList.contains("quotation_part")) {
                        const part = input.value.trim();

                        if (!part) {
                            salert("Warning", "Select the part", "warning");
                            return;
                        }

                        modalNextInput = next || null;
                        const modal = bootstrap.Modal.getOrCreateInstance(
                            document.getElementById("exampleModal")
                        );
                        modal.show();
                        return;
                    }

                    // NORMAL NAVIGATION
                    if (next) {
                        next.focus();
                    } else {
                        totalCalculation(row);

                        const nextRow = row.nextElementSibling;
                        if (nextRow) {
                            const nextInputs = nextRow.querySelectorAll("input");
                            if (nextInputs.length) nextInputs[0].focus();
                        } else {
                            createRow();
                            focusLastRowFirstCell();
                        }
                    }
                }

                // ESC
                if (e.key === "Escape") {
                    e.preventDefault();

                    if (index > 0) {
                        inputs[index - 1].focus();
                    } else {
                        const prevRow = row.previousElementSibling;
                        if (prevRow) {
                            const prevInputs = prevRow.querySelectorAll("input");
                            prevInputs[prevInputs.length - 1].focus();
                        }
                    }
                }
            });
        });
    }


    const modalEl = document.getElementById("exampleModal");

    modalEl.addEventListener("shown.bs.modal", () => {
        modalEl.querySelector(".list-group-item")?.focus();
    });

    document.getElementById("exampleModal").addEventListener("hidden.bs.modal", () => {
        if (selectedFromModal && modalNextInput) {
            modalNextInput.focus();
            modalNextInput = null;
            selectedFromModal = false;
        }
    });

    /* ---------------- MODAL KEYBOARD ---------------- */

    document.getElementById("godownList").addEventListener("keydown", (e) => {
        const items = [...document.querySelectorAll("#godownList .list-group-item")];
        const index = items.indexOf(document.activeElement);

        if (e.key === "ArrowDown" && index < items.length - 1) {
            e.preventDefault();
            items[index + 1].focus();
        }

        if (e.key === "ArrowUp" && index > 0) {
            e.preventDefault();
            items[index - 1].focus();
        }

        if (e.key === "Enter") {
            e.preventDefault();
            selectedFromModal = true;
            bootstrap.Modal.getInstance(modalEl).hide();
        }
    });



    function focusFirstCell() {
        const firstInput = tableBody.querySelector("input");
        if (firstInput) firstInput.focus();
    }

    function focusLastRowFirstCell() {
        const lastRow = tableBody.lastElementChild;
        if (lastRow) {
            lastRow.querySelector("input").focus();
        }
    }


    /* ---------------- INSERT FUNCTION ---------------- */

    function insert() {
        alert("Ctrl + A detected → insert() called");
    }

    function initPartAutocomplete(row) {
        $(row).find(".quotation_part").autocomplete({
            minLength: 2,
            cacheLength: 0,

            source: function (request, response) {
                $.ajax({
                    url: "php/get_part_name_auto1.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        part: request.term,
                        term: "part"
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.part_name,
                                value: item.part_name,
                                id: item.part_id
                            };
                        }));
                    }
                });
            },

            select: function (event, ui) {
                $(this).data("process_id", ui.item.id);
            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<div>" + item.label + "</div>")
                .appendTo(ul);
        };
    }


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





});





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