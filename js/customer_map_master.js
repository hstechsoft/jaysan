
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

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //         function (position) {
    //             console.log("Latitude:", position.coords.latitude);
    //             console.log("Longitude:", position.coords.longitude);
    //             console.log("Accuracy:", position.coords.accuracy + " meters");
    //             get_godown_locations(position.coords.latitude, position.coords.longitude)
    //         },
    //         function (error) {
    //             console.log(error.message);
    //         }
    //     );
    // } else {
    //     console.log("Geolocation is not supported.");
    // }

    // $("#excel_report_search").on("keyup", function () {
    //     var value = $(this).val().toLowerCase();

    //     $("#excel_need_material_tbody tr").filter(function () {
    //         $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    //     });
    // });

    check_login();

    get_dealer_map('', '');

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#customer_master').on('input', function () {
        //check the value not empty
        if ($('#customer_master').val() != "") {
            $('#customer_master').data("cus_mas_id", '');
            $('#customer_master').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/assign_product_customer_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            term: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.cus_name,
                                    value: item.cus_name,
                                    cus_id: item.cus_id,
                                    phone: item.cus_phone,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("cus_mas_id", ui.item.cus_id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style='font-size:12px;'><strong>" + item.label + "</strong> - " + item.phone + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#child_customer').on('input', function () {
        //check the value not empty
        if ($('#child_customer').val() != "") {
            $('#child_customer').data("cus_mas_id", '');
            $('#child_customer').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/assign_product_customer_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            term: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.cus_name,
                                    value: item.cus_name,
                                    cus_id: item.cus_id,
                                    phone: item.cus_phone,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("cus_mas_id", ui.item.cus_id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style='font-size:12px;'><strong>" + item.label + "</strong> - " + item.phone + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#parent_cus_search').on('input', function () {
        //check the value not empty
        if ($('#parent_cus_search').val() != "") {
            $('#parent_cus_search').data("cus_mas_id", '');
            $('#parent_cus_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/assign_product_customer_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            term: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.cus_name,
                                    value: item.cus_name,
                                    cus_id: item.cus_id,
                                    phone: item.cus_phone,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("cus_mas_id", ui.item.cus_id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)
                    get_dealer_map(ui.item.cus_id, $('#child_cus_search').data("cus_mas_id") || '');

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style='font-size:12px;'><strong>" + item.label + "</strong> - " + item.phone + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#child_cus_search').on('input', function () {
        //check the value not empty
        if ($('#child_cus_search').val() != "") {
            $('#child_cus_search').data("cus_mas_id", '');
            $('#child_cus_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/assign_product_customer_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            term: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.cus_name,
                                    value: item.cus_name,
                                    cus_id: item.cus_id,
                                    phone: item.cus_phone,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("cus_mas_id", ui.item.cus_id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)
                    get_dealer_map($('#parent_cus_search').data("cus_mas_id") || '', ui.item.cus_id);

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style='font-size:12px;'><strong>" + item.label + "</strong> - " + item.phone + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#parent_cus_search, #child_cus_search").on("input", function () {
        var parent_cus_id = $('#parent_cus_search').data("cus_mas_id") || '';
        var child_cus_id = $('#child_cus_search').data("cus_mas_id") || '';
        console.log(parent_cus_id, child_cus_id);
        get_dealer_map(parent_cus_id, child_cus_id);
    });

    $("#clear_button").click(function () {
        window.location.reload();
    });

    $("#insert_button").click(function () {

        var parent_cus_id = $('#customer_master').data("cus_mas_id") || '';
        var child_cus_id = $('#child_customer').data("cus_mas_id") || '';

        if (parent_cus_id == '' || child_cus_id == '') {
            salert("Warning", "Please select both parent and child customers.", "warning");
            return;
        }

        insert_dealer_map(parent_cus_id, child_cus_id);
    });

    $("#customer_map_tbody").on("click", ".edit_btn", function () {
        var dealer_map_id = $(this).val();
        var parent_id = $(this).data("parent_id");
        var child_id = $(this).data("child_id");

        var parent_cus_name = $(this).closest("tr").find("td:eq(0)").text();
        var child_cus_name = $(this).closest("tr").find("td:eq(1)").text();

        $("#customer_master").data("cus_mas_id", parent_id).val(parent_cus_name);
        $("#child_customer").data("cus_mas_id", child_id).val(child_cus_name);


        $("#insert_button").addClass("d-none");
        $("#update_button").val(dealer_map_id).removeClass("d-none");
        $("#clear_button").removeClass("d-none");
    });

    $("#update_button").click(function () {
        var dealer_map_id = $(this).val();
        var parent_cus_id = $('#customer_master').data("cus_mas_id") || '';
        var child_cus_id = $('#child_customer').data("cus_mas_id") || '';

        if (parent_cus_id == '' || child_cus_id == '') {
            salert("Warning", "Please select both parent and child customers.", "warning");
            return;
        }

        update_dealer_map(dealer_map_id, parent_cus_id, child_cus_id);

    });

    $("#customer_map_tbody").on("click", ".delete_btn", function () {
        var dealer_map_id = $(this).val();
        var parent_cus_id = $('#customer_master').data("cus_mas_id") || '';
        var child_cus_id = $('#child_customer').data("cus_mas_id") || '';

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                delete_dealer_map(dealer_map_id, parent_cus_id, child_cus_id);
            }
        });

        $("#insert_button").addClass("d-none");
        $("#update_button").val(dealer_map_id).removeClass("d-none");
        $("#clear_button").removeClass("d-none");
    });

});



function insert_dealer_map(parent_cus_id, child_cus_id) {

    $.ajax({
        url: "php/insert_dealer_map.php",
        type: "post", //send it through get method
        data: {

            parent_cus_id: parent_cus_id,
            child_cus_id: child_cus_id
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                window.location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function update_dealer_map(dealer_map_id, parent_cus_id, child_cus_id) {

    $.ajax({
        url: "php/update_dealer_map.php",
        type: "post", //send it through get method
        data: {

            dealer_map_id: dealer_map_id,
            parent_cus_id: parent_cus_id,
            child_cus_id: child_cus_id
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                window.location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function delete_dealer_map(dealer_map_id, parent_cus_id, child_cus_id) {

    $.ajax({
        url: "php/delete_dealer_map.php",
        type: "post", //send it through get method
        data: {

            dealer_map_id: dealer_map_id,
            parent_cus_id: parent_cus_id,
            child_cus_id: child_cus_id
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                window.location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_dealer_map(parent_cus_id, child_cus_id) {
    console.log(parent_cus_id, child_cus_id);

    $.ajax({
        url: "php/get_dealer_map.php",
        type: "get", //send it through get method
        data: {

            parent_cus_id: parent_cus_id,
            child_cus_id: child_cus_id
        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== 'error') {
                $("#customer_map_tbody").empty();
                if (response.trim() !== '0 result') {

                    var obj = JSON.parse(response);
                    obj.forEach(function (obj) {

                        $("#customer_map_tbody").append(`<tr><td>${obj.parent_cus_name}</td><td>${obj.child_cus_name}</td><td><button class="btn btn-danger btn-sm delete_btn" data-parent_id="${obj.parent_cus_id}" data-child_id="${obj.child_cus_id}" value="${obj.dealer_map_id}"><i class="fas fa-trash"></i></button><button class="btn btn-warning text-dark btn-sm edit_btn" data-parent_id="${obj.parent_cus_id}" data-child_id="${obj.child_cus_id}" value="${obj.dealer_map_id}"><i class="fas fa-edit"></i></button></td></tr>`);
                    });
                }
                else {
                    $("#customer_map_tbody").append(`<tr><td colspan="3" class="text-center">No data found</td></tr>`);
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