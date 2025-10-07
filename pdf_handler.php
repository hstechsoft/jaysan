<?php
require __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ========= Collect Parameters =========
$params = [
    'save_path'     => $_POST['save_path'] ?? '',
        'unique_file' => $_POST['unique_file'] ?? 'no', // ✅ New parameter
    'file_name'     => $_POST['file_name'] ?? 'invoice.pdf',
    'header_html'   => $_POST['header_html'] ?? '',
    'footer_html'   => $_POST['footer_html'] ?? '',
    'body_html'     => $_POST['body_html'] ?? '<h1>No data provided</h1>',
    'orientation'   => $_POST['orientation'] ?? 'portrait',
    'paper_size'    => $_POST['paper_size'] ?? 'A4',
    'margin_top'    => $_POST['margin_top'] ?? '80px',
    'margin_bottom' => $_POST['margin_bottom'] ?? '50px',
    'margin_left'   => $_POST['margin_left'] ?? '40px',
    'margin_right'  => $_POST['margin_right'] ?? '40px',
    'email_to'      => $_POST['email_to'] ?? '',
    'email_subject' => $_POST['email_subject'] ?? 'Invoice',
    'email_body'    => $_POST['email_body'] ?? 'Please find your invoice attached.',
    'watermark_text'=> $_POST['watermark_text'] ?? ''
];






$params['body_html'] = urldecode($params['body_html']);
if (empty($params['save_path'])) {
    // fallback if nothing provided
    $params['save_path'] = __DIR__ . '/storage/pdf/invoice_' . time();
}


$dir = dirname($params['save_path']);
if (!is_dir($dir)) {
    mkdir($dir, 0775, true);
}

// ✅ Add timestamp or .pdf depending on unique_file
if (strtolower($params['unique_file']) === 'yes') {
    $params['save_path'] .= '_' . time() . '.pdf';
} else {
    $params['save_path'] .= '.pdf';
}

// ========= Setup Dompdf =========
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);
$options->set('defaultFont', 'DejaVu Sans');

$dompdf = new Dompdf($options);

// ========= Build Watermark =========
$watermarkHtml = '';
if (!empty($params['watermark_text'])) {
    $watermarkHtml = "
    <div style='position: fixed; top: 40%; left: 20%; opacity: 0.1;
                font-size: 80px; color: red; transform: rotate(-30deg);'>
        {$params['watermark_text']}
    </div>";
}

// ========= Build Full HTML =========
$html = "
<html>
<head>
  <style>
    @page { margin: {$params['margin_top']} {$params['margin_right']} {$params['margin_bottom']} {$params['margin_left']}; }
    header { position: fixed; top: -{$params['margin_top']}; left: 0; right: 0; height: 60px; }
    footer { position: fixed; bottom: -{$params['margin_bottom']}; left: 0; right: 0; height: 30px; text-align:center; font-size:10px; color:#666; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
    .page-break { page-break-after: always; }

    /* Clean Invoice Table */
    table { border-collapse: collapse; width: 100%; font-size: 12px; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background: #f2f2f2; }
    tfoot td { font-weight: bold; background: #eee; }
    thead { display: table-header-group; }
    tfoot { display: table-footer-group; }
  </style>
</head>
<body>
  $watermarkHtml
  <header>{$params['header_html']}</header>
  <footer>{$params['footer_html']}<br>Page {PAGE_NUM} of {PAGE_COUNT}</footer>
  <main>{$params['body_html']}</main>
</body>
</html>";

// ========= Render PDF =========
$dompdf->loadHtml($html, 'UTF-8');
$dompdf->setPaper($params['paper_size'], $params['orientation']);
$dompdf->render();

// ========= Auto-create Folder & Save =========


$pdfOutput = $dompdf->output();
if (file_put_contents($params['save_path'], $pdfOutput) === false) {
    $result = ['status' => 'error', 'message' => "❌ Could not save file at {$params['save_path']}"];
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}

// ========= Optional Email =========
if (!empty($params['email_to'])) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@hstechsoft.com';
        $mail->Password   = '09eel123#Ea1';
        $mail->Port       = 587;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $mail->setFrom('info@hstechsoft.com', 'HS Tech Soft');
        $mail->addAddress($params['email_to']);
        $mail->isHTML(true);
        $mail->Subject = $params['email_subject'];
        $mail->Body    = $params['email_body'];
        $mail->addAttachment($params['save_path'], $params['file_name']);
        $mail->send();

        $email_status = '✅ Email sent successfully';
    } catch (Exception $e) {
        $email_status = '❌ Email failed: ' . $mail->ErrorInfo;
    }
} else {
    $email_status = '📄 File saved (email not sent)';
}

// ========= Return JSON for AJAX =========
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'message' => '✅ PDF generated successfully!',
    'email_status' => $email_status,
    'file_path' => $params['save_path'],       // Full path
    'download_url' => 'pdf_download.php?file=' . urlencode($params['save_path']) // for frontend
]);
