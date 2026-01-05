
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {


    $(".page-wrapper :input:visible:not([disabled]):not([readonly]):first").focus();
    $(document).on("keydown", ".page-wrapper :input:visible:not([disabled]):not([readonly])", function (e) {

        const inputs = $(".page-wrapper :input:visible:not([disabled]):not([readonly])");
        const index = inputs.index(this);



        if (e.ctrlKey && e.key.toLowerCase() === "a") {
            e.preventDefault();

            const current = inputs.eq(index);
            if (current.is("button")) {
                current.click();
                alert("BUtton clicked")
            }
            return;
        }


        if (e.key === "Enter") {
            e.preventDefault();

            const next = inputs.eq(index + 1);
            if (!next.length) return;

            next.focus();


            if (next.is("select")) {

                next[0].dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "Alt",
                        key: "ArrowDown",
                        bubbles: true
                    })
                );

            }


            if (next.is("button")) {

                if (next.attr("id") === "cus_type_modal") {
                    next.trigger("click");


                    setTimeout(() => {
                        $("#staticBackdrop")
                            .find(":input:visible:not([disabled]):not([readonly]):first")
                            .focus();
                    }, 200);
                }
                else {
                    next.trigger("click");
                }
            }
        }



        if (e.key === "Escape") {
            e.preventDefault();

            const prev = inputs.eq(index - 1);
            if (!prev.length) return;

            prev.focus();

            if (prev.is("select")) {
                setTimeout(() => {
                    prev[0].dispatchEvent(
                        new KeyboardEvent("keydown", {
                            key: "ArrowDown",
                            bubbles: true
                        })
                    );
                }, 50);
            }
        }

    }
    );





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

    get_jaysan_final_product();

    $("#product").on("change", function () {
        get_jaysan_final_productmodel();
    })

    $("#product_model").on("change", function () {
        get_jaysan_final_producttype();
    })

    $("#product_sub_model").on("change", function () {

        get_jaysan_model_subtype();
    })

    $("#product_price_submit_btn").on("click", function () {
        $("#product_type_table_next").removeClass("d-none");
        $("#customer_type_table_next").removeClass("d-none");
        $("#customer_type_view").removeClass("d-none");
        $("#product_type_table").addClass("d-none");
        $("#product_base_price").prop("disabled", true);
        $("#product_base_min_price").prop("disabled", true);
        $("#product_base_max_price").prop("disabled", true);
    })

    $("#customer_type_create_btn").on("click", function () {
        $(this).prop('disabled', true).addClass("d-none");
        $("#customer_Sub_type").removeClass("d-none");
        $("#customer_type_table_next").removeClass("d-none");
        $("#product_type_table").addClass("d-none");
        $("#submit_btn").removeClass("d-none");
    })

    $("#demo").on("click", "tr td", function (event) {
        event.preventDefault();
        // TODO: handle click here

        $(this).addClass("border border-1 border-danger")
    });

    $("#customer_type_table_next").on("click", ".accordion-head", function () {
        const bodyRows = $(this).siblings(".accordion-body");
        const icon = $(this).find("i");

        bodyRows.toggleClass("d-none");
        // $(".accordion-body").toggleClass("d-none");

        icon.toggleClass("fa-chevron-down fa-chevron-up");
    });
    $("#product_type_table_next").on("click", ".accordion-head", function () {
        // const bodyRows = $(this).siblings(".accordion-body");
        const icon = $(this).find("i");

        // bodyRows.toggleClass("d-none");
        $("#product_type_table_next").find(".accordion-body").toggleClass("d-none");

        icon.toggleClass("fa-chevron-down fa-chevron-up");
    });

});











function get_jaysan_final_product() {


    $.ajax({
        url: "php/get_jaysan_final_product.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {

            $('#product').empty()
            $('#product').append("<option value='null' selected disabled>Choose Options...</option>")
            if (response.trim() != "error") {
                console.log(response);

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#product').append("<option  value = '" + obj.product_id + "'>" + obj.product_name + "</option>")

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

function get_jaysan_final_productmodel() {

    console.log($('#product').val());

    $.ajax({
        url: "php/get_jaysan_final_productmodel.php",
        type: "get", //send it through get method
        data: {
            product_id: $('#product').val()


        },
        success: function (response) {
            $('#product_model').removeAttr('disabled')
            $('#product_model').empty()
            $('#product_model').append("<option value='null' selected disabled>Choose Options...</option>")
            console.log(response);

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#product_model').append("<option value = '" + obj.model_id + "'>" + obj.model_name + "</option>")

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

function get_jaysan_final_producttype() {

    $.ajax({
        url: "php/get_jaysan_final_producttype.php",
        type: "get", //send it through get method
        data: {
            model_id: $('#product_model').val()


        },
        success: function (response) {
            $('#product_sub_model').removeAttr('disabled')
            $('#product_sub_model').empty()
            $('#product_sub_model').append("<option value='null' selected disabled>Choose Options...</option>")
            console.log(response);

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#product_sub_model').append("<option value = '" + obj.mtid + "'>" + obj.type_name + "</option>")

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

function get_jaysan_model_subtype() {


    $.ajax({
        url: "php/get_jaysan_model_subtype1.php",
        type: "get", //send it through get method
        data: {
            mtid: $('#product_sub_model').val()

        },
        success: function (response) {
            console.log(response);
            $('#product_type_tbody').empty()
            $('#product_type_table').removeClass('d-none')
            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0

                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#product_type_tbody').append(`<tr data-mtid='${obj.mtid}'>

                                    <td>${count}</td>
                                    <td>${obj.subtype_name}</td>
                                    <td>
                                        <input type="number" class="form-control rounded-3" id="price_variation"
                                        placeholder="Base Price">
                                    </td>
                                    <td>
                                        <select class="form-select" id="product_type">
                                            <option selected disabled value="null">Choose...</option>
                                            <option value="+">+</option>
                                            <option value="-">-</option>
                                        </select>
                                    </td>

                                </tr>`)

                        $("#product_type_ttbody").append(`<tr data-mtid='${obj.mtid}'>

                                    <td>${count}</td>
                                    <td>${obj.subtype_name}</td>
                                    <td class="accordion-head" style="cursor:pointer;">
                                        <input type="number" class="form-control rounded-3" id="price_variation"
                                        placeholder="Base Price">
                                    </td>
                                    <td  class="accordion-body d-none">
                                        <input type="number" class="form-control rounded-3" id="price_variation"
                                        placeholder=" Price">
                                    </td>
                                    <td  class="accordion-body d-none">
                                        <input type="number" class="form-control rounded-3" id="price_variation"
                                        placeholder=" Price">
                                    </td>
                                    <td  class="accordion-body d-none">
                                        <input type="number" class="form-control rounded-3" id="price_variation"
                                        placeholder=" Price">
                                    </td>

                                </tr>`)
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