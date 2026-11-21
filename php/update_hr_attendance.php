
<?php

include 'db_head.php';

header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../vendor/phpmailer/phpmailer/src/Exception.php';
require_once '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once '../vendor/phpmailer/phpmailer/src/SMTP.php';

// TODO: Verify authenticated HR/admin session here.

$attendance_id = $_POST['attendance_id'] ?? '';
$dated = $_POST['dated'] ?? '';
$start_time = $_POST['start_time'] ?? '';
$end_time = $_POST['end_time'] ?? '';

if (
    !filter_var($attendance_id, FILTER_VALIDATE_INT) ||
    !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dated) ||
    !$start_time
) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid attendance details"
    ]);
    exit;
}

// Validate datetime formats
$start = DateTime::createFromFormat('Y-m-d H:i:s', $start_time);
$end = $end_time
    ? DateTime::createFromFormat('Y-m-d H:i:s', $end_time)
    : null;

if (
    !$start ||
    $start->format('Y-m-d H:i:s') !== $start_time ||
    ($end_time && (
        !$end || $end->format('Y-m-d H:i:s') !== $end_time
    ))
) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid date or time format"
    ]);
    exit;
}

if ($end && $end < $start) {
    echo json_encode([
        "status" => "error",
        "message" => "End time cannot be earlier than start time"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    // Get old attendance and employee details
    $check = $conn->prepare("
        SELECT
            a.*,
            e.emp_name,
            e.emp_email
        FROM attendance a
        INNER JOIN employee e ON e.emp_id = a.emp_id
        WHERE a.id = ?
        LIMIT 1
        FOR UPDATE
    ");

    $check->bind_param("i", $attendance_id);
    $check->execute();

    $result = $check->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Attendance record not found");
    }

    $old = $result->fetch_assoc();

    $oldDate = $old['dated'];
    $oldStart = $old['start_time'];
    $oldEnd = $old['end_time'];

    // Prevent duplicate attendance for same employee and date
    $duplicate = $conn->prepare("
        SELECT id
        FROM attendance
        WHERE emp_id = ?
        AND dated = ?
        AND id != ?
        LIMIT 1
    ");

    $duplicate->bind_param(
        "isi",
        $old['emp_id'],
        $dated,
        $attendance_id
    );

    $duplicate->execute();

    if ($duplicate->get_result()->num_rows > 0) {
        throw new Exception(
            "An attendance record already exists for this employee and date"
        );
    }

    $newStatus = $end_time ? 'completed' : 'started';

    $update = $conn->prepare("
        UPDATE attendance
        SET
            dated = ?,
            start_time = ?,
            end_time = ?,
            status = ?
        WHERE id = ?
    ");

    $update->bind_param(
        "ssssi",
        $dated,
        $start_time,
        $end_time,
        $newStatus,
        $attendance_id
    );

    if (!$update->execute()) {
        throw new Exception($update->error);
    }

    $conn->commit();

    // Email notification after successful database update
    $mailSent = false;

    try {


        $mail = new PHPMailer(true);

        $mail->isSMTP();

        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        $mail->Username = 'marketing@jaysanagri.com';

        // Use the same working SMTP password
        // from your website configuration.
        // Do not use the previously exposed password.
        $mail->Password = 'cugm swls gsxu ritm';

        $mail->SMTPSecure =
            PHPMailer::ENCRYPTION_STARTTLS;

        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';
        $mail->Timeout = 30;

        // Sender
        $mail->setFrom(
            'marketing@jaysanagri.com',
            'JAYSAN HR'
        );

        // Employee recipient
        $mail->addAddress(
            $old['emp_email'],
            $old['emp_name']
        );

        $mail->isHTML(true);

        $mail->Subject = 'Your Attendance Details Have Been Updated';

        $mail->Body = "
            <div style='font-family:Arial,sans-serif;
                        max-width:600px;margin:auto;
                        border:1px solid #ddd;padding:25px;
                        border-radius:10px;'>

                <h2 style='color:#198754;'>Attendance Updated</h2>

                <p>Hello <b>" . htmlspecialchars($old['emp_name']) . "</b>,</p>

                <p>Your attendance details have been modified by the HR team.</p>

                <table style='width:100%;border-collapse:collapse;'>
                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>Previous Date</td>
                        <td style='padding:10px;border:1px solid #ddd;'>" . htmlspecialchars($oldDate) . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>New Date</td>
                        <td style='padding:10px;border:1px solid #ddd;'>" . htmlspecialchars($dated) . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>Previous Start</td>
                        <td style='padding:10px;border:1px solid #ddd;'>" . htmlspecialchars($oldStart) . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>New Start</td>
                        <td style='padding:10px;border:1px solid #ddd;'>" . htmlspecialchars($start_time) . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>Previous End</td>
                        <td style='padding:10px;border:1px solid #ddd;'>" . htmlspecialchars($oldEnd ?? 'Not recorded') . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px;border:1px solid #ddd;'>New End</td>
                        <td style='padding:10px;border:1px solid #ddd;'>" . htmlspecialchars($end_time ?: 'Not recorded') . "</td>
                    </tr>
                </table>

                <p style='margin-top:20px;'>
                    If you have any questions, kindly contact HR.
                </p>

                <p>Regards,<br><b>JAYSAN HR Team</b></p>

            </div>
        ";

        $mail->send();
        $mailSent = true;
        $email_error = '';
    } catch (Exception $e) {

        $email_error = $e->getMessage();
        error_log("Attendance update email failed: " . $e->getMessage());
        error_log("Attendance Email Error: " . $email_error);
    }

    echo json_encode([
        "status" => "success",
        "message" => $mailSent
            ? "Attendance updated and employee notified successfully."
            : "Attendance updated, but the notification email could not be sent.",
        "email_sent" => $mailSent,
        "email_error" => $email_error
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
