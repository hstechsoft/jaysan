
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];
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
    get_jaysan_subtype_link(0, 0, 0);

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#part_name').on('input', function () {
        //check the value not empty
        $(this).data("part_id", '');
        $('#product').val('').trigger("change");

        if ($('#part_name').val() != "") {
            $('#part_name').autocomplete({
                //get data from database return as array of object which contain label,value
                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {
                            term: "name",
                            part: request.term,
                            godwon_id: '',
                            department_id: '',
                            section_id: '',
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name + "-" + item.part_no,
                                    value: item.part_name,
                                    id: item.part_id,
                                    part_no: item.part_no
                                };
                            }));
                        }
                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {
                    $(this).data("part_id", ui.item.id);
                    console.log(ui.item.id)

                    if (ui.item.id > 0) {
                        get_jaysan_final_product1();
                    }

                },
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
        }
    });

    $('#product').change(function () {
        get_jaysan_final_productmodel1();
        $('#ptype').val('')
        $('#sub_type_div').empty()
        $('#product_sub_type_card').addClass('d-none')
    });
    $('#pmodel').change(function () {
        get_jaysan_final_producttype1()
        $('#sub_type_div').empty()
        $('#product_sub_type_card').addClass('d-none')
    });

    $('#ptype').change(function () {
        get_jaysan_model_subtype1();
    });

    $("#map_btn").on("click", function () {

        var part_id = $("#part_name").data("part_id");
        var msid = [];

        $("#sub_type_div input:checked").each(function () {

            var msiddd = Number($(this).val());

            if (msiddd > 0) {
                msid.push(msiddd);
            }

        });

        if (part_id && msid.length > 0) {

            insert_jaysan_subtype_link(part_id, JSON.stringify(msid));

        } else {

            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please select at least one product subtype."
            });

        }

    });

    $("#filter_btn").on("click", function () {

        var product_id = $('#product').val() || 0;
        var model_id = $('#pmodel').val() || 0;
        var type_id = $('#ptype').val() || 0;

        if (product_id > 0 || model_id > 0 || type_id > 0) {
            get_jaysan_subtype_link(product_id, model_id, type_id);
        }
        else {
            salert("Warning", "Atleast Select Product, Model Or Type.", "warning");
        }
    })

    $("#mapped_tbody").on("click", "tr .delete_map_btn", function () {

        var part_id = $(this).val();

        if (Number(part_id) > 0) {

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to recover this data!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, Delete it!"
            }).then((result) => {

                if (result.isConfirmed) {
                    delete_jaysan_subtype_pro(part_id);
                }

            });

        }

    });

    $("#mapped_tbody").on("click", "tr .delete_btn", function () {

        var link_id = $(this).val();

        if (Number(link_id) > 0) {

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to recover this data!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, Delete it!"
            }).then((result) => {

                if (result.isConfirmed) {
                    delete_jaysan_subtype_link(link_id);
                }

            });

        }
    })

});



function get_jaysan_subtype_link(product_id, model_id, type_id) {

    console.log(product_id, model_id, type_id);


    $.ajax({
        url: "php/get_jaysan_subtype_link.php",
        type: "post", //send it through get method
        data: {

            product_id: product_id,
            model_id: model_id,
            type_id: type_id


        },
        success: function (response) {
            //console.log

            $('#mapped_tbody').empty();

            if (response.trim() !== "error") {

                if (response.trim() !== "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (items) {

                        count++;

                        var sub_type = JSON.parse(items.sub_type);
                        var sub_types = "";

                        sub_type.forEach(function (subtypes) {
                            sub_types += `
                                <li class="list-group-item p-1">
                                    ${subtypes.subtype_name} <button class="btn btn-outline-danger btn-sm float-end delete_btn"
                                                value="${subtypes.link_id}">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                </li>`;
                        });

                        $('#mapped_tbody').append(`
                                <tr class="text-center align-middle">
                                    <td>${count}</td>

                                    <td>${items.part_name}</td>

                                    <td>
                                        <strong>${items.product_name}</strong><br>
                                        <div class="d-flex justify-content-center gap-2">
                                            <span class="badge bg-warning text-dark">${items.model_name}</span>
                                            <span class="badge bg-info text-dark">${items.type_name}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <ul class="list-group list-group-flush">
                                            ${sub_types}
                                        </ul>
                                    </td>

                                    <td class="text-center">
                                        <button class="btn btn-outline-danger btn-sm delete_map_btn"
                                                value="${items.part_id}">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `);

                    });

                }
                else {
                    $('#mapped_tbody').append(`<tr><td colspan="5" class="text-center text-danger">No Data Found</td></tr>`);
                }

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_jaysan_subtype_link(part_id, msid) {
    console.log(part_id, msid);

    $.ajax({
        url: "php/insert_jaysan_subtype_link.php",
        type: "post", //send it through get method
        data: {

            part_id: part_id,
            msid: msid,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                location.reload()
            }
            else {
                salert("Warning", response, "warning");
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function delete_jaysan_subtype_link(link_id) {
    console.log(link_id);

    $.ajax({
        url: "php/delete_jaysan_subtype_link.php",
        type: "get", //send it through get method
        data: {

            link_id: link_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                location.reload()
            }
            else {
                salert("Warning", response, "warning");
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function delete_jaysan_subtype_pro(part_id) {
    console.log(part_id);

    $.ajax({
        url: "php/delete_jaysan_subtype_pro.php",
        type: "get", //send it through get method
        data: {

            part_id: part_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                location.reload()
            }
            else {
                salert("Warning", response, "warning");
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_jaysan_model_subtype1() {

    console.log($('#ptype').val(), $('#ptype').data("cus_type_id"));


    $.ajax({
        url: "php/get_jaysan_model_subtype_sale.php",
        type: "get", //send it through get method
        data: {
            mtid: $('#ptype').val(),
            subgroup_id: $('#ptype').data("cus_type_id") || '0'


        },
        success: function (response) {
            //console.log

            $('#sub_type_div').empty();
            $('#product_sub_type_card').removeClass('d-none');

            if (response.trim() !== "error") {

                if (response.trim() !== "0 result") {

                    var obj = JSON.parse(response);
                    var app_html = "";

                    obj.forEach(function (section) {
                        var price_details = JSON.parse(section.price_details) || [];

                        // ================= Additional Features (Checkbox) =================
                        if (section.sec_name === null) {

                            var app_nhtml = "";

                            price_details.forEach(function (item) {

                                app_nhtml += `
                                    <div class="form-check mb-2">
                                        <input
                                            class="form-check-input sub_type_chk"
                                            type="checkbox"
                                            id="chk_${item.msid}"
                                            value="${item.msid}"
                                            data-price="${item.price}"
                                            data-discount="${item.discount}"
                                            data-is_reduce="${item.is_reduce}"
                                            ${item.is_default == 1 ? "checked" : ""}
                                        >

                                        <label class="form-check-label w-100 d-flex justify-content-between align-items-center flex-wrap"
                                            for="chk_${item.msid}">
                                            <span>${item.subtype_name}</span>

                                            ${Number(item.discount) > 0
                                        ? `<span class="badge bg-danger ms-2">${item.discount}/- Offer</span>`
                                        : ""
                                    }
                                        </label>
                                    </div>
                                `;

                            });

                            app_html += `
                                <div class="col-12 col-lg-6 col-xl-6  text-center align-middle">
                                    <fieldset class="boxborder bg-light h-100">
                                        <legend>Additional Features</legend>
                                        ${app_nhtml}
                                    </fieldset>
                                </div>
                            `;

                        }

                        // ================= Section Wise Radio Buttons =================
                        else {

                            var chk = "";

                            price_details.forEach(function (item) {

                                chk += `
                                    <div class="form-check mb-2">

                                        <input
                                            class="form-check-input sub_type_chk"
                                            type="radio"
                                            name="${section.sec_name}"
                                            id="chk_${item.msid}"
                                            value="${item.msid}"
                                            data-price="${item.price}"
                                            data-discount="${item.discount}"
                                            data-is_reduce="${item.is_reduce}"
                                            ${item.is_default == 1 ? "checked" : ""}
                                        >

                                        <label class="form-check-label w-100 d-flex justify-content-between align-items-center flex-wrap"
                                            for="chk_${item.msid}">

                                            <span>${item.subtype_name}</span>

                                            ${Number(item.discount) > 0
                                        ? `<span class="badge bg-danger ms-2">${item.discount}/- Offer</span>`
                                        : ""
                                    }

                                        </label>

                                    </div>
                                `;

                            });

                            app_html += `
                                <div class="col-12 col-lg-6 col-xl-6 text-center align-middle">
                                    <fieldset class="boxborder h-100">
                                        <legend>${section.sec_name}</legend>
                                        ${chk}
                                    </fieldset>
                                </div>
                            `;
                        }

                    });

                    $('#sub_type_div').append(app_html);

                    $('#sub_type_div input[type="checkbox"]').prop('disabled', false);

                }

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function get_jaysan_final_productmodel1() {

    //console.log$('#product').val());

    $.ajax({
        url: "php/get_jaysan_final_productmodel.php",
        type: "get", //send it through get method
        data: {
            product_id: $('#product').val()


        },
        success: function (response) {
            $('#pmodel').removeAttr('disabled')
            $('#pmodel').empty()
            $('#pmodel').append("<option value='' selected disabled>Choose Options...</option>")
            //console.log

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#pmodel').append("<option value = '" + obj.model_id + "'>" + obj.model_name + "</option>")

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

function get_jaysan_final_producttype1() {

    $.ajax({
        url: "php/get_jaysan_final_producttype.php",
        type: "get", //send it through get method
        data: {
            model_id: $('#pmodel').val()


        },
        success: function (response) {
            $('#ptype').removeAttr('disabled')
            $('#ptype').empty()
            $('#ptype').append("<option value='' selected disabled>Choose Options...</option>")
            //console.log

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#ptype').append("<option value = '" + obj.mtid + "'>" + obj.type_name + "</option>")

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


function get_jaysan_final_product1() {


    $.ajax({
        url: "php/get_jaysan_final_product.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {

            $('#product').empty()
            $('#product').append("<option value='' selected disabled>Choose Options...</option>")
            if (response.trim() != "error") {
                //console.log

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