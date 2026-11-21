
var emp_id = localStorage.getItem("ls_uid");
var emp_name = localStorage.getItem("ls_uname");
var app_phone_id = localStorage.getItem("app_phone_id");
var role = localStorage.getItem("ls_emp_role");

let attendanceRows = [];

$(document).ready(function () {

    if (!emp_id) {
        window.location.replace("login.html");
        return;
    }

    $("#filter_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#attendance_report_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("#filter_attendance_date").val(getToday());

    loadAttendanceReport();

    // Apply filters
    $("#apply_attendance_filter").on("click", function () {
        loadAttendanceReport();
    });

    // Reset filters
    $("#reset_attendance_filter").on("click", function () {

        $("#filter_emp_id").val("");
        $("#filter_attendance_date").val(getToday());

        loadAttendanceReport();

    });

    // Save attendance changes
    $("#save_attendance_edit").on("click", function () {
        saveAttendanceChanges();
    });

    // View employee details
    $("#attendance_report_tbody").on("click", ".view-btn", function () {

        const index = $(this).data("index");

        var emp_id = attendanceRows[index]?.emp_id ?? "";

        if (!emp_id) {
            salert("Warning", "Employee ID not found.", "warning");
            return;
        }

        window.location.href = `individual_employee_attendance.html?emp_id=${encodeURIComponent(emp_id)}`;


    });

    // Edit attendance
    $("#attendance_report_tbody").on("click", ".edit-btn", function () {

        const index = $(this).data("index");

        openAttendanceEdit(index);

    });

    // Clear logout details
    $("#attendance_report_tbody").on("click", ".clear-btn", function () {

        const index = $(this).data("index");

        clearAttendanceEnd(index);


    });

});

// Today's date
function getToday() {

    const today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

// Convert MySQL datetime to datetime-local
function toDateTimeLocal(value) {

    if (!value) return "";

    return value.replace(" ", "T").substring(0, 16);
}

// Convert datetime-local to MySQL datetime
function toMySQLDateTime(value) {

    if (!value) return null;

    return value.replace("T", " ") + ":00";
}

// Format date
function formatAttendanceDate(value) {

    if (!value) return "-";

    const date = new Date(value + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// Format time
function formatAttendanceTime(value) {

    if (!value) return "-";

    const date = new Date(value.replace(" ", "T"));

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

// Working hours
function calculateWorkingHours(start, end) {

    if (!start || !end) return "-";

    const startDate = new Date(start.replace(" ", "T"));
    const endDate = new Date(end.replace(" ", "T"));

    let seconds = Math.floor(
        (endDate - startDate) / 1000
    );

    if (seconds < 0) return "-";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return String(hours).padStart(2, '0') + ":" +
        String(minutes).padStart(2, '0');
}


// LOAD ATTENDANCE REPORT
function loadAttendanceReport() {

    const dated = $("#filter_attendance_date").val();
    const selectedEmp = $("#filter_emp_id").val();

    $("#attendance_report_tbody").html(`
        <tr>
            <td colspan="8" class="text-center py-5">
                <div class="spinner-border spinner-border-sm text-success"></div>
                Loading attendance...
            </td>
        </tr>
    `);

    $.ajax({

        url: "php/get_hr_attendance.php",
        type: "POST",

        data: {
            dated: dated,
            emp_id: selectedEmp
        },

        dataType: "json",

        success: function (response) {

            if (response.status !== "success") {
                $("#attendance_report_tbody").html(`
                    <tr>
                        <td colspan="8" class="text-center py-5 text-danger">
                            ${escapeHtml(response.message || "Unable to load attendance")}
                        </td>
                    </tr>
                `);
                return;
            }

            attendanceRows = response.data;

            // Load employee filter options only once
            populateEmployeeFilter(response.employees);

            // Summary
            $("#total_employees").text(response.summary.total);
            $("#present_employees").text(response.summary.present);
            $("#absent_employees").text(response.summary.absent);
            $("#completed_employees").text(response.summary.completed);

            $("#selected_date_label").text(
                formatAttendanceDate(dated)
            );

            $("#attendance_report_subtitle").text(
                "Attendance for " + formatAttendanceDate(dated)
            );

            $("#attendance_record_count").text(
                attendanceRows.length + " Employees"
            );

            $("#attendance_footer_text").text(
                "Showing " + attendanceRows.length + " employees"
            );

            renderAttendanceTable(attendanceRows);

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            $("#attendance_report_tbody").html(`
                <tr>
                    <td colspan="8" class="text-center py-5 text-danger">
                        Server error while loading attendance.
                    </td>
                </tr>
            `);

        }

    });

}


// EMPLOYEE FILTER
function populateEmployeeFilter(employees) {

    const select = $("#filter_emp_id");

    const currentValue = select.val();

    if (select.data("loaded")) return;

    employees.forEach(function (employee) {

        select.append(`
            <option value="${employee.emp_id}">
                ${escapeHtml(employee.emp_name)}
            </option>
        `);

    });

    select.data("loaded", true);

    select.val(currentValue || "");

}


// RENDER TABLE
function renderAttendanceTable(rows) {

    let html = "";

    if (!rows.length) {

        html = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    No employees found.
                </td>
            </tr>
        `;

    } else {

        rows.forEach(function (row, index) {

            const present = !!row.attendance_id;

            const completed =
                present && row.status === "completed";

            const status = !present
                ? `<span class="attendance-badge absent">
                    <i class="bi bi-x-circle"></i> Absent
                   </span>`
                : completed
                    ? `<span class="attendance-badge completed">
                        <i class="bi bi-check-circle"></i> Completed
                       </span>`
                    : `<span class="attendance-badge active">
                        <i class="bi bi-clock"></i> Working
                       </span>`;

            const startTime = row.start_time
                ? formatAttendanceTime(row.start_time)
                : "-";

            const endTime = row.end_time
                ? formatAttendanceTime(row.end_time)
                : "-";

            const duration = calculateWorkingHours(
                row.start_time,
                row.end_time
            );

            const avatar = row.emp_name
                ? row.emp_name.charAt(0).toUpperCase()
                : "E";

            const actions = present ? `
                <div class="attendance-action-buttons">

                    <button type="button"
                        class="view-btn"
                        title="View Employee"
                        data-index="${index}">
                        <i class="bi bi-person-lines-fill"></i>
                    </button>

                    <button type="button"
                        class="edit-btn ${role.toLowerCase() === 'admin' || role.toLowerCase() === 'hr' ? '' : 'd-none'}"
                        title="Edit attendance"
                        data-index="${index}">
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    ${row.end_time ? `
                        <button type="button"
                            class="clear-btn ${role.toLowerCase() === 'admin' || role.toLowerCase() === 'hr' ? '' : 'd-none'}"
                            title="Clear end time and logout location"
                            data-index="${index}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    ` : ""}

                </div>
            ` : `<button type="button"
                            class="view-btn"
                            title="View Employee"
                            data-index="${index}">
                            <i class="bi bi-person-lines-fill"></i>
                        </button>`;

            html += `
                <tr>

                    <td>${index + 1}</td>

                    <td>
                        <div class="employee-cell">

                            <div class="employee-avatar">
                                ${escapeHtml(avatar)}
                            </div>

                            <div>
                                <strong>${escapeHtml(row.emp_name)}</strong>
                                <small>ID: ${escapeHtml(row.emp_code)}</small>
                            </div>

                        </div>
                    </td>

                    <td>${escapeHtml(row.emp_role || "-")}</td>

                    <td>
                        <span class="attendance-time ${present ? '' : 'time-muted'}">
                            ${startTime}
                        </span>
                    </td>

                    <td>
                        <span class="attendance-time ${row.end_time ? '' : 'time-muted'}">
                            ${endTime}
                        </span>
                    </td>

                    <td>
                        <strong>${duration}</strong>
                    </td>

                    <td>${status}</td>

                    <td class="text-center">
                        
                        
                        ${actions}
                    </td>

                </tr>
            `;

        });

    }

    $("#attendance_report_tbody").html(html);

}


// OPEN EDIT MODAL
function openAttendanceEdit(index) {

    const row = attendanceRows[index];

    if (!row || !row.attendance_id) return;

    $("#edit_attendance_id").val(row.attendance_id);

    $("#edit_emp_name").text(row.emp_name);
    $("#edit_emp_role").text(row.emp_role || "-");

    $("#edit_emp_avatar").text(
        row.emp_name.charAt(0).toUpperCase()
    );

    $("#edit_attendance_date").val(row.dated);

    $("#edit_start_time").val(
        toDateTimeLocal(row.start_time)
    );

    $("#edit_end_time").val(
        toDateTimeLocal(row.end_time)
    );

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("edit_attendance_modal")
    ).show();

}


// SAVE EDIT
function saveAttendanceChanges() {

    const attendanceId = $("#edit_attendance_id").val();

    const dated = $("#edit_attendance_date").val();

    const startTime = $("#edit_start_time").val();

    const endTime = $("#edit_end_time").val();

    if (!dated || !startTime) {
        salert("Error", "Please enter attendance date and start time.", "error");
        return;
    }

    if (endTime && new Date(endTime) < new Date(startTime)) {
        salert("Error", "End time cannot be earlier than start time.", "error");
        return;
    }

    const btn = $("#save_attendance_edit");

    btn.prop("disabled", true)
        .html('<i class="bi bi-arrow-repeat"></i> Saving...');

    $.ajax({

        url: "php/update_hr_attendance.php",
        type: "POST",

        data: {
            attendance_id: attendanceId,
            dated: dated,
            start_time: toMySQLDateTime(startTime),
            end_time: toMySQLDateTime(endTime)
        },

        dataType: "json",

        success: function (response) {

            console.log(response);
            if (response.status === "success") {

                bootstrap.Modal.getInstance(
                    document.getElementById("edit_attendance_modal")
                ).hide();
                salert("Success", response.message, "success");

                loadAttendanceReport();

            } else {

                salert("Error", response.message, "error");

            }

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            salert("Error", "Unable to update attendance.", "error");

        },

        complete: function () {

            btn.prop("disabled", false)
                .html('<i class="bi bi-check2"></i> Save Changes');

        }

    });

}


// CLEAR END TIME AND LOCATION
function clearAttendanceEnd(index) {

    const row = attendanceRows[index];

    // if (!row || !row.attendance_id || !row.end_time) return;

    // if (!confirm(
    //     "Are you sure you want to clear the employee's end time and logout location?\n\nAn email notification will be sent to the employee."
    // )) {
    //     return;
    // }

    swal.fire({
        title: "Are you sure?",
        text: "This will clear the employee's end time and logout location.\n\nAn email notification will be sent to the employee.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, clear it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({

                url: "php/clear_hr_attendance_end.php",
                type: "POST",

                data: {
                    attendance_id: row.attendance_id
                },

                dataType: "json",

                success: function (response) {

                    if (response.status === "success") {

                        salert("Success", response.message, "success");

                        loadAttendanceReport();

                    } else {

                        salert("Error", response.message, "error");

                    }

                },

                error: function (xhr) {

                    console.log(xhr.responseText);

                    salert("Error", "Unable to clear attendance details.", "error");

                }

            });
        }
    });


}


// Prevent HTML injection in employee names
function escapeHtml(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (char) {

        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[char];

    });

}

function salert(title, text, icon) {


    Swal.fire({
        title: title,
        text: text,
        icon: icon,
    });
}
