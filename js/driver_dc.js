
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];

let historyQueue = [];
let currentIndex = 0;
let output_qty = 0;

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


    $("#part_search").on("keyup", function () {

        var value = $(this).val().toLowerCase();

        $("#manual_dc_card .card-body").each(function () {

            $(this).toggle(
                $(this).text().toLowerCase().indexOf(value) > -1
            );

        });

    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#godown').on('input', function () {
        $(this).removeData("godown_id");
        $("#dc_switch").prop("checked", false);
        $(".dc_details").empty();
        $(".dc_filess").prop("disabled", true);
        $(".alert_text").text('');
        $("#dc_switch").prop("checked", false);

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
                    get_transport_parts_dc(ui.item.id);
                    $(".dc_filess").prop("disabled", false);

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $(".dc_details").on("click", ".driver_confrim_btn", function () {
        var stock_json = $(this).data("stock_id_qty");

        var dc_type = $("#dc_switch").is(":checked") ? 1 : 0;
        console.log(stock_json);

        if (stock_json.length > 0 && dc_type == 0) {
            load_transport(JSON.stringify(stock_json));
        }
        else if (stock_json.length > 0 && dc_type == 1 && $('#godown').data("godown_id") > 0) {
            un_load_transport(JSON.stringify(stock_json), $('#godown').data("godown_id"))
        }
        else {
            salert("Warning", "Data Missing!, Try Later.", "warning");
        }

    })

    $("#dc_switch").on('change', function () {

        if ($('#godown').data("godown_id") < 1 || $('#godown').data("godown_id") == undefined) {
            $(this).prop("checked", false);
            salert("Warning", "First Select The Godown.", "warning");
            return;
        }

        if ($(this).is(":checked")) {
            $(".dc_title").text("DC Unload Details");
            $(this).next('label').text("DC Load Details");
            $(".alert_text").text('');
            get_transport_unload_parts($('#godown').data("godown_id"));
        }
        else {
            $(".dc_title").text("DC Load Details");
            $(this).next('label').text("DC Unload Details");
            $(".alert_text").text('');
            get_transport_parts_dc($('#godown').data("godown_id"));
        }
    })

    $("#manual_dc_modal_btn").on("click", function () {
        if ($('#godown').data("godown_id") < 1 || $('#godown').data("godown_id") == undefined) {
            salert("Warning", "First Select The Godown.", "warning");
            return;
        }
        else {

            get_godown_wise_process($('#godown').data("godown_id"));
            $("#manual_dc_modal").modal('show');

        }
    })

    // $("#dc_file_upload").on("change", function () {
    //     if (this.files.length > 0) {

    //         let godown_id = $("#godown").data("godown_id");
    //         let file = this.files[0];

    //         let formData = new FormData();
    //         formData.append("file", file);
    //         formData.append("godown_id", godown_id);
    //         $(".loading").removeClass("d-none");

    //         upload_dc(formData);
    //     }
    // });

    $("#dc_file_upload").on("click", function (event) {
        event.preventDefault();
        uploadFile();
    });


    window.onLocationReceived = function (lat, lng) {
        console.log("GPS Location received:", lat, lng);

        // Example: Show it in an alert or update your UI
        // alert("Latitude: " + lat + "\nLongitude: " + lng);

        // You can now use lat and lng for your business logic
        // For example, update a hidden input or send to your server via AJAX
        $("#lat_input").val(lat);
        $("#lng_input").val(lng);
        
        $("#loc_status").removeClass("text-danger");
        $("#loc_status").addClass("text-success");
        get_godown_location(lat, lng)
    };

    // Global callbacks called by the Android app
    window.onUploadSuccess = function (response) {
        console.log("Upload Success:", response);
        $(".loading").addClass("d-none");
        salert("Success", "Image Uploaded Successfully.", "success");
    };

    window.onUploadError = function (error) {
        $(".loading").addClass("d-none");
        console.error("Upload Error:", error);
        salert("Warning", "Upload failed. Error code: " + error, "warning");
    };



    if (phone_id) {

        AndroidBridge.getLocation();
    }

    $("#dc_file").on("click", function (event) {
        event.preventDefault();
        captureWithDbData();

    });

    $("#save_map_btn").on("click", function () {

        let lati = $("#lat_input").val();
        let long = $("#lng_input").val();

        let godown_id = $("#godown").data("godown_id");

        if (lati && long && godown_id) {
            update_godown_location1(lati, long, godown_id);
        } else {
            salert(
                "Warning",
                "Data Is Missing! Please provide map coordinates and vendor.",
                "warning"
            );
        }
    });

    $("#godown_list_tbody").on("click", ".select_btn", function () {
        let godown_name = $(this).data("creditor_name");
        let godown_id = $(this).val();

        if (godown_id && godown_name) {
            $("#godown_list_modal").modal("hide");
            $("#godown").data("godown_id", godown_id).val(godown_name);
            $(".alert_text").text('');
            $(".dc_filess").prop("disabled", false);
            get_transport_parts_dc($('#godown').data("godown_id"));
        }
        else {
            salert("Warning", "Data Missing!, Try Again.", "warning");
        }

    })




});


function upload_dc(formData) {

    $.ajax({
        url: "php/upload_dc.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,

        success: function (response) {
            console.log(response);

            if (response.trim() == "Success") {
                $(".loading").addClass("d-none");
                alert("DC uploaded successfully");
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}


function get_godown_wise_process(godown_id) {

    $.ajax({
        url: "php/get_godown_wise_process.php",
        type: "get", //send it through get method
        data: {

            godown_id: godown_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $("#manual_dc_card").empty();

                if (response.trim() != "0 results") {

                    var obj = JSON.parse(response);
                    var count = 0;
                    $("#manual_dc_card").append(`<div class='card-header'>
                        <input type='text' class='part_search' placeholder='Search'>
                        </div>`)
                    obj.forEach(function (item, index) {

                        count++;

                        $("#manual_dc_card").append(`
                                <div class="card-body p-2">

                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <div class="fw-semibold">${item.final_part}</div>
                                            <span class="badge bg-success">
                                                ${item.process_name}
                                            </span>
                                        </div>

                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            data-stock_id="${item.stock_id}">
                                    </div>

                                    <div class="mt-2">
                                        <input
                                            type="number"
                                            class="form-control form-control-sm text-end"
                                            value="${item.qty || 0}"
                                            data-stock_id="${item.stock_id}">
                                    </div>

                                </div>`
                        );

                    });
                }
                else {
                    salert("Warning", "No Part Found", "warning");
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}



// function get_transport_parts(godown_id) {

//     $.ajax({
//         url: "php/get_transport_parts.php",
//         type: "get", //send it through get method
//         data: {

//             godown: godown_id,
//         },
//         success: function (response) {
//             console.log(response);



//             if (response.trim() != "error") {
//                 $(".dc_details").empty();

//                 if (response.trim() != "0 results") {

//                     var obj = JSON.parse(response);
//                     var count = 0;

//                     obj.forEach(function (item, index) {

//                         let parts = JSON.parse(item.parts);
//                         let stock_id_qty = [];

//                         let html = `
//                                 <div class="accordion mb-2" id="dcAccordion${index}">
//                                     <div class="accordion-item border-0 shadow-sm">

//                                         <h2 class="accordion-header" id="heading${index}">
//                                             <button class="accordion-button collapsed py-2 px-3"
//                                                     type="button"
//                                                     data-bs-toggle="collapse"
//                                                     data-bs-target="#collapse${index}"
//                                                     aria-expanded="false"
//                                                     aria-controls="collapse${index}">

//                                                 <div class="w-100">
//                                                     <div class="d-flex justify-content-between align-items-center">
//                                                         <strong>DC #${item.dc_no}</strong>

//                                                         <span class="badge bg-primary">
//                                                             ${item.reserve_type.toUpperCase()}
//                                                         </span>
//                                                     </div>

//                                                     <div class="small text-muted mt-1">
//                                                         ${item.bill_to}
//                                                         <i class="fa fa-arrow-right mx-1"></i>
//                                                         ${item.ship_to}
//                                                     </div>
//                                                 </div>

//                                             </button>
//                                         </h2>

//                                         <div id="collapse${index}"
//                                             class="accordion-collapse collapse"
//                                             aria-labelledby="heading${index}">

//                                             <div class="accordion-body p-2">`;

//                         parts.forEach(function (group) {

//                             html += `
//                                 <div class="border rounded p-2 mb-2 bg-light">

//                                     <div class="d-flex flex-wrap gap-1 mb-2">
//                                         <span class="badge bg-success">
//                                             ${group.creditor_name}
//                                         </span>

//                                         ${group.dep_name ? `<span class="badge bg-warning text-dark">${group.dep_name}</span>` : ''}
//                                     </div>`;

//                             group.parts.forEach(function (part) {

//                                 stock_id_qty.push({
//                                     stock_reserve_id: part.stock_reserve_id,
//                                     qty: part.qty
//                                 });

//                                 html += `
//                                         <div class="d-flex justify-content-between align-items-center py-1 border-bottom">

//                                             <div class="flex-grow-1 pe-2">
//                                                 <div class="fw-semibold small">
//                                                     ${part.part_name}
//                                                 </div>

//                                                 <small class="text-muted">
//                                                     ${part.process_name}
//                                                 </small>
//                                             </div>

//                                             <span class="badge bg-secondary">
//                                                 Qty : ${part.qty}
//                                             </span>

//                                         </div>`;
//                             });

//                             html += `</div>`;
//                         });

//                         html += `
//                                 <div class="text-end mt-2">
//                                     <button class="btn btn-success btn-sm driver_confrim_btn" data-stock_id_qty='${JSON.stringify(stock_id_qty)}'><i class="fa fa-circle-check"></i>Confirm</button>
//                                 </div></div></div></div></div>`;

//                         $(".dc_details").append(html);

//                     });

//                 }
//                 else {
//                     salert("Warning", "No DC Found for this Vendor To Load", "warning");
//                 }
//             }





//         },
//         error: function (xhr) {
//             //Do Something to handle error
//         }
//     });




// }

function get_transport_parts_dc(godown_id) {

    $.ajax({
        url: "php/get_transport_parts_dc.php",
        type: "get", //send it through get method
        data: {

            godown: godown_id,
            transport_godown: 1233,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $(".dc_details").empty();

                if (response.trim() != "0 results") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item, index) {

                        let parts = JSON.parse(item.parts);
                        let stock_id_qty = [];

                        let html = `
                                <div class="accordion mb-2" id="dcAccordion${index}">
                                    <div class="accordion-item border-0 shadow-sm">

                                        <h2 class="accordion-header" id="heading${index}">
                                            <button class="accordion-button collapsed py-2 px-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapse${index}"
                                                    aria-expanded="false"
                                                    aria-controls="collapse${index}">

                                                ${item.des_godown_name}

                                            </button>
                                        </h2>

                                        <div id="collapse${index}"
                                            class="accordion-collapse collapse"
                                            aria-labelledby="heading${index}">

                                            <div class="accordion-body p-2">`;

                        parts.forEach(function (group) {

                            html += `
                                <div class="border rounded p-2 mb-2 bg-light">

                                    <div class="d-flex flex-wrap gap-1 mb-2">
                                        <span class="badge bg-success">
                                            ${group.creditor_name}
                                        </span>

                                        ${group.dep_name ? `<span class="badge bg-warning text-dark">${group.dep_name}</span>` : ''}
                                    </div>`;

                            group.parts.forEach(function (part) {

                                stock_id_qty.push({
                                    stock_reserve_id: part.stock_reserve_id,
                                    qty: part.qty
                                });

                                html += `
                                        <div class="d-flex justify-content-between align-items-center py-1 border-bottom">

                                            <div class="flex-grow-1 pe-2">
                                                <div class="fw-semibold small">
                                                    ${part.part_name}
                                                </div>

                                                <small class="text-muted">
                                                    ${part.process_name}
                                                </small>
                                            </div>

                                            <span class="badge bg-secondary">
                                                Qty : ${part.qty}
                                            </span>

                                        </div>`;
                            });

                            html += `</div>`;
                        });

                        html += `
                                <div class="text-end mt-2">
                                    <button class="btn btn-success btn-sm driver_confrim_btn" data-stock_id_qty='${JSON.stringify(stock_id_qty)}'><i class="fa fa-circle-check"></i>Confirm</button>
                                </div></div></div></div></div>`;

                        $(".dc_details").append(html);

                        // $("#dc_file_upload").trigger("click");
                    });

                }
                else {
                    $(".alert_text").text("No DC Found for this Vendor To Load");
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function load_transport(stock_json) {

    $.ajax({
        url: "php/load_transport.php",
        type: "get", //send it through get method
        data: {

            transport_godown: 1233,
            stock_json: stock_json,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {

                location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_transport_unload_parts(godown_id) {

    $.ajax({
        url: "php/get_transport_unload_parts.php",
        type: "get", //send it through get method
        data: {

            des_godown: godown_id,
            transport_godown: 1233,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $(".dc_details").empty();

                if (response.trim() != "0 results") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item, index) {

                        let parts = JSON.parse(item.parts);
                        let stock_id_qty = [];

                        let html = `
                                <div class="accordion mb-2" id="dcAccordion${index}">
                                    <div class="accordion-item shadow-sm border-0">

                                        <h2 class="accordion-header" id="heading${index}">
                                            <button class="accordion-button collapsed py-2 px-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapse${index}"
                                                    aria-expanded="false"
                                                    aria-controls="collapse${index}">

                                                <div class="w-100">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <strong class="small">
                                                            DC #${item.dc_no}
                                                        </strong>

                                                        <span class="badge bg-primary">
                                                            ${item.dc_date}
                                                        </span>
                                                    </div>

                                                    <div class="small text-muted mt-1  d-none">
                                                        <span class="fw-semibold">${item.bill_to}</span>
                                                        <i class="fa fa-arrow-right mx-1"></i>
                                                        <span class="fw-semibold">${item.ship_to}</span>
                                                    </div>
                                                </div>

                                            </button>
                                        </h2>

                                        <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}">

                                            <div class="accordion-body p-2">`;

                        parts.forEach(function (group) {

                            html += `
                                <div class="border rounded p-2 mb-2 bg-light">

                                    <div class="d-flex flex-wrap gap-1 mb-2">
                                        <span class="badge bg-success d-none">
                                            ${group.creditor_name}
                                        </span>

                                        ${group.dep_name ? `<span class="badge bg-warning text-dark  d-none">${group.dep_name}</span>` : ''}</div>`;

                            // group.parts.forEach(function (part) {

                            stock_id_qty.push({
                                stock_reserve_id: group.stock_reserve_id,
                                qty: group.qty
                            });

                            html += `
                                        <div class="d-flex justify-content-between align-items-center py-1 border-bottom">

                                            <div class="flex-grow-1 pe-2">
                                                <div class="fw-semibold small">
                                                    ${group.part_name}
                                                </div>

                                                <small class="text-muted">
                                                    ${group.process_name}
                                                </small>
                                            </div>

                                            <span class="badge bg-secondary">
                                                ${group.qty}
                                            </span>

                                        </div>`;
                            // });

                            html += `</div>`;
                        });

                        html += `
                                    <div class="text-end mt-2">
                                        <button class="btn btn-success btn-sm driver_confrim_btn"data-stock_id_qty='${JSON.stringify(stock_id_qty)}'><i class="fa fa-circle-check"></i>Confirm</button>
                                    </div></div></div></div></div>`;

                        $(".dc_details").append(html);

                        // $("#dc_file_upload").trigger("click");
                    });

                }
                else {
                    $(".alert_text").text("No DC Found for this Vendor To Unload");
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function un_load_transport(stock_json, godown_id) {

    console.log(stock_json, godown_id);

    $.ajax({
        url: "php/un_load_transport.php",
        type: "get", //send it through get method
        data: {

            des_godown: godown_id,
            stock_json: stock_json,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {

                location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_godown_location(lat, lng) {

    $.ajax({
        url: "php/get_godown_location.php",
        type: "get",
        data: {
            latti: lat,
            longi: lng,
        },

        success: function (response) {
            console.log(response);

            if (response.trim() !== "error") {
                $("#godown_list_tbody").empty();
                if (response.trim() !== "0 result") {
                    var obj = JSON.parse(response);
                    if (obj.length == 1) {
                        $("#godown_status").text('Found 1 Godown').addClass("bg-success");
                        obj.forEach(function (item) {
                            $(".dc_filess").prop("disabled", false);
                            get_transport_parts_dc(item.creditor_id);
                            $("#godown").data("godown_id", item.creditor_id).val(item.creditor_name);
                        })
                    }
                    else {
                        $("#godown_list_modal").modal("show");
                        var count = 0;
                        obj.forEach(function (item) {
                            count += 1;
                            $("#godown_list_tbody").append(`
                                <li class="list-group-item godown-item">
                                    <div class="godown-details">
                                        <h6 class="godown-name mb-1">${item.creditor_name}</h6>
                                        <span class="godown-distance">
                                            <i class="fa-solid fa-location-dot me-1"></i>
                                            ${item.distance_m} Meters Away
                                        </span>
                                    </div>

                                    <button
                                        class="btn btn-success btn-sm select_btn"
                                        value="${item.creditor_id}"
                                        data-creditor_name="${item.creditor_name}">
                                        <i class="fa-solid fa-circle-check me-1"></i>
                                        Select
                                    </button>
                                </li>
                            `);
                        });
                        $("#godown_status").text('Found ' + count + ' Godown').addClass("bg-success");

                    }
                }
                else {
                    $("#godown_status").text('No Godown').addClass("bg-danger");
                }
            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

function update_godown_location1(lati, long, godown_id) {

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





function uploadFile() {
    $(".loading").removeClass("d-none");
    var myParams = { "godown_id": $("#godown").data("godown_id"), "emp_id": current_user_id};
    var url = 'https://jaysan.cloud/php/upload_dc.php';
    // Parameters are passed as the second argument
    if (window.AndroidBridge) {
        AndroidBridge.pickFile("*/*", JSON.stringify(myParams), url);
    }


}



function captureWithDbData() {
    $(".loading").removeClass("d-none");
    var params = {
        "godown_id": $("#godown").data("godown_id"),
        "emp_id": current_user_id,
    };

    var url = 'https://jaysan.cloud/php/upload_dc.php';

    if (window.AndroidBridge) {
        // Kotlin will take the photo, compress it, 
        // and include these params in the POST request to app_upload.php
        AndroidBridge.takePhoto(JSON.stringify(params), url);
    }
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