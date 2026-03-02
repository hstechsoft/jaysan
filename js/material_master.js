
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
    get_finished_godown_master_list();
    // get_creditors_auto();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $("#material_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#part_list li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $('#material').on('input', function () {
        //check the value not empty
        if ($('#material').val() != "") {
            $('#material').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {
                            term: "name",
                            part: $('#material').val(),


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name + "-" + item.part_no,
                                    value: item.part_name + "-" + item.part_no,
                                    id: item.part_id,
                                    part_name: item.part_name
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
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $('#godown').on('input', function () {
        //check the value not empty
        if ($('#godown').val() != "") {
            $('#godown').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_creditors_auto.php",
                        type: "get", //send it through get method
                        data: {

                            term: $('#godown').val(),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.creditor_name,
                                    value: item.creditor_name,
                                    id: item.creditor_id,
                                    // part_name: item.part_name
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
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $("#submit_btn").on("click", function () {

        var material_id = $("#material").data("material_id");
        var godown_id = $("#godown").data("godown_id");
        var day = $("#day_required").val();
        var unit = $("#unit").val();
        var priority = $("#priority").val();

        var PartsData = [];
        var converted_day = day;

        if (!material_id || !godown_id || !day || !priority) {
            salert("Warning", "Fill All the Fields!", "warning");
            return;
        }

        if (unit === "minutes") {
            converted_day = parseFloat(day) / 60;
        }

        PartsData.push({
            time_taken: parseFloat(converted_day),
            godown_id: godown_id,
            category: priority
        });

        if (PartsData.length > 0) {

            $(this).prop("disabled", true);

            insert_finished_godown_master(material_id, PartsData);

        } else {

            $(this).prop("disabled", false);
            salert("Warning", "Fill All the Fields!", "warning");
        }

    });

    $("#part_list").on("dblclick", "li", function () {
        var material_id = $(this).val();

        if (!material_id) {
            salert("Warning", "Try Later!", "warning");
            return;
        }
        get_finished_godown_master_details(material_id);
    })

    $("#material_tbody").on("click", ".edit", function () {
        var row = $(this).closest("tr");
        var master_id = $(this).data("master_id");
        var part_id = $(this).data("part_id");
        var godown_id = $(this).data("godown_id");
        var time_taken = $(this).data("time_taken");
        var priority = $(this).data("priority");

        $('#material').val(row.find("td").eq(1).text()).data("material_id", part_id);
        $('#godown').val(row.find("td").eq(2).text()).data("godown_id", godown_id);
        $('#day_required').val(time_taken);
        $('#priority').val(priority).prop("selected", true);
        $("#update_btn").val(master_id);

        $("#update_btn, #clear_form").removeClass("d-none");
        $("#submit_btn").addClass("d-none");

    })

    $("#update_btn").on("click", function () {

        var master_id = $(this).val();
        var material_id = $("#material").data("material_id");
        var godown_id = $("#godown").data("godown_id");
        var day = $("#day_required").val();
        var unit = $("#unit").val();
        var priority = $("#priority").val();

        var converted_day = day;

        if (!master_id || !material_id || !godown_id || !day || !priority) {
            salert("Warning", "Fill All the Fields!", "warning");
            return;
        }

        if (isNaN(day) || parseFloat(day) <= 0) {
            salert("Warning", "Enter valid time value!", "warning");
            return;
        }

        if (unit === "minutes") {
            converted_day = parseFloat(day) / 60;
        }

        $(this).prop("disabled", true);

        update_finished_godown_master(
            material_id,
            parseFloat(converted_day),
            godown_id,
            priority,
            master_id
        );

    });

    $("#clear_form").on("click", function () {

        $('#material').val('').data("material_id", '');
        $('#godown').val('').data("godown_id", '');
        $('#day_required').val('');
        $('#priority').val("null").prop("selected", true);
        $('#unit').val("hours").prop("selected", true);

        $("#update_btn, #clear_form").addClass("d-none");
        $("#submit_btn").removeClass("d-none");
         $("#update_btn").prop("disabled", false);

    })

    $("#material_tbody").on("click", ".trash", function () {
        var master_id = $(this).data("master_id");
        var part_id = $(this).val();

        if (!master_id && !part_id) {
            salert("Warning", "Data Missing Try Later!", "warning");
            return;
        }
        Swal.fire({
            title: "Are You Sure!",
            text: "Do You Want to Delete? It Cann't be Recovered.",
            icon: "warning",
            buttons: true,
            dangerMOde: true,
        }).then((result) => {

            if (result.isConfirmed) {
                delete_finished_godown_master(master_id, part_id);
            }

        });
    })

});







function insert_finished_godown_master(material_id, PartsData) {
    console.log(material_id, PartsData);

    $.ajax({
        url: "php/insert_finished_godown_master.php",
        type: "post", //send it through get method
        data: {
            PartsData: PartsData,
            part_id: material_id,


        },
        success: function (response) {


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

function delete_finished_godown_master(master_id, part_id) {
    console.log(master_id, part_id);

    $.ajax({
        url: "php/delete_finished_godown_master.php",
        type: "post", //send it through get method
        data: {
            master_id: master_id,


        },
        success: function (response) {


            if (response.trim() == "ok") {
                get_finished_godown_master_details(part_id);
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

function update_finished_godown_master(material_id, converted_day, godown_id, priority, master_id) {
    console.log(material_id, converted_day, godown_id, priority, master_id);

    $.ajax({
        url: "php/update_finished_godown_master.php",
        type: "post", //send it through get method
        data: {

            part_id: material_id,
            time_taken: converted_day,
            godown_id: godown_id,
            category: priority,
            master_id: master_id,
        },
        success: function (response) {


            if (response.trim() == "ok") {

                $("#clear_form").trigger("click");
                get_finished_godown_master_list()
                get_finished_godown_master_details(material_id);
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

function get_finished_godown_master_list() {
    $.ajax({
        url: "php/get_finished_godown_master_list.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#part_list").empty();
                $("#material_search").val('');
                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);


                    console.log(response);

                    obj.forEach(function (obj) {
                        $("#part_list").append(`<li class="list-group-item" value=${obj.part_id}>${obj.part_name}</li>`);


                    });


                }
                else {
                    $("#part_list").append("No Material Found.");
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

function get_finished_godown_master_details(material_id) {
    $.ajax({
        url: "php/get_finished_godown_master_details.php",
        type: "get", //send it through get method
        data: {
            part_id: material_id,

        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#material_tbody").empty();
                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    console.log(response);

                    obj.forEach(function (obj) {
                        count++
                        $("#material_tbody").append(`<tr><td>${count}</td><td>${obj.part_name}</td><td>${obj.creditor_name}</td><td>${obj.time_taken}</td><td>${obj.category}</td><td class='d-flex gap-2'><button class='btn btn-outline-warning edit' data-part_id='${obj.part_id}' data-godown_id='${obj.godown_id}' data-time_taken='${obj.time_taken}' data-priority='${obj.category}' data-master_id='${obj.master_id}'><i class='fa fa-edit'></i></button><button class='btn btn-outline-danger trash' value='${obj.part_id}' data-master_id='${obj.master_id}'><i class='fa fa-trash'></i></button></td></tr>`);


                    });


                }
                else {
                    window.location.reload();
                    $("#material_tbody").append("No Material Found.");
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

// function get_creditors_auto() {
//     $.ajax({
//         url: "php/get_creditors_auto.php",
//         type: "get", //send it through get method
//         data: {
//             term: '',


//         },
//         success: function (response) {


//             if (response.trim() != "error") {
//                 $("#godown_list").empty();
//                 if (response.trim() != "0 result") {

//                     var obj = JSON.parse(response);


//                     console.log(response);
//                     var godown = `<div class="row">`

//                     obj.forEach(function (obj) {

//                         godown += `
//                         <div class="col-6">
//                             <div class="form-check">
//                                 <input class="form-check-input" type="radio" name="" data-godown_id='${obj.creditor_id}' id="godown${obj.creditor_id}">
//                                 <label class="form-check-label" for="godown${obj.creditor_id}">
//                                     ${obj.creditor_name}
//                                 </label>
//                             </div>
//                         </div>`
//                     });

//                     godown += `</div>`
//                     $("#godown_list").append(godown);

//                 }
//                 else {
//                     $("#godown_list").append("No Godown Found.");
//                 }


//                 //    get_sales_order()
//             }

//             else {
//                 salert("Error", "User ", "error");
//             }



//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });
// }

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