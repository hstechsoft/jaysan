
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
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


    $("#material_id").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#nesting_details_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#material_id').on('input', function () {


        $(this).data("material_id", '');


        //check the value not empty
        if ($('#material_id').val() != "") {
            $('#material_id').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {

                            part: $("#material_id").val(),
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

                    $(this).data("material_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    console.log(ui.item.id);



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#nested_parts').on('input', function () {


        $(this).data("part_id", '');


        //check the value not empty
        if ($('#nested_parts').val() != "") {
            $('#nested_parts').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {

                            part: $("#nested_parts").val(),
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
                    console.log(ui.item.id);



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $("#nested_part_add_btn").on("click", function () {

        let nested_part = $("#nested_parts").val().trim();
        let nested_part_id = $("#nested_parts").data("part_id");
        let nested_part_qty = $("#nested_part_qty").val();


        if (nested_part_id !== "" && nested_part !== "" && nested_part_qty !== "" && nested_part_qty > 0) {


            $("#nesting_parts_tbody").append(`<tr data-part_id=${nested_part_id}><td>${nested_part}</td><td>${nested_part_qty}</td><td><button class='btn btn-danger delete_btn'><i class='fa fa-trash'></i></button></td></tr>`);


            $("#nested_parts").val('');
            $("#nested_part_qty").val('');

        } else {
            salert("Warning", "Enter Part First & Its Qty", "warning");
        }

    });

    $("#nesting_parts_tbody").on("click", ".delete_btn", function () {

        var row = $(this).closest("tr");

        Swal.fire({
            title: "Warning",
            text: "Are you sure? Do you want to delete?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                row.remove();
            }
        });

    });

    $("#add_nesting_btn").on("click", function () {

        let nesting_name = $("#nesting_name").val();
        let material_id = $("#material_id").data("material_id");
        let material_qty = $("#material_qty").val();
        let run_time = $("#run_time").val();
        let product = $("#product").val();
        let created_by = current_user_id;
        let nested_arr = [];

        if ($("#nesting_parts_tbody tr").length > 0) {
            $("#nesting_parts_tbody tr").each(function () {
                nested_arr.push({
                    part_id: $(this).data("part_id"),
                    quantity: $(this).find("td").eq(1).text().trim()
                })
            })
        }

        console.log(nested_arr);

        let file = $("#nest_file")[0].files[0];

        if (nesting_name && material_id && material_qty && run_time && product && nested_arr.length > 0 && file) {

            let formData = new FormData();

            formData.append("created_by", created_by);
            formData.append("nesting_name", nesting_name);
            formData.append("material_id", material_id);
            formData.append("material_qty", material_qty);
            formData.append("run_time", run_time);
            formData.append("product", product);


            formData.append("nesting_parts", JSON.stringify(nested_arr));

            formData.append("file", file);

            console.log(formData);

            insert_nesting_details(formData);

        } else {
            salert("Warning", "Fill All Required Fields", "warning");
        }

    });



    get_nesting_details();

    $("#nesting_job_card_tbody").on("click", ".view_btn", function () {
        let path = $(this).data("path");

        // open in new tab
        window.open(path, "_blank");
    });

    $("#nesting_details_tbody").on("click", ".edit_btn", function () {

        $("#add_nesting_btn").addClass('d-none');
        $("#update_nesting_btn").removeClass('d-none');

        var nesting_parts_details = $(this).data("nesting_parts_details");

        if (typeof nesting_parts_details === "string") {
            nesting_parts_details = JSON.parse(nesting_parts_details);
        }

        var material_id = $(this).data("material_id");
        var nesting_id = $(this).data("nesting_id");
        var path = $(this).data("path");

        var row = $(this).closest("tr");

        var nesting_name = row.find("td").eq(1).text().trim();
        var material_name = row.find("td").eq(2).text().trim();
        var material_qty = row.find("td").eq(3).text().trim();
        var time = row.find("td").eq(4).text().trim();
        var product = row.find("td").eq(5).text().trim();

        $("#update_nesting_btn").val(nesting_id);
        $("#nesting_name").val(nesting_name);
        $("#material_id").val(material_name).data('material_id', material_id);
        $("#material_qty").val(material_qty);
        $("#run_time").val(time);
        $("#product").val(product);
        $("#nest_file").val('');

        $("#nesting_parts_tbody").empty();

        if (nesting_parts_details && nesting_parts_details.length > 0) {
            nesting_parts_details.forEach(function (item) {
                $("#nesting_parts_tbody").append(`
                <tr data-part_id="${item.part_id}">
                    <td>${item.part_name}</td>
                    <td>${item.qty}</td>
                    <td>
                        <button class='btn btn-danger delete_btn'>
                            <i class='fa fa-trash'></i>
                        </button>
                    </td>
                </tr>
            `);
            });
        }

    });

    $("#clear_btn").on("click", function () {
        clear_form();
    })

    $("#update_nesting_btn").on("click", function () {
        
        let nesting_id = $("this").val();
        let nesting_name = $("#nesting_name").val();
        let material_id = $("#material_id").data("material_id");
        let material_qty = $("#material_qty").val();
        let run_time = $("#run_time").val();
        let product = $("#product").val();
        let created_by = current_user_id;
        let nested_arr = [];

        if ($("#nesting_parts_tbody tr").length > 0) {
            $("#nesting_parts_tbody tr").each(function () {
                nested_arr.push({
                    part_id: $(this).data("part_id"),
                    quantity: $(this).find("td").eq(1).text().trim()
                })
            })
        }


        let file = $("#nest_file")[0].files[0];
        console.log(nesting_id, nesting_name, material_id, material_qty, run_time, product, nested_arr, file);

        if (nesting_id > 0 && nesting_name && material_id && material_qty && run_time && product && nested_arr.length > 0 && file) {

            let formData = new FormData();

            formData.append("created_by", created_by);
            // formData.append("nesting_name", nesting_name);
            formData.append("material_id", material_id);
            formData.append("material_qty", material_qty);
            formData.append("run_time", run_time);
            formData.append("product", product);
            formData.append("nesting_id", nesting_id);


            formData.append("nesting_parts", JSON.stringify(nested_arr));

            formData.append("file", file);

            console.log(formData);

            update_nesting_details(formData);

        } else {
            salert("Warning", "Fill All Required Fields", "warning");
        }
    })
});



function clear_form() {

    $("#nesting_name").val('');
    $("#material_id").val('').data('material_id', '');
    $("#material_qty").val('');
    $("#run_time").val('');
    $("#product").val('');
    $("#nest_file").val('');
    $("#nested_parts").val('');
    $("#nested_part_qty").val('');

    $("#nesting_parts_tbody").empty();

}

function insert_nesting_details(formData) {

    console.log(formData);

    $.ajax({
        url: "php/insert_nesting_details.php",
        type: "POST",
        data: formData,
        processData: false,   // IMPORTANT
        contentType: false,   // IMPORTANT
        success: function (response) {
            console.log(response);
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function update_nesting_details(formData) {

    console.log(formData);

    $.ajax({
        url: "php/update_nesting_details.php",
        type: "POST",
        data: formData,
        processData: false,   // IMPORTANT
        contentType: false,   // IMPORTANT
        success: function (response) {
            console.log(response);
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}


function get_nesting_details() {

    console.log();

    $.ajax({
        url: "php/get_nesting_details.php",
        type: "GET",
        data: {
            created_by: '',
            nesting_name: '',
            material_id: ''

        },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {

                $("#nesting_details_tbody").empty();

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);

                    obj.forEach(function (item, index) {
                        index++;

                        let nesting = JSON.parse(item.nesting_parts_details);
                        let nesting_parts_details = '<ul class="list-group">';
                        nesting.forEach(function (obj) {

                            nesting_parts_details += `<li class="list-group-item">${obj.part_name} <span class='badge bg-secondary'>${obj.qty}</span></li>`;
                        })

                        nesting_parts_details += `</ul>`;

                        // convert path to web path
                        let filePath = item.path.replace(/.*nesting[\\/]/, 'nesting/');

                        $("#nesting_details_tbody").append(`
                            <tr>
                                <td>${index}</td>
                                <td>${item.nesting_name}</td>
                                <td>${item.material_name}</td>
                                <td>${item.material_qty}</td>
                                <td>${item.run_time}</td>
                                <td>${item.product}</td>
                                <td>${item.emp_name}</td>
                                <td>${nesting_parts_details}</td>
                                <td>
                                    <button type="button" class="btn btn-primary view_btn" data-path="${filePath}">
                                        View
                                    </button>
                                    <button type="button" class="btn btn-warning edit_btn" data-path=${item.path} data-nesting_parts_details='${item.nesting_parts_details}'  data-nesting_id="${item.nesting_id}"  data-material_id="${item.material_id}">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        `);
                    });

                }
                else {
                    $("#nesting_details_tbody").append(`<tr><td colspan='8' class='text-center text-danger'>No Data Found</td></tr>`);
                }
            }
        },
        error: function (xhr) {
            console.log(xhr);
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