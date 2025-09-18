<?php
// Read JSON file
$filename = 'Stockitem.json';
$jsonString = file_get_contents($filename );
// Decode JSON into an associative array
$data = json_decode($jsonString, true);

// Open a CSV file to write
$file = fopen('output.csv', 'w');

// Add a header to the CSV
fputcsv($file, ['Name', 'Part No']);

// Loop through each item in the StockItem array
foreach ($data['StockItem'] as $item) {
    // Check if "Part No" exists
    $partNo = isset($item['Part No']) ? $item['Part No'] : '';
    
    // Write "Name" and "Part No" (if available) to the CSV
    fputcsv($file, [$item['Name'], $partNo]);
}

// Close the CSV file
fclose($file);

echo "CSV file with 'Name' and 'Part No' values has been generated successfully.";
?>
