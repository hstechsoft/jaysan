
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

    get_bomlist_correction('not_done');

    $("#bom_finished_list").on("change", function () {
        if ($(this).is(":checked")) {
            get_bomlist_correction('');
        } else {
            get_bomlist_correction('not_done');
        }
    })

    $("#multiple_bom_list_tbody").on("click", ".link-bom-btn", function () {

        const row = $(this).closest("tr");
        const part_id = row.data("part_id");

        let selectedBom = [];

        row.find("input[type='checkbox']:checked").each(function () {
            selectedBom.push($(this).val());
        });

        selectedBom = selectedBom.join(",");

        if (!selectedBom) {
            salert("Warning", "Please select a BOM", "warning");
            return;
        }

        console.log("Part:", part_id, "BOM:", selectedBom);
        update_bomlist(part_id, selectedBom);
    });


});






function update_bomlist(part_id, bom_id) {
    console.log( part_id, bom_id);

    $.ajax({
        url: "php/update_bomlist.php",
        type: "post", //send it through get method
        data: {
            part_id: part_id,
            bom_id: bom_id,


        },
        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {
                get_bomlist_correction("not_done")
                $("#bom_finished_list").prop("checked", false)
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

function get_bomlist_correction(cat) {
    $.ajax({
        url: "php/get_bomlist_correction.php",
        type: "get", //send it through get method
        data: {
            cat: cat,


        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#multiple_bom_list_tbody").empty();
                if (response.trim() !== "0 result") {

                    const data = JSON.parse(response);
                    let count = 0;

                    $("#multiple_bom_list_tbody").empty();

                    data.forEach(function (row) {

                        count++;

                        const bomDetails = JSON.parse(
                            row["JSON_ARRAYAGG(JSON_OBJECT('bom_id',bom_id,'component_cat',component_cat,'is_default',is_default))"]
                        );

                        let bomList = `<ul class="list-group">`;

                        bomDetails.forEach(function (item, index) {

                            const radioId = `bom_${row.part_id}_${item.bom_id}`;

                            bomList += `
                                    <li class="list-group-item">
                                        <div class="form-check">
                                            <input
                                                class="form-check-input default-bom-radio"
                                                type="checkbox"
                                                name="bom_${row.part_id}"
                                                value="${item.bom_id}"
                                                id="${radioId}"
                                                ${item.is_default == 1 ? "checked" : ""}
                                            >
                                            <label class="form-check-label" for="${radioId}">
                                                ${item.component_cat}
                                            </label>
                                        </div>
                                    </li>
                                `;
                        });

                        bomList += `</ul>`;

                        $("#multiple_bom_list_tbody").append(`
                                <tr data-part_id="${row.part_id}">
                                    <td>${count}</td>
                                    <td>${row.part_name}</td>
                                    <td>${bomList}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary link-bom-btn">
                                            <i class="fa-solid fa-link me-1"></i> Submit
                                        </button>
                                    </td>
                                </tr>
                            `);
                    });
                }



                else {
                    $("#multiple_bom_list_tbody").append(`<tr><td colspan='4' class='text-center text-danger'>No BOM available</td></tr>`)
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