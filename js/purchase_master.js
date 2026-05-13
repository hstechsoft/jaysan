
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


    $("#parts_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#parts_list li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("#summary_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#all_bom_table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();
    get_purchase_process_recent();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#part_name').on('input', function () {
        //check the value not empty
        $(this).removeData("part_id");
        if ($('#part_name').val() != "") {
            $('#part_name').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {
                            term: "name",
                            part: request.term,


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
                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#add_parts").on("click", function () {
        var part_id = $('#part_name').data('part_id')
        console.log(part_id);

        if (part_id > 0) {
            purchase_process_entry(part_id);
        }
        else {

            salert("Warning", "First select Part.", "warning");
        }
    })

    $('#godown').on('input', function () {
        $(".form_godown_update_btn").removeData("wtid")
        $(this).removeData("godown_id");
        if ($(this).val().trim() === '') {
            $(this).removeData("godown_id");
        }


        $("#department_da").empty();
        $("#section_da").empty();
        $("#machine_da").empty();
        $('#min_time').val('');
        $('#max_time').val('');
        $('#cost').val('');

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
                    // get_master_department(ui.item.id);
                    // $("#department_add_btn").removeClass("d-none");


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    // $("#department_da").on("change", function () {

    //     $('#min_time').val('');
    //     $('#max_time').val('');
    //     $('#cost').val('');

    //     $("#section_da").empty();
    //     $("#machine_da").empty();

    //     get_master_dep_section($(this).val());
    // });

    // $("#section_da").on("change", function () {


    //     $('#min_time').val('');
    //     $('#max_time').val('');
    //     $('#cost').val('');

    //     $("#machine_da").empty();

    //     get_master_dep_sec_machine($(this).val());

    // });

    // $("#machine_da").on("change", function () {

    //     $('#min_time').val('');
    //     $('#max_time').val('');
    //     $('#cost').val('');

    // });

    $("#godown_tbody").on("change", "#default_godown", function () {
        update_work_time_master_default($(this).data("wtid"), 1, $(".form_godown_update_btn").data("process_id"));
    });

    $("#godown_tbody").on("click", ".delete_extra", function () {

        const icon = $(this);
        const wtid = $(this).data("wtid");

        swal({
            title: "Are you sure - delete? ",
            text: "You will not be recover this  again!",
            icon: "warning",
            buttons: [
                'No, cancel it!',
                'Yes, I am sure!'
            ],
            dangerMode: true,
        }).then(function (isConfirm) {
            if (isConfirm) {

                if (wtid) {
                    delete_work_time_master(wtid)
                }
                else {
                    salert("Warning", "Data Missing!, Try Later.", "warning");

                }
            }

        })

    });

    $("#godown_tbody").on("click", ".edit_extra", function () {


        var editingRow = $(this).closest("tr");
        $(".form_godown_update_btn").data("wtid", $(this).data("wtid"))

        let min = $(this).closest("tr").data('min_time');
        let max = $(this).closest("tr").data('max_time');
        let unit = $(this).closest("tr").data("unit");
        $("#godown").val($(this).closest("tr").find("td").eq(1).text());
        $("#godown").data("godown_id", $(this).closest("tr").data("godown_id"));
        // get_master_department($(this).closest("tr").data("godown_id"));


        // get_master_dep_section($(this).closest("tr").data("dept_id"));
        // get_master_dep_sec_machine($(this).closest("tr").data("section_id"));

        // console.log($(this).closest("tr").data("dept_id"), $(this).closest("tr").data("section_id"), $(this).closest("tr").data("machine_id"));

        // setTimeout(() => {

        //     $("#department_da").val($(this).closest("tr").data("dept_id"));
        //     $("#section_da").val($(this).closest("tr").data("section_id"));
        //     $("#machine_da").val($(this).closest("tr").data("machine_id"));

        // }, 500)

        $("#is_default").prop("checked", $(this).closest("tr").data("is_default") == 1)
        $("#min_time").val(min);
        $("#max_time").val(max);
        $("#unit").val(unit);
        $("#cost").val($(this).closest("tr").find("td").eq(4).text());
    });

    $(".form_godown_update_btn").on("click", function () {

        var process_id = $(this).data("process_id");
        var process = $(this).data("process");
        var wtid = $(this).data("wtid") || 0;

        var godown_id = $("#godown").data("godown_id");
        var depart_id = null;
        var section_id = null;
        var machine_id = null;
        var min = $("#min_time").val();
        var max = $("#max_time").val();
        var cost = $("#cost").val();

        var unit = $("#unit").val();

        if (unit == 'hrs') {
            alert()
            min = Number(min) * 60;
            max = Number(max) * 60;
        }
        else if (unit == 'days') {
            min = Number(min) * 60 * 24;
            max = Number(max) * 60 * 24;
        }
        else {
            min = min;
            max = max;
        }

        var is_default = $("#is_default").is(":checked") ? 1 : 0;

        if (godown_id && process_id && process) {

            console.log(process_id, process, godown_id, depart_id, section_id, machine_id, min, max, cost);

            update_work_time_master1_details(process_id, process, godown_id, depart_id, section_id, machine_id, min, max, cost, wtid, is_default);

        } else {
            console.log(process_id, process, godown_id, depart_id, section_id, machine_id, min, max, cost);

            salert("Warning", "Fill the fields/Requied Data Missing.", "warning");
        }
    })

    $("#parts_list").on("dblclick", "li", function () {

        var part_id = $(this).data("part_id");

        if (part_id) {
            $("#part_name").data("part_id", part_id).val($(this).text().trim());
            purchase_process_entry(part_id);
        }
        else {
            salert("Warning", "Data Missing!, Try Later.", "warning");
        }
    })

});






function clear() {
    $("#godown").removeData("godown_id").val('');
    $("#department_da").val('');
    $("#section_da").val('');
    $("#machine_da").val('');
    $("#min_time").val('');
    $("#max_time").val('');
    $("#cost").val('');
    $("#unit").val('hrs');
    $("#is_default").prop('checked', false);

}


function update_work_time_master1_details(process_id, process, godown_id, depart_id, section_id, machine_id, min, max, cost, wtid, is_default) {

    console.log(process_id, process, godown_id, depart_id, section_id, machine_id, min, max, cost, wtid, is_default);


    $.ajax({
        url: "php/update_work_time_master1.php",
        type: "post", //send it through get method
        data: {
            min_time: min,
            max_time: max,
            process_id: process,
            machine_id: machine_id,
            dep_id: depart_id,
            dep_sec_id: section_id,
            cost: cost,
            godown_id: godown_id,
            ori_process_id: process_id,
            wtid: wtid,
            is_default: is_default,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() == "ok") {

                clear();
                shw_toast("Success", "Updated Successfully!");
                purchase_process_entry($("#part_name").data("part_id"));

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

function delete_work_time_master(wtid) {

    console.log(wtid);


    $.ajax({
        url: "php/delete_work_time_master.php",
        type: "post", //send it through get method
        data: {
            wtid: wtid,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() == "ok") {

                clear();
                shw_toast("Success", "Deleted Successfully!");
                purchase_process_entry($("#part_name").data("part_id"));

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

function update_work_time_master_default(wtid, is_default, process_id) {

    console.log(wtid, is_default, process_id);


    $.ajax({
        url: "php/update_work_time_master_default.php",
        type: "post", //send it through get method
        data: {
            wtid: wtid,
            is_default: is_default,
            process_id: process_id,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() == "ok") {

                clear();
                shw_toast("Success", "Updated Successfully!");
                purchase_process_entry($("#part_name").data("part_id"));
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

function purchase_process_entry(part_id) {

    console.log(part_id);

    $.ajax({
        url: "php/purchase_process_entry.php",
        type: "get",
        data: {
            part_id: part_id,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() != 'error') {
                $("#godown_tbody").empty();
                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);

                    obj.forEach(function (item) {
                        if (item.process_id) {
                            $(".godown_section").removeClass('d-none');
                            $(".form_godown_update_btn").data("process_id", item.process_id);
                            $(".form_godown_update_btn").data("process", item.process);

                            if (item.total_extra > 0) {

                                var godown_details = JSON.parse(item.process_details);

                                godown_details.forEach(function (gd, index) {
                                    index++;

                                    function formatTime(value) {

                                        let unit = 'mins';

                                        if (value >= 60 && value < 1440) {

                                            value = value / 60;
                                            unit = 'hrs';

                                        } else if (value >= 1440) {

                                            value = value / 1440;
                                            unit = 'days';
                                        }

                                        return {
                                            value: value,
                                            unit: unit
                                        };
                                    }


                                    var minData = formatTime(gd.min_time);
                                    var maxData = formatTime(gd.max_time);

                                    var min = minData.value;
                                    var minUnit = minData.unit;

                                    var max = maxData.value;
                                    var maxUnit = maxData.unit;

                                    $("#godown_tbody").append(`<tr data-wtid=${gd.wtid} data-godown_id=${gd.godown_id} data-dept_id=${gd.dep_id} data-section_id=${gd.dep_sec_id} data-machine_id=${gd.dep_sec_machine_id} data-is_default=${gd.is_default} data-min_time=${min} data-max_time=${max} data-unit=${minUnit}>
                                        <td> <input class="form-check-input" data-wtid=${gd.wtid} ${gd.is_default == 1 ? "checked" : ''} type="radio" name="flexRadioDefault" id="default_godown" ></td>
                                        <td>${gd.godown_name}</td>
                                        <td>${parseFloat(min).toFixed(2)} ${minUnit}</td>
                                        <td>${parseFloat(max).toFixed(2)} ${maxUnit}</td>
                                        <td>${gd.cost}</td>
                                        <td>
                                            <button class='btn btn-outline-secondary border-0 edit_extra' data-wtid=${gd.wtid}><i class='fa fa-pen pe-2'></i></button>
                                            <button class='btn btn-outline-danger border-0 delete_extra' data-wtid=${gd.wtid}><i class='fa fa-trash '></i></button>
                                        </td>
                                        </tr>`)
                                })
                            }
                        }
                    })
                }
                else {
                    $("#godown_tbody").append(`<div class="text-center text-muted py-5">
                                            <i class="fa fa-table fa-2x mb-2"></i>
                                            <p class="mb-0">
                                                Data Table Area
                                            </p>
                                        </div>
                    `);
                }
            }

        },
        error: function (xhr) {
            salert("Error", xhr.responseText, "error");
        }
    })
}

// function get_master_department(godown_id) {

//     $.ajax({
//         url: "php/get_department.php",
//         type: "get", //send it through get method
//         data: {
//             godown_id: godown_id

//         },
//         success: function (response) {
//             console.log(response);


//             if (response.trim() != "error") {
//                 $("#department_da").empty();
//                 if (response.trim() != "0 result") {





//                     var obj = JSON.parse(response);
//                     var count = 0
//                     $("#department_da").append(`<option selected disabled value="">Choose...</option>`);


//                     obj.forEach(function (obj) {
//                         count = count + 1;

//                         $("#department_da").append(`<option value=${obj.dep_id}>${obj.dep_name}</option>`);

//                     });


//                 }
//                 else {
//                     $("#department_da").append(`<option selected disabled value="">Choose...</option>`);

//                 }
//             }





//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });


// }

// function get_master_dep_section(dept_id) {

//     $.ajax({
//         url: "php/get_dep_section.php",
//         type: "get", //send it through get method
//         data: {
//             dep_id: dept_id

//         },
//         success: function (response) {
//             console.log(response);


//             if (response.trim() != "error") {
//                 $("#section_da").empty();
//                 if (response.trim() != "0 result") {





//                     var obj = JSON.parse(response);
//                     var count = 0

//                     $("#section_da").append(`<option selected disabled value="">Choose...</option>`);

//                     obj.forEach(function (obj) {
//                         count = count + 1;

//                         $("#section_da").append(`<option value=${obj.dep_sec_id}>${obj.sec_name}</option>`);


//                     });


//                 }
//                 else {

//                     $("#section_da").append(`<option selected disabled value="">Choose...</option>`);

//                 }
//             }





//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });


// }

// function get_master_dep_sec_machine(sec_id) {

//     $.ajax({
//         url: "php/get_dep_sec_machine.php",
//         type: "get", //send it through get method
//         data: {
//             sec_id: sec_id

//         },
//         success: function (response) {
//             console.log(response);


//             if (response.trim() != "error") {
//                 $("#machine_da").empty();
//                 if (response.trim() != "0 result") {

//                     var obj = JSON.parse(response);
//                     var count = 0
//                     $("#machine_da").append(`<option selected disabled value="">Choose...</option>`);


//                     obj.forEach(function (obj) {
//                         count = count + 1;

//                         $("#machine_da").append(`<option value=${obj.dep_sec_machine_id}>${obj.machine_name}</option>`);

//                     });


//                 }
//                 else {
//                     // $("#machine_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")
//                     $("#machine_da").append(`<option selected disabled value="">Choose...</option>`);


//                 }
//             }

//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });


// }

function get_purchase_process_recent() {
    $.ajax({
        url: "php/get_purchase_process_recent.php",
        type: "get", //send it through get method
        data: {
        },
        success: function (response) {


            if (response.trim() != "error") {
                $("#parts_list").empty();
                if (response.trim() != "0 result") {
                    var obj = JSON.parse(response);


                    console.log(response);


                    obj.forEach(function (obj) {
                        $("#parts_list").append(`<li class="list-group-item" data-part_id='${obj.part_id}'>${obj.part_name}</li>`);

                    });
                }
                else {
                    $("#parts_list").append(`<li class="list-group-item"'>No Data Found</li>`)
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