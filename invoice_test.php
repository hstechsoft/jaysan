<?php
require __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// 1) Generate PDF
$dompdf = new Dompdf();
$dompdf->loadHtml('<h1>Hello World</h1><p>This PDF is generated with Composer packages!</p>');
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$pdfOutput = $dompdf->output();
$pdfPath   = __DIR__ . '/invoice_demo.pdf';
file_put_contents($pdfPath, $pdfOutput);

// 2) Email PDF
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';  // e.g. smtp.hostinger.com
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@hstechsoft.com';
    $mail->Password   = '09eel123#Ea1';
    $mail->Port       = 587; 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->setFrom('info@hstechsoft.com', 'HS Tech Soft');
    $mail->addAddress('nklharish1@gmail.com', 'Harish');

    $mail->isHTML(true);
    $mail->Subject = 'Test Invoice';
    $mail->Body    = '<p>Dear Client, please find your invoice attached.</p>';
    $mail->addAttachment($pdfPath);

    $mail->send();
    echo "✅ PDF generated and emailed successfully!";
} catch (Exception $e) {
    echo "❌ Mailer Error: {$mail->ErrorInfo}";
}
