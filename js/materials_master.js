
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];
var stock_master = [];

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

    $("#godown_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#godown_list li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    get_jaysan_final_product();


    get_parts();

    $("#alise_checkbox").on("change", function () {

        if ($(this).is(":checked")) {
            $(".alise_table").removeClass("d-none");
        }
        else {
            $(".alise_table").addClass("d-none");
        }
    })

    $("#add_alise_name").on("click", function () {

        var alise_name = $("#alise_name").val();

        if (alise_name) {
            $("#alise_tbody").append(`<tr><td>${alise_name}</td><td><button type="button" class="p-0 border-0 btn btn-outline-danger alise_delete_btn" id=""><i class="fa fa-trash "></i></button></td></tr>`)
            $("#alise_name").val('')
        }
        else {
            salert("Warning", "First Enter Alise Name.", "warning");
        }
    })

    $("#alise_tbody").on("click", " .alise_delete_btn", function () {

        var row = $(this).closest("tr");

        Swal.fire({
            title: "Delete",
            text: "Are You Sure!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel"
        }).then((result) => {

            if (result.isConfirmed) {
                row.remove();
            }

        });

    });

    $('#part_name').on('input', function () {
        //check the value not empty
        $(this).data("part_id", '')
        if ($('#part_name').val() != "") {
            $('#part_name').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_parts.php",
                        type: "get", //send it through get method
                        data: {

                            part: $('#part_name').val(),
                            term: '',

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
                    //  get_bom(ui.item.id)
                    get_parts_tbl(ui.item.id);


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    // Godown 

    $("#available_godown").on("change focusout", function () {

        if ($(this).val() == 1) {
            $("#modal_part_name").text($("#part_name").val())
            $("#godownModal").modal("show");

        }
        else {
            $("#godownModal").modal("hide");
        }
    })

    
    $('#godown').on('input', function () {

        $(this).removeData("godown_id");
        if ($(this).val().trim() === '') {
            $(this).removeData("godown_id");
        }

        $('#department').val('').removeData("dept_id");
        $('#section').val('').removeData("section_id");
        $('#mini_order_qty').val('');
        $('#max_order_qty').val('');
        $('#rack').val('');
        $('#bin').val('');

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

        $('#section').val('').removeData("section_id");
        $('#min_order_qty').val('');
        $('#max_order_qty').val('');
        $('#rack').val('');
        $('#bin').val('');

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


        $('#machine').val('').removeData("machine_id");
        $('#min_order_qty').val('');
        $('#max_order_qty').val('');
        $('#rack').val('');
        $('#bin').val('');


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
                            dep_id: $("#department").data("dept_id") || $("#department_da").find("li").find("a").data("dept_id")

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

    $("#add_avialable_godown").click(function () {

        var part_id = $(this).val() || 0;
        var master_id = $(this).data('master_id');

        var godown = $("#godown").val();
        var godown_id = $("#godown").data("godown_id");
        var department = $("#department").val();
        var department_id = $("#department").data("dept_id");
        var section = $("#section").val();
        var section_id = $("#section").data("sec_id");
        var min_order_qty = $("#mini_order_qty").val();
        var max_order_qty = $("#max_order_qty").val();
        var rack = $("#rack").val();
        var bin = $("#bin").val();

        var godown_type = '';
        var store_id = '';
        var store = ''

        if (godown_id && !department_id && !section_id) {
            godown_type = 'godown';
            store_id = godown_id;
            store = godown;
        }
        else if (godown_id && department_id && !section_id) {
            godown_type = 'dept';
            store_id = department_id;
            store = department;
        }
        else if (godown_id && department_id && section_id) {
            godown_type = 'sec';
            store_id = section_id;
            store = section;
        }
        else {
            salert("Warning", " Please Select Alteast Godown.", "warning");
            return;
        }



        if (master_id > 0) {
            update_sec_stock_master(master_id, min_order_qty, max_order_qty, store_id, godown_type, rack, bin, part_id);
        }
        else if (part_id > 0 && !master_id > 0) {
            insert_sec_stock_master(part_id, min_order_qty, max_order_qty, store_id, godown_type, rack, bin);
        }
        else {
            $("#available_godown_tbody").append(`<tr data-store_id='${store_id}' data-godown_id='${godown_id}' data-department_id='${department_id}' data-section_id='${section_id}' data-min_order_qty='${min_order_qty}' data-max_order_qty='${max_order_qty}' data-rack='${rack}' data-bin='${bin}' data-godown_type='${godown_type}'>
                <td>${store}</td>
                <td>${godown_type}</td>
                <td>${min_order_qty}</td>
                <td>${max_order_qty}</td>
                <td>${rack}</td>
                <td>${bin}</td>
                <td><button class="btn btn-sm btn-danger delete_godown_btn">Delete</button></td>
            </tr>`);
        }

        $("#clear_avialable_godown").trigger("click")
    })

    $("#available_godown_tbody").on("click", ".delete_godown_btn", function () {

        var row = $(this).closest("tr");
        var master_id = $(this).data("master_id") || 0

        Swal.fire({
            title: "Delete",
            text: "Are You Sure!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {

                if (master_id > 0) {
                    delete_sec_stock_master(master_id, row);
                }
                else {
                    row.remove();
                }
            }
        })
    })

    $("#available_godown_tbody").on("click", ".edit_godown_btn", function () {

        var row = $(this).closest("tr");
        var master_id = $(this).data("master_id")

        $("#add_avialable_godown").removeData("master_id");
        $("#selected_store").empty();

        if (master_id > 0) {
            $("#add_avialable_godown").data("master_id", master_id);
            $("#selected_store").html(`<strong class='text-primary'>${row.find("td").eq(0).text()}</strong> <span>${row.find("td").eq(1).text()}</span>`)
            $("#mini_order_qty").val(row.find("td").eq(2).text());
            $("#max_order_qty").val(row.find("td").eq(3).text());
            $("#rack").val(row.find("td").eq(4).text());
            $("#bin").val(row.find("td").eq(5).text());
        }
        else {
            salert("Warning", "Data Missing!, Try Later.", "warning");
        }

    })

    $("#add_godown_details_btn").on("click", function () {

        stock_master = [];

        $("#available_godown_tbody tr").each(function () {

            var store_id = $(this).data("store_id");
            var store_type = $(this).data("godown_type");
            var min_qty = $(this).data("min_order_qty");
            var max_qty = $(this).data("max_order_qty");
            var rack = $(this).data("rack");
            var bin = $(this).data("bin");

            stock_master.push({
                store_id: store_id,
                store_type: store_type,
                min_qty: min_qty,
                max_qty: max_qty,
                rack: rack,
                bin: bin
            })
        })

        console.log(stock_master);


        if (stock_master.length <= 0) {
            salert("Warning", "Add Atleast One Godown Details.", "warning");
        }
        else {
            $("#godownModal").modal("hide");
        }


    });

    $(".modal_close_btn").click(function () {
        $("#available_godown").val(0);
    })

    $("#clear_avialable_godown").on("click", function (e) {

        e.preventDefault();

        $("#godown, #department, #section, #mini_order_qty, #max_order_qty, #rack, #bin").val("");

        $("#godown").data("godown_id", '');
        $("#department").data("dept_id", '');
        $("#section").data("sec_id", '');


        $("#add_avialable_godown").removeData("master_id");
        $("#selected_store").empty();
    });



    //   GST Applicability
    $("#gst_applicability").on("change", function () {

        if ($(this).val() == "1") {
            $("#gst_section").removeClass("d-none");
        }
        else {
            $("#gst_section").addClass("d-none");
        }
    })

    // BOM

    $("#alter_component").on("change focusout", function () {

        if ($(this).val() == 1) {

            if ($("#edit_part_btn").data("part_id") > 0) {
                if ($("#part_name").data("part_id")) {
                    window.location.href = "welding_process.html?part_id=" + $("#part_name").data("part_id") + "&part_name=" + encodeURIComponent($("#part_name").val());
                }
                else {
                    salert("Warning", "First select part name.", "warning");
                    $(this).val('');
                }
            }
            else {
                salert("Message", "After Creating Part, Set The BOM Details.", "warning");
            }


        }
    })

    // opening balance
    // $("#open_balance_qty").on("focusout", function () {

    //     var qty = $(this).val();

    //     if (qty && qty > 0) {
    //         $("#opening_balanceModal").modal("show");
    //     }
    //     else {
    //         $("#opening_balanceModal").modal('hide');
    //     }
    // })

    // $("#opening_balance_godown_list_select").on("dblclick", "li", function () {


    //     var g_name = $(this).text().trim();

    //     $("#opening_balance_godown_details").append(`

    //                                                     <li class="list-group-item border rounded-3 shadow-sm p-3">

    //                                     <div class="row g-2 align-items-center">

    //                                         <div class="col-md-3">
    //                                             <label class="form-label small text-muted mb-1">
    //                                                 Godown
    //                                             </label>

    //                                             <input type="text" class="form-control form-control-sm rounded-3"
    //                                                 placeholder="Enter Godown">
    //                                         </div>

    //                                         <div class="col-md-2">
    //                                             <label class="form-label small text-muted mb-1">
    //                                                 Qty
    //                                             </label>

    //                                             <input type="number" class="form-control form-control-sm rounded-3"
    //                                                 placeholder="0">
    //                                         </div>

    //                                         <div class="col-md-2">
    //                                             <label class="form-label small text-muted mb-1">
    //                                                 Rate
    //                                             </label>

    //                                             <input type="number" class="form-control form-control-sm rounded-3"
    //                                                 placeholder="0.00">
    //                                         </div>

    //                                         <div class="col-md-2">
    //                                             <div class="form-floating">
    //                                                 <select class="form-select" id="">
    //                                                     <option selected disabled value="">Choose...</option>
    //                                                     <option value="">Nos</option>
    //                                                     <option value="">Kg</option>
    //                                                     <option value="">Mm</option>
    //                                                 </select>
    //                                                 <label for="">Per</label>
    //                                             </div>
    //                                         </div>

    //                                         <div class="col-md-2">
    //                                             <label class="form-label small text-muted mb-1">
    //                                                 Amount
    //                                             </label>

    //                                             <input type="number" class="form-control form-control-sm rounded-3"
    //                                                 placeholder="0.00">
    //                                         </div>

    //                                         <div class="col-md-1 text-end">
    //                                             <label class="form-label d-block small text-muted mb-1">
    //                                                 Action
    //                                             </label>

    //                                             <button class="btn btn-sm btn-danger rounded-3">
    //                                                 Delete
    //                                             </button>
    //                                         </div>

    //                                     </div>

    //                                 </li>

    //                 `)


    // })

    // alter standard rate

    // $("#alter_standard_rate").on("change", function () {

    //     if ($(this).val() == "yes") {
    //         $("#alter_standard_rateModal").modal("show");
    //     } else {
    //         $("#alter_standard_rateModal").modal("hide");
    //     }
    // })

    $('#under').on('input', function () {
        //check the value not empty
        $(this).data("part_id", '');
        if ($('#under').val() != "") {
            $('#under').autocomplete({
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
                                    label: item.part_name,
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
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $("#add_alter_rate_row").on("click", function () {
        $("#alter_standard_rate_tbody").append(`
               <tr>

                                            <!-- Standard Cost -->

                                            <td>
                                                <input type="date"
                                                    class="form-control form-control-sm rounded-3 shadow-sm">
                                            </td>

                                            <td>
                                                <input type="number"
                                                    class="form-control form-control-sm rounded-3 shadow-sm"
                                                    placeholder="Rate">
                                            </td>

                                            <td>
                                                <select class="form-select form-select-sm rounded-3 shadow-sm">
                                                    <option selected disabled>
                                                        Per
                                                    </option>

                                                    <option value="Nos">Nos</option>
                                                    <option value="Kg">Kg</option>
                                                    <option value="Mm">Mm</option>
                                                </select>
                                            </td>

                                            <!-- Standard Selling Price -->

                                            <td>
                                                <input type="date"
                                                    class="form-control form-control-sm rounded-3 shadow-sm">
                                            </td>

                                            <td>
                                                <input type="number"
                                                    class="form-control form-control-sm rounded-3 shadow-sm"
                                                    placeholder="Rate">
                                            </td>

                                            <td>
                                                <select class="form-select form-select-sm rounded-3 shadow-sm">
                                                    <option selected disabled>
                                                        Per
                                                    </option>

                                                    <option value="Nos">Nos</option>
                                                    <option value="Kg">Kg</option>
                                                    <option value="Mm">Mm</option>
                                                </select>
                                            </td>

                                        </tr>
            `);
    })

    $("#add_part_btn").on("click", function () {

        var part_name = $("#part_name").val();
        var part_no = $("#part_no").val();
        var des = $("#part_des").val();
        // var part_image = $("#image_path")[0].files[0];
        var sub_ass = $("#sub_ass").is(":checked") ? 1 : 0;
        var reorder_qty = $("#reorder_qty").val();
        var min_order_qty = $("#min_order_qty").val();
        var Parent = $("#under").val();
        var category = $("#category").val();
        var baseunits = $("#uom").val();
        var gstrate = $("#gst_rate").val();
        var tally_part = 0;
        var alias_name = $("#alise_name").val();
        var is_sale_item = $("#sale_item").val();
        var item_grade = $("#item_grade").val();
        var preference = $("#item_prefernce").val();
        var is_godown_available = $("#available_godown").val();
        var under_partid = $("#under").data("part_id");
        var alternate_unit = $("#alternative_uom").val();
        var base_value = $("#alternative_uom_value").val();
        var is_bom = $("#alter_component").val();
        var alter_std_rate = $("#alter_standard_rate").val();
        var is_gst_appicable = $("#gst_applicability").val();
        var hsn_code = $("#hsn_sac").val();
        var hsn_des = $("#description").val();
        var gstdetails = $("#gst_details").val();
        var type_of_supply = $("#supply_type").val();

        if (!part_name || !part_no) {
            salert("Warning", "Part Name And Part No Is Required.", "warning");
            return;
        }

        var formData = new FormData();

        var imageFile = $("#image_path")[0].files[0];

        if (imageFile) {
            formData.append("file", imageFile);
        }

        formData.append("part_name", part_name);
        formData.append("part_no", part_no);
        formData.append("des", des);
        // formData.append("part_image", part_image);
        formData.append("sub_ass", sub_ass);
        formData.append("reorder_qty", reorder_qty);
        formData.append("min_order_qty", min_order_qty);
        formData.append("Parent", Parent);
        formData.append("category", category);
        formData.append("baseunits", baseunits);
        formData.append("gstrate", gstrate);
        formData.append("tally_part", tally_part);
        formData.append("alias_name", alias_name);
        formData.append("is_sale_item", is_sale_item);
        formData.append("item_grade", item_grade);
        formData.append("preference", preference);
        formData.append("is_godown_available", is_godown_available);
        formData.append("under_partid", under_partid);
        formData.append("alternate_unit", alternate_unit);
        formData.append("base_value", base_value);
        formData.append("is_bom", is_bom);
        formData.append("alter_std_rate", alter_std_rate);
        formData.append("is_gst_appicable", is_gst_appicable);
        formData.append("hsn_code", hsn_code);
        formData.append("hsn_des", hsn_des);
        formData.append("gstdetails", gstdetails);
        formData.append("type_of_supply", type_of_supply);
        formData.append("stock_master", JSON.stringify(stock_master));


        insert_parts_tbl(formData)

    });


    // update and delete

    $("#parts_list").on("dblclick", "li", function () {

        var part_id = $(this).data("part_id");

        if (part_id) {
            get_parts_tbl(part_id);
        }
        else {
            salert("Warning", "Data Missing!, Try Later.", "warning");
        }
    })

    $("#edit_part_btn").on("click", function () {


        var part_name = $("#part_name").val();
        var part_id = $(this).data("part_id");
        var part_no = $("#part_no").val();
        var des = $("#part_des").val();
        var part_image = $("#image_path")[0].files[0];
        var sub_ass = $("#sub_ass").is(":checked") ? 1 : 0;
        var reorder_qty = $("#reorder_qty").val();
        var min_order_qty = $("#min_order_qty").val();
        var Parent = $("#under").val();
        var category = $("#category").val();
        var baseunits = $("#uom").val();
        var gstrate = $("#gst_rate").val();
        var tally_part = $(this).val() ?? 0;
        var alias_name = $("#alise_name").val();
        var is_sale_item = $("#sale_item").val();
        var item_grade = $("#item_grade").val();
        var preference = $("#item_prefernce").val();
        var is_godown_available = $("#available_godown").val();
        var under_partid = $("#under").data("part_id");
        var alternate_unit = $("#alternative_uom").val();
        var base_value = $("#alternative_uom_value").val();
        var is_bom = $("#alter_component").val();
        var alter_std_rate = $("#alter_standard_rate").val();
        var is_gst_appicable = $("#gst_applicability").val();
        var hsn_code = $("#hsn_sac").val();
        var hsn_des = $("#description").val();
        var gstdetails = $("#gst_details").val();
        var type_of_supply = $("#supply_type").val();

        if (!part_name || !part_id || part_id < 1 || !part_no) {
            salert("Warning", "Part Name And Part No Is Required.", "warning");
            return;
        }

        var formData = new FormData();


        formData.append("part_name", part_name);
        formData.append("part_no", part_no);
        formData.append("des", des);
        // formData.append("part_image", part_image);
        formData.append("sub_ass", sub_ass);
        formData.append("reorder_qty", reorder_qty);
        formData.append("min_order_qty", min_order_qty);
        formData.append("Parent", Parent);
        formData.append("category", category);
        formData.append("baseunits", baseunits);
        formData.append("gstrate", gstrate);
        formData.append("tally_part", tally_part);
        formData.append("alias_name", alias_name);
        formData.append("is_sale_item", is_sale_item);
        formData.append("item_grade", item_grade);
        formData.append("preference", preference);
        formData.append("is_godown_available", is_godown_available);
        formData.append("under_partid", under_partid);
        formData.append("alternate_unit", alternate_unit);
        formData.append("base_value", base_value);
        formData.append("is_bom", is_bom);
        formData.append("alter_std_rate", alter_std_rate);
        formData.append("is_gst_appicable", is_gst_appicable);
        formData.append("hsn_code", hsn_code);
        formData.append("hsn_des", hsn_des);
        formData.append("gstdetails", gstdetails);
        formData.append("type_of_supply", type_of_supply);
        formData.append("part_id", part_id);
        // formData.append("stock_master", JSON.stringify(stock_master));

        // alert(is_godown_available);

        update_parts_tbl(formData)

    });

    $("#update_godown_details_btn").click(function () {
        $("#godownModal").modal("hide");
    })


    $("#delete_part_btn").on("click", function () {

        var part_id = $(this).val();

        Swal.fire({
            title: "Delete",
            text: "Are You Sure!, The Part Cann't Be Retrived.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel"
        }).then((result) => {

            if (result.isConfirmed) {
                if (part_id > 0) {
                    delete_parts_tbl(part_id)
                }
                else {
                    salert("Warning", "Data Missing!, Try Later.", "warning");
                }
            }

        });

    });

    $("#image_path").on('change', function () {

        var part_id = $("#edit_part_btn").data("part_id");
        var part_no = $("#part_no").val();
        var imageFile = $("#image_path")[0].files[0];

        if (part_id && part_no && imageFile) {

            var formData = new FormData();

            formData.append('part_id', part_id);
            formData.append('part_no', part_no);

            formData.append("file", imageFile);
            formData.append("file_name", imageFile.name);

            upload_part_image(formData, part_id);
        }

    });
});





function insert_parts_tbl(formData) {

    $.ajax({
        url: "php/insert_parts_tbl.php",
        type: "POST",
        data: formData,

        processData: false,
        contentType: false,

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {

                salert(
                    "Success",
                    "Part Created Successfully.",
                    "success"
                );

                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function update_parts_tbl(formData) {

    $.ajax({
        url: "php/update_parts_tbl.php",
        type: "POST",
        data: formData,

        processData: false,
        contentType: false,

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {

                salert(
                    "Success",
                    "Part Updated Successfully.",
                    "success"
                );

                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function upload_part_image(formData, part_id) {

    $.ajax({
        url: "php/upload_part_image.php",
        type: "POST",
        data: formData,

        processData: false,
        contentType: false,

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {

                salert(
                    "Success",
                    "Part Created Successfully.",
                    "success"
                );


                setTimeout(() => {
                    get_parts_tbl(part_id);
                }, 500);
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function delete_sec_stock_master(master_id, row) {

    $.ajax({
        url: "php/delete_sec_stock_master.php",
        type: "get",
        data: {
            master_id: master_id,
        },

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {


                salert(
                    "Success",
                    "Godown Deleted Successfully.",
                    "success"
                );
                row.remove();
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function delete_parts_tbl(part_id) {

    $.ajax({
        url: "php/delete_parts_tbl.php",
        type: "get",
        data: {
            part_id: part_id,
        },

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {


                salert(
                    "Success",
                    "Part Deleted Successfully.",
                    "success"
                );

                setTimeout(() => {
                    location.reload();
                }, 300)
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function insert_sec_stock_master(part_id, min_order_qty, max_order_qty, store_id, godown_type, rack, bin) {

    console.log(part_id, min_order_qty, max_order_qty, store_id, godown_type, rack, bin);

    $.ajax({
        url: "php/insert_sec_stock_master.php",
        type: "POST",
        data: {
            part_id: part_id,
            min_qty: min_order_qty,
            max_qty: max_order_qty,
            store_id: store_id,
            store_type: godown_type,
            rack: rack,
            bin: bin,
        },


        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {

                salert(
                    "Success",
                    "Godown Added Successfully.",
                    "success"
                );

                setTimeout(() => {
                    $("#available_godown_tbody").empty();
                    get_parts_tbl(part_id);
                }, 500);
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function update_sec_stock_master(master_id, min_order_qty, max_order_qty, store_id, godown_type, rack, bin, part_id) {

    console.log(master_id, min_order_qty, max_order_qty, store_id, godown_type, rack, bin, part_id);

    $.ajax({
        url: "php/update_sec_stock_master.php",
        type: "POST",
        data: {
            master_id: master_id,
            min_qty: min_order_qty,
            max_qty: max_order_qty,
            store_id: store_id,
            store_type: godown_type,
            // rack: rack,
            // bin: bin,
        },


        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {


                $("#add_avialable_godown").removeData("master_id");
                $("#selected_store").empty();

                salert(
                    "Success",
                    "Godown Updated Successfully.",
                    "success"
                );

                setTimeout(() => {
                    $("#available_godown_tbody").empty();
                    get_parts_tbl(part_id);
                }, 500);
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function get_parts_tbl(part_id) {

    console.log(part_id);

    $.ajax({
        url: "php/get_parts_tbl.php",
        type: "get", //send it through get method
        data: {

            part_id: part_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== 'error') {
                if (response.trim() !== '0 result') {

                    $("#edit_part_btn, #delete_part_btn, #update_godown_details_btn").removeClass('d-none');
                    $("#add_part_btn, #add_godown_details_btn").addClass('d-none');

                    var obj = JSON.parse(response);

                    obj.forEach(function (obj) {

                        $("#edit_part_btn").val(obj.tally_part).data("part_id", obj.part_id);
                        $("#add_avialable_godown, #delete_part_btn").val(obj.part_id);

                        $("#part_name").val(obj.part_name ?? '').data('part_id', obj.part_id);
                        $("#part_no").val(obj.part_no ?? '');
                        $("#part_des").val(obj.des ?? '');
                        $("#sub_ass").prop("checked", obj.sub_ass == 1);
                        $("#reorder_qty").val(obj.reorder_qty ?? '');
                        $("#min_order_qty").val(obj.min_order_qty ?? '');
                        $("#under").val(obj.Parent ?? '').data('part_id', obj.under_partid);
                        $("#category").val(obj.category ?? '');
                        $("#uom").val(obj.baseunits ?? '');
                        $("#gst_rate").val(obj.gstrate ?? '');
                        $("#alise_name").val(obj.alias_name ?? '');
                        $("#sale_item").val(obj.is_sale_item == 1 ? 1 : 0);
                        $("#item_grade").val((obj.item_grade ?? '').toLowerCase());
                        $("#item_prefernce").val(obj.preference ?? '');
                        $("#available_godown").val(obj.is_godown_available == 1 ? 1 : 0);
                        $("#under").data("part_id");
                        $("#alternative_uom").val(obj.alternate_unit ?? '');
                        $("#alternative_uom_value").val(obj.base_value ?? '');
                        $("#alter_component").val(obj.is_bom == 1 ? 1 : 0);
                        $("#alter_standard_rate").val(obj.alter_std_rate == 1 ? 1 : 0);
                        $("#gst_applicability").val(obj.is_gst_appicable == 1 ? 1 : 0);
                        $("#hsn_sac").val(obj.hsn_code ?? '');
                        $("#description").val(obj.hsn_des ?? '');
                        $("#gst_details").val(obj.gstdetails ?? '');
                        $("#supply_type").val(obj.type_of_supply ?? '');

                        var stock = obj.stock_master ?? '';

                        if (stock != '') {
                            stock = JSON.parse(stock);
                            stock.forEach(function (item) {
                                $("#available_godown_tbody").append(`<tr>
                                    <td>${item.store_name}</td>
                                    <td>${item.store_type}</td>
                                    <td>${item.min_qty}</td>
                                    <td>${item.max_qty}</td>
                                    <td>${item.rack}</td>
                                    <td>${item.bin}</td>
                                    <td>
                                        <button class="btn btn-sm btn-secondary edit_godown_btn" data-master_id='${item.master_id}' data-store_id='${item.store_id}'>Edit</button>
                                        <button class="btn btn-sm btn-danger delete_godown_btn" data-master_id='${item.master_id}'>Delete</button>
                                    </td>
                                </tr>`);
                            })
                        }

                    })
                }
                else {

                }

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_parts() {

    $.ajax({
        url: "php/get_parts.php",
        type: "get", //send it through get method
        data: {

            part: '',
            term: '',
        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== 'error') {
                $("#parts_list").empty();
                if (response.trim() !== '0 result') {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (obj, index) {

                        count++;
                        $("#parts_list").append(`<li class="list-group-item" data-part_id='${obj.part_id}'>${obj.part_name}</li>`)

                    })
                    $(".part_count").text(count)
                }
                else {

                }

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_jaysan_final_product() {

    $.ajax({
        url: "php/get_jaysan_final_product.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== 'error') {
                $("#under").empty();
                $("#under").append(`<option selected disabled value="">Choose...</option>`);
                if (response.trim() !== '0 result') {

                    var obj = JSON.parse(response);


                    obj.forEach(function (obj) {

                        $("#under").append(`<option value="${obj.product_id}">${obj.product_name}</option>`);

                    })
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