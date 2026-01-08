
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
    get_all_customer_group();

    $('#product_auto').on('input', function () {

        $('#product_model').prop('disabled', true)
        $('#product_sub_model').prop('disabled', true)
        $('#model_auto').val("")
        $('#sub_model_auto').val("")
        $('#product').val('0')
        $('#product_model').val('0')
        $('#product_sub_model').val('0')
        //check the value not empty
        if ($('#product_auto').val() != "") {
            $('#product_auto').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_jaysan_product_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            product: "%" + $('#product_auto').val() + "%",
                            term: 'pname',
                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.product_name,
                                    // value: item.part_no,
                                    id: item.product_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {
                    console.log(ui.item.id);

                    $("#product").val(ui.item.id).trigger("change")
                    //   $(this).data("selected-part_id", ui.item.id);
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
    $("#product").on("change", function () {
        $('#product_model').prop('disabled', true)
        $('#product_sub_model').prop('disabled', true)
        $('#model_auto').val("")
        $('#sub_model_auto').val("")
        $('#product_model').val('0')
        $('#product_sub_model').val('0')
        $('#product_auto').val($("#product").find(":selected").text()).trigger("change")
        get_jaysan_final_productmodel();
    })
    $('#model_auto').on('input', function () {

        $('#product_sub_model').prop('disabled', true)
        $('#sub_model_auto').val("")
        $('#product_model').val('0')
        $('#product_sub_model').val('0')
        //check the value not empty
        if ($('#model_auto').val() != "") {
            $('#model_auto').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_jaysan_product_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            product: "%" + $('#model_auto').val() + "%",
                            term: 'pmodel',

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.product_name,
                                    // value: item.part_no,
                                    id: item.model_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $("#product_model").val(ui.item.id).trigger("change")
                    //   $(this).data("selected-part_id", ui.item.id);
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

    $("#product_model").on("change", function () {
        $('#product_sub_model').prop('disabled', true)
        $('#sub_model_auto').val("")
        $('#product_sub_model').val("0")
        $("#model_auto").val($("#product_model").find(":selected").text())
        get_jaysan_final_producttype();
    })
    $('#sub_model_auto').on('input', function () {


        $('#product_sub_model').val('0')
        //check the value not empty
        if ($('#sub_model_auto').val() != "") {

            $("#add_new_product_btn").removeClass("d-none");
            $('#sub_model_auto').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_jaysan_product_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            product: "%" + $('#sub_model_auto').val() + "%",
                            term: 'ptype',

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                $("#add_new_product_btn").addClass("d-none");

                                return {
                                    label: item.product_name,
                                    // value: item.part_no,
                                    id: item.mtid,
                                    // part_name: item.part_name
                                };
                            }));

                        }


                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $("#product_sub_model").val(ui.item.id).trigger("change")
                    $("#add_new_product_btn").addClass("d-none");

                    //   $(this).data("selected-part_id", ui.item.id);
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

    $("#product_sub_model").on("change", function () {
        $("#add_new_product_btn").addClass("d-none");
        $("#sub_model_auto").val($("#product_sub_model").find(":selected").text())
        get_jaysan_model_subtype();
    })

    $("#product_base_price_submit_btn").on("click", function () {



        const mtid = $("#product_sub_model").val() || $("#sub_model_auto").data("mtid");
        const mrp = $("#product_base_price").val();
        const min_price = $("#product_base_min_price").val();
        const max_price = $("#product_base_max_price").val();

        let sub_type_price = [];
        let hasError = false;

        $("#product_type_tbody tr").each(function () {

            const row = $(this);
            const msid = row.data("msid");
            const price = row.find("#price_variation").val();
            const is_reduce = row.find("#product_price_type").val();

            if (!msid || !price || !is_reduce) {
                hasError = true;
                return false;
            }

            sub_type_price.push({ msid, price, is_reduce });
        });

        if (!mtid || !mrp || !min_price || !max_price || sub_type_price.length === 0 || hasError) {
            salert("Warning", "Fill all required fields", "warning");
            return;
        }

        console.log(mtid, mrp, min_price, max_price, sub_type_price);

        update_base_price(mtid, mrp, min_price, max_price, sub_type_price);
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

    $("#add_new_product_btn").on("click", function () {

        var product = $("#product_auto").val();
        var model = $("#model_auto").val();
        var sub_model = $("#sub_model_auto").val();
        console.log(product, model, sub_model);

        if (!product || !model || !sub_model || product === undefined || model === undefined || sub_model === undefined) {
            salert("Warning", "Data missing", "warning");
        }
        else {
            insert_jaysan_final_product(product, model, sub_model)
        }
    })

    $("#type_add_btn").on("click", function () {
        console.log($("#type_add_field").val());

        if ($("#type_add_field").val() === undefined || $("#type_add_field").val() == '') {
            salert("Warning", "Fill the type", "warning");
            return;
        }
        insert_jaysan_model_subtype($("#type_add_field").val());
    })



    // customer type


    $('#add_custome_type').on('input', function () {
        $("#customer_type_create_btn").prop("disabled", false);
        //check the value not empty
        $(this).removeData("cus_type_id");
        if ($('#add_custome_type').val() != "") {
            $('#add_custome_type').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_customer_group_auto.php",
                        type: "get", //send it through get method
                        data: {

                            group_name: $('#add_custome_type').val(),


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.group_name,
                                    value: item.group_name,
                                    id: item.group_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("cus_type_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)
                    if (ui.item.id) {

                        $("#customer_type_create_btn").prop("disabled", true);
                        $("#customer_Sub_type").removeClass("d-none");
                        get_customer_subgroup(ui.item.id)
                    }


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#customer_sub_type_f').on('input', function () {
        //check the value not empty
        if ($('#customer_sub_type_f').val() != "") {
            $('#customer_sub_type_f').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_customer_subgroup_auto.php",
                        type: "get", //send it through get method
                        data: {

                            sub_group_name: $('#customer_sub_type_f').val()

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.sub_group_name,
                                    value: item.sub_group_name,
                                    id: item.sub_group_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("sub_group_id", ui.item.id);
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

    $("#customer_type_create_btn").on("click", function () {

        const groupName = $("#add_custome_type").val().trim();
        if (!groupName) {
            salert("Warning", "Fill the field", "warning");
            return;
        }

        insert_customer_group_master(groupName);
    });


    $("#add_to_table").on("click", function () {

        const sub_group_name = $("#customer_sub_type_f").val().trim();
        const group_id = $("#add_custome_type").data("cus_type_id");
        console.log(group_id);

        if (!sub_group_name || !group_id) {
            salert("Warning", "Fill the field", "warning");
            return;
        }

        let dataObj = [];

        dataObj.push({
            sub_group_name,
            group_id
        });

        insert_customer_subgroup_master(dataObj);
    });



    $("#customer_modal_tbody").on("click", "button", function () {
        const subGroupId = $(this).data("sub_group_id");

        $("#delete_btn").data("sub_group_id", subGroupId);
        $("#deleteModal").modal("show");
    });


    $("#delete_btn").on("click", function () {
        const subGroupId = $(this).data("sub_group_id");

        if (!subGroupId) return;

        delete_customer_subgroup_master(subGroupId);
    });

    $("#customer_type").on("change", function () {
        console.log($(this).data("mtid"));

        get_customer_price($(this).data("mtid"), $(this).val())
    })


    $("#product_price_submit_btn").on("click", function () {

        let product_price = [];
        let features_price = [];

        let group_id = $("#customer_type").val();
        let mtid = $("#product_sub_model").val() || $("#sub_model_auto").data("mtid");
        let mrp = $("#cus_grp_mrp").val();
        let min_price = $("#cus_grp_min_price").val();
        let max_price = $("#cus_grp_max_price").val();

        const price_type = "main_group_price";

        if (!group_id || !mtid || !mrp || !min_price || !max_price) {
            salert("Warning", "Fill the fields", "warning");
            return;
        }


        product_price.push({
            price_type,
            group_id,
            mtid,
            mrp,
            min_price,
            max_price
        });


        $("#customer_type_tbody tr").each(function () {

            const row = $(this);

            const sub_group_id = row.data("sub_group_id");
            const row_mtid = row.data("mtid");

            const row_mrp = row.find("td").eq(2).text().trim();
            const row_min = row.find("td").eq(3).text().trim();
            const row_max = row.find("td").eq(4).text().trim();

            if (!sub_group_id || !row_mtid || !row_mrp || !row_min || !row_max) {
                salert("Warning", "Fill all customer price fields", "warning");
                return false;
            }

            product_price.push({
                price_type: "",
                group_id: sub_group_id,
                mtid: row_mtid,
                mrp: row_mrp,
                min_price: row_min,
                max_price: row_max
            });
        });



        $("#product_type_ttbody tr").each(function () {

            const row = $(this);
            const msid = row.data("msid");

            row.find("td[data-sub_group_id]").each(function () {

                const td = $(this);
                const sub_group_id = td.data("sub_group_id");
                const price = td.text().trim();
                var f_price_type = td.data("price_type");

                if (!sub_group_id) return;

                features_price.push({
                    price_type: f_price_type,
                    group_id: sub_group_id,
                    msid: msid,
                    price: price || 0
                });
            });
        });

        console.log(product_price, features_price);


        if (product_price.length && features_price.length) {
            insert_product_price(
                JSON.stringify(product_price),
                JSON.stringify(features_price)
            );
        } else {
            salert("Warning", "No price data found", "warning");
        }
    });


    let selectedCells = new Set();
    $("#customer_type_tbody").on("dblclick", "td", function () {

        const $td = $(this);
        const colIndex = $td.index();

        if (colIndex < 2) return;

        const cellKey = this;

        if (selectedCells.has(cellKey)) {
            selectedCells.delete(cellKey);
            $td.removeClass("border border-2 border-danger");
        } else {
            selectedCells.add(cellKey);
            $td.addClass("border border-2 border-danger");
        }
    });


    $("#cus_grp_mrp, #cus_grp_min_price, #cus_grp_max_price").on("input", function () {

        const price = $(this).val();

        if (!selectedCells.size) return;

        selectedCells.forEach(cell => {
            $(cell).text(price);
        });


    });


    let f_selectedCells = new Set();

    $("#product_type_ttbody").on("dblclick", "td", function () {

        const $cell = $(this);
        const colIndex = $cell.index();
        const $row = $cell.closest("tr");
        const lastIndex = $row.children("td").length - 1;

        
        if (colIndex < 2  || colIndex === lastIndex) return;

        
        if (colIndex === 2) {

            $row.children("td").each(function (i) {

                if (i < 3 || i === lastIndex) return;

                toggleCellSelection(this);
            });

            return;
        }

        
        toggleCellSelection(this);
    });


    
    function toggleCellSelection(cell) {

        if (f_selectedCells.has(cell)) {
            f_selectedCells.delete(cell);
            $(cell).removeClass("border border-2 border-danger");
        } else {
            f_selectedCells.add(cell);
            $(cell).addClass("border border-2 border-danger");
        }
    }


    $("#product_type_ttbody").on("input", "td", function () {

        const colIndex = $(this).index();

        if (colIndex !== 2) return;

        const price = $(this).text().trim();

        if (!f_selectedCells.size) return;

        f_selectedCells.forEach(cell => {
            $(cell).text(price);
        });
    });



    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            selectedCells.clear();
            f_selectedCells.clear();
            $("#customer_type_tbody td").removeClass("border border-2 border-danger");
            $("#product_type_ttbody td").removeClass("border border-2 border-danger");
        }
    });
    // $("#feature_load_btn").on("click", function () {
    //     get_jaysan_model_subtype_feature();
    // })


});










// function get_jaysan_model_subtype_feature() {
//     console.log($('#product_sub_model').val() || $("#sub_model_auto").data("mtid"));


//     $.ajax({
//         url: "php/get_jaysan_model_subtype.php",
//         type: "get", //send it through get method
//         data: {
//             mtid: $('#product_sub_model').val() || $("#sub_model_auto").data("mtid"),

//         },
//         success: function (response) {
//             console.log(response);
//             if (response.trim() != "error") {

//                 if (response.trim() !== "0 result") {

//                     const apiData = JSON.parse(response);

//                     apiData.forEach(function (item) {

//                         const base_p = JSON.parse(item.master);

//                         $("#product_type_ttbody tr").each(function () {

//                             const row = $(this);
//                             const table_msid = row.data("msid");
//                             var td = row.find("td").eq(2).text();

//                             if (table_msid == base_p.msid && td == 0) {


//                                 td.text(base_p.price);

//                             }
//                         });
//                     });
//                 }

//                 else {
//                     // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

//                 }
//             }





//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });




// }

function get_customer_price(mtid, group_id) {
    console.log(mtid, group_id);


    $.ajax({
        url: "php/get_customer_price.php",
        type: "get", //send it through get method
        data: {
            group_id: group_id,
            mtid: mtid,
        },
        success: function (response) {

            if (response.trim() !== "error") {

                console.log(response);

                if (response.trim() !== "0 result") {

                    const data = JSON.parse(response);

                    const subgroups = data.subgroups || [];
                    const groupPrice = data.group_price || {};
                    const groupSubtypes = data.group_subtypes || [];
                    const subgroupSubtypes = data.subgroup_subtypes || [];

                    var fixed_mrp = $("#product_base_price").val();
                    var fixed_min = $("#product_base_min_price").val();
                    var fixed_max = $("#product_base_max_price").val();

                    $("#cus_grp_mrp").val(groupPrice?.mrp !== null && groupPrice?.mrp !== undefined && groupPrice?.mrp !== "" ? groupPrice.mrp : fixed_mrp);
                    $("#cus_grp_min_price").val(groupPrice?.min_price !== null && groupPrice?.min_price !== undefined && groupPrice?.min_price !== "" ? groupPrice.min_price : fixed_min);
                    $("#cus_grp_max_price").val(groupPrice?.max_price !== null && groupPrice?.max_price !== undefined && groupPrice?.max_price !== "" ? groupPrice.max_price : fixed_max);

                    $("#customer_type_tbody").empty();

                    subgroups.forEach((sg, index) => {
                        $("#customer_type_tbody").append(`
                            <tr data-sub_group_id="${sg.sub_group_id}" data-mtid="${sg.mtid}">
                                <td>${index + 1}</td>
                                <td>${sg.sub_group_name}</td>
                                <td contenteditable="true" id='mrp'>${sg.mrp ?? groupPrice.mrp ?? fixed_mrp}</td>
                                <td contenteditable="true" id='min_p'>${sg.min_price ?? groupPrice.min_price ?? fixed_min}</td>
                                <td contenteditable="true" id='max_p'>${sg.max_price ?? groupPrice.max_price ?? fixed_max}</td>
                            </tr>
                        `);
                    });



                    $("#product_type_thead").empty();

                    let theadHtml = `
                                    <tr>
                                        <th>#</th>
                                        <th>Type</th>
                                        <th>Base Price</th>
                                `;

                    subgroups.forEach(sg => {
                        theadHtml += `<th data-sub_group_id="${sg.sub_group_id}" style='width:5%'>
                            ${sg.sub_group_name}
                        </th>`;
                    });

                    theadHtml += `<th>Action</th></tr>`;

                    $("#product_type_thead").append(theadHtml);


                    $("#product_type_ttbody").empty();

                    groupSubtypes.forEach((gt, index) => {


                        const matchedSubtype = subgroupSubtypes.find(st => st.msid === gt.msid);
                        const priceDetails = matchedSubtype ? matchedSubtype.price_details : [];

                        let customerTds = "";

                        subgroups.forEach(sg => {
                            const priceObj = priceDetails.find(p => p.sub_group_id === sg.sub_group_id);

                            customerTds += `
                                <td contenteditable="true"
                                    data-msid="${gt.msid}"
                                    data-sub_group_id="${sg.sub_group_id}" data-price_type=''>
                                    ${priceObj?.price ?? gt.main_price}
                                </td>
                            `;
                        });

                        $("#product_type_ttbody").append(`
                            <tr data-msid="${gt.msid}" data-mtid="${gt.mtid}">
                                <td>${index + 1}</td>
                                <td>${gt.subtype_name}</td>
                                <td id='edit_price_feature' data-sub_group_id='${gt.group_id}' data-price_type='main_subtype_price' contenteditable="true">${gt.main_price ?? 0}</td>

                                ${customerTds}

                                <td>
                                ${gt.is_reduce == 0 ? "+" : "-"}
                                </td>
                            </tr>
                        `);
                    });

                } else {
                    $("#customer_type_tbody").append(`
                        <tr>
                            <td colspan="5" class="text-center text-danger">Nothing Added</td>
                        </tr>
                    `);
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

            $('#product').empty()
            $('#product').append("<option value='0' selected disabled>Choose Options...</option>")
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
            $('#product_model').append("<option value='0' selected disabled>Choose Options...</option>")
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
            $('#product_sub_model').append("<option value='0' selected disabled>Choose Options...</option>")
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
    console.log($('#product_sub_model').val() || $("#sub_model_auto").data("mtid"));
    $("#sub_type_section").removeClass("d-none");


    $.ajax({
        url: "php/get_jaysan_model_subtype.php",
        type: "get", //send it through get method
        data: {
            mtid: $('#product_sub_model').val() || $("#sub_model_auto").data("mtid"),

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
                        const base_p = JSON.parse(obj.master);


                        $("#product_base_price").val(base_p.mrp)
                        $("#product_base_min_price").val(base_p.min_price)
                        $("#product_base_max_price").val(base_p.max_price)
                        $('#product_type_tbody').append(`<tr data-msid='${obj.msid}'>

                                    <td>${count}</td>
                                    <td>${obj.subtype_name}</td>
                                    <td>
                                        <input type="number" class="form-control rounded-3" value='${obj.price}' id="price_variation"
                                        placeholder="Base Price">
                                    </td>
                                    <td>
                                        <select class="form-select" id="product_price_type">
                                            <option disabled value="null">Choose...</option>
                                            <option ${obj.is_reduce === 0 ? "selected" : ''} value="+">+</option>
                                            <option ${obj.is_reduce === 1 ? "selected" : ''} value="-">-</option>
                                        </select>
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

function insert_jaysan_final_product(product_name, product_model, product_type) {

    $.ajax({
        url: "php/insert_jaysan_final_product.php",
        type: "get", //send it through get method
        data: {

            product_name: product_name,
            product_model: product_model,
            product_type: product_type,
        },
        success: function (response) {
            console.log(response);


            if (response.trim() > 0) {
                $("#sub_type_section").removeClass("d-none");
                $("#add_new_product_btn").addClass("d-none");
                $('#sub_model_auto').data("mtid", response);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_jaysan_model_subtype(subtype_name) {

    console.log($('#product_sub_model').val() || $("#sub_model_auto").data("mtid"));

    $.ajax({
        url: "php/insert_jaysan_model_subtype.php",
        type: "get", //send it through get method
        data: {

            mtid: $('#product_sub_model').val() || $("#sub_model_auto").data("mtid"),
            subtype_name: subtype_name,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                get_jaysan_model_subtype();
                $("#type_add_field").val("")
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function update_base_price(mtid, mrp, min_price, max_price, sub_type_price) {
    console.log(mtid, mrp, min_price, max_price, sub_type_price);


    $.ajax({
        url: "php/update_base_price.php",
        type: "post", //send it through get method
        data: {

            mtid: mtid,
            mrp: mrp,
            min_price: min_price,
            max_price: max_price,
            sub_type_price: JSON.stringify(sub_type_price),
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                $("#product_type_table_next, #customer_type_table_next, #customer_type_view")
                    .removeClass("d-none");

                $("#product_type_table, #sub_type_section").addClass("d-none");

                $("#product, #product_auto, #product_model, #model_auto, #product_sub_model, #sub_model_auto, #product_base_price, #product_base_min_price, #product_base_max_price")
                    .prop("disabled", true);

                $("#customer_type").data("mtid", mtid);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

// customer type

function insert_customer_group_master(group_name) {

    $.ajax({
        url: "php/insert_customer_group_master.php",
        type: "post", //send it through get method
        data: {

            group_name: group_name,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() > 0) {
                $("#customer_type_create_btn").prop("disabled", true);
                $("#customer_Sub_type").removeClass("d-none");
                $("#add_custome_type").data("cus_type_id", response);

                get_all_customer_group();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_customer_subgroup_master(dataObj) {

    console.log(dataObj);

    $.ajax({
        url: "php/insert_customer_subgroup_master.php",
        type: "post", //send it through get method
        data: {

            sub_group_json: JSON.stringify(dataObj),
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {

                $("#customer_sub_type_f").val("");
                get_customer_subgroup($("#add_custome_type").data("cus_type_id"));

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_all_customer_group() {



    $.ajax({
        url: "php/get_all_customer_group.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {
            console.log(response);
            $('#customer_modal_tbody').empty()
            if (response.trim() != "error") {

                if (response.trim() != "0 result") {
                    $('#customer_type').empty();
                    var obj = JSON.parse(response);
                    var count = 0
                    $('#customer_type').append(`<option selected disabled value="null">Choose...</option>`)

                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#customer_modal_tbody').append(`<tr>

                                    <td>${count}</td>
                                    <td>${obj.group_name}</td><td></td>

                                </tr>`)

                        $('#customer_type').append(`<option  value='${obj.group_id}'>${obj.group_name}</option>`)

                    });


                }
                else {
                    $('#customer_modal_tbody').append(`<tr>

                                    <td colspan='3' class='text-center text-danger'>No Data Available</td>

                                </tr>`)

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_customer_subgroup(group_id) {


    $.ajax({
        url: "php/get_customer_subgroup.php",
        type: "get", //send it through get method
        data: {
            group_id: group_id

        },
        success: function (response) {
            console.log(response);
            $('#customer_modal_tbody').empty()
            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0

                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#customer_modal_tbody').append(`<tr>

                                    <td>${count}</td>
                                    <td>${obj.sub_group_name}</td>
                                    <td><button class="btn btn-danger" data-sub_group_id='${obj.sub_group_id}'><i class="fa fa-trash"></i></button></td>
                                </tr>`)

                    });


                }
                else {
                    $('#customer_modal_tbody').append(`<tr>
                                    <td colspan='3' class='text-center text-danger'>No Data Available</td>
                                </tr>`)

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function delete_customer_subgroup_master(sub_group_id) {


    $.ajax({
        url: "php/delete_customer_subgroup_master.php",
        type: "get", //send it through get method
        data: {
            sub_group_id: sub_group_id

        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                $("#deleteModal").modal("hide");
                get_customer_subgroup($("#add_custome_type").data("cus_type_id"))
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

// final

function insert_product_price(product_price, features_price) {

    console.log(product_price, features_price);


    $.ajax({
        url: "php/insert_product_price.php",
        type: "post", //send it through get method
        data: {

            product_price: product_price,
            features_price: features_price,
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