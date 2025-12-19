
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


    $("#stock_history_search").on("keyup", function () {
        const value = $(this).val().toLowerCase();

        $("#stock_history_tbody tr").each(function () {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.indexOf(value) !== -1);
        });
    });


    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    get_stock_log()


    $('#part_search').on('input', function () {
        //check the value not empty
        $(this).data("part_id", "");
        if ($('#part_search').val() != "") {
            $('#part_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/mrf_partname_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            part_name: request.term,

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


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#part_search').on("change", function () {
        alert("c")
        if ($(this).data('part_id') != '') {
            alert()
            get_stock_log($(this).data("part_id"))
        }
    })


    $('#emp_search').on('input', function () {
        //check the value not empty
        $(this).data("emp_id", "");
        if ($('#emp_search').val() != "") {
            $('#emp_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_emp_auto.php",
                        type: "get", //send it through get method
                        data: {

                            emp_name: $('#emp_search').val(),

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.emp_name,
                                    value: item.emp_name,
                                    id: item.emp_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("emp_id", ui.item.id);
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

    $('#emp_search').on("change", function () {
        if ($(this).data('part_id') != '') {
            get_stock_log($(this).data("part_id"))
        }
    })

    $("#excel_bnt").on("click", function () {

        let csv = [];
        $(".table tr").each(function () {
            let row = [];
            $(this).find("th, td").each(function () {
                row.push(`"${$(this).text().trim()}"`);
            });
            csv.push(row.join(","));
        });

        if (csv.length <= 1) {
            alert("No data to export");
            return;
        }

        const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
        const downloadLink = document.createElement("a");

        downloadLink.download = "stock_history.csv";
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });



});








function get_stock_log(part_id) {
    $.ajax({
        url: "php/get_stock_log.php",
        type: "get",
        data: {
            emp_query: "",
            part_query: part_id,
        },
        success: function (response) {

            if (response.trim() !== "error" && response.trim() !== "0 result") {

                const data = JSON.parse(response);
                $("#stock_history_tbody").empty(); // clear old rows

                data.forEach(function (row, index) {

                    const tr = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${row.part_name}</td>
                            <td>${row.dated}</td>
                            <td>${row.action_type}</td>
                            <td>${row.godown ?? "-"}</td>
                            <td>${row.dep_name ?? "-"}</td>
                            <td>${row.sec_name ?? "-"}</td>
                            <td>${row.old_qty ?? "-"} → ${row.new_qty}</td>
                            <td>${row.emp_name}</td>
                            <td>${row.remark}</td>
                        </tr>
                    `;

                    $("#stock_history_tbody").append(tr);
                });

            } else {
                $("#stock_history_tbody").html(
                    "<tr><td colspan='9' class='text-center text-danger'>No records found</td></tr>"
                );
            }
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
        get_stock_log();
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