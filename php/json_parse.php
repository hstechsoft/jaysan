<?php
// Read JSON file
$jsonString = file_get_contents('your_json_file.json');

// Decode JSON into an associative array
$data = json_decode($jsonString, true);

// Open a CSV file to write
$file = fopen('output.csv', 'w');

// Loop through each item in the StockItem array
foreach ($data['StockItem'] as $item) {
    // Write only the "Name" value into the CSV file
    fputcsv($file, [$item['Name']]);
}

// Close the CSV file
fclose($file);

echo "CSV file with 'Name' values has been generated successfully.";
?>
