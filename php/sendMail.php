<?php
if (isset($_FILES['pdf'])) {
    $to = $_POST['to'];
    $subject = $_POST['subject'];
    $message = "Attached is the requested purchase order report.";

    $filename = $_FILES['pdf']['name'];
    $filedata = $_FILES['pdf']['tmp_name'];
    $filetype = $_FILES['pdf']['type'];

    $file = chunk_split(base64_encode(file_get_contents($filedata)));
    $uid = md5(uniqid(time()));

    $header = "From: sanjayrv.sts@gmail.com\r\n";
    $header .= "MIME-Version: 1.0\r\n";
    $header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n";

    $body = "--".$uid."\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $message."\r\n\r\n";
    $body .= "--".$uid."\r\n";
    $body .= "Content-Type: ".$filetype."; name=\"".$filename."\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"".$filename."\"\r\n\r\n";
    $body .= $file."\r\n\r\n";
    $body .= "--".$uid."--";

    if (mail($to, $subject, $body, $header)) {
        echo "✅ Email sent successfully!";
    } else {
        echo "❌ Failed to send email!";
    }
} else {
    echo "No PDF file received.";
}
?>
