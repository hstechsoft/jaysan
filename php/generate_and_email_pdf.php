<?php
// ====== CONFIG ======
$useComposer = true; // set false if you uploaded libraries manually (see includes below)
$recipientEmail = "receiver@example.com";   // TODO: put dynamic email from DB
$recipientName  = "Receiver Name";          // optional
$companyName    = "HS Tech Soft";
$reportTitle    = "Employee Report";
$todayStr       = date('d-m-Y H:i');

// ====== AUTOLOADS ======
if ($useComposer) {
    // Composer install path (public_html/vendor)
    require __DIR__ . '/vendor/autoload.php';
} else {
    // Manual library includes (adjust paths)
    require __DIR__ . '/dompdf/autoload.inc.php';
    require __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/PHPMailer/src/SMTP.php';
    require __DIR__ . '/PHPMailer/src/Exception.php';
}

use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ====== DOMPDF OPTIONS ======
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$options->set('isRemoteEnabled', true);  // allow external css/images if needed
$options->set('defaultFont', 'DejaVu Sans'); // good for Indian languages
$dompdf = new Dompdf($options);

// Optional: handle big docs on shared hosting
@ini_set('memory_limit','512M');
@ini_set('max_execution_time','120');

// ====== OPTIONAL: EMBED A LOGO (base64) ======
$logoPngPath = __DIR__ . '/assets/logo.png'; // put your logo file here
$logoBase64  = file_exists($logoPngPath)
    ? 'data:image/png;base64,'.base64_encode(file_get_contents($logoPngPath))
    : null;

// ====== BUILD YOUR HTML (Bootstrap table demo) ======
ob_start(); ?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title><?= htmlspecialchars($reportTitle) ?></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <style>
    /* Page setup */
    @page { size: A4; margin: 22mm 15mm 25mm 15mm; } /* top right bottom left */
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }

    /* Fixed header/footer repeat on each page */
    header {
      position: fixed;
      top: -18mm; left: 0; right: 0; height: 18mm;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid #d7d7d7; padding: 0 4mm;
    }
    header .brand { font-weight: 700; font-size: 13px; }
    header .title { font-weight: 600; }
    footer {
      position: fixed;
      bottom: -18mm; left: 0; right: 0; height: 18mm;
      border-top: 1px solid #d7d7d7; padding: 0 6mm;
      display: flex; align-items: center; justify-content: space-between;
      font-size: 10px;
    }

    /* Table & page-break rules */
    thead { display: table-header-group; }   /* repeat header rows */
    tfoot { display: table-footer-group; }
    table { page-break-inside: auto; width: 100%; }
    tr    { page-break-inside: avoid; page-break-after: auto; }

    .page-break { page-break-before: always; }

    /* Cosmetic tweaks for nicer PDF look */
    .report-header h4 { margin: 6px 0 2px; }
    .muted { color: #666; }
  </style>
</head>
<body>

<header>
  <div class="brand">
    <?php if ($logoBase64): ?>
      <img src="<?= $logoBase64 ?>" alt="Logo" style="height:14mm; vertical-align:middle; margin-right:6px;">
    <?php endif; ?>
    <?= htmlspecialchars($companyName) ?>
  </div>
  <div class="title"><?= htmlspecialchars($reportTitle) ?></div>
</header>

<footer>
  <div class="muted">Generated: <?= htmlspecialchars($todayStr) ?></div>
  <div class="muted">Page {PAGE_NUM} of {PAGE_COUNT}</div>
</footer>

<main>
  <div class="report-header text-center mb-3">
    <h4 class="mb-0"><?= htmlspecialchars($reportTitle) ?></h4>
    <small class="muted">A4 • Auto page-breaks • Repeating header/footer</small>
  </div>

  <!-- Demo table (replace with your HTML) -->
  <table class="table table-bordered table-striped">
    <thead class="table-dark">
      <tr>
        <th style="width:6%">#</th>
        <th style="width:34%">Name</th>
        <th style="width:30%">Department</th>
        <th style="width:15%">Age</th>
        <th style="width:15%">Status</th>
      </tr>
    </thead>
    <tbody>
    <?php for ($i=1; $i<=120; $i++): ?>
      <tr>
        <td><?= $i ?></td>
        <td>Employee <?= $i ?></td>
        <td>Dept <?= rand(1,5) ?></td>
        <td><?= rand(23,54) ?></td>
        <td><?= (rand(0,1) ? 'Active' : 'Inactive') ?></td>
      </tr>
    <?php endfor; ?>
    </tbody>
  </table>

  <!-- Force a manual page break example -->
  <div class="page-break"></div>

  <h5 class="mb-2">Notes</h5>
  <p class="mb-0">You can place any content here (charts as images, summaries, signatures, etc.).</p>
</main>

<!-- Page numbers via Dompdf "page_text" -->
<script type="text/php">
if (isset($pdf)) {
    $font = $fontMetrics->get_font("DejaVu Sans", "normal");
    $size = 9;
    // Bottom-right coordinates: tweak for your margins (x, y)
    // A4 height ~ 842pt; adjust y if your bottom margin changes
    $pdf->page_text(520, 820, "Page {PAGE_NUM} of {PAGE_COUNT}", $font, $size, [0,0,0]);
}
</script>

</body>
</html>
<?php
$html = ob_get_clean();

// ====== RENDER PDF ======
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait'); // change to 'landscape' if needed
$dompdf->render();
$pdfBytes = $dompdf->output();

// ====== EMAIL (PHPMailer) ======
$mail = new PHPMailer(true);
try {
    // SMTP (edit to your credentials)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';     // e.g., smtp.gmail.com
    $mail->SMTPAuth   = true;
    $mail->Username   = 'youremail@gmail.com';    // TODO
    $mail->Password   = 'your_app_password';      // Use App Password for Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // or ENCRYPTION_SMTPS
    $mail->Port       = 587; // 465 for SMTPS

    $mail->setFrom('youremail@gmail.com', $companyName);
    $mail->addAddress($recipientEmail, $recipientName);

    $mail->Subject = "$reportTitle - " . date('d M Y');
    $mail->isHTML(true);
    $mail->Body = "<p>Hi,</p>
                   <p>Please find attached the <strong>$reportTitle</strong> generated on $todayStr.</p>
                   <p>Regards,<br>$companyName</p>";

    // Attach PDF from memory
    $fileName = preg_replace('/[^A-Za-z0-9_\-]+/', '_', $reportTitle) . '_' . date('Ymd_His') . '.pdf';
    $mail->addStringAttachment($pdfBytes, $fileName, 'base64', 'application/pdf');

    $mail->send();
    echo "Success: email sent to $recipientEmail with attachment $fileName";
} catch (Exception $e) {
    http_response_code(500);
    echo "Mailer Error: " . $mail->ErrorInfo;
}
