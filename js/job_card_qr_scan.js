
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var current_work = 0;
var work_done_id = 0;
var current_process_id = 0;
var current_part_id = 0;
var current_godown_id = 0;
var current_department_id = 0;
var current_section_id = 0;
var current_machine_id = 0;
var production_id = [];
$(document).ready(function () {

    console.log(production_id);

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
    // get_dep_section();
    get_current_work_details(current_user_id);
    get_all_extra_time();


    $("#openScannerBtn").on("click", function (event) {
        event.preventDefault();
        console.log(window.AndroidBridge);

        if (window.AndroidBridge) {
            AndroidBridge.openScanner();
        }
        else{
            alert("This Is For Mobile App Only");
        }
    });

    $("#unamed").text(localStorage.getItem("ls_uname"))

    if ($("#worked_section").val() != null) {
        $(".qr_section").removeClass("d-none");
    }
    else {
        $(".qr_section").addClass("d-none");
    }

    $("#worked_section").on("change", function () {
        if ($("#worked_section").val() != null) {
            $(".qr_section").removeClass("d-none");
        }
        else {
            $(".qr_section").addClass("d-none");
        }
    })

    let html5QrCode;
    let isScanning = false;

    // $("#openScannerBtn").click(function () {

    //     if (isScanning) return;

    //     $("#qr-reader").removeClass("d-none");

    //     html5QrCode = new Html5Qrcode("qr-reader");

    //     Html5Qrcode.getCameras().then(devices => {

    //         if (devices && devices.length) {

    //             // Prefer back camera on mobile
    //             let cameraId = devices.find(device =>
    //                 device.label.toLowerCase().includes("back")
    //             )?.id || devices[0].id;

    //             html5QrCode.start(
    //                 cameraId,
    //                 {
    //                     fps: 10,
    //                     qrbox: { width: 250, height: 250 }
    //                 },
    //                 onScanSuccess
    //             );

    //             isScanning = true;
    //         }

    //     }).catch(err => {
    //         salert("Error", "Camera access denied or not supported", "error");
    //         console.error(err);
    //     });

    // });

    $("#start_work").click(function () {

        if ($("#job_ass_id").val() > 0 && $("#worked_section").val() > 0 && Number($("#day_start_time").data("work_done_id") || 0)) {
            let confirm = 0;

            let jobId = Number($("#job_ass_id").val());

            production_id.forEach(function (t) {
                if (Number(t) === jobId) {
                    confirm += 1;
                }
            });

            console.log(production_id, confirm);
            if (confirm == 0) {
                insert_qr_work_entry(current_user_id, $("#job_ass_id").val(), $("#worked_section").val(), $("#day_start_time").data("work_done_id"));
            }
            else {
                console.log(production_id);
                salert("Warning", "This QR " + $("#job_ass_id").val() + " Is Already Scaned. Check It in Your Paused Or Completed Work List.", "warning")
                $("#job_ass_id").val('')
            }
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
        let process_part_array = [];
        process_part_array.push({ part_id: current_part_id, process_id: current_process_id, required_qty: 1, machine_id: current_machine_id })



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


                var se = sec_details()

                if (!se.godown_id || !se.dep_id || !se.sec_id) {
                    salert("Warning", "Select Section First", "warning");
                    return;
                }

                if (process_part_array.length > 0 || qrValue) {

                    $('html, body').animate({
                        scrollTop: $("#workChart").offset().top
                    }, 500);

                    get_work_summary(current_user_id, qrValue, '', JSON.stringify(process_part_array), se.godown_id, se.dep_id, se.sec_id);
                    console.log(qrValue, process_part_array, se.godown_id, se.dep_id, se.sec_id);

                }
                // get_current_work_break(current_user_id);
                // $("#end_day_work").data({ "part_id": '', "process_id": current_process_id, "machine_id": current_machine_id, "req_qty": 1, "qr_id": qrValue });

                // $("#end_day_work").data("process_part_array", process_part_array);
                // $("#end_day_work").data("qr_id", qrValue);
                // update_qr_end_time(qrValue);
                // insert_work_done(current_user_id, qrValue, JSON.stringify(break_details), '', godown_id, dep_id, sec_id)

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
            ta: "தவறைத் தவறு என்று உங்களால் சொல்ல முடியாவிட்டால், நீங்கள் அடிமைத்தனத்தின் இறுதிக் கட்டத்தில் இருக்கிறீர்கள்.",
            en: "If you can't say wrong as wrong, you are in last stage of slavery.",
            icon: "⛓️"
        },

        {
            ta: "பயிற்சியில் நீங்கள் எவ்வளவு அதிகமாக வியர்வை சிந்துகிறீர்களோ, போர்க்களத்தில் அவ்வளவு குறைவாகவே இரத்தம் சிந்துவீர்கள்.",
            en: "The more you sweat in practice, the less you bleed in battle.",
            icon: "🛡️"
        },

        {
            ta: "சுதந்திரம் என்பது கொடுப்பதல்ல. அது எடுக்கப்படவேண்டியது.",
            en: "Freedom is not give. It's taken.",
            icon: "⚔️"
        },

        {
            ta: "வெற்றி அடைவோர் வாய்ப்புகளுக்காக காத்திருக்க மாட்டார்கள், அவர்கள் முயற்சி செய்து வாய்ப்பையும் வெற்றியும் உருவாக்குவார்கள்.",
            en: "Success usually comes to those who are too busy to be looking for it.",
            icon: "🧑‍💻"
        },

        {
            ta: "முன்னேறுவதற்கான ரகசியம் தொடங்குவதில்தான் உள்ளது.",
            en: "The secret of getting ahead is getting started.",
            icon: "🚩"
        },

        {
            ta: "உங்கள் வார்த்தைகளால் அதிகாரத்தை அசைக்க முடியுமானால், அதை உரக்கச் சொல்லுங்கள்.",
            en: "If your words can shake power, say them louder.",
            icon: "💥"
        },

        {
            ta: "மௌனத்தைப் போல அதிகாரத்தை வலுப்படுத்துவது வேறு எதுவும் இல்லை.",
            en: "Nothing strengthens authority so much as silence.",
            icon: "🤐"
        },

        {
            ta: "தவறு என்பது தவறுதான் — அது தலைமையாகவே இருந்தாலும் சரி.",
            en: "Wrong is wrong — even when it comes from leadership.",
            icon: "✍️"
        },

        {
            ta: "கடிகாரத்தை பார்த்துக் கொண்டிருக்காதே; அது போல நீயும் தொடர்ந்து செயல்பட்டு.",
            en: "Don’t watch the clock; do what it does. Keep going.",
            icon: "⏰"
        },

        {
            ta: "சிறிய முன்னேற்றமும் முன்னேற்றம்தான்.",
            en: "Small progress is still progress.",
            icon: "💹"
        },

        {
            ta: "உன் எதிர்காலம் இன்று நீ செய்கிற செயல்களால் உருவாகிறது.",
            en: "Your future is created by what you do today.",
            icon: "🌟"
        },

        {
            ta: "வெற்றியை நோக்கி உங்களை நீங்களே தலிக்கொள்ளுங்க, ஏனென்றால் வேறு யாரும் அதை உங்களுக்காக செய்ய மாட்டார்கள்.",
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
            ta: "உந்துதல் உங்களை வழிநடத்துகிறது, ஆனால் ஒழுக்கம் உங்களை வளரச் செய்கிறது.",
            en: "Motivation gets you going, but discipline kepps you growing.",
            icon: "♻️"
        },

        {
            ta: "நிலைத்தன்மைதான் சராசரியைச் சிறப்பானதாக மாற்றுகிறது.",
            en: "Consistency is what transforms average into excellence.",
            icon: "📈"
        },

        {
            ta: "வாய்ப்புகள் தானாக வருவதில்லை. அவற்றை நாம்தான் உருவாக்க வேண்டும்.",
            en: "Opportunities don't happen. You have to create them.",
            icon: "✏️"
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
            ta: "உங்கள் தொழிலில் நீங்கள் எவ்வளவு அதிக எதிர்ப்புகளும் தடைகளையும் சந்திக்கிறீர்களோ, அவ்வளவு வெற்றிக்கு அருகில் இருக்கிறீர்கள்.",
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
            icon: "⏳"
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
            ta: "மனிதனை ஒழுக்கத்தின் பெயரால் தான்  உயர்ந்தவர் என மரியாதை கொடுக்க வேண்டுமே தவிர மதத்தாலோ அல்லது சாதியாலோ அல்ல.",
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


    $('#start_worked_unit').on('change', function () {

        $('#start_worked_dept').val('').trigger("change");
        $("#start_Worked_parts_tbody").empty();
        $(".start_Worked_parts_table").addClass("d-none");

        var unit_id = $(this).val();
        start_get_department_work(unit_id);

    });

    $("#start_worked_dept").on("change", function () {
        var dep_id = $(this).val();
        $('#start_worked_section').val('').trigger("change");
        $("#start_Worked_parts_tbody").empty();
        $(".start_Worked_parts_table").addClass("d-none");
        start_get_dep_section_work(dep_id);
    })

    $("#start_worked_section").on("change", function () {
        var sec_id = $(this).val();
        $('#machine').val('').trigger("change");
        $("#start_Worked_parts_tbody").empty();
        $(".start_Worked_parts_table").addClass("d-none");
        start_get_section_machine_work($("#start_worked_unit").val(), $("#start_worked_dept").val(), sec_id);
    })

    $("#start_worked_machine").on("change", function () {
        var mach_id = $(this).val();
        start_get_section_wise_process($("#start_worked_unit").val(), $("#start_worked_dept").val(), $("#start_worked_section").val(), mach_id);
    })

    $("#start_Worked_parts_tbody").on("click", "input", function () {
        var process_id = $(this).data("process_id");
        var part_id = $(this).data("part_id");

        $("#start_day_btn").data("process_id", process_id)
        $("#start_day_btn").data("part_id", part_id)
    })


    $("#start_day_btn").on("click", function () {
        var process_id = $(this).data("process_id");
        var part_id = $(this).data("part_id");
        var godown_id = $("#start_worked_unit").val();
        var department_id = $("#start_worked_dept").val();
        var section_id = $("#start_worked_section").val();
        var machine_id = $("#start_worked_machine").val();
        console.log(process_id, part_id);

        if (Number(current_user_id) > 0 && godown_id && department_id && section_id && machine_id && process_id && part_id) {
            insert_work_done_table(current_user_id, godown_id, department_id, section_id, machine_id, process_id, part_id);
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

        if ($("#paused_work_tbody tr").length <= 0) {
            $("#final_summary").removeClass("d-none");
            get_final_summary();
        }
        else {
            salert("Warning", "First Complete all the paused work.", "warning");
        }


    })

    $("#last_end_btn").on("click", function () {

        if (work_done_id <= 0) {
            salert("Warning", "Data Missing Try Later.", "warning");
        }

        Swal.fire({
            title: "Sure?",
            text: "Do you want to End The day?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, End Day!"
        }).then((result) => {

            if (result.isConfirmed) {

                work_day_end(work_done_id);

            }
        });
    })

    $("#chase_entry_btn").on("click", function () {
        var chasis_no = $("#chase_no").val();
        var ass_id = $(this).val();

        if (chasis_no && ass_id) {
            console.log(ass_id, chasis_no);

            update_chasis_no(ass_id, chasis_no);
        }
        else {
            salert("Warning", "Please Enter the Chasis No", "warning");
        }
    })

    $("#set_main_process").change(function () {
        if (Number($("#worked_machine").val()) > 0) {
            get_section_wise_process($("#worked_unit").val(), $("#worked_dept").val(), $("#worked_section").val(), $("#worked_machine").val());
        }
    })

    $("#Worked_parts_tbody").on("click", "td button", function () {

        // if (current_work > 0) {
        //     salert("Warning", "Pause/ End The Current Work", "warning");
        //     return;
        // }

        $("#setting_part_table").removeClass("d-none");
        var part_id = $(this).data("part_id");
        var process_id = $(this).data("process_id");

        var part_name = $(this).closest("tr").find("td").eq(1).text();
        var process = $(this).closest("tr").find("td").eq(2).text();
        var length_n = $("#setting_part_tbody tr").length;

        $("#setting_part_tbody").append(`<tr data-part_id=${part_id} data-process_id=${process_id}><td>${length_n + 1}</td><td>${part_name}</td><td>${process}</td><td contenteditable=true>1</td><td><button class='btn btn-outline-danger'><i class='fa fa-trash'></i> </button<</td></tr>`)

        if ($("#setting_part_tbody tr").length === 0) {
            $("#setting_part_table").addClass("d-none");
        }

    });

    $("#Worked_parts_tbody").on("click", "td input", function () {

        var part_id = $(this).data("part_id");
        var process_id = $(this).data("process_id");
        var godown_id = $("#worked_unit").val();
        var department_id = $("#worked_dept").val();
        var section_id = $("#worked_section").val();
        var machine_id = $("#worked_machine").val();



        if (part_id && process_id && work_done_id > 0 && godown_id && department_id && section_id && machine_id) {
            change_current_process(godown_id, department_id, section_id, machine_id, process_id, part_id, work_done_id);
        }
        else {
            salert("Warning", "Select Section & Process.", "warning");
        }

    });


    $("#setting_part_tbody").on("focusout", "[contenteditable]", function () {
        let value = $(this).text().trim();
        let num = Number(value);

        if (!value || isNaN(num) || num <= 0) {
            $(this).text(1);
        }
    })

    $("#setting_part_tbody").on("click", "button", function () {
        var row = $(this).closest("tr");

        $("#setting_part_tbody").on("click", "button", function () {

            var row = $(this).closest("tr");

            Swal.fire({
                title: "Do you want to delete?",
                text: "The row will be deleted.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {

                if (result.isConfirmed) {

                    row.remove();
                    Chart.getChart("workChart")?.destroy();

                    $("#setting_part_tbody tr").each(function (index) {
                        $(this).find("td").eq(0).text(index + 1);
                    });

                    if ($("#setting_part_tbody tr").length === 0) {
                        $("#setting_part_table").addClass("d-none");
                    }
                }
            });
        });
    })

    $("#add_setting_part_btn").on("click", function () {

        var process_part_array = [];
        var machine_id = $("#worked_machine").val();

        $("#setting_part_tbody tr").each(function () {

            var part_id = $(this).data("part_id");
            var process_id = $(this).data("process_id");
            var req_qty = $(this).find("td").eq(3).text();

            process_part_array.push({ part_id: part_id, process_id: process_id, required_qty: req_qty, machine_id: machine_id })


        });

        $("#end_day_work").data("process_part_array", process_part_array);
        $("#end_day_work").data("qr_id", '');
        get_current_work_break(current_user_id);


    });

    $("#end_day_work").on("click", function () {

        var qr_work_id = $(this).data("qr_id");
        var process_part_array = $(this).data("process_part_array");
        var break_time_array = [];


        $("#break_time_list li").each(function () {

            if ($(this).find("input").is(":checked")) {
                var break_id = $(this).find("input").data("ex_id");
                var break_minutes = $(this).find("input").data("ex_time");
                break_time_array.push({ break_id: break_id, break_minutes: break_minutes });

            }

        });

        console.log(process_part_array, break_time_array)
        var se = sec_details()

        if (!se.godown_id || !se.dep_id || !se.sec_id) {
            salert("Warning", "Select Section First", "warning");
            return;
        }

        if (process_part_array.length > 0 || qr_work_id) {

            get_work_summary(current_user_id, qr_work_id, JSON.stringify(break_time_array), JSON.stringify(process_part_array), se.godown_id, se.dep_id, se.sec_id);
            console.log(se.godown_id, se.dep_id, se.sec_id);
            $('html, body').animate({
                scrollTop: $("#workChart").offset().top
            }, 500);
            // insert_work_done(current_user_id, qr_work_id, JSON.stringify(break_time_array), JSON.stringify(process_part_array), se.godown_id, se.dep_id, se.sec_id);
        }
        else {
            salert("Warning", "Data Missing!, Try Later.", "warning");
        }
    })


    $("#complete_work").on("click", function () {

        var qr_work_id = $(this).data("qr_work_id");
        var break_time_array = $(this).data("break_time_array");
        var process_part_array = $(this).data("process_part_array");
        var godown_id = $(this).data("godown_id");
        var dep_id = $(this).data("dep_id");
        var sec_id = $(this).data("sec_id");
        console.log(qr_work_id);
        console.log(break_time_array);
        console.log(process_part_array);


        if (!process_part_array) {
            salert("Warning", "Data missing, try later", "warning");
            return;
        }

        Swal.fire({
            title: "Are You Sure!, Anyone Cann't Edit Anything After Inserted",
            html: "Work Completed? Have you assembled all parts and sub-assemblies? 🤔",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Completed",
            cancelButtonText: "No",
            confirmButtonColor: "#198754",
            cancelButtonColor: "#dc3545",
            reverseButtons: true
        }).then((result) => {

            if (result.isConfirmed) {


                var se = sec_details()

                if (!se.godown_id || !se.dep_id || !se.sec_id) {
                    salert("Warning", "Select Section First", "warning");
                    return;
                }

                if (process_part_array.length > 0 || qr_work_id) {

                    insert_work_done(current_user_id, qr_work_id, break_time_array, process_part_array, se.godown_id, se.dep_id, se.sec_id);
                    console.log(se.godown_id, se.dep_id, se.sec_id);

                }

            }

        });

    });

    $("#add_extra_work_btn").on("click", function () {
        var extra_work_id = $("#extra_work_select").val();
        var extra_work_name = $("#extra_work_select").find(":selected").data("name");
        var extra_work_time = $("#extra_work_time").val();
        var extra_work_time_type = $("#extra_work_time_type").val();
        var ex_time = 0;

        if (!extra_work_id || !extra_work_time) {
            salert("Warning", "Fill All Fields.", "warning");
            return;
        }

        if (extra_work_time_type == "hrs") {
            ex_time = Number(extra_work_time) * 60;
        } else {
            ex_time = extra_work_time;
        }

        $("#break_time_list").append(`<li class='list-group-item bg-warning' >${extra_work_name} - (${ex_time} Mins)<input class="form-check-input float-end" type="checkbox" data-ex_id="${extra_work_id}" data-ex_time="${ex_time}" id="" checked></li>`)
        shw_toast("Success", "Extra Work Added Successfully!")
        extra_work_id = $("#extra_work_select").val("");
        extra_work_time = $("#extra_work_time").val("");
        extra_work_time_type = $("#extra_work_time_type").val("minutes");
    })

    $("#pdf_summary_btn").on("click", function () {

        const element = document.getElementById("pdfContent");

        html2canvas(element, {
            scale: 2 // better quality
        }).then(canvas => {

            const imgData = canvas.toDataURL("image/png");

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 150; // A4 width
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;
            let x = (210 - imgWidth) / 2;
            // First page
            pdf.addImage(imgData, "PNG", x, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Multiple pages if needed
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // ✅ 🔥 Dynamic File Name
            let today = new Date();

            let day = String(today.getDate()).padStart(2, '0');
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let year = today.getFullYear();

            let formattedDate = `${day}-${month}-${year}`;

            let employeeName = current_user_name
                ? current_user_name.replace(/\s+/g, "_").toLowerCase()
                : "employee";

            let fileName = `${employeeName}_work_summary_${formattedDate}.pdf`;

            // ✅ Save with dynamic name
            pdf.save(fileName);
        });
    });

});



function sec_details() {
    var godown_id = $("#worked_unit").val();
    var dep_id = $("#worked_dept").val();
    var sec_id = $("#worked_section").val();

    return { godown_id, dep_id, sec_id };
}


window.receiveScanResult = function (result) {
    console.log("Scanned result: " + result);

    $("#job_ass_id").val(result);
};

function get_work_summary(emp_id, qr_work_id, break_time_array, process_part_array, godown_id, dep_id, sec_id) {

    $.ajax({
        url: "php/get_work_summary.php",
        type: "post",
        data: {
            emp_id,
            qr_work_id,
            break_time_array,
            process_part_array,
            godown_id,
            dep_id,
            sec_id
        },

        success: function (response) {

            console.log(response);

            let data;

            try {
                data = JSON.parse(response);
            } catch (e) {
                salert("Invalid response");
                return;
            }

            Chart.getChart("workChart")?.destroy();
            document.getElementById("workDetails").innerHTML = '';


            if (data.message == "success") {

                $("#complete_work").data({ "qr_work_id": qr_work_id, "break_time_array": break_time_array, "process_part_array": process_part_array, "godown_id": godown_id, "dep_id": dep_id, "sec_id": sec_id })


                $("#complete_work").removeClass("d-none")
                $("#setting_part_table").removeClass("d-none");
                $("#breakTimeModal").modal("hide");

                // ======= TIME CALCULATION =======
                let totalDayWork = Number(data.total_day_time || 0);
                let totalWork = Number(data.total_process_time || 0).toFixed(1);
                let freeTime = Number(data.free_time || 0).toFixed(1);
                let pausedTime = Number(data.paused_time || 0).toFixed(1);
                let extraWork = Number(data.total_extra_work_time || 0).toFixed(1);

                // Extra Work Logic
                let breakTime = Number(data.break_time || 0).toFixed(1);
                // let extraWork = data.work_status === "excess_time" ? totalWork - freeTime : 0;
                if (extraWork < 0) extraWork = 0;


                // ======= TIME FORMAT FUNCTION =======
                function formatMinutes(mins) {
                    let h = Math.floor(mins / 60);
                    let m = mins % 60;
                    return h + "h " + m + "m";
                }


                // ======= CHART =======
                const ctx = document.getElementById('workChart').getContext('2d');

                // Gradient colors
                let grad1 = ctx.createLinearGradient(0, 0, 0, 300);
                grad1.addColorStop(0, "#4CAF50");
                grad1.addColorStop(1, "#81C784");

                let grad2 = ctx.createLinearGradient(0, 0, 0, 300);
                grad2.addColorStop(0, "#FF9800");
                grad2.addColorStop(1, "#FFB74D");

                let grad3 = ctx.createLinearGradient(0, 0, 0, 300);
                grad3.addColorStop(0, "#F44336");
                grad3.addColorStop(1, "#E57373");

                let grad4 = ctx.createLinearGradient(0, 0, 0, 300);
                grad4.addColorStop(0, "#36def4");
                grad4.addColorStop(1, "#73d4e5");

                let grad5 = ctx.createLinearGradient(0, 0, 0, 300);
                grad5.addColorStop(0, "#f4e136");
                grad5.addColorStop(1, "#e5da73");


                // ===== FIX: DESTROY OLD CHART =====
                if (window.workChartInstance) {
                    window.workChartInstance.destroy();
                }

                // ======= CHART =======
                // const ctx = document.getElementById('workChart').getContext('2d');

                // Center text plugin
                const centerTextPlugin = {
                    id: 'centerText',
                    beforeDraw(chart) {

                        const { ctx } = chart;

                        const meta = chart.getDatasetMeta(0);
                        const centerX = meta.data[0].x;
                        const centerY = meta.data[0].y;

                        ctx.save();

                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";

                        let efficiency = (parseInt(totalWork) + parseInt(extraWork)) / (totalDayWork);
                        ctx.fillText((efficiency * 100).toFixed(0) + "%", centerX, centerY + 0);


                        let title = "😴 Lazy Day";
                        let color = "#c62828";

                        if (efficiency > 0.85) {
                            title = "🔥 Highly Productive";
                            color = "#1b5e20";
                        } else if (efficiency > 0.65) {
                            title = "💪 Work Day";
                            color = "#2e7d32";
                        } else if (efficiency > 0.35) {
                            title = "⚠️ Average";
                            color = "#f9a825";
                        }

                        ctx.fillStyle = color;
                        // let isGood = totalWork > freeTime;
                        // let title = isGood ? "💪 Work Day" : "😴 Lazy Day";


                        ctx.font = "bold 9px sans-serif";
                        // ctx.fillStyle = isGood ? "#2e7d32" : "#c62828";
                        ctx.fillText(title, centerX, centerY - 15);


                        ctx.font = "bold 12px sans-serif";
                        ctx.fillStyle = "#0d31ff";
                        ctx.fillText(formatMinutes(totalDayWork), centerX, centerY + 12);

                        ctx.restore();
                    }
                };

                // ===== CREATE CHART =====
                window.workChartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['💪 Work Time', '😎 Extra Time', '⏸️ Paused Time', '☕ Break Time', '😴 Free Time'],
                        datasets: [{
                            data: [totalWork, extraWork, pausedTime, breakTime, freeTime],
                            backgroundColor: [grad1, grad2, grad4, grad5, grad3],
                            borderRadius: 10,
                            hoverOffset: 15,
                            borderWidth: 2,
                            borderColor: "#fff"
                        }]
                    },
                    options: {
                        responsive: true,

                        cutout: '65%',

                        animation: {
                            animateRotate: true,
                            animateScale: true,
                            duration: 1800,
                            easing: 'easeOutElastic' // more visible than bounce
                        },

                        transitions: {
                            active: {
                                animation: {
                                    duration: 400
                                }
                            }
                        },

                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        let percent = ((context.raw / totalDayWork) * 100).toFixed(1);

                                        return ` ${formatMinutes(context.raw)} (${percent}%)`;
                                    }
                                }
                            }
                        },

                        onClick: (evt, elements) => {
                            if (elements.length > 0) {

                                let index = elements[0].index;
                                let label = window.workChartInstance.data.labels[index];

                                if (label.includes("Work Time")) {
                                    showWorkDetails(data.report, "Work Time");
                                }
                                else if (label.includes("Extra Time")) {
                                    showWorkDetails(data.report, "Extra Time");
                                }
                                else if (label.includes("Break Time")) {
                                    showWorkDetails(data.report, "Break Time");
                                }
                                else {
                                    document.getElementById("workDetails").innerHTML = '';
                                }
                            }
                        }
                    },
                    plugins: [centerTextPlugin]
                });


                let workPer = ((totalWork / totalDayWork) * 100) || 0;
                let extraPer = ((extraWork / totalDayWork) * 100) || 0;
                let freePer = ((freeTime / totalDayWork) * 100) || 0;
                let pausedPer = ((pausedTime / totalDayWork) * 100) || 0;
                let breakPer = ((breakTime / totalDayWork) * 100) || 0;
                // ===== FUN SUMMARY CARDS =====
                let funSummary = `
                    <div class="row mt-3 text-center g-1">

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#e8f5e9;">
                                <span class="icon-work">💪</span><br>
                                <b>${formatMinutes(totalWork)}</b><br>
                                <small>Work</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${workPer}%; background:#2e7d32;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#fff3e0;">
                                <span class="icon-work">😎</span><br>
                                <b>${formatMinutes(extraWork)}</b><br>
                                <small>Extra</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${extraPer}%; background:#ef6c00;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#e3f2fd;">
                                <span class="icon-paused">⏸️</span><br>
                                <b>${formatMinutes(pausedTime)}</b><br>
                                <small>Paused</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${pausedPer}%; background:#1565c0;"></div>
                                </div>
                            </div>
                        </div> 

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#fffacf;">
                                <span class="icon-extra">☕</span><br>
                                <b>${formatMinutes(breakTime)}</b><br>
                                <small>Break</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${breakPer}%; background:#f4e136;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#ffebee;">
                                <span class="icon-free">😴</span><br>
                                <b>${formatMinutes(freeTime)}</b><br>
                                <small>Free</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${freePer}%; background:#c62828;"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                    `;

                document.getElementById("workSummaryCards").innerHTML = funSummary;


                // ======= DRILL DOWN TABLE =======
                function showWorkDetails(report, label) {
                    document.getElementById("workDetails").innerHTML = '';

                    let html = `
                        <div class="card shadow">
                            <div class="card-header bg-primary text-white">
                                Work Details
                            </div>
                            <div class="card-body p-2" style="max-height: 25vh; overflow-y: auto;">
                                <table class="table table-bordered table-sm">
                                    <thead style="position: sticky; z-index: 5; top: 0; background-color: #d1e5ff">
                                        <tr>
                                            <th>#</th>
                                            <th>Part Name</th>
                                            <th>Process</th>
                                            <th>Chasis/No</th>
                                            <th>Qty</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                    `;

                    let html1 = `
                        <div class="card shadow">
                            <div class="card-header bg-primary text-white">
                                Extra Work / Break Details
                            </div>
                            <div class="card-body p-2" style="max-height: 25vh; overflow-y: auto;">
                                <table class="table table-bordered table-sm">
                                    <thead style="position: sticky; z-index: 5; top: 0; background-color: #d1e5ff">
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                    `;


                    let count = 1;

                    report.forEach(item => {

                        if (item.work_sts === "finished" && item.process_data && item.process_data !== "null" && label === "Work Time") {

                            try {
                                let processes = JSON.parse(item.process_data);
                                let parsedData = item.assign_product_data ? JSON.parse(item.assign_product_data) : [];
                                processes.forEach(p => {

                                    if (!p.process_name) return;

                                    html += `
                                        <tr>
                                            <td>${count++}</td>
                                            <td>${p.part_name}</td>
                                            <td>${p.process_name}</td>
                                            <td>${!parsedData.chasis_no ? "Sub-Assembly" : parsedData.chasis_no}</td>
                                            <td>${p.qty || 0}</td>
                                            <td>${p.total_time || 0} min</td>
                                        </tr>
                                    `;
                                });

                            } catch (e) {
                                console.log("Parse error", e);
                            }
                        }

                        else if (item.extra_work_data && item.extra_work_data !== "null" && label === "Extra Time") {

                            try {
                                let processes = JSON.parse(item.extra_work_data).filter(p => p !== null);

                                processes.forEach(p => {

                                    if (!p.ex_name) return;

                                    html1 += `
                                        <tr>
                                            <td>${count++}</td>
                                            <td>${p.ex_name}</td>
                                            <td>${p.break_time || 0} min</td>
                                        </tr>
                                    `;
                                });

                            } catch (e) {
                                console.log("Parse error", e);
                            }
                        }

                        else if (item.break_data && item.break_data !== "null" && label === "Break Time") {

                            try {
                                let processes = JSON.parse(item.break_data).filter(p => p !== null);

                                processes.forEach(p => {

                                    if (!p.ex_name) return;

                                    html1 += `
                                        <tr>
                                            <td>${count++}</td>
                                            <td>${p.ex_name}</td>
                                            <td>${p.break_time || 0} min</td>
                                        </tr>
                                    `;
                                });

                            } catch (e) {
                                console.log("Parse error", e);
                            }
                        }
                    });

                    if (count === 1) {
                        html1 += `<tr><td colspan="4" class="text-center text-muted">No Extra Work / Break TIme</td></tr>`;
                    }

                    html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                        `;

                    html1 += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                        `;

                    if (label === "Extra Time" || label === "Break Time") {

                        document.getElementById("workDetails").innerHTML = html1;
                    } else {

                        document.getElementById("workDetails").innerHTML = html;
                    }
                }

            }
            else {

                $("#setting_part_table").addClass("d-none");
                $("#setting_part_tbody").empty();
                $("#breakTimeModal").modal("hide");
                document.getElementById("workDetails").innerHTML = '';

                try {
                    var materials = Array.isArray(data.stock_issue)
                        ? data.stock_issue
                        : JSON.parse(data.stock_issue);
                } catch (e) {
                    materials = [];
                }

                var m_details = `<ul class="list-group">`;

                if (materials.length > 0) {

                    materials.forEach(function (obj) {

                        let process = obj.process_name ? obj.process_name : "General";

                        let required = Number(obj.required_qty || 0);
                        let available = Number(obj.available_qty || 0);

                        let shortage = required - available;

                        let color = shortage > 0 ? "text-dark " : "text-success";

                        m_details += `
                            <li class="list-group-item ${color}"><b>${obj.part_name}</b><small class="text-muted">(${process})</small><br> Required: ${required} → Available: ${available}
                            ${shortage > 0 ? `<br><span class="text-danger">⚠ Shortage: ${shortage}</span>` : `<br><span class="text-success">✅ Sufficient</span>`}
                            </li>`;
                    });

                } else {
                    m_details += `<li class="list-group-item text-muted">No material issues</li>`;
                }

                m_details += `</ul>`;


                var message = `
                    <div style="font-size: 13px">

                        <p class="text-danger"><b>${data.message}</b></p>

                        ${m_details}

                        <div class="card mt-3 p-2 text-center bg-light">
                            📞 Contact Gowthami <br>
                            கௌதமியைத் தொடர்பு கொள்ளவும் <br>
                            गौथमी से संपर्क करें
                        </div>

                    </div>
                    `;


                Swal.fire({
                    icon: 'warning',
                    title: 'Stock Issue',
                    html: message,
                    width: 600
                });
            }



        },

        error: function (xhr) {
            console.error(xhr.responseText);
        }
    });
}

function get_final_summary() {
    console.log(current_user_id);

    $.ajax({
        url: "php/get_final_summary.php",
        type: "get",
        data: {
            emp_id: current_user_id,
        },

        success: function (response) {

            console.log(response);

            let data;

            try {
                data = JSON.parse(response);
                $("#summay_btn").addClass("d-none")
                $("#last_end_btn").removeClass("d-none")
            } catch (e) {
                salert("Invalid response");
                $("#final_summary").addClass("d-none");
                return;
            }

            Chart.getChart("finalWorkChart")?.destroy();
            document.getElementById("finalWorkDetails").innerHTML = '';


            $("#emp_name_summary").text(current_user_name + " Work Summary" ?? "Employee Work Summary")

            // ======= TIME CALCULATION =======
            let totalDayWork = Number(data.total_day_time || 0);
            let totalWork = Number(data.total_process_time || 0).toFixed(1);
            let freeTime = Number(data.free_time || 0).toFixed(1);
            let pausedTime = Number(data.paused_time || 0).toFixed(1);
            let extraWork = Number(data.total_extra_work_time || 0).toFixed(1);

            // Extra Work Logic
            let breakTime = Number(data.break_time || 0).toFixed(1);
            // let extraWork = data.work_status === "excess_time" ? totalWork - freeTime : 0;
            if (extraWork < 0) extraWork = 0;


            // ======= TIME FORMAT FUNCTION =======
            function formatMinutes(mins) {
                let h = Math.floor(mins / 60);
                let m = mins % 60;
                return h + "h " + m + "m";
            }


            // ======= CHART =======
            const ctx = document.getElementById('finalWorkChart').getContext('2d');

            // Gradient colors
            let grad1 = ctx.createLinearGradient(0, 0, 0, 300);
            grad1.addColorStop(0, "#4CAF50");
            grad1.addColorStop(1, "#81C784");

            let grad2 = ctx.createLinearGradient(0, 0, 0, 300);
            grad2.addColorStop(0, "#FF9800");
            grad2.addColorStop(1, "#FFB74D");

            let grad3 = ctx.createLinearGradient(0, 0, 0, 300);
            grad3.addColorStop(0, "#F44336");
            grad3.addColorStop(1, "#E57373");

            let grad4 = ctx.createLinearGradient(0, 0, 0, 300);
            grad4.addColorStop(0, "#36def4");
            grad4.addColorStop(1, "#73d4e5");

            let grad5 = ctx.createLinearGradient(0, 0, 0, 300);
            grad5.addColorStop(0, "#f4e136");
            grad5.addColorStop(1, "#e5da73");


            // ===== FIX: DESTROY OLD CHART =====
            if (window.workChartInstance) {
                window.workChartInstance.destroy();
            }

            // ======= CHART =======
            // const ctx = document.getElementById('workChart').getContext('2d');

            // Center text plugin
            const centerTextPlugin = {
                id: 'centerText',
                beforeDraw(chart) {

                    const { ctx } = chart;

                    const meta = chart.getDatasetMeta(0);
                    const centerX = meta.data[0].x;
                    const centerY = meta.data[0].y;

                    ctx.save();

                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    let efficiency = (parseInt(totalWork) + parseInt(extraWork)) / (totalDayWork);
                    ctx.fillText((efficiency * 100).toFixed(0) + "%", centerX, centerY + 0);


                    let title = "😴 Lazy Day";
                    let color = "#c62828";

                    if (efficiency > 0.85) {
                        title = "🔥 Highly Productive";
                        color = "#1b5e20";
                    } else if (efficiency > 0.65) {
                        title = "💪 Work Day";
                        color = "#2e7d32";
                    } else if (efficiency > 0.35) {
                        title = "⚠️ Average";
                        color = "#f9a825";
                    }

                    ctx.fillStyle = color;
                    // let isGood = totalWork > freeTime;
                    // let title = isGood ? "💪 Work Day" : "😴 Lazy Day";


                    ctx.font = "bold 9px sans-serif";
                    // ctx.fillStyle = isGood ? "#2e7d32" : "#c62828";
                    ctx.fillText(title, centerX, centerY - 15);


                    ctx.font = "bold 12px sans-serif";
                    ctx.fillStyle = "#0d31ff";
                    ctx.fillText(formatMinutes(totalDayWork), centerX, centerY + 12);

                    ctx.restore();
                }
            };

            // ===== CREATE CHART =====
            window.workChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['💪 Work Time', '😎 Extra Time', '⏸️ Paused Time', '☕ Break Time', '😴 Free Time'],
                    datasets: [{
                        data: [totalWork, extraWork, pausedTime, breakTime, freeTime],
                        backgroundColor: [grad1, grad2, grad4, grad5, grad3],
                        borderRadius: 10,
                        hoverOffset: 15,
                        borderWidth: 2,
                        borderColor: "#fff"
                    }]
                },
                options: {
                    responsive: true,

                    cutout: '65%',

                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1800,
                        easing: 'easeOutElastic' // more visible than bounce
                    },

                    transitions: {
                        active: {
                            animation: {
                                duration: 400
                            }
                        }
                    },

                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let percent = ((context.raw / totalDayWork) * 100).toFixed(1);

                                    return ` ${formatMinutes(context.raw)} (${percent}%)`;
                                }
                            }
                        }
                    },

                    onClick: (evt, elements) => {
                        if (elements.length > 0) {

                            let index = elements[0].index;
                            let label = window.workChartInstance.data.labels[index];

                            if (label.includes("Work Time")) {
                                showWorkDetails(data.report, "Work Time");
                            }
                            else if (label.includes("Extra Time")) {
                                showWorkDetails(data.report, "Extra Time");
                            }
                            else if (label.includes("Break Time")) {
                                showWorkDetails(data.report, "Break Time");
                            }
                            else {
                                document.getElementById("finalWorkDetails").innerHTML = '';
                            }
                        }
                    }
                },
                plugins: [centerTextPlugin]
            });


            let workPer = ((totalWork / totalDayWork) * 100) || 0;
            let extraPer = ((extraWork / totalDayWork) * 100) || 0;
            let freePer = ((freeTime / totalDayWork) * 100) || 0;
            let pausedPer = ((pausedTime / totalDayWork) * 100) || 0;
            let breakPer = ((breakTime / totalDayWork) * 100) || 0;
            // ===== FUN SUMMARY CARDS =====
            let funSummary = `
                    <div class="row mt-3 text-center g-1">

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#e8f5e9;">
                                <span class="icon-work">💪</span><br>
                                <b>${formatMinutes(totalWork)}</b><br>
                                <small>Work</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${workPer}%; background:#2e7d32;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#fff3e0;">
                                <span class="icon-work">😎</span><br>
                                <b>${formatMinutes(extraWork)}</b><br>
                                <small>Extra</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${extraPer}%; background:#ef6c00;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#e3f2fd;">
                                <span class="icon-paused">⏸️</span><br>
                                <b>${formatMinutes(pausedTime)}</b><br>
                                <small>Paused</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${pausedPer}%; background:#1565c0;"></div>
                                </div>
                            </div>
                        </div> 

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#fffacf;">
                                <span class="icon-extra">☕</span><br>
                                <b>${formatMinutes(breakTime)}</b><br>
                                <small>Break</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${breakPer}%; background:#f4e136;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card p-2 shadow-sm border-0" style="background:#ffebee;">
                                <span class="icon-free">😴</span><br>
                                <b>${formatMinutes(freeTime)}</b><br>
                                <small>Free</small>

                                <div class="wave-box">
                                    <div class="wave-fill" style="width:${freePer}%; background:#c62828;"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                    `;

            document.getElementById("finalWorkSummaryCards").innerHTML = funSummary;


            // ======= DRILL DOWN TABLE =======
            function showWorkDetails(report, label) {
                document.getElementById("finalWorkDetails").innerHTML = '';

                let html = `
                        <div class="card shadow">
                            <div class="card-header bg-primary text-white">
                                Work Details
                            </div>
                            <div class="card-body p-2" style="max-height: 25vh; overflow-y: auto;">
                                <table class="table table-bordered table-sm">
                                    <thead style="position: sticky; z-index: 5; top: 0; background-color: #d1e5ff">
                                        <tr>
                                            <th>#</th>
                                            <th>Part Name</th>
                                            <th>Process</th>
                                            <th>Chasis/No</th>
                                            <th>Qty</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                    `;

                let html1 = `
                        <div class="card shadow">
                            <div class="card-header bg-primary text-white">
                                Extra Work / Break Details
                            </div>
                            <div class="card-body p-2" style="max-height: 25vh; overflow-y: auto;">
                                <table class="table table-bordered table-sm">
                                    <thead style="position: sticky; z-index: 5; top: 0; background-color: #d1e5ff">
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                    `;


                let count = 1;

                report.forEach(item => {

                    if (item.work_sts === "finished" && item.process_data && item.process_data !== "null" && label === "Work Time") {

                        try {
                            let processes = JSON.parse(item.process_data);
                            let parsedData = item.assign_product_data ? JSON.parse(item.assign_product_data) : [];
                            processes.forEach(p => {

                                if (!p.process_name) return;

                                html += `
                                        <tr>
                                            <td>${count++}</td>
                                            <td>${p.part_name}</td>
                                            <td>${p.process_name}</td>
                                            <td>${!parsedData.chasis_no ? "Sub-Assembly" : parsedData.chasis_no}</td>
                                            <td>${p.qty || 0}</td>
                                            <td>${p.total_time || 0} min</td>
                                        </tr>
                                    `;
                            });

                        } catch (e) {
                            console.log("Parse error", e);
                        }
                    }

                    else if (item.extra_work_data && item.extra_work_data !== "null" && label === "Extra Time") {

                        try {
                            let processes = JSON.parse(item.extra_work_data).filter(p => p !== null);

                            processes.forEach(p => {

                                if (!p.ex_name) return;

                                html1 += `
                                        <tr>
                                            <td>${count++}</td>
                                            <td>${p.ex_name}</td>
                                            <td>${p.break_time || 0} min</td>
                                        </tr>
                                    `;
                            });

                        } catch (e) {
                            console.log("Parse error", e);
                        }
                    }

                    else if (item.break_data && item.break_data !== "null" && label === "Break Time") {

                        try {
                            let processes = JSON.parse(item.break_data).filter(p => p !== null);

                            processes.forEach(p => {

                                if (!p.ex_name) return;

                                html1 += `
                                        <tr>
                                            <td>${count++}</td>
                                            <td>${p.ex_name}</td>
                                            <td>${p.break_time || 0} min</td>
                                        </tr>
                                    `;
                            });

                        } catch (e) {
                            console.log("Parse error", e);
                        }
                    }
                });

                if (count === 1) {
                    html1 += `<tr><td colspan="4" class="text-center text-muted">No Break TIme</td></tr>`;
                }

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                        `;

                html1 += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                        `;

                if (label === "Extra Time" || label === "Break Time") {

                    document.getElementById("finalWorkDetails").innerHTML = html1;
                } else {

                    document.getElementById("finalWorkDetails").innerHTML = html;
                }
            }




        },

        error: function (xhr) {
            console.error(xhr.responseText);
        }
    });
}

function work_day_end(work_done_id) {

    console.log(work_done_id);

    $.ajax({
        url: "php/work_day_end.php",
        type: "post", //send it through get method
        data: {

            work_done_id: work_done_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok" || response.trim() == "Work ended successfully") {
                window.location.reload();
                // get_current_work_details(current_user_id)
            }




        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function insert_work_done(emp_id, qr_work_id, break_time_array, process_part_array, godown_id, dep_id, sec_id) {

    console.log(emp_id, qr_work_id, break_time_array, process_part_array, godown_id, dep_id, sec_id);

    $.ajax({
        url: "php/insert_work_done.php",
        type: "post", //send it through get method
        data: {

            emp_id: emp_id,
            qr_work_id: qr_work_id,
            break_time_array: break_time_array,
            process_part_array: process_part_array,
            godown_id: godown_id,
            dep_id: dep_id,
            sec_id: sec_id
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                window.location.reload();
                // get_current_work_details(current_user_id)
            }
            else {
                let msg = "Something went wrong";

                try {
                    let match = response.match(/"message":"([^"]+)"/);
                    if (match && match[1]) {
                        msg = match[1];
                    }
                } catch (e) {
                    console.log("Error parsing message", e);
                }

                salert(msg);
                $("#setting_part_tbody").empty();
                $("#setting_part_table").addClass("d-none");
                get_current_work_details(current_user_id)
            }




        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function update_chasis_no(ass_id, chasis_no) {

    $.ajax({
        url: "php/update_chasis_no.php",
        type: "post", //send it through get method
        data: {

            ass_id: ass_id,
            chasis_no: chasis_no,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                window.location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

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
                            $("#break_time_list").append(`<li class='list-group-item' >${item.ex_name} <input class="form-check-input float-end" type="checkbox" data-ex_id="${item.ex_id}" data-ex_time="${item.ex_time}" id="" checked></li>`)
                        })

                    });

                }
                else {

                    $("#end_day_work").data("break_details", '');
                    $("#break_time_list").append(`<li class='list-group-item text-white bg-secondary'>No Braek Between This Time Period</li>`)
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

function insert_work_done_table(user_id, godown_id, department_id, section_id, machine_id, process_id, part_id) {

    $.ajax({
        url: "php/insert_work_done_table.php",
        type: "post", //send it through get method
        data: {

            emp_id: user_id,
            current_process_id: process_id,
            part_id: part_id,
            godown_id: godown_id,
            dep_id: department_id,
            sec_id: section_id,
            current_machine_id: machine_id,
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

function change_current_process(godown_id, department_id, section_id, machine_id, process_id, part_id, work_done_id) {

    $.ajax({
        url: "php/change_current_process.php",
        type: "post", //send it through get method
        data: {

            work_id: work_done_id,
            current_process_id: process_id,
            part_id: part_id,
            godown_id: godown_id,
            dep_id: department_id,
            sec_id: section_id,
            current_machine_id: machine_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {

                window.location.reload()
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
                location.reload();
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
                $("#pause_work_btn").prop("disabled", false);
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


function startRunningTimer(startTimeStr, elementId) {
    console.log(startTimeStr, elementId);

    // Convert "19-03-2026 09:53 AM" → proper Date
    let parts = startTimeStr.split(" ");
    let datePart = parts[0].split("-");
    let timePart = parts[1];
    let ampm = parts[2];

    let day = datePart[0];
    let month = datePart[1] - 1; // JS month is 0-based
    let year = datePart[2];

    let [hours, minutes] = timePart.split(":");

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    let startTime = new Date(year, month, day, hours, minutes, 0);

    setInterval(() => {
        let now = new Date();
        let diff = now - startTime;

        let seconds = Math.floor(diff / 1000);
        let hrs = Math.floor(seconds / 3600);
        let mins = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;

        let formatted =
            String(hrs).padStart(2, '0') + ":" +
            String(mins).padStart(2, '0') + ":" +
            String(secs).padStart(2, '0');

        let el = document.getElementById(elementId);

        if (el) {
            el.innerText = formatted;
        }

    }, 1000);
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


                    $("#start_work").prop("disabled", false);
                    $("#job_ass_id").val("");
                    $("#start_section").addClass("d-none");
                    $("#after_start").removeClass("d-none");
                    $("#scan_section").addClass("d-none");
                    $("#timing_section").removeClass("d-none");
                    current_work = 1;
                    var obj = JSON.parse(response);

                    current_process_id = obj.current_process_id;
                    current_part_id = obj.part_id;
                    current_godown_id = obj.godown_id;
                    current_department_id = obj.dep_id;
                    current_section_id = obj.sec_id;
                    current_machine_id = obj.current_machine_id;
                    work_done_id = obj.work_done_id;

                    $('#worked_unit').val(current_godown_id).trigger("change");

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
                    $("#batch_id").text("JS" + obj.work_done_id);

                    let in_process_work_entries = Array.isArray(obj.in_process_work_entries) ? obj.in_process_work_entries : [];
                    in_process_work_entries.forEach(function (item) {

                        if (!item.chasis_no) {
                            $("#chase_entry_btn").val(item.ass_id)
                            $("#chase_entry_modal").modal("show");
                        }

                        production_id.push(obj.production_id);

                        $("#timing_section").append(`
                            <div class="card part-card">

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
                                

                                <div class="card-body text-center p-2">

                                    <div class="motivation-box mb-1">
                                        🚀 <strong>Consistency is Progress</strong><br>
                                        I fear not the man who has practiced 10,000 kicks once, but i fear the man who has practiced one kick 10,000 times ~ Bruce Lee.
                                    </div>

                                    <div class="time-box">
                                        <i class="fa-solid fa-clock text-success"></i>
                                        Started at: <strong>${item.start_time_formated}</strong><br>

                                        ⏱ Running Time: 
                                        <strong id="running_time_${item.qr_work_id}" class='text-danger  badge bg-warning'>00:00:00</strong>
                                    </div>
                                    <div class="bg-secondary text-white rounded mt-1">
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

                        startRunningTimer(item.start_time_formated, `running_time_${item.qr_work_id}`);

                    });

                    let paused_work_entries = Array.isArray(obj.paused_work_entries) ? obj.paused_work_entries : [];
                    paused_work_entries.forEach(function (pause) {

                        var work_entries = JSON.parse(pause.work_entries);
                        work_entries.forEach(function (we, index) {
                            production_id.push(we.production_id);
                            $("#paused_work_tbody").append(`<tr><td>${index + 1}</td><td><span class='badge bg-info  text-dark'>${we.start_time}</span><span class='badge bg-warning text-dark'>${we.end_time}</span></td><td>${we.reason}</td><td> ${we.chasis_no} <br> QR/No: ${we.production_id}</td><td><button type="button" class="btn btn-outline-primary "id="resume_work" value='${we.current_work_id}' style="font-size: 10px; ">⏸Resume </button></td></tr>`)
                        })
                    });

                    let finished_work_entries = Array.isArray(obj.finished_work_entries) ? obj.finished_work_entries : [];
                    finished_work_entries.forEach(function (finish, index) {

                        if (finish.production_id !== null) {
                            production_id.push(finish.production_id);
                        }

                        let process_data = Array.isArray(finish.process_data) ? finish.process_data : JSON.parse(finish.process_data);

                        process_data.forEach(function (item, i) {
                            $("#work_compeleted_tbody").append(`<tr><td>${i + 1}</td><td>${item.part_name}</td><td>${item.process_name}</td><td>${!finish.chasis_no ? "Sub-Assembly" : finish.chasis_no}</td><td>${item.qty}</td><td>${item.total_time}Mins</td></tr>`);

                        })


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


function get_all_extra_time() {

    $.ajax({
        url: "php/get_all_extra_time.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#extra_work_select").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0
                    $("#extra_work_select").append("<option class='' value='null'> select section...  </option>");

                    obj.forEach(function (obj) {
                        count = count + 1;


                        $("#extra_work_select").append("<option class='' value=" + obj.ext_id + " data-name='" + obj.ex_name + "'>" + obj.ex_name + "</option>");


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

function start_get_department_work(godown_id) {

    $.ajax({
        url: "php/get_department.php",
        type: "get", //send it through get method
        data: {
            godown_id: godown_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#start_worked_dept").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0

                    $("#start_worked_dept").append("<option class='' value='null'> select department...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;

                        $("#start_worked_dept").append("<option class='' value=" + obj.dep_id + " >" + obj.dep_name + "</option>")


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

function start_get_dep_section_work(dept_id) {

    $.ajax({
        url: "php/get_dep_section.php",
        type: "get", //send it through get method
        data: {
            dep_id: dept_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#start_worked_section").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0

                    $("#start_worked_section").append("<option class='' value='null'> select section...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;

                        $("#start_worked_section").append("<option class='' value=" + obj.dep_sec_id + " >" + obj.sec_name + "</option>")



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

function start_get_section_machine_work(godown_id, dep_id, sec_id) {

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
                $("#start_worked_machine").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0
                    $("#start_worked_machine").append("<option class='' value='null'> select machine...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;


                        $("#start_worked_machine").append("<option class='' value=" + obj.machine_id + " >" + obj.machine_name + "</option>")


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

function start_get_section_wise_process(godown_id, dep_id, sec_id, machine_id) {

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
                $("#start_Worked_parts_tbody").empty();
                $(".start_Worked_parts_table").removeClass("d-none");
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0

                    obj.forEach(function (obj, index) {
                        count = count + 1;


                        $("#start_Worked_parts_tbody").append(`<tr><td>${index + 1}</td><td>${obj.output_part}</td><td>${obj.process_name}</td><td>
                      <input class="form-check-input" name="default_process" type="radio" value="" id="" data-part_id=${obj.outpart} data-process_id=${obj.process_id}></td></tr>`)


                    });


                }
                else {
                    // $("#section_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")
                    $("#start_Worked_parts_tbody").append(`<tr><td colspan='5' class='text-center text-danger'> No data Found</td></tr>`)

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

                    if (current_department_id > 0) {
                        $('#worked_dept').val(current_department_id).trigger("change");
                    }


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

                    if (current_section_id > 0) {
                        $("#worked_section").val(current_section_id).trigger("change");
                    }


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
                    if (current_machine_id > 0) {
                        $("#worked_machine").val(current_machine_id).trigger("change");
                    }

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
                    var tb = '';
                    var tb_process = '';

                    obj.forEach(function (obj, index) {
                        count = count + 1;


                        tb += `<tr><td>${index + 1}</td><td>${obj.output_part}</td><td>${obj.process_name}</td><td><button class='btn btn-outline-primary small' data-part_id=${obj.outpart} data-process_id=${obj.process_id} >Add</button></td></tr>`;

                        tb_process += `<tr><td>${index + 1}</td><td>${obj.output_part}</td><td>${obj.process_name}</td><td><input class="form-check-input" name="default_process" type="radio" value="" id="" data-part_id=${obj.outpart} data-process_id=${obj.process_id}></td></tr>`;


                    });

                    if ($("#set_main_process").is(":checked")) {
                        $("#Worked_parts_tbody").append(tb_process);
                    } else {
                        $("#Worked_parts_tbody").append(tb);
                    }
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