
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var role = localStorage.getItem("ls_emp_role");

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
    get_creditors();
    // get_creditors_auto();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $("#creditor_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#creditors_table_body tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("#creditors_table_body").on("click", ".map_btn", function () {
        $(".save_map_btn").val($(this).val());
        window.open("https://www.google.com/maps/", "_blank");
        $("#map_modal").modal('show');
    });

    $("#creditors_table_body").on("click", ".edit_btn", function () {
        if ($(this).val() < 0) {
            salert("Warning", "Invalid Creditor ID.", "warning");
        } else {
            get_single_creditor($(this).val());
        }
    });

    $("#creditors_table_body").on("click", ".delete_btn", function () {
        
        if ($(this).val() < 0) {
            salert("Warning", "Invalid Creditor ID.", "warning");
        } else {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this creditor!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            }).then((willDelete) => {
                if (willDelete) {
                    delete_creditors($(this).val());    
                } else {
                    // salert("Info", "Creditor deletion canceled.", "info");
                }
            });
        }
    });

    $(".save_map_btn").on("click", function () {

        let coordinates = $("#map_coordinates").val();

        let parts = coordinates.split(',');

        let lati = parts[0]?.trim();
        let long = parts[1]?.trim();

        let godown_id = $(this).val() || 0;

        if (lati && long && godown_id > 0) {
            update_creditor_location(lati, long, godown_id);
        } else {
            salert(
                "Warning",
                "Data Is Missing! Please provide map coordinates and Vendor.",
                "warning"
            );
        }
    });


    $("#submit_creditor_btn").on("click", function () {

        if ($("#creditors")[0].checkValidity()) {
            if ($("#creditor_id").val() == "") {
                insert_creditors();
            }
            else {
                update_creditors();
            }
        } else {
            $("#creditors")[0].reportValidity();
        }

    });


    $('#stock_godown').on('input', function () {
        $(this).data("godown_id", '');
        $('#stock_department').val('').data('dept_id', '');
        $('#stock_section').val('').data("sec_id", '');
        $("#unit_add_btn").removeClass("d-none");
        $("#dep_add_btn").addClass("d-none");
        $("#sec_add_btn").addClass("d-none");
        //check the value not empty
        if ($('#stock_godown').val() != "") {
            $('#stock_godown').autocomplete({
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
                    if ($(this).data("godown_id") != '') {
                        $("#unit_add_btn").addClass("d-none");
                        $("#dep_add_btn").removeClass("d-none");
                    }


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });


});

function update_creditor_location(lati, long, godown_id) {

    console.log(lati, long, godown_id);

    $.ajax({
        url: "php/update_godown_location.php",
        type: "post", //send it through get method
        data: {

            latti: lati,
            longi: long,
            creditor_id: godown_id,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                $("#map_modal").modal('hide');
                $("#map_coordinates").val('');
                salert("Success", "Location Saved Successfully.", "success");
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

function delete_creditors(id) {

    $.ajax({
        url: "php/delete_creditors.php",
        type: "get", //send it through get method
        data: {
            creditor_id: id,
        },
        success: function (response) {

            console.log(response);

            if (response.trim() == "Record deleted successfully") {
                window.location.reload();

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

function insert_creditors() {

    const form = document.getElementById("creditors");
    const formData = new FormData(form)

    $.ajax({
        url: "php/insert_creditors.php",
        type: "post", //send it through get method
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {
                window.location.reload();

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

function update_creditors() {
    const form = document.getElementById("creditors");
    const formData = new FormData(form);

    $.ajax({
        url: "php/update_creditors.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,

        success: function (response) {
            response = response.trim();

            console.log(response);

            if (response === "ok") {
                window.location.reload();
            } else {
                salert("Error", response, "error");
            }
        },

        error: function (xhr, status, error) {
            console.error("AJAX Error:", error);
            console.error(xhr.responseText);

            salert("Error", "Failed to update creditor.", "error");
        }
    });
}



function get_creditors() {
    $.ajax({
        url: "php/get_creditors.php",
        type: "get", //send it through get method
        data: {
            creditor_id: '',

        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#creditors_table_body").empty();
                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    console.log(response);

                    obj.forEach(function (obj) {
                        count++;
                        $("#creditors_table_body").append(`<tr><td>${count}</td><td>${obj.creditor_name}</td><td>${obj.contact_person}</td><td>${obj.creditor_phone}</td><td>${obj.creditors_email}</td><td>${obj.creditors_addr}</td><td>${obj.creditor_gst}</td><td class=''><button type="button" class="btn btn-primary btn-sm map_btn" id="" value="${obj.creditor_id}"><i class="fa-solid fa-map-location-dot"></i></button><button type="button" class="btn btn-warning text-dark btn-sm m-1 edit_btn" id="" value="${obj.creditor_id}"><i class="fa fa-edit"></i></button><button type="button" class="btn btn-danger btn-sm m-1 delete_btn ${role.toLocaleLowerCase() === "admin" || role.toLocaleLowerCase() === "super admin" ? "" : "d-none"}" id="" value="${obj.creditor_id}"><i class="fa fa-trash"></i></button></td></tr>`);


                    });


                }
                else {
                    $("#creditors_table_body").append("No Material Found.");
                }


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

function get_single_creditor(creditor_id) {
    $.ajax({
        url: "php/get_creditors.php",
        type: "get", //send it through get method
        data: {
            creditor_id: creditor_id,

        },
        success: function (response) {


            if (response.trim() != "error") {
                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    console.log(response);

                    obj.forEach(function (obj) {

                        $("#creditor_id").val(obj.creditor_id);
                        $("#creditor_name").val(obj.creditor_name);
                        $("#contact_person").val(obj.contact_person);
                        $("#creditor_phone").val(obj.creditor_phone);
                        $("#creditors_email").val(obj.creditors_email);
                        $("#creditors_addr").val(obj.creditors_addr);
                        $("#creditor_gst").val(obj.creditor_gst);


                    });


                }
                else {
                    $("#creditors_table_body").append("No Material Found.");
                }


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