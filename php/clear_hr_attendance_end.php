
<?php

include 'db_head.php';

header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../vendor/phpmailer/phpmailer/src/Exception.php';
require_once '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once '../vendor/phpmailer/phpmailer/src/SMTP.php';

// TODO: Add authenticated HR/admin session validation.

// Validate attendance ID
$attendance_id = $_POST['attendance_id'] ?? '';

if (!filter_var($attendance_id, FILTER_VALIDATE_INT)) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid attendance ID"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    // Fetch attendance and employee details
    $check = $conn->prepare("
        SELECT
            a.*,
            e.emp_name,
            e.emp_email
        FROM attendance a
        INNER JOIN employee e
            ON e.emp_id = a.emp_id
        WHERE a.id = ?
        LIMIT 1
        FOR UPDATE
    ");

    if (!$check) {
        throw new Exception($conn->error);
    }

    $check->bind_param("i", $attendance_id);
    $check->execute();

    $result = $check->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Attendance record not found");
    }

    $row = $result->fetch_assoc();

    if (empty($row['end_time'])) {
        throw new Exception("No ending time is available to clear");
    }

    $oldEndTime = $row['end_time'];

    $employeeEmail = trim((string)($row['emp_email'] ?? ''));
    $employeeName = trim((string)($row['emp_name'] ?? ''));

    // Validate employee email
    if (!filter_var($employeeEmail, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Employee email address is missing or invalid.");
    }

    // Clear only logout details
    $update = $conn->prepare("
        UPDATE attendance
        SET
            end_time = NULL,
            end_latitude = NULL,
            end_longitude = NULL,
            status = 'started'
        WHERE id = ?
    ");

    if (!$update) {
        throw new Exception($conn->error);
    }

    $update->bind_param("i", $attendance_id);

    if (!$update->execute()) {
        throw new Exception($update->error);
    }

    $update->close();
    $check->close();

    // Commit attendance update
    $conn->commit();

    // -----------------------------------
    // EMAIL NOTIFICATION
    // -----------------------------------

    $mailSent = false;
    $emailError = '';

    try {

        $mail = new PHPMailer(true);

        // Gmail SMTP - same configuration as working website
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        $mail->Username = 'marketing@jaysanagri.com';

        // Enter the newly rotated working Gmail SMTP app password
        $mail->Password = 'cugm swls gsxu ritm';

        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';
        $mail->Timeout = 30;

        // Sender
        $mail->setFrom(
            'marketing@jaysanagri.com',
            'JAYSAN HR'
        );

        // Employee recipient - add only once
        $mail->addAddress(
            $employeeEmail,
            $employeeName
        );

        $mail->isHTML(true);

        $mail->Subject = 'Attendance Logout Details Updated';

        // HTML email
        $mail->Body = "
            <div style='font-family:Arial,sans-serif;
                        max-width:600px;
                        margin:auto;
                        border:1px solid #ddd;
                        padding:25px;
                        border-radius:10px;'>

                <h2 style='color:#dc4545;'>
                    Attendance Logout Details Cleared
                </h2>

                <p>
                    Hello
                    <b>" .
            htmlspecialchars($employeeName, ENT_QUOTES, 'UTF-8') .
            "</b>,
                </p>

                <p>
                    Your previous attendance logout details have been
                    cleared by the HR team.
                </p>

                <table style='width:100%;border-collapse:collapse;'>

                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>
                            Attendance Date
                        </td>

                        <td style='padding:10px;border:1px solid #ddd;'>" .
            htmlspecialchars($row['dated'], ENT_QUOTES, 'UTF-8') .
            "</td>
                    </tr>

                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>
                            Previous End Time
                        </td>

                        <td style='padding:10px;border:1px solid #ddd;'>" .
            htmlspecialchars($oldEndTime, ENT_QUOTES, 'UTF-8') .
            "</td>
                    </tr>

                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>
                            Current Status
                        </td>

                        <td style='padding:10px;border:1px solid #ddd;'>
                            Started
                        </td>
                    </tr>

                </table>

                <p style='margin-top:20px;'>
                    Please contact HR if you have any questions.
                </p>

                <p>
                    Regards,<br>
                    <b>JAYSAN HR Team</b>
                </p>

            </div>
        ";

        // Plain text alternative
        $mail->AltBody =
            "Hello " . $employeeName . ",\n\n" .
            "Your previous attendance logout details have been cleared by HR.\n\n" .
            "Attendance Date: " . $row['dated'] . "\n" .
            "Previous End Time: " . $oldEndTime . "\n" .
            "Current Status: Started\n\n" .
            "Regards,\nJAYSAN HR Team";

        // Send email
        $mail->send();

        $mailSent = true;
    } catch (Exception $e) {

        $emailError = isset($mail) && !empty($mail->ErrorInfo)
            ? $mail->ErrorInfo
            : $e->getMessage();

        error_log("Attendance clear email failed: " . $emailError);
    }

    // -----------------------------------
    // RESPONSE
    // -----------------------------------

    echo json_encode([
        "status" => "success",

        "message" => $mailSent
            ? "Logout details cleared and employee notified."
            : "Logout details cleared, but email notification failed.",

        "email_sent" => $mailSent,

        "email_error" => $mailSent ? null : $emailError
    ]);
} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$conn->close();

?>
