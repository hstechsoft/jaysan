
var current_emp_id = localStorage.getItem("ls_uid");
var current_emp_name = localStorage.getItem("ls_uname");
var current_app_phone_id = localStorage.getItem("app_phone_id");
var role = localStorage.getItem("ls_emp_role");

var emp_id = new URLSearchParams(window.location.search).get("emp_id");

let attendanceRecords = [];
let employeeDetails = {};

$(document).ready(function () {

    if (!emp_id || !/^\d+$/.test(emp_id)) {
        salert("Error", "Invalid employee ID.", "error");
        return;
    }

    const today = getToday();

    $("#filter_from_date").val(getMonthStart());
    $("#filter_to_date").val(today);

    loadIndividualAttendance();

    // Apply filters
    $("#apply_filters").on("click", function () {
        loadIndividualAttendance();
    });

    // Reset filters
    $("#reset_filters").on("click", function () {

        $("#filter_from_date").val(getMonthStart());
        $("#filter_to_date").val(getToday());
        $("#filter_status").val("");

        $(".quick-filter-btn").removeClass("active");

        loadIndividualAttendance();
    });

    // Status filter
    $("#filter_status").on("change", function () {
        renderAttendance();
    });

    // Quick filters
    $(".quick-filter-btn").on("click", function () {

        const range = $(this).data("range");

        $(".quick-filter-btn").removeClass("active");
        $(this).addClass("active");

        const today = new Date();

        if (range === "week") {

            const day = today.getDay();
            const diff = day === 0 ? 6 : day - 1;

            const monday = new Date(today);
            monday.setDate(today.getDate() - diff);

            $("#filter_from_date").val(formatDateInput(monday));
            $("#filter_to_date").val(getToday());

            $("#filter_status").val("");

        } else if (range === "month") {

            $("#filter_from_date").val(getMonthStart());
            $("#filter_to_date").val(getToday());

            $("#filter_status").val("");

        } else if (range === "absent") {

            $("#filter_status").val("absent");

        }

        loadIndividualAttendance();

    });

    // Edit attendance
    $(document).on("click", ".btn-attendance-edit", function () {

        const id = $(this).data("id");

        const record = attendanceRecords.find(function (item) {
            return String(item.id) === String(id);
        });

        if (!record || !record.id) {
            salert("Cannot Edit", "No attendance record exists.", "warning");
            return;
        }

        openEditAttendance(record);

    });

    $(document).on("click", ".btn-attendance-add", function () {

        const emp_id = $(this).val();
        const phone_id = $(this).data("phone_id");
        const dated = $(this).data("dated");

        const record = attendanceRecords.find(function (item) {
            return String(item.emp_id) === String(emp_id);
        });

        if (!emp_id || !phone_id || !dated) {
            salert("Cannot Add", "No employee record exists or date is missing.", "warning");
            return;
        }

        openAddAttendance(emp_id, phone_id, dated);

    });

    // Clear logout details
    $(document).on("click", ".btn-attendance-delete", function () {

        const id = $(this).data("id");

        deleteLogoutDetails(id);

    });

    // View location
    $(document).on("click", ".btn-location", function () {

        const latitude = $(this).attr("data-lat");
        const longitude = $(this).attr("data-lng");

        if (!latitude || !longitude) return;

        window.open(
            "https://www.google.com/maps?q=" +
            encodeURIComponent(latitude + "," + longitude),
            "_blank"
        );

    });

    // Save attendance
    $("#save_attendance").on("click", function () {
        saveAttendance();
    });

    // Add Attendance Save
    $("#add_save_attendance").on("click", function () {
        saveAddAttendance();
    });

    // Excel export
    $("#export_attendance").on("click", function () {
        exportAttendanceExcel();
    });

});


// Date helpers
function getToday() {

    return formatDateInput(new Date());

}

function getMonthStart() {

    const date = new Date();

    date.setDate(1);

    return formatDateInput(date);

}

function formatDateInput(date) {

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;

}

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (char) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];

    });

}

function salert(title, text, icon) {

    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });

}


// Convert MySQL datetime to datetime-local
function toDateTimeLocal(value) {

    if (!value) return "";

    return String(value).replace(" ", "T").substring(0, 16);

}


// Convert datetime-local to MySQL datetime
function toMySQLDateTime(value) {

    if (!value) return "";

    return value.replace("T", " ") + ":00";

}


// Format attendance time
function formatAttendanceTime(value) {

    if (!value) return "--";

    const date = new Date(String(value).replace(" ", "T"));

    if (isNaN(date.getTime())) return "--";

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

}


// Format date
function formatAttendanceDate(value) {

    if (!value) return "--";

    const date = new Date(value + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// Calculate working duration
function calculateWorkingHours(record) {

    if (!record.start_time) return "--";

    const start = new Date(record.start_time.replace(" ", "T"));

    let end;

    if (record.end_time) {

        end = new Date(record.end_time.replace(" ", "T"));

    } else if (record.status === "started" && record.dated === getToday()) {

        end = new Date();

    } else {

        return "--";

    }

    let seconds = Math.floor((end - start) / 1000);

    if (isNaN(seconds) || seconds < 0) return "--";

    const hours = Math.floor(seconds / 3600);

    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);

    return String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds % 60).padStart(2, "0");

}


// Determine status
function getAttendanceStatus(record) {

    if (!record.id) return "absent";

    if (record.status === "completed") return "completed";

    return "started";
}


// Load individual employee attendance
function loadIndividualAttendance() {

    const fromDate = $("#filter_from_date").val();
    const toDate = $("#filter_to_date").val();

    if (!fromDate || !toDate) {
        salert("Invalid Date", "Please select both dates.", "warning");
        return;
    }

    if (fromDate > toDate) {
        salert("Invalid Range", "From date cannot be greater than to date.", "warning");
        return;
    }

    $("#attendance_tbody").html(`
        <tr>
            <td colspan="8" class="text-center py-5">
                <div class="spinner-border spinner-border-sm text-success"></div>
                <p class="text-secondary mt-2 mb-0">Loading attendance...</p>
            </td>
        </tr>
    `);

    $.ajax({

        url: "php/get_individual_employee_attendance.php",

        type: "POST",

        dataType: "json",

        data: {
            emp_id: emp_id,
            from_date: fromDate,
            to_date: toDate
        },

        success: function (response) {

            console.log(response);


            if (response.status !== "success") {

                attendanceRecords = [];

                salert("Error", response.message || "Unable to load attendance.", "error");

                renderAttendance();

                return;
            }

            employeeDetails = response.employee || {};

            attendanceRecords = response.data || [];

            renderEmployeeDetails();

            renderAttendance();

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            $("#attendance_tbody").html(`
                <tr>
                    <td colspan="8" class="text-center text-danger py-5">
                        Unable to load attendance.
                    </td>
                </tr>
            `);

        }

    });

}


// Employee profile
function renderEmployeeDetails() {

    $("#employee_name").text(employeeDetails.emp_name || "Employee");

    $("#employee_role").text(employeeDetails.emp_role || "Employee");

    $("#employee_id").text(employeeDetails.emp_code || '');

    $("#employee_email").text(employeeDetails.emp_email || "");

    $("#employee_avatar").text(
        (employeeDetails.emp_name || "E").charAt(0).toUpperCase()
    );

}


// Build all dates in selected range and merge attendance records
function getDailyRecords() {

    const fromDate = $("#filter_from_date").val();
    const toDate = $("#filter_to_date").val();

    const attendanceMap = {};

    attendanceRecords.forEach(function (record) {

        // Convert MySQL DATETIME to YYYY-MM-DD
        const attendanceDate = String(record.dated || "").substring(0, 10);

        if (!attendanceMap[attendanceDate]) {
            attendanceMap[attendanceDate] = record;
        }

    });

    const dailyRecords = [];

    let current = new Date(fromDate + "T00:00:00");
    const end = new Date(toDate + "T00:00:00");

    while (current <= end) {

        const dated = formatDateInput(current);

        if (dated > getToday()) break;

        if (attendanceMap[dated]) {

            // Existing attendance record
            dailyRecords.push(attendanceMap[dated]);

        } else {

            // No attendance record for this date
            dailyRecords.push({
                id: null,
                emp_id: emp_id,
                emp_name: employeeDetails.emp_name,
                emp_role: employeeDetails.emp_role,
                emp_phone_id: employeeDetails.emp_phone_id,
                dated: dated,
                start_time: null,
                end_time: null,
                status: "absent"
            });

        }

        current.setDate(current.getDate() + 1);

    }

    return dailyRecords;
}


// Render attendance table
function renderAttendance() {

    const dailyRecords = getDailyRecords();

    const selectedStatus = $("#filter_status").val();

    const filteredRecords = dailyRecords.filter(function (record) {

        const status = getAttendanceStatus(record);

        if (!selectedStatus) return true;

        if (selectedStatus === "present") return status !== "absent";

        return status === selectedStatus;

    });

    const total = dailyRecords.length;

    const present = dailyRecords.filter(r =>
        getAttendanceStatus(r) !== "absent"
    ).length;

    const absent = dailyRecords.filter(r =>
        getAttendanceStatus(r) === "absent"
    ).length;

    const completed = dailyRecords.filter(r =>
        getAttendanceStatus(r) === "completed"
    ).length;

    $("#total_days").text(total);
    $("#present_days").text(present);
    $("#absent_days").text(absent);
    $("#completed_days").text(completed);

    $("#report_count").text(filteredRecords.length + " Records");

    $("#attendance_footer_text").text(
        "Showing " + filteredRecords.length + " of " + total + " days"
    );

    $("#report_period").text(
        formatAttendanceDate($("#filter_from_date").val()) +
        " - " +
        formatAttendanceDate($("#filter_to_date").val())
    );

    if (filteredRecords.length === 0) {

        $("#attendance_tbody").html(`
            <tr>
                <td colspan="8" class="text-center text-secondary py-5">
                    <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                    No attendance records found.
                </td>
            </tr>
        `);

        return;
    }

    let html = "";

    filteredRecords.forEach(function (record, index) {

        const status = getAttendanceStatus(record);

        let statusLabel = "Absent";
        let statusClass = "status-absent";
        let statusIcon = "bi-x-circle";

        if (status === "started") {

            statusLabel = "Currently Working";
            statusClass = "status-working";
            statusIcon = "bi-clock";

        } else if (status === "completed") {

            statusLabel = "Completed";
            statusClass = "status-completed";
            statusIcon = "bi-check-circle";

        }

        const hasAttendance = !!record.id;

        const startLocation =
            record.start_latitude != null &&
            record.start_longitude != null;

        const endLocation =
            record.end_latitude != null &&
            record.end_longitude != null;

        html += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${formatAttendanceDate(record.dated)}</strong>
                </td>

                <td>
                    <span class="attendance-status ${statusClass}">
                        <i class="bi ${statusIcon}"></i>
                        ${statusLabel}
                    </span>
                </td>

                <td>
                    ${formatAttendanceTime(record.start_time)}
                </td>

                <td>
                    ${formatAttendanceTime(record.end_time)}
                </td>

                <td>
                    <span class="working-time">
                        ${calculateWorkingHours(record)}
                    </span>
                </td>

                <td>

                    <button type="button"
                        class="attendance-action-btn btn-location"
                        title="Start location"
                        ${startLocation
                ? `data-lat="${escapeHTML(record.start_latitude)}"
                               data-lng="${escapeHTML(record.start_longitude)}"`
                : "disabled"}>

                        <i class="bi bi-geo-alt"></i>

                    </button>

                    <button type="button"
                        class="attendance-action-btn btn-location"
                        title="End location"
                        ${endLocation
                ? `data-lat="${escapeHTML(record.end_latitude)}"
                               data-lng="${escapeHTML(record.end_longitude)}"`
                : "disabled"}>

                        <i class="bi bi-geo-fill"></i>

                    </button>

                </td>

                <td>

                    ${!hasAttendance ? `<button type="button"
                        class="attendance-action-btn btn-attendance-add ${role.toLowerCase() === 'admin' || role.toLowerCase() === 'hr' ? '' : 'd-none'}"
                        title="Add attendance" value="${escapeHTML(record.emp_id || "")}" data-phone_id="${escapeHTML(record.emp_phone_id || "")}" data-dated="${escapeHTML(record.dated || "")}">

                        <i class="bi bi-pencil-square"></i>

                    </button>` : `<button type="button"
                        class="attendance-action-btn btn-attendance-edit ${role.toLowerCase() === 'admin' || role.toLowerCase() === 'hr' ? '' : 'd-none'}"
                        data-id="${escapeHTML(record.id || "")}"
                        title="Edit attendance">

                        <i class="bi bi-pencil-square"></i>

                    </button>`}

                    <button type="button"
                        class="attendance-action-btn btn-attendance-delete ${role.toLowerCase() === 'admin' || role.toLowerCase() === 'hr' ? '' : 'd-none'}"
                        data-id="${escapeHTML(record.id || "")}"
                        title="Clear logout details"
                        ${!record.end_time ? "disabled" : ""}>

                        <i class="bi bi-trash3"></i>

                    </button>

                </td>

            </tr>
        `;

    });

    $("#attendance_tbody").html(html);

}


// Open edit modal
function openEditAttendance(record) {

    
    // var endTime = dated ? new Date(`${dated}T${new Date().toTimeString().slice(0, 5)}`).toISOString().slice(0, 16) : "";
    var endTime = record.dated ? `${record.dated}T21:00` : "";

    $("#edit_attendance_id").val(record.id);

    $("#edit_employee_label").text(employeeDetails.emp_name || "");

    $("#edit_attendance_date").val(record.dated);

    $("#edit_start_time").val(toDateTimeLocal(record.start_time));

    $("#edit_end_time").val(toDateTimeLocal(record.end_time || endTime));

    $("#edit_attendance_modal").modal("show");

}

// Open add modal
function openAddAttendance(emp_id, phone_id, dated) {

    // var startTime = dated ? new Date(`${dated}T${new Date().toTimeString().slice(0, 5)}`).toISOString().slice(0, 16) : "";
    var startTime = dated ? `${dated}T09:00` : "";

    $("#add_emp_id").val(emp_id);

    $("#add_emp_phone_id").val(phone_id);

    $("#add_attendance_date").val(dated);

    $("#add_start_time").val(startTime);

    $("#add_employee_label").text(employeeDetails.emp_name || "");

    $("#add_attendance_modal").modal("show");

}


// Save attendance changes
function saveAttendance() {

    const attendanceId = $("#edit_attendance_id").val();

    const dated = $("#edit_attendance_date").val();

    const startTime = $("#edit_start_time").val();

    const endTime = $("#edit_end_time").val();

    if (!attendanceId || !dated || !startTime) {

        salert(
            "Required Fields",
            "Attendance date and start time are required.",
            "warning"
        );

        return;
    }

    if (endTime && new Date(endTime) < new Date(startTime)) {

        salert(
            "Invalid Time",
            "End time cannot be earlier than start time.",
            "warning"
        );

        return;
    }

    const btn = $("#save_attendance");

    btn.prop("disabled", true).text("Saving...");

    $.ajax({

        url: "php/update_hr_attendance.php",

        type: "POST",

        dataType: "json",

        data: {
            attendance_id: attendanceId,
            dated: dated,
            start_time: toMySQLDateTime(startTime),
            end_time: endTime ? toMySQLDateTime(endTime) : ""
        },

        success: function (response) {

            if (response.status === "success") {

                $("#edit_attendance_modal").modal("hide");

                Swal.fire({
                    title: "Updated!",
                    text: response.email_sent
                        ? "Attendance updated and employee notified."
                        : "Attendance updated, but email notification failed.",
                    icon: response.email_sent ? "success" : "warning"
                });

                loadIndividualAttendance();

            } else {

                salert(
                    "Update Failed",
                    response.message || "Unable to update attendance.",
                    "error"
                );

            }

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            salert("Error", "Unable to update attendance.", "error");

        },

        complete: function () {

            btn.prop("disabled", false).html(
                '<i class="bi bi-check2-circle me-1"></i> Save Changes'
            );

        }

    });

}

// Save attendance changes
function saveAddAttendance() {

    const emp_id = $("#add_emp_id").val();

    const emp_phone_id = $("#add_emp_phone_id").val();

    const dated = $("#add_attendance_date").val();

    const startTime = $("#add_start_time").val();

    if (!emp_id || !dated || !startTime || !emp_phone_id) {

        salert(
            "Required Fields",
            "Attendance date, start time, and employee phone ID are required.",
            "warning"
        );

        return;
    }


    const btn = $("#add_save_attendance");

    btn.prop("disabled", true).text("Saving...");

    $.ajax({

        url: "php/insert_day_login.php",

        type: "POST",

        dataType: "json",

        data: {
            emp_id: emp_id,
            phone_id: emp_phone_id,
            dated: dated,
            start_time: toMySQLDateTime(startTime),
            start_longitude: '77.0238635',
            start_latitude: '11.0930837',
        },

        success: function (response) {

            if (response.status === "success") {

                $("#add_attendance_modal").modal("hide");

                Swal.fire({
                    title: "Added!",
                    text: "Attendance added successfully.",
                    icon: "success"
                });

                loadIndividualAttendance();

            } else {

                salert(
                    "Update Failed",
                    response.message || "Unable to add attendance.",
                    "error"
                );

            }

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            salert("Error", "Unable to add attendance.", "error");

        },

        complete: function () {

            btn.prop("disabled", false).html(
                '<i class="bi bi-check2-circle me-1"></i> Save Changes'
            );

        }

    });

}

// Clear logout details
function deleteLogoutDetails(id) {

    Swal.fire({

        title: "Clear logout details?",
        text: "The employee's previous end time and logout location will be cleared. An email notification will be sent.",
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Yes, clear details",
        cancelButtonText: "Cancel"

    }).then(function (result) {

        if (!result.isConfirmed) return;

        $.ajax({

            url: "php/clear_hr_attendance_end.php",

            type: "POST",

            dataType: "json",

            data: {
                attendance_id: id
            },

            success: function (response) {

                if (response.status === "success") {

                    Swal.fire({
                        title: "Completed",
                        text: response.email_sent
                            ? "Logout details cleared and employee notified."
                            : "Logout details cleared, but email notification failed.",
                        icon: response.email_sent ? "success" : "warning"
                    });

                    loadIndividualAttendance();

                } else {

                    salert("Error", response.message, "error");

                }

            },

            error: function (xhr) {

                console.log(xhr.responseText);

                salert("Error", "Unable to clear logout details.", "error");

            }

        });

    });

}


// Export filtered records to Excel
function exportAttendanceExcel() {

    const dailyRecords = getDailyRecords();

    const selectedStatus = $("#filter_status").val();

    const records = dailyRecords.filter(function (record) {

        const status = getAttendanceStatus(record);

        if (!selectedStatus) return true;

        if (selectedStatus === "present") return status !== "absent";

        return status === selectedStatus;

    });

    if (records.length === 0) {

        salert("No Data", "There are no records to export.", "warning");

        return;
    }

    const excelData = records.map(function (record, index) {

        const status = getAttendanceStatus(record);

        return {
            "S.No": index + 1,
            "Employee ID": employeeDetails.emp_code,
            "Employee Name": employeeDetails.emp_name,
            "Date": record.dated,
            "Status": status === "absent"
                ? "Absent"
                : status === "started"
                    ? "Currently Working"
                    : "Completed",
            "Start Time": record.start_time || "",
            "End Time": record.end_time || "",
            "Working Hours": calculateWorkingHours(record),
            "Start Latitude": record.start_latitude || "",
            "Start Longitude": record.start_longitude || "",
            "End Latitude": record.end_latitude || "",
            "End Longitude": record.end_longitude || ""
        };

    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
        { wch: 8 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 20 },
        { wch: 23 },
        { wch: 23 },
        { wch: 18 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Attendance"
    );

    // Summary sheet
    const summary = [
        ["Individual Employee Attendance"],
        ["Employee Name", employeeDetails.emp_name],
        ["Employee ID", employeeDetails.emp_code],
        ["Employee Role", employeeDetails.emp_role],
        ["Export Date", getToday()],
        ["From Date", $("#filter_from_date").val()],
        ["To Date", $("#filter_to_date").val()],
        ["Total Days", records.length],
        ["Present Days", records.filter(r => getAttendanceStatus(r) !== "absent").length],
        ["Absent Days", records.filter(r => getAttendanceStatus(r) === "absent").length],
        ["Completed Days", records.filter(r => getAttendanceStatus(r) === "completed").length]
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summary);

    summarySheet["!cols"] = [
        { wch: 22 },
        { wch: 30 }
    ];

    XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        "Summary"
    );

    const employeeName = (employeeDetails.emp_name || "Employee")
        .replace(/[^a-zA-Z0-9_-]/g, "_");

    const fileName =
        "Attendance_" +
        employeeName +
        "_" +
        getToday() +
        ".xlsx";

    XLSX.writeFile(workbook, fileName);

}
