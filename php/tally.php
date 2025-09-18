<?php
// Your XML request here — replace this with sales invoice or query XML
$xml = <<<XML
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Voucher Register</REPORTNAME>
        <STATICVARIABLES>
          <SVFROMDATE>20250618</SVFROMDATE>
          <SVTODATE>20250618</SVTODATE>
          <VoucherTypeName>Sales</VoucherTypeName>
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>
XML;

// Tally URL (default localhost port 9000)
$url = "http://103.224.34.72:9000";

// Setup cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: text/xml",
    "Content-Length: " . strlen($xml)
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);

// Execute request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo "Curl Error: " . curl_error($ch);
} else {
    header("Content-Type: text/xml");
    echo $response;
}

curl_close($ch);
?>
