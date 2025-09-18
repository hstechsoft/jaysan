<?php
$xml = <<<XML
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Voucher Register</REPORTNAME>
        <STATICVARIABLES>
          <SVFROMDATE>20240101</SVFROMDATE>
          <SVTODATE>20251231</SVTODATE>
          <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
          <NUMVOUCHERS>1</NUMVOUCHERS> <!-- Custom variable -->
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>
XML;

$ch = curl_init('http://localhost:9000');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: text/xml']);
$response = curl_exec($ch);
curl_close($ch);

header("Content-Type: text/xml");
echo $response;
?>
