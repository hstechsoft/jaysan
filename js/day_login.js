
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArBOz33-zRE8lMCj7d8mlzytL4hH6OSNQ",
    authDomain: "jaysan-8fa8d.firebaseapp.com",
    databaseURL: "https://jaysan-8fa8d-default-rtdb.firebaseio.com",
    projectId: "jaysan-8fa8d",
    storageBucket: "jaysan-8fa8d.appspot.com",
    messagingSenderId: "1077120566221",
    appId: "1:1077120566221:web:17e8bd20996c16bcc8fa84",
    measurementId: "G-6JNJZT1YCV"
};


let activeStartTime = null;
let timerInterval = null;
let attendance_id = null;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
var emp_id = localStorage.getItem("ls_uid");
var emp_name = localStorage.getItem("ls_uname");
var app_phone_id = localStorage.getItem("app_phone_id");
// var app_phone_id = "cbbfc05f5d5a3abe";
if (app_phone_id && app_phone_id !== "null") {

    $("#app_phone_txt").text("Phone Id-" + app_phone_id);


} else {
    $(".attendance-action").addClass("d-none");
    $(".attendance-message").removeClass("d-none");
    window.location.replace("login.html");
}


let pendingLocationCallback = null;
let pendingLocationError = null;

$(document).ready(function () {
    
    if (emp_id) {
        loadTodayAttendance();
    }
    else {
        window.location.replace("login.html");
    }

    updateDate();
    updateClock();

    setInterval(updateClock, 1000);

    // Get current location


    // Android sends GPS coordinates to this function
    window.onLocationReceived = function (lat, lng) {

        console.log("GPS Location received:", lat, lng);

        lat = parseFloat(lat);
        lng = parseFloat(lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            if (pendingLocationError) {
                pendingLocationError("Invalid GPS coordinates received.");
            }
            return;
        }

        // Update UI if required
        $("#lat_input").val(lat);
        $("#lng_input").val(lng);

        // Execute the pending callback
        if (pendingLocationCallback) {
            pendingLocationCallback({
                latitude: lat,
                longitude: lng
            });
        }

        // Clear callbacks
        pendingLocationCallback = null;
        pendingLocationError = null;
    };

    // START YOUR DAY
    $("#start_day_btn").on("click", function () {

        const btn = $(this);

        btn.prop("disabled", true)
            .html('<i class="bi bi-arrow-repeat"></i> Detecting location...');

        getCurrentLocation(function (location) {

            const startTime = new Date();
            var todayDate = getToday();
            const attendanceData = {
                dated: getToday(),
                start_time: getMySQLDateTime(startTime),
                start_latitude: location.latitude,
                start_longitude: location.longitude,
                emp_id: emp_id,
                phone_id: app_phone_id
            };

            $.ajax({
                url: "php/insert_day_login.php",
                type: "POST",
                data: attendanceData,
                dataType: "json",

                success: function (response) {

                    if (response.status === "success" ||
                        response.status === "exists") {
                        console.log("Success", response.message + " (" + todayDate + ")" + " Phone ID: " + app_phone_id);
                        // salert("Success", response.message + " (" + todayDate + ")" + " Phone ID: " + app_phone_id, "success");
                        // window.location.replace();
                        attendance_id = response.attendance_id;

                        localStorage.setItem("ls_emp_attendance", response.attendance_id)
                        // Use the database start time for an existing record
                        const savedTime = response.status === "exists"
                            ? new Date(response.start_time.replace(' ', 'T'))
                            : startTime;
                        if (app_phone_id && app_phone_id !== "null")
                            window.location.replace("dashboard_p.html?phone_id=" + app_phone_id);
                        else
                            window.location.replace("user_index.html");


                        updateAttendanceUI(savedTime);

                    } else {

                        salert("Error", response.message, "error");

                        btn.prop("disabled", false)
                            .html('<i class="bi bi-play-circle"></i> Start Your Day');
                    }
                },

                error: function (xhr) {

                    console.log(xhr.responseText);
                    salert("Error", "Unable to save attendance. Please try again.", "error");

                    btn.prop("disabled", false)
                        .html('<i class="bi bi-play-circle"></i> Start Your Day');
                }
            });

        }, function (error) {

            console.log("Location error:", error);

            btn.prop("disabled", false)
                .html('<i class="bi bi-play-circle"></i> Start Your Day');

        });

    });



    // END YOUR DAY

    $("#end_day_btn").on("click", function () {

        const btn = $(this);

        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure you want to end your day?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, end my day",
            cancelButtonText: "Cancel"
        }).then((result) => {

            if (!result.isConfirmed) {
                return;
            }

            btn.prop("disabled", true)
                .html('<i class="bi bi-arrow-repeat"></i> Processing...');

            getCurrentLocation(function (location) {

                const endTime = new Date();

                const attendanceData = {
                    attendance_id: attendance_id,
                    emp_id: emp_id,
                    phone_id: app_phone_id,
                    end_time: getMySQLDateTime(endTime),
                    end_latitude: location.latitude,
                    end_longitude: location.longitude
                };

                $.ajax({
                    url: "php/insert_day_logoff.php",
                    type: "POST",
                    data: attendanceData,
                    dataType: "json",

                    success: function (response) {

                        if (response.status === "success") {

                            // Update attendance UI first
                            completeAttendanceUI(endTime);

                            Swal.fire({
                                title: "Day Completed!",
                                text: "Your attendance has been successfully recorded.",
                                icon: "success",
                                confirmButtonText: "Continue"
                            }).then(() => {

                                // Clear login data only after attendance is saved
                                localStorage.clear();

                                window.location.replace("login.html");

                            });

                        } else {

                            Swal.fire({
                                title: "Unable to end your day",
                                text: response.message,
                                icon: "error"
                            });

                            btn.prop("disabled", false)
                                .html('<i class="bi bi-stop-circle"></i> End Your Day');
                        }
                    },

                    error: function (xhr) {

                        console.log(xhr.responseText);

                        Swal.fire({
                            title: "Error",
                            text: "Unable to end your day. Please try again.",
                            icon: "error"
                        });

                        btn.prop("disabled", false)
                            .html('<i class="bi bi-stop-circle"></i> End Your Day');
                    }
                });

            }, function () {

                Swal.fire({
                    title: "Location Required",
                    text: "Unable to get your current location. Please enable location access and try again.",
                    icon: "warning"
                });

                btn.prop("disabled", false)
                    .html('<i class="bi bi-stop-circle"></i> End Your Day');

            });

        });

    });


    $("#home_btn").on("click", function () {

        if (app_phone_id && app_phone_id !== "null")
            window.location.replace("dashboard_p.html?phone_id=" + app_phone_id);
        else
            window.location.replace("user_index.html");
    });


});


function loadTodayAttendance() {

    $.ajax({
        url: "php/get_day_attendance.php",
        type: "POST",

        data: {
            emp_id: emp_id,
            phone_id: app_phone_id,
            dated: getToday()
        },

        dataType: "json",

        success: function (response) {
            console.log(response);

            $("#home_btn").prop("disabled", true);
            if (response.status === "success") {

                const data = response.data;

                attendance_id = data.id;

                const startTime = new Date(
                    data.start_time.replace(' ', 'T')
                );

                if (data.status === "started") {

                    $("#home_btn").prop("disabled", false);
                    updateAttendanceUI(startTime);

                } else if (data.status === "completed") {

                    $("#home_btn").prop("disabled", false);
                    activeStartTime = startTime;

                    $("#start_day_btn").addClass("d-none");
                    $("#end_day_btn").removeClass("d-none");

                    $("#start_time_display").text(formatTime(startTime));

                    completeAttendanceUI(
                        new Date(data.end_time.replace(' ', 'T'))
                    );
                }

            } else {

                console.log("No attendance started today.");

            }
        },

        error: function (xhr) {
            console.log(xhr.responseText);
        }
    });
}

// Update UI after ending
function completeAttendanceUI(endTime) {

    clearInterval(timerInterval);

    updateDuration();

    $("#end_time_display").text(formatTime(endTime));

    $("#day_status")
        .removeClass("active ready")
        .addClass("completed")
        .html('<span class="status-dot"></span> Day completed');

    $("#today_status").text("Completed");

    $("#end_day_btn").prop("disabled", true)
        .html('<i class="bi bi-check-circle"></i> Day Completed');

    $("#attendance_note").html(
        '<i class="bi bi-check-circle-fill"></i> ' +
        'Your workday has been completed successfully.'
    );

}

// Update UI after starting
function updateAttendanceUI(startTime) {

    activeStartTime = startTime;

    $("#start_day_btn").addClass("d-none");
    $("#end_day_btn").removeClass("d-none");

    $("#day_status")
        .removeClass("ready completed")
        .addClass("active")
        .html('<span class="status-dot"></span> Day started');

    $("#start_time_display").text(formatTime(startTime));
    $("#today_status").text("Day Started");

    $("#attendance_note").html(
        '<i class="bi bi-check-circle-fill"></i> ' +
        'Your workday is currently active.'
    );

    updateDuration();

    timerInterval = setInterval(updateDuration, 1000);
}

// Get today's date
function getToday() {
    const today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

// Format date
function updateDate() {
    const today = new Date();

    $("#attendance_date").text(
        today.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    );

    $("#current_date").text(
        today.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    );
}

// Live clock
function updateClock() {
    const now = new Date();

    $("#current_time").text(
        now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
    );
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Working duration
function updateDuration() {

    if (!activeStartTime) return;

    const now = new Date();

    let seconds = Math.floor(
        (now - activeStartTime) / 1000
    );

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const duration =
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');

    $("#working_duration").text(duration);
    $("#summary_duration").text(duration);
}


// Handle Android location errors
window.onLocationError = function (message) {

    console.error("Android GPS Error:", message);

    if (pendingLocationError) {
        pendingLocationError(message || "Unable to detect location.");
    }

    pendingLocationCallback = null;
    pendingLocationError = null;
};


// Get current location through Android
function getCurrentLocation(callback, onError = null) {

    if (
        !window.AndroidBridge ||
        typeof AndroidBridge.getLocation !== "function"
    ) {
        console.error("AndroidBridge location is unavailable.");

        if (onError) {
            onError("Android location service is unavailable.");
        }

        return;
    }

    pendingLocationCallback = callback;
    pendingLocationError = onError;

    try {

        console.log("Requesting location from Android...");

        AndroidBridge.getLocation();

    } catch (error) {

        console.error("AndroidBridge Error:", error);

        pendingLocationCallback = null;
        pendingLocationError = null;

        if (onError) {
            onError(error.message);
        }
    }
}


function getMySQLDateTime(date) {

    const pad = num => String(num).padStart(2, '0');

    return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds());
}



function salert(title, text, icon) {


    Swal.fire({
        title: title,
        text: text,
        icon: icon,
    });
}


























