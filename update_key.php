<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $glusr_crm_key = trim($_POST['glusr_crm_key']);

    // Validate input
    if (!empty($glusr_crm_key)) {
        $key_file = 'glusr_crm_key.txt';

        // Save the key to the text file
        if (file_put_contents($key_file, $glusr_crm_key)) {
            echo "Key updated successfully.";
        } else {
            echo "Failed to update the key.";
        }
    } else {
        echo "Key cannot be empty!";
    }
} else {
    echo "Invalid request.";
}
?>
