
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

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $("#flexSwitchCheckDefault").on("change", function () {

        if ($(this).is(":checked")) {
            $("#filter_heading").text("Sale Order Filter");
            $(".sale_table").removeClass("d-none");
            $(".mrf_table").addClass("d-none");
        }
        else {
            $("#filter_heading").text("MRF Filter");
            $(".sale_table").addClass("d-none");
            $(".mrf_table").removeClass("d-none");
        }
    })


    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(get_dcf_chart);

    function get_dcf_chart() {
        $.ajax({
            url: "php/dcf_graph.php",
            type: "GET",
            success: function (response) {
                if (response.trim() !== "error") {
                    var obj = JSON.parse(response);
                    drawDCFChart(obj);
                } else {
                    alert("Error fetching data!");
                }
            },
            error: function (xhr) {
                console.error("AJAX Error:", xhr);
            }
        });
    }

    function drawDCFChart(dataArray) {

        // Count by status
        let statusCount = {};

        dataArray.forEach(item => {
            let status = item.sts;

            if (!statusCount[status]) {
                statusCount[status] = 0;
            }

            statusCount[status] += 1;
        });

        // Prepare chart data
        let chartData = [['Status', 'Count']];

        for (let key in statusCount) {
            chartData.push([key, statusCount[key]]);

            // Map the correct badge values
            if (key == 'create') {
                $("#create").text(statusCount[key]);
                $("#create").css("color", "#109618");
            }
            else if (key == 'HOD') {
                $("#approve").text(statusCount[key]);
                $("#approve").css("color", "#ff9900");
            }
            else if (key == 'invoice') {
                $("#papprove").text(statusCount[key]);
                $("#papprove").css("color", "#dc3912");
            }
            else if (key == 'delivery') {
                $("#invoice").text(statusCount[key]);
                $("#invoice").css("color", "#3366cc");
            }
        }

        var data = google.visualization.arrayToDataTable(chartData);

        var options = {
            title: 'DCF Status Chart',
            is3D: true,
            pieSliceText: 'value',
            legend: { position: 'right' },
            chartArea: { width: '100%', height: '100%' }
        };

        var chart = new google.visualization.PieChart(
            document.getElementById("DCF_chart")
        );
        chart.draw(data, options);
    }

    google.charts.setOnLoadCallback(get_sale_order_chart);

    function get_sale_order_chart() {
        $.ajax({
            url: "php/sale_order_graph.php",
            type: "GET",
            success: function (response) {
                if (response.trim() !== "error") {
                    var obj = JSON.parse(response);
                    drawSaleOrderChart(obj);
                } else {
                    alert("Error fetching data!");
                }
            },
            error: function (xhr) {
                console.error("AJAX Error:", xhr);
            }
        });
    }

    function drawSaleOrderChart(dataArray) {

        // Prepare chart data FIRST
        let chartData = [['Status', 'Payment']];

        dataArray.forEach(item => {
            chartData.push([item.sts, parseInt(item.total_pay_approval)]);

            // Map the correct badge values
            if (item.sts == 'pay_approval') {
                $("#orderr").text(item.total_pay_approval);
                $("#orderr").css("color", "#6f42c1");
            }
            else if (item.sts == 'un_assign') {
                $("#pa").text(item.total_pay_approval);
                $("#pa").css("color", "#d63384");
            }
            else if (item.sts == 'approved') {
                $("#op").text(item.total_pay_approval);
                // $("#purchase").css("color", "#3366cc");
            }
        });

        var data = google.visualization.arrayToDataTable(chartData);

        var options = {
            title: 'Sale Order Status Chart',
            is3D: true,
            pieSliceText: 'value',
            colors: ['#6f42c1', '#d63384'], // Purple + Pink
            legend: { position: 'right' },
            chartArea: { width: '90%', height: '85%' }
        };

        var chart = new google.visualization.PieChart(
            document.getElementById("Sale_Order_chart")
        );

        chart.draw(data, options);
    }



    google.charts.setOnLoadCallback(get_mrf_chart);

    function get_mrf_chart() {
        $.ajax({
            url: "php/mrf_graph.php",
            type: "GET",
            success: function (response) {
                if (response.trim() !== "error") {
                    var obj = JSON.parse(response);
                    drawMRFChart(obj);
                } else {
                    alert("Error fetching data!");
                }
            },
            error: function (xhr) {
                console.error("AJAX Error:", xhr);
            }
        });
    }

    function drawMRFChart(dataArray) {

        // Count statuses
        let statusCount = {};

        dataArray.forEach(item => {
            let status = item.status;
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        // Prepare chart data
        let chartData = [['Status', 'Count']];
        let mdCount = 0; // FIXED accumulator

        for (let key in statusCount) {
            chartData.push([key, statusCount[key]]);

            if (key == 'created') {
                $("#request").text(statusCount[key]);
                // $("#request").css("color", "#ff9900");
            }
            else if (key == 'tally_stock_approved') {
                $("#tally").text(statusCount[key]);
                $("#tally").css("color", "#ff9900");
            }
            else if (key == 'approved' || key == 'md_redo') {
                
                mdCount += statusCount[key];
                $("#purchase").text(mdCount);
                $("#purchase").css("color", "#3366cc");
            }
            else if (key == 'md_approved' ) {
                $("#md").text(statusCount[key]);
                $("#md").css("color", "#dc3912");
            }
            else if (key == 'order_placed') {
                $("#order").text(statusCount[key]);
                // $("#order").css("color", ""); // add if needed
            }
        }


        var data = google.visualization.arrayToDataTable(chartData);

        var options = {
            title: 'MRF Status Chart',
            is3D: true,
            pieSliceText: 'value',
            legend: { position: 'right' },
            chartArea: { width: '100%', height: '100%' },
            // colors: ['#0d6efd', '#6f42c1', '#d63384', '#198754', '#fd7e14'] // CUSTOM COLORS
        };

        var chart = new google.visualization.PieChart(
            document.getElementById("MRF_chart")
        );
        chart.draw(data, options);
    }





});



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