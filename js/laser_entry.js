
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
    get_nesting_master1('');
    get_nesting_details('');

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#nesting_name').on('input', function () {

        $(this).data("nesting_id", '');


        //check the value not empty
        if ($('#nesting_name').val() != "") {
            $('#nesting_name').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_nesting_auto.php",
                        type: "get", //send it through get method
                        data: {

                            nesting_name: $("#nesting_name").val(),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.nesting_name,
                                    value: item.nesting_name,
                                    id: item.nes_master_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("nesting_id", ui.item.id);
                    get_nesting_master1(ui.item.id);
                    get_nesting_master_single1(ui.item.id)
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

    $('#material_id').on('input', function () {


        $(this).data("part_id", '');


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

    $('#godown').on('input', function () {

        $(this).removeData("godown_id");
        if ($(this).val().trim() === '') {
            $(this).removeData("godown_id");
        }

        $('#department').val('').removeData("dept_id");
        $('#section').val('').removeData("sec_id");
        $('#machine').val('').removeData("mach_id");

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

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#department').on('input', function () {

        $(this).data("dept_id", "");
        $('#section').val('').removeData("sec_id");
        $('#machine').val('').removeData("mach_id");

        //check the value not empty
        if ($('#department').val() != "") {
            $('#department').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            godown_id: $("#godown").data("godown_id")

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.dep_name,
                                    value: item.dep_name,
                                    id: item.dep_id
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("dept_id", ui.item.id);

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#section').on('input', function () {

        $(this).data("sec_id", "");


        $('#machine').val('').removeData("mach_id");

        //check the value not empty
        if ($('#section').val() != "") {
            $('#section').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            dep_id: $("#department").data("dept_id"),
                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.sec_name,
                                    value: item.sec_name,
                                    id: item.dep_sec_id
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("sec_id", ui.item.id);

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#machine').on('input', function () {

        $(this).data("mach_id", "");

        if ($('#machine').val() != "") {

            $('#machine').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sec_machine_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,
                            sec_id: $("#section").data("sec_id"),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.machine_name,
                                    value: item.machine_name,
                                    id: item.jmid
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("mach_id", ui.item.id);
                    // get_dep_section(ui.item.id)



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#nest_file").on("change",
        function () {
            var file = this.files[0];

            if (file && file.type === "application/pdf") {

            }
            else {
                $("#nest_file").val("");
                salert("Warning", "PDF Files Only.", "warning");
            }
        });

    $("#weight").on("focusout", function () {
        scrap_weight();
    });



    $("#nested_machine_add_btn").on("click", function () {

        var godown_id = $("#godown").data("godown_id") || 0;
        var department_id = $("#department").data("dept_id") || 0;
        var section_id = $("#section").data("sec_id") || 0;
        var machine_id = $("#machine").data("mach_id") || 0;
        var machine = $("#machine").val() || '';
        var runtime = $("#run_timee").val() || 0;
        var handling_time = $("#handling_time").val() || 0;
        console.log(godown_id, department_id, section_id, machine_id, machine, runtime, handling_time);
        if (godown_id <= 0 || department_id <= 0 || section_id <= 0 || machine_id <= 0 || machine == '' || runtime <= 0 || handling_time <= 0) {
            salert('warning', 'Please Fill All Fields.', 'warning');
            return;
        }
        else {
            $("#nesting_machine_tbody").append(`<tr data-godown_id="${godown_id}" data-department_id="${department_id}" data-section_id="${section_id}" data-machine_id="${machine_id}"><td>${machine}</td><td>${runtime}</td><td>${handling_time}</td><td><button type='button' class='btn btn-sm delete_btn btn-outline-danger'><i class='fa fa-trash'></i></button></td></tr>`);

            $("#godown, #department, #section, #machine, #run_timee, #handling_time").val('').removeData("godown_id").removeData("dept_id").removeData("sec_id").removeData("mach_id");
        }

    });

    $("#nesting_machine_tbody").on("click", ".delete_btn", function () {

        var row = $(this).closest('tr');
        // var nes_part_id = $(this).val() || 0;

        Swal.fire({
            title: "Are You Sure?",
            text: "Do You Want To Delete This?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete!"
        }).then((result) => {

            if (result.isConfirmed) {

                // if (nes_part_id > 0) {
                //   $("#scrap_weight").val(scrap_weigth);

                //   row.remove();
                //   delete_nesting_parts_master(nes_part_id);
                //   $("#update_nesting_btn").trigger("click");
                // }
                // else {
                row.remove();
                //   scrap_weight();
                // }
                // scrap_weight();
            }

        });

    });

    $("#nested_part_add_btn").on("click", function () {

        let nested_part = $("#nested_parts").val().trim();
        let nested_part_id = $("#nested_parts").data("part_id");
        let nested_part_qty = $("#nested_part_qty").val();
        let nested_part_weight = $("#nested_part_weight").val();
        var total_weight = Number(nested_part_qty) * Number(nested_part_weight);

        let update_btn = $("#update_nesting_btn").hasClass("d-none") ? 1 : 0;


        if (nested_part_id !== "" && nested_part !== "" && nested_part_qty !== "" && nested_part_qty > 0 && nested_part_weight > 0 && update_btn == 0 && $("#update_nesting_btn").val() > 0) {

            update_nesting_parts($("#update_nesting_btn").val(), nested_part_id, nested_part_qty, nested_part_weight)
        }

        else if (nested_part_id !== "" && nested_part !== "" && nested_part_qty !== "" && nested_part_qty > 0 && nested_part_weight > 0 && update_btn == 1) {


            $("#nesting_parts_tbody").append(`<tr data-total_weight="${total_weight}" data-part_id=${nested_part_id}><td>${nested_part}</td><td>${nested_part_qty}</td><td>${nested_part_weight}</td><td><button class='btn btn-outline-danger btn-sm delete_btn'><i class='fa fa-trash'></i></button></td></tr>`);

            var sw = scrap_weight();

            if (sw !== false && sw >= 0) {

                $("#nested_parts").data("part_id", '').val('');
                $("#nested_part_qty, #nested_part_weight").val('');

            }

        } else {
            salert("Warning", "Enter Part First & Its Qty", "warning");
        }

    });

    $("#nesting_parts_tbody").on("click", ".delete_btn", function () {

        var row = $(this).closest("tr");
        var nes_part_id = row.data("nes_part_id");
        var update_btn = $("#update_nesting_btn").hasClass("d-none") ? 1 : 0;

        console.log(nes_part_id, update_btn);

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
                $("#nesting_name").val('');
                if (nes_part_id > 0 && update_btn == 0) {
                    delete_nesting_parts(nes_part_id);
                }
            }
        });

    });

    $("#add_nesting_btn").on("click", function () {

        let nesting_name = $("#nesting_name").val() || '';
        let material_id = $("#material_id").data("part_id") || 0;
        let material_qty = $("#material_qty").val() || 0;
        let run_time = $("#run_time").val() || 0;
        let std_length = $("#dimension").val() || '';
        let weight = $("#weight").val() || 0;
        let scrap_weight = $("#scrap_weight").val() || 0;
        let created_by = current_user_id;
        let nested_arr = [];

        if ($("#nesting_parts_tbody tr").length > 0) {
            $("#nesting_parts_tbody tr").each(function () {
                nested_arr.push({
                    part_id: $(this).data("part_id"),
                    qty: $(this).find("td").eq(1).text().trim(),
                    weight: $(this).find("td").eq(2).text().trim()
                })
            })
        }

        console.log(nesting_name, material_id, material_qty, run_time, std_length, weight, scrap_weight, nested_arr);

        let file = $("#nest_file")[0].files[0];

        if (nesting_name != '' && material_id > 0 && material_qty > 0 && run_time > 0 && std_length != '' && weight > 0 && nested_arr.length > 0) {

            let formData = new FormData();

            formData.append("created_by", created_by);
            formData.append("nesting_name", nesting_name);
            formData.append("material_id", material_id);
            formData.append("material_qty", material_qty);
            formData.append("run_time", run_time);
            formData.append("weight", weight);
            formData.append("scarp_weight", scrap_weight);
            formData.append("nesting_type", 'temp');
            formData.append("std_length", std_length);


            formData.append("laser_parts", JSON.stringify(nested_arr));

            formData.append("file", file);

            console.log(formData);

            insert_nesting_details(formData);

        } else {
            salert("Warning", "Fill All Required Fields", "warning");
        }

    });


    $("#material_id, #run_time, #weight, #scrap_weight, #dimension, #nest_file, #nested_parts, #nested_part_qty, #nested_part_weight").on("change", function () {
        $("#nesting_name").val('');
    });




    $("#work_nesting_details_tbody").on("click", ".view_btn", function () {
        let path = $(this).data("path");

        // open in new tab
        window.open(path, "_blank");
    });

    $("#work_nesting_details_tbody").on("click", ".delete_btn", function () {

        var row = $(this).closest('tr');
        var nesting_details_id = $(this).data("nesting_details_id") || 0;

        Swal.fire({
            title: "Are You Sure?",
            text: "Do You Want To Delete This?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete!"
        }).then((result) => {

            if (result.isConfirmed) {
                if (nesting_details_id > 0) {
                    delete_laser_assign(nesting_details_id);
                }
                else {
                    salert("Error", "Data Missing!, Try Later", "error");
                }
            }

        });

    });

    $("#nesting_details_tbody").on("click", ".edit_btn", function () {

        var nes_master_id = $(this).val() || 0;

        if (nes_master_id > 0) {
            get_nesting_master_single1(nes_master_id);
        } else {
            salert("Warning", "Data Missing!, Try Later.", "warning");
        }

    });

    $("#clear_btn").on("click", function () {


        $("#update_nesting_btn, #view_file").addClass("d-none");
        $("#add_nesting_btn").removeClass("d-none");

        $("#nesting_name").val('');
        $("#material_id").data("part_id", '').val('');
        $("#run_time").val('');
        $("#dimension").val('');

        $("#update_nesting_btn, #nested_part_add_btn, #view_file").val('');
        $("#nesting_parts_tbody").empty();

    });


    $("#view_file").on("click", function () {
        var path = $(this).val() || 'attachment/laser/nesting/laser_10.pdf'
        if (path == '') {
            salert("Warning", 'Path Not Fetched, Try Later.', 'warning');
            return;
        }

        window.open(path, "_blank");
    });

    $("#update_nesting_btn").on("click", function () {


        let nesting_id = $("#update_nesting_btn").val();
        let nesting_name = $("#nesting_name").val();
        let material_id = $("#material_id").data("material_id");
        let material_qty = $("#material_qty").val();
        let run_time = $("#run_time").val();
        let weight = $("#weight").val() || 0;
        let scrap_weight = $("#scrap_weight").val() || 0;
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
        console.log(nesting_id, nesting_name, material_id, material_qty, run_time, weight, scrap_weight, nested_arr, file);

        if (nesting_id > 0 && nesting_name && material_id && material_qty && run_time && weight > 0 && nested_arr.length > 0) {

            let formData = new FormData();

            formData.append("created_by", created_by);
            // formData.append("nesting_name", nesting_name);
            formData.append("material_id", material_id);
            formData.append("material_qty", material_qty);
            formData.append("run_time", run_time);
            formData.append("weight", weight);
            formData.append("scrap_weight", scrap_weight);
            formData.append("nesting_id", nesting_id);
            formData.append("nesting_name", nesting_name);
            formData.append("file", file);


            formData.append("nesting_parts", JSON.stringify(nested_arr));

            formData.append("file", file);

            console.log(formData);

            update_nesting_details(formData);

            if (file) {
                update_nesting_document(formData)
            }

        } else {
            salert("Warning", "Fill All Required Fields", "warning");
        }
    })
});


function scrap_weight() {

    var scrap_weight = 0;
    var weight = 0;
    var material_weight = parseFloat($("#weight").val()) || 0;
    $("#nesting_parts_tbody tr").each(function () {
        weight += parseFloat($(this).data("total_weight")) || 0;
    });

    scrap_weight = material_weight - weight;

    if (material_weight < weight) {
        salert("Warning", "Scrap Weight Is More Than Raw Material Weight!, Recently Added Part Isn't Added.", "warning");
        $("#nesting_parts_tbody").find("tr:last").remove();
        return false;
    }
    $("#scrap_weight").val(parseFloat(scrap_weight).toFixed(2));
    return scrap_weight;

}

function delete_nesting_parts(nes_part_id) {

    console.log(nes_part_id);

    $.ajax({
        url: "php/delete_nesting_parts.php",
        type: "POST",
        data: {
            nes_part_id: nes_part_id,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {

            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function delete_laser_assign(nesting_details_id) {

    console.log(nesting_details_id);

    $.ajax({
        url: "php/delete_laser_assign.php",
        type: "POST",
        data: {
            nesting_details_id: nesting_details_id,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                salert("Success", "Deleted Successfully.", "success");
                setTimeout(() => {
                    get_nesting_details();
                }, 1000)
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

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

            if (response.trim() == "ok") {
                window.location.reload();
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function update_nesting_parts(nesting_id, part_id, quantity, nested_part_weight) {

    console.log(nesting_id, part_id, quantity, nested_part_weight);

    $.ajax({
        url: "php/update_nesting_parts.php",
        type: "POST",
        data: {
            nesting_id: nesting_id,
            part_id: part_id,
            quantity: quantity,
            weight: nested_part_weight
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                $("#nesting_parts_tbody").append(`<tr data-part_id=${part_id}><td>${$("#nested_parts").val()}</td><td>${quantity}</td><td>${nested_part_weight}</td><td><button class='btn btn-danger delete_btn'><i class='fa fa-trash'></i></button></td></tr>`);


                $("#nested_parts").val('');
                $("#nested_part_qty, #nested_part_weight").val('');
            }
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
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {

                setTimeout(function () {
                    window.location.reload();
                }, 500);
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function update_nesting_document(formData) {

    console.log(formData);

    $.ajax({
        url: "php/update_nesting_document.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {

                // window.location.reload();
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function get_nesting_master1(nes_master_id) {

    $.ajax({
        url: "php/get_nesting_master.php",
        type: "get", //send it through get method
        data: {

            nes_master_id: nes_master_id,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != 'error') {
                $("#nesting_details_tbody").empty();
                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count += 1;

                        var part = JSON.parse(item.nesting_parts) || '';
                        var parts = ``;

                        if (part != '') {
                            parts = `<ul class="list-group">`;
                            part.forEach(function (p) {

                                parts += `<li class="list-group-item p-1"><strong class='small'>${p.part_name}</strong> <span class='badge bg-primary'>${p.qty} Qty</span></li>`;

                            });

                            parts += `</ul>`;
                        };


                        var stock_info = JSON.parse(item.stock_info) || '';
                        var stock = ``;

                        if (stock_info != '') {
                            stock_info.forEach(function (s) {
                                stock += `<strong class='small'>${s.godown_name} ${s.dep_name != null ? "-" + s.dep_name : ''} ${s.sec_name != null ? "-" + s.sec_name : ''} <span class='badge bg-primary'>${s.available_qty} Qty</span></strong><br>`
                            })
                        }

                        $("#nesting_details_tbody").append(`
                            <tr>
                                <td>${count}</td><td>${item.nesting_name}</td>
                                <td>${item.nesting_material}</td>
                                <td>${stock}</td>
                                <td>${item.run_time}</td>
                                <td>${item.std_length}</td>
                                <td>${parts}</td>
                                <td><span class='badge ${item.nesting_type == 'std' ? 'bg-success' : 'bg-warning text-dark'}'>${item.nesting_type}</span></td>
                                <td>
                                    <div  class='d-flex justify-content-between'>
                                        <button type='button' class='btn btn-sm edit_btn btn-outline-warning mx-2' value=${item.nesting_id}><i class='fa fa-pen'></i></button>
                                        <button type='button' class='btn btn-sm delete_btn btn-outline-danger d-none' value=${item.nesting_id}><i class='fa fa-trash'></i></button>
                                    </div>
                                </td>
                            </tr>`);
                    })
                }
                else {
                    $("#nesting_details_tbody").append(`<tr><td colspan='7' class='text-center text-dange'>No Standard Nesting Found.</td></tr>`);
                }
            }
            else {
                salert("Error", response, "error");
            }


        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_nesting_master_single1(nes_master_id) {

    $.ajax({
        url: "php/get_nesting_master.php",
        type: "get", //send it through get method
        data: {

            nes_master_id: nes_master_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != 'error') {

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);
                    var count = 0;

                    $("#view_file").removeClass("d-none");

                    obj.forEach(function (item) {

                        count += 1;

                        var part = JSON.parse(item.nesting_parts) || ''
                        var parts = ``;

                        if (part != '') {
                            $("#nesting_parts_tbody").empty();

                            part.forEach(function (p) {

                                parts += `<tr data-total_weight="${parseFloat(p.qty) * parseFloat(p.weight)}" data-part_id=${p.part_id}><td>${p.part_name} </td><td>${p.qty} </td><td>${p.weight} </td><td><button type='button' class='btn btn-sm delete_btn btn-outline-danger' value=${p.nes_part_id}><i class='fa fa-trash'></i></button></td></tr>`;

                            });

                            $("#nesting_parts_tbody").append(parts);
                        }


                        $("#nesting_name").val(item.nesting_name);
                        $("#material_id").data("part_id", item.material_id).val(item.nesting_material);
                        $("#run_time").val(item.run_time);
                        $("#dimension").val(item.std_length);
                        $("#weight").val(item.weight);
                        $("#scrap_weight").val(item.scarp_weight);

                        $("#view_file").val(item.path);
                        $("#update_nesting_btn, #nested_part_add_btn").val(item.nesting_id)

                    })
                }
                else {

                }
            }
            else {
                salert("Error", response, "error");
            }


        },
        error: function (xhr) {
            //Do Something to handle error
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
            material_id: '',
            remaining_qty: 0

        },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {

                $("#work_nesting_details_tbody").empty();

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);

                    obj.forEach(function (item, index) {
                        index++;

                        let nesting = JSON.parse(item.nesting_parts_details);
                        let nesting_parts_details = '<ul class="list-group">';
                        nesting.forEach(function (obj) {

                            nesting_parts_details += `<li class="list-group-item p-1">${obj.part_name} <span class='badge bg-secondary'>${obj.qty} Qty</span></li>`;
                        })

                        nesting_parts_details += `</ul>`;


                        $("#work_nesting_details_tbody").append(`
                            <tr>
                                <td>${index}</td>
                                <td>${item.nesting_name}</td>
                                <td>${item.material_name}</td>
                                <td>
                                   <div class='d-flex justify-content-between'><span class='badge bg-success' title='Total Qty: ${item.material_qty}'>${item.material_qty}</span>
                                    <span class='badge bg-primary' title='Assigned Qty: ${item.total_assigned_qty}'>${item.total_assigned_qty}</span><span class='badge bg-danger' title='Remaining Qty: ${item.remaining_qty}'>${item.remaining_qty}</span></div>
                                </td>
                                <td>${item.run_time}</td>
                                <td><span class='badge ${item.nesting_type == 'std' ? 'bg-success' : 'bg-warning text-dark'}'>${item.nesting_type}</td>
                                <td>${item.emp_name}</td>
                                <td>${nesting_parts_details}</td>
                                <td>
                                    <div  class='d-flex justify-content-between'>
                                        <button type="button" class="btn btn-outline-primary btn-sm view_btn me-2" data-path="${item.path}">
                                            <i class="fa-solid fa-eye fa-beat"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-danger btn-sm  delete_btn" data-nesting_details_id='${item.nesting_details_id}' value='${item.job_card_id}'>
                                            <i class='fa fa-trash fa-beat'></i>
                                        </button>
                                    </div>    
                                </td>
                            </tr>
                        `);
                    });

                }
                else {
                    $("#work_nesting_details_tbody").append(`<tr><td colspan='8' class='text-center text-danger'>No Data Found</td></tr>`);
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