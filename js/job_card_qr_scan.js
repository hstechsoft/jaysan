
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
// var current_user_id = 231
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var current_work = 0;
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
    get_dep_section();
    get_current_work_details(current_user_id);

    $("#unamed").text(localStorage.getItem("ls_uname"))

    if ($("#section_select").val() != null) {
        $(".qr_section").removeClass("d-none");
    }
    else {
        $(".qr_section").addClass("d-none");
    }

    $("#section_select").on("change", function () {
        if ($("#section_select").val() != null) {
            $(".qr_section").removeClass("d-none");
        }
        else {
            $(".qr_section").addClass("d-none");
        }
    })

    let html5QrCode;
    let isScanning = false;

    $("#openScannerBtn").click(function () {

        if (isScanning) return;

        $("#qr-reader").removeClass("d-none");

        html5QrCode = new Html5Qrcode("qr-reader");

        Html5Qrcode.getCameras().then(devices => {

            if (devices && devices.length) {

                // Prefer back camera on mobile
                let cameraId = devices.find(device =>
                    device.label.toLowerCase().includes("back")
                )?.id || devices[0].id;

                html5QrCode.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    onScanSuccess
                );

                isScanning = true;
            }

        }).catch(err => {
            salert("Error", "Camera access denied or not supported", "error");
            console.error(err);
        });

    });

    $("#start_work").click(function () {

        if ($("#job_ass_id").val() > 0 && $("#section_select").val() > 0 && Number($("#day_start_time").data("work_done_id") || 0)) {
            insert_qr_work_entry(current_user_id, $("#job_ass_id").val(), $("#section_select").val(), $("#day_start_time").data("work_done_id"));
        }
        else {
            salert("Warning", "Data missing, try later", "warning");
        }
    })

    $("#production_line_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#arrange_order_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("#timing_section").on("click", "#end_work", function () {

        let qrValue = $(this).val();

        if (!qrValue) {
            salert("Warning", "Data missing, try later", "warning");
            return;
        }

        Swal.fire({
            title: "Work Completed?",
            html: "Have you assembled all parts and sub-assemblies? 🤔",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Completed",
            cancelButtonText: "No",
            confirmButtonColor: "#198754",
            cancelButtonColor: "#dc3545",
            reverseButtons: true
        }).then((result) => {

            if (result.isConfirmed) {
                update_qr_end_time(qrValue);
            }

        });

    });

    get_assign_order()


    $("#timing_section").on("click", "#pause_work", function () {
        $("#pause_workModal").modal("show")
        $("#pause_work_btn").val($(this).val())
    })

    $("#pause_select").on("change", function () {
        var select_reason = $(this).val();

        if (select_reason == "No Stock" || select_reason == "Rework") {
            $(".pause_reason").removeClass("d-none");
            $("#pause_reason").val("");
        } else {
            $(".pause_reason").addClass("d-none");
            $("#pause_reason").val(select_reason);
        }

    })
    $("#pause_work_btn").on("click", function () {
        var qr_work_id = $(this).val() || 0
        var select_reason = $("#pause_select").val();
        var ent_reason = $("#pause_reason").val();
        if (Number(qr_work_id) > 0 && ent_reason != '') {

            var reason = select_reason + " : " + ent_reason;
            $(this).prop("disabled", true);
            update_qr_work_entry(qr_work_id, "paused", reason);
        }
        else {
            salert("Warning", "Enter The Reason Or Data Missing!, Try Later", "warning");
        }
    })

    $("#timing_section").on("click", "#resume_work", function () {
        $(this).addClass("d-none");
        $("#pause_work").removeClass("d-none");

    })


    // Day Start 
    const quotes = [

        {
            ta: "சுதந்திரம் என்பது கொடுப்பதல்ல. அது எடுக்கப்படவேண்டியது.",
            en: "Freedom is not give. It's taken.",
            icon: "⚔️"
        },

        {
            ta: "வெற்றி அடைவோர் வாய்ப்புகளுக்காக காத்திருக்க மாட்டார்கள், அவர்கள் வேலை செய்து வெற்றியை உருவாக்குவார்கள்.",
            en: "Success usually comes to those who are too busy to be looking for it.",
            icon: "🧑‍💻"
        },

        {
            ta: "முன்னேறுவதற்கான ரகசியம் தொடங்குவதில்தான் உள்ளது.",
            en: "The secret of getting ahead is getting started.",
            icon: "🚩"
        },

        {
            ta: "கடிகாரத்தை பார்த்துக் கொண்டிருக்காதே; அது போல நீயும் தொடர்ந்து செயல்பட்டு.",
            en: "Don’t watch the clock; do what it does. Keep going.",
            icon: "⏰"
        },

        {
            ta: "சிறிய முன்னேற்றமும் முன்னேற்றம்தான்.",
            en: "Small progress is still progress.",
            icon: "📈"
        },

        {
            ta: "உன் எதிர்காலம் இன்று நீ செய்கிற செயல்களால் உருவாகிறது.",
            en: "Your future is created by what you do today.",
            icon: "🌟"
        },

        {
            ta: "வெற்றியை நோக்கி உங்களை நீங்களே தாலிக்கொள்ளுங்க, ஏனென்றால் வேறு யாரும் அதை உங்களுக்காக செய்ய மாட்டார்கள்.",
            en: "Push yourself towards success, because no one else will do it for you.",
            icon: "🔥"
        },

        {
            ta: "சிறந்த விஷயங்கள் ஒருபோதும் ஆறுதல் மண்டலங்களிலிருந்து வருவதில்லை.",
            en: "Great things never come from comfort zones.",
            icon: "💎"
        },

        {
            ta: "சிறந்த பணியைச் செய்வதற்கான ஒரே வழி, நீங்கள் செய்வதை நேசிப்பதுதான்.",
            en: "The only way to do great work is to love what you do.",
            icon: "🛠️"
        },


        {
            ta: "பெரிய கனவு காணுங்கள். சிறியதாகத் தொடங்குங்கள். இப்போதே செயல்படுங்கள்.",
            en: "Dream big. Start small. Act now.",
            icon: "🌠"
        },

        {
            ta: "ஒழுக்கம் என்பது, உங்களுக்கு இப்போது என்ன வேண்டும் என்பதற்கும், நீங்கள் மிகவும் விரும்புவது என்பதற்கும் இடையே தேர்வு செய்வதாகும்.",
            en: "Discipline is choosing between what you want now and what you want most.",
            icon: "⏳"
        },

        {
            ta: "வாய்ப்புகள் அமையாது. நீங்கள் அவற்றை உருவாக்குங்கள்.",
            en: "Opportunities don't happen. You create them.",
            icon: "⚡"
        },

        {
            ta: "திறமை கடினமாக உழைக்காதபோது கடின உழைப்பு திறமையை வெல்லும்.",
            en: "Hard work beats talent when talent doesn't work hard.",
            icon: "💪"
        },

        {
            ta: "நேர்மறையாக இருங்கள், கடினமாக உழைக்கவும், அதைச் சாத்தியமாக்குங்கள்.",
            en: "Stay positive, work hard, make it happen.",
            icon: "✨"
        },

        {
            ta: "வெற்றி என்பது தினமும் மீண்டும் மீண்டும் செய்யப்படும் சிறிய முயற்சிகளின் கூட்டுத்தொகை.",
            en: "Success is the sum of small efforts repeated daily.",
            icon: "📊"
        },

        {
            ta: "ஒருவன் தனியாக இருக்கும்போது அவனுடைய சிந்தனைகளிலும். அவன் கூடத்தில் இருக்கும்போது அவனுடை வார்த்தைகளிலும் கவனமாக இருக்க வேண்டும்.",
            en: "One should be careful of his thoughts when he is alone and of his words when he is in crowd.",
            icon: "💬"
        },

        {
            ta: "தடைகளில் அல்ல, இலக்கில் கவனம் செலுத்துங்கள்.",
            en: "Focus on the goal, not the obstacles.",
            icon: "🎯"
        },

        {
            ta: "உன் மனமே உன் எல்லை.",
            en: "Your only limit is your mind.",
            icon: "🧠"
        },

        {
            ta: "அமைதியாக உழை; வெற்றி சத்தம் செய்யட்டும்.",
            en: "Work hard in silence, let success make the noise.",
            icon: "🔔"
        },

        {
            ta: "உங்கள் தொழிலில் நீங்கள் எவ்வளவு அதிக எதிர்ப்புகளைச் சந்திக்கிறீர்களோ, அவ்வளவு வெற்றிக்கு அருகில் இருக்கிறீர்கள்.",
            en: "The more resistance you face in your profession, the closer you are to success.",
            icon: "⛰️"
        },

        {
            ta: "ஒவ்வொரு நாளும் உன்னை மேம்படுத்த ஒரு புதிய வாய்ப்பு.",
            en: "Every day is a new chance to improve yourself.",
            icon: "🌅"
        },

        {
            ta: "நீ பெருமை படும் வரை நிறுத்தாதே.",
            en: "Don’t stop until you’re proud.",
            icon: "🏆"
        },

        {
            ta: "முழுமை அல்ல முன்னேற்றம் முக்கியம்.",
            en: "Progress, not perfection.",
            icon: "📈"
        },

        {
            ta: "நீ முடியும் என்று நம்பு; பாதி வெற்றி அங்கேயே.",
            en: "Believe you can and you're halfway there.",
            icon: "💫"
        },

        {
            ta: "சில சமயங்களில், உண்மையை தைரியமாகச் சொல்வதே மற்றவர்களின் பார்வையில் உங்களை ஒரு வில்லனாகக் காட்டப் போதுமானது.",
            en: "Sometimes, telling the truth boldly is enough to make you the villain in others’ eyes.",
            icon: "📣"
        },

        {
            ta: "மனிதனை ஒழுக்கத்தின் பெயரால் தான்  உயர்ந்தவர் என மரியாதை கொடுக்க வேண்டுமே தவிர சாதியால் அல்ல.",
            en: "A person should be respected as superior in the name of morality, not because of caste.",
            icon: "⚖️"
        },

    ];

    let lang = "ta";
    let currentQuoteIndex = 0;

    function showQuote(index) {

        let quote = quotes[index];

        $("#quote_icon").fadeOut(200, function () {
            $(this).text(quote.icon).fadeIn(200);
        });

        $("#quote_text").fadeOut(200, function () {
            $(this).text(lang === "ta" ? quote.ta : quote.en).fadeIn(200);
        });

    }

    function rotateQuotes() {

        let newIndex;

        do {
            newIndex = Math.floor(Math.random() * quotes.length);
        }
        while (newIndex === currentQuoteIndex);

        currentQuoteIndex = newIndex;

        showQuote(currentQuoteIndex);
    }


    $("#lang_toggle").on("change", function () {

        lang = this.checked ? "en" : "ta";

        showQuote(currentQuoteIndex);

    });


    currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    showQuote(currentQuoteIndex);

    setInterval(rotateQuotes, 300000);


    $("#start_day_btn").on("click", function () {
        var sec_id = $("#day_section_select").val() || 0;
        if (Number(sec_id) > 0 && Number(current_user_id) > 0) {
            insert_work_done_table(current_user_id);
        }
        else {
            salert("Warning", "select The Section Or Data Missing!, Try Later.", "warning");
        }
    })

    $("#paused_work_tbody").on("click", "#resume_work", function () {
        if (current_work > 0) {
            salert("Warning", "Pause/ End The Current Work", "warning");
            return;
        }
        var qr_work_id = $(this).val() || 0;

        if (Number(qr_work_id) > 0) {
            update_qr_work_entry(qr_work_id, "in-process", '');
        } else {
            salert("Warning", "Data Missing!, Try Later", "warning");
        }
    })


    $('#worked_unit').on('change', function () {

        $('#worked_dept').val('').trigger("change");
        $("#Worked_parts_tbody").empty();
        $(".Worked_parts_table").addClass("d-none");

        var unit_id = $(this).val();
        get_department_work(unit_id);

    });

    $("#worked_dept").on("change", function () {
        var dep_id = $(this).val();
        $('#worked_section').val('').trigger("change");
        $("#Worked_parts_tbody").empty();
        $(".Worked_parts_table").addClass("d-none");
        get_dep_section_work(dep_id);
    })

    $("#worked_section").on("change", function () {
        var sec_id = $(this).val();
        $('#machine').val('').trigger("change");
        $("#Worked_parts_tbody").empty();
        $(".Worked_parts_table").addClass("d-none");
        get_section_machine_work($("#worked_unit").val(), $("#worked_dept").val(), sec_id);
    })

    $("#worked_machine").on("change", function () {
        var mach_id = $(this).val();
        get_section_wise_process($("#worked_unit").val(), $("#worked_dept").val(), $("#worked_section").val(), mach_id);
    })



    // Day End Button

    $("#summay_btn").on("click", function () {
        get_current_work_break(current_user_id);
    })

    $("#chase_entry_btn").on("click", function(){
        var chasis_no = $("#chase_no").val();
        
        if(chasis_no){

        }
        else{
            salert("Warning", "Please Enter the Chasis No", "warning");
        }
    })
});





function get_current_work_break(emp_id) {
    $.ajax({
        url: "php/get_current_work_break.php",
        type: "get", //send it through get method
        data: {
            emp_id: emp_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                $("#break_time_list").empty();
                $("#breakTimeModal").modal("show");
                if (response.trim() != '0 result') {


                    var obj = JSON.parse(response);


                    obj.forEach(function (obj) {

                        var break_details = JSON.parse(obj.break_details);
                        $("#break_time_list").append(`<li class='list-group-item bg-info text-dark'>${obj.dates} </li>`)
                        break_details.forEach(function (item) {
                            $("#break_time_list").append(`<li class='list-group-item'>${item.ex_name} <input class="form-check-input float-end" type="checkbox" value="${item.ex_time}" id="" checked></li>`)
                        })

                    });

                }
                else {

                    $("#break_time_list").append(`<li class='list-group-item bg-secondary'>No Braek Between This Time Period</li>`)
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

function insert_work_done_table(current_user_id) {

    $.ajax({
        url: "php/insert_work_done_table.php",
        type: "get", //send it through get method
        data: {

            emp_id: current_user_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {

                $("#start_section").addClass("d-none");
                $("#after_start").removeClass("d-none");
                get_current_work_details(current_user_id);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_qr_work_entry(emp_id, qr_code, sec_id, work_done_id) {

    $.ajax({
        url: "php/insert_qr_work_entry.php",
        type: "post", //send it through get method
        data: {

            emp_id: emp_id,
            qr_code: qr_code,
            sec_id: sec_id,
            work_done_id: work_done_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                $("#start_work").prop("disabled", true).text("Time Started");
                get_current_work_details(current_user_id);
                // get_current_work_break(current_user_id);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function update_qr_work_entry(qr_work_id, work_update_sts, reason) {
    console.log(qr_work_id, work_update_sts, reason);

    $.ajax({
        url: "php/update_qr_work_entry.php",
        type: "post", //send it through get method
        data: {

            qr_work_id: qr_work_id,
            work_update_sts: work_update_sts,
            reason: reason
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                $("#pause_work_btn").prop("disabled", false);
                $("#pause_select, #pause_reason").val("");
                $("#pause_workModal").modal("hide")
                $("#end_work").prop("disabled", true)
                get_current_work_details(current_user_id);
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

function update_qr_end_time(qr_work_id) {

    $.ajax({
        url: "php/update_qr_end_time.php",
        type: "post", //send it through get method
        data: {

            qr_work_id: qr_work_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                $("#end_work").prop("disabled", true).text("Work Ended")
                window.location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function get_assign_order() {
    $.ajax({
        url: "php/get_assigned_order.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                $("#arrange_order_tbody").empty();
                $("#mobile_view_arrange_order_tbody").empty();
                if (response.trim() != '0 result') {


                    var obj = JSON.parse(response);


                    obj.forEach(function (obj) {


                        var details = `
                            <div class="card shadow-sm border-0" style="border-radius: 10px;">
                                <div class="card-body py-1 px-2 d-flex justify-content-between align-items-center">
                                    <span class="text-muted small">${obj.model}</span>
                                    <span class="fw-semibold text-primary">${obj.product}</span>
                                    <span class="badge bg-success">${obj.type}</span>
                                </div>

                                <div class="card-footer py-0 px-1 bg-light border-0">
                                    <small class="text-muted">
                                        ${obj.sub_type}
                                    </small>
                                </div>
                            </div>
                        `;
                        $("#arrange_order_tbody").append(`
                            <tr class='text-center' style=" font-size: 13px"
                                data-ass_id='${obj.ass_id}'>
                                <td>${obj.qr_no}</td>
                                <td>${obj.cus_name} - ${obj.cus_phone} <span class='badge bg-primary small'>Sale Order/No: ${obj.order_no}</span></td>
                                <td>${details}</td>
                            </tr>
                        `);
                        $("#mobile_view_arrange_order_tbody").append(`<div class="card border-info mb-3" style=" font-size: 10px;">
                            <div class="card-header">Line no: <b class=' float-end badge bg-danger'>${obj.qr_no}</b></div>
                            <div class="card-body p-1">
                                <p class="card-title text-info">${obj.cus_name}</p>
                                <h6 class="card-text">${details}</h6>
                            </div>
                        </div>`)
                    });

                }
                else {
                    $("#arrange_order_tbody").append(`<tr><td colspan='4' class="text-center text-danger">No Product Assigned</td></tr>`);
                    $("#mobile_view_arrange_order_tbody").append(`<div class="card border-info mb-3" style=" font-size: 10px;">No Product Assigned</div>`);

                }



            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}





function get_current_work_details(emp_id) {

    $.ajax({
        url: "php/get_current_work_details.php",
        type: "get",
        data: {
            emp_id: emp_id,
        },
        success: function (response) {
            if (response.trim() != "error") {
                console.log(response);

                $("#timing_section, #paused_work_tbody, #work_compeleted_tbody").empty();
                if (response.trim() != "0 result") {
                    $("#start_section").addClass("d-none");
                    $("#after_start").removeClass("d-none");
                    $("#scan_section").addClass("d-none");
                    $("#timing_section").removeClass("d-none");
                    current_work = 1;
                    var obj = JSON.parse(response);

                    if (Number(obj.work_done_id) <= 0) {

                        $("#start_section").removeClass("d-none");
                        $("#after_start").addClass("d-none");
                    }
                    if (obj.current_sts == "not-in-process") {


                        current_work = 0;
                        $("#scan_section").removeClass("d-none");
                        $("#timing_section").addClass("d-none");
                    }

                    $("#day_start_time").text(obj.start_time).data("work_done_id", obj.work_done_id);

                    let in_process_work_entries = Array.isArray(obj.in_process_work_entries) ? obj.in_process_work_entries : [];
                    in_process_work_entries.forEach(function (item) {

                        if (item.chasis_no) {
                            $("#chase_entry_btn").val()
                            $("#chase_entry_modal").modal("show");
                        }

                        $("#timing_section").append(`
                            <div class="card machine-card">

                                <div class="card-header">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 class="mb-0 fw-bold text-uppercase">
                                                ${item.product} ${item.model_name} ${item.type_name}
                                            </h5>
                                            <small class="text-light opacity-75">
                                                ${item.sub_type}
                                            </small>
                                        </div>

                                        <span class="status-badge">
                                            🟢 Active
                                        </span>
                                    </div>
                                </div>

                                <div class="card-body text-center">

                                    <div class="motivation-box mb-1">
                                        🚀 <strong>Consistency is Progress</strong><br>
                                        I fear not the man who has practiced 10,000 kicks once, but i fear the man who has practiced one kick 10,000 times ~ Bruce Lee.
                                    </div>

                                    <div class="time-box">
                                        <i class="fa-solid fa-clock text-success"></i>
                                        Started at: <strong>${item.start_time_formated}</strong>
                                    </div>
                                    <div class="bg-secondary">
                                        Chasis No: <strong>${item.chasis_no}</strong>
                                    </div>

                                </div>

                                <div class="card-footer d-flex text-center justify-content-between">

                                    <button type="button"
                                        class="btn btn-danger px-2 fw-bold shadow-sm "
                                        id="end_work" value='${item.qr_work_id}'>
                                        ⏹ End Work
                                    </button>


                                    <button type="button"
                                        class="btn btn-warning px-2 fw-bold shadow-sm "
                                        id="pause_work" value='${item.qr_work_id}' data-current_sts='${item.current_sts}' data-sec_id='${item.sec_id}'>
                                        ▶ Pause Work
                                    </button>

                                </div>

                            </div>
                        `);
                    });

                    let paused_work_entries = Array.isArray(obj.paused_work_entries) ? obj.paused_work_entries : [];
                    paused_work_entries.forEach(function (pause) {

                        var work_entries = JSON.parse(pause.work_entries);
                        work_entries.forEach(function (we, index) {
                            $("#paused_work_tbody").append(`<tr><td>${index + 1}</td><td><span class='badge bg-info  text-dark'>${we.start_time}</span><span class='badge bg-warning text-dark'>${we.end_time}</span></td><td>${we.reason}</td><td>Chasis/No: ${we.chasis_no} <br> QR/No: ${we.production_id}</td><td><button type="button" class="btn btn-outline-primary "id="resume_work" value='${we.current_work_id}' style="font-size: 10px; ">⏸Resume </button></td></tr>`)
                        })
                    });

                    let finished_work_entries = Array.isArray(obj.finished_work_entries) ? obj.finished_work_entries : [];
                    finished_work_entries.forEach(function (finish) {


                        $("#work_compeleted_tbody").append(`<tr><td></td><td></td><td></td></tr>`);


                    })

                }
                else {

                    $("#start_section").removeClass("d-none");
                    $("#after_start").addClass("d-none");
                }
            }
        },
        error: function (xhr) {

        },
    })
}

function onScanSuccess(decodedText) {

    $("#scan_result")
        .removeClass("d-none")
        .html("✅ Scanned: <strong>" + decodedText + "</strong>");

    $("#job_ass_id").val(decodedText);

    stopScanner();

    fetchJobDetails(decodedText);
}

function stopScanner() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            $("#qr-reader").addClass("d-none");
            isScanning = false;
        });
    }
}

function fetchJobDetails(jobId) {

    $.ajax({
        url: "php/get_job_card_details.php",
        type: "GET",
        data: { job_id: jobId },
        success: function (response) {
            console.log(response);

            // You can redirect or update UI
        }
    });

}


function get_dep_section() {

    $.ajax({
        url: "php/get_dep_section.php",
        type: "get", //send it through get method
        data: {
            dep_id: 29,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#section_select").empty();
                $("#day_section_select").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0
                    $("#section_select").append("<option class='' value='null'> select section...  </option>")
                    $("#day_section_select").append("<option class='' value='null'> select section...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;


                        $("#section_select").append("<option class='' value=" + obj.dep_sec_id + " data-sec_name='" + obj.sec_name + "' data-dep_id='" + obj.dep_id + "'>" + obj.sec_name + "</option>")
                        $("#day_section_select").append("<option class='' value=" + obj.dep_sec_id + " data-sec_name='" + obj.sec_name + "' data-dep_id='" + obj.dep_id + "'>" + obj.sec_name + "</option>")


                    });


                }
                else {
                    // $("#section_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });


}


function get_department_work(godown_id) {

    $.ajax({
        url: "php/get_department.php",
        type: "get", //send it through get method
        data: {
            godown_id: godown_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#worked_dept").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0

                    $("#worked_dept").append("<option class='' value='null'> select department...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;

                        $("#worked_dept").append("<option class='' value=" + obj.dep_id + " >" + obj.dep_name + "</option>")


                    });


                }
                else {
                    // $("#department_da").append("<li disabled><a class='dropdown-item'  >NO DATA</a></li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });


}

function get_dep_section_work(dept_id) {

    $.ajax({
        url: "php/get_dep_section.php",
        type: "get", //send it through get method
        data: {
            dep_id: dept_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#worked_section").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0

                    $("#worked_section").append("<option class='' value='null'> select section...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;

                        $("#worked_section").append("<option class='' value=" + obj.dep_sec_id + " >" + obj.sec_name + "</option>")



                    });


                }
                else {
                    // $("#section_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });


}

function get_section_machine_work(godown_id, dep_id, sec_id) {

    console.log(godown_id, dep_id, sec_id);

    $.ajax({
        url: "php/get_section_machine.php",
        type: "get", //send it through get method
        data: {
            godown_id: godown_id,
            dep_id: dep_id,
            sec_id: sec_id,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#worked_machine").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0
                    $("#worked_machine").append("<option class='' value='null'> select machine...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;


                        $("#worked_machine").append("<option class='' value=" + obj.machine_id + " >" + obj.machine_name + "</option>")


                    });


                }
                else {
                    // $("#section_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });


}

function get_section_wise_process(godown_id, dep_id, sec_id, machine_id) {

    console.log(godown_id, dep_id, sec_id, machine_id);

    $.ajax({
        url: "php/get_section_wise_process.php",
        type: "get", //send it through get method
        data: {
            godown_id: godown_id,
            dep_id: dep_id,
            sec_id: sec_id,
            machine_id: machine_id,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#Worked_parts_tbody").empty();
                $(".Worked_parts_table").removeClass("d-none");
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0

                    obj.forEach(function (obj, index) {
                        count = count + 1;


                        $("#Worked_parts_tbody").append(`<tr><td>${index + 1}</td><td>${obj.output_part}</td><td>${obj.process_name}</td><td contenteditable=true>0</td><td><button class='btn btn-outline-primary small'>Add</button></td></tr>`)


                    });


                }
                else {
                    // $("#section_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")
                    $("#worked_machine").append(`<tr><td colspan='5' class='text-center text-danger'> No data Found</td></tr>`)

                }
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