<?php
if (!isset($_POST['html_file'])) {
  echo json_encode([]);
  exit;
}

$htmlFile = basename($_POST['html_file']);
$jsFile = 'js/' . pathinfo($htmlFile, PATHINFO_FILENAME) . '.js';

$ids = [];
$classes = [];
$results = [];

// Extract IDs and Classes from HTML
$html = file_get_contents("../$htmlFile");
preg_match_all('/id="([^"]+)"/', $html, $idMatches);
preg_match_all('/class="([^"]+)"/', $html, $classMatches);
$ids = $idMatches[1];
foreach ($classMatches[1] as $classList) {
  foreach (explode(' ', $classList) as $class) {
    $classes[] = $class;
  }
}

// Search JS for jQuery Events
$jsPath = "../$jsFile";
if (file_exists($jsPath)) {
  $lines = file($jsPath);
  foreach ($lines as $num => $line) {
    foreach ($ids as $id) {
      if (preg_match("/\\$\\(['\"]#{$id}['\"]\\)\\.(\\w+)/", $line, $match)) {
        $results[] = [
          'selector' => "#$id",
          'event' => $match[1],
          'line' => $num + 1,
          'file' => realpath($jsPath)
        ];
      }
    }
    foreach ($classes as $class) {
      if (preg_match("/\\$\\(['\"]\\.${class}['\"]\\)\\.(\\w+)/", $line, $match)) {
        $results[] = [
          'selector' => ".$class",
          'event' => $match[1],
          'line' => $num + 1,
          'file' => realpath($jsPath)
        ];
      }
    }
  }
}

echo json_encode($results);
