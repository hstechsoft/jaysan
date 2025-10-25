<?php
require __DIR__ . '/vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ========= Collect Parameters =========
$params = [
    'save_path'     => $_POST['save_path'] ?? '',
    'unique_file'   => $_POST['unique_file'] ?? 'no',
    'file_name'     => $_POST['file_name'] ?? 'invoice.pdf',
    'header_html'   => $_POST['header_html'] ?? '',
    'footer_html'   => $_POST['footer_html'] ?? '',
    'body_html'     => urldecode($_POST['body_html'] ?? '<h1>No data provided</h1>'),
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

// ========= Prepare Save Path =========
if (empty($params['save_path'])) {
    $params['save_path'] = __DIR__ . '/storage/pdf/invoice_' . time();
}

$dir = dirname($params['save_path']);
if (!is_dir($dir)) {
    mkdir($dir, 0775, true);
}

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

// ========= Load External CSS =========
$cssPath = __DIR__ . '/invoice_style.css';
$css = file_exists($cssPath) ? file_get_contents($cssPath) : '';

$css = str_replace(
    ['80px', '40px', '50px', '40px'],
    [$params['margin_top'], $params['margin_right'], $params['margin_bottom'], $params['margin_left']],
    $css
);

// ========= Watermark =========
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
<meta charset='UTF-8'>
<style>
$css
</style>
</head>
<body>
  $watermarkHtml
  <div class='header'>{$params['header_html']}</div>
  <div class='footer'>{$params['footer_html']}<br>Page {PAGE_NUM} of {PAGE_COUNT}</div>
  <main>{$params['body_html']}</main>
</body>
</html>";

// ========= Render PDF =========
$dompdf->loadHtml($html);
$dompdf->setPaper($params['paper_size'], $params['orientation']);
$dompdf->render();

// ========= Add “To be continued…” on all pages except the last =========
$canvas = $dompdf->getCanvas();
$pageCount = $canvas->get_page_count();
$font = $dompdf->getFontMetrics()->getFont("DejaVu Sans", "normal");
$fontSize = 10;

for ($i = 1; $i < $pageCount; $i++) {
    $canvas->page_script(function ($pageNumber, $pageCount, $canvas, $font, $fontSize) {
        if ($pageNumber < $pageCount) {
            $width = $canvas->get_width();
            $height = $canvas->get_height();
            $text = "To be continued...";
            $textWidth = $canvas->getTextWidth($text, $font, $fontSize);
            $x = ($width - $textWidth) / 2;
            $y = $height - 30; // Position 30px from bottom
            $canvas->text($x, $y, $text, $font, $fontSize);
        }
    }, $font, $fontSize);
}

// ========= Save File =========
$pdfOutput = $dompdf->output();
if (file_put_contents($params['save_path'], $pdfOutput) === false) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => "❌ Could not save file at {$params['save_path']}"]);
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

// ========= Return JSON =========
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'message' => '✅ PDF generated successfully!',
    'email_status' => $email_status,
    'file_path' => $params['save_path'],
    'download_url' => 'pdf_download.php?file=' . urlencode($params['save_path'])
]);
