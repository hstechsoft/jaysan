<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update glusr_crm_key</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body>

<div class="container mt-5">
    <h2 class="mb-4">Update glusr_crm_key</h2>

    <!-- Alert Message Container -->
    <div id="message" class="alert d-none"></div>

    <?php
    // Define the path to the key file
    $key_file = 'php/glusr_crm_key.txt';

    // Initialize the variable to hold the current key
    $current_key = '';

    // Check if the key file exists and read its contents
    if (file_exists($key_file)) {
        $current_key = trim(file_get_contents($key_file));
    } else {
        echo '<div class="alert alert-danger">Key file not found!</div>';
    }
    ?>

    <form id="updateForm">
        <div class="mb-3">
            <label for="glusr_crm_key" class="form-label">Current glusr_crm_key:</label>
            <input type="text" id="glusr_crm_key" name="glusr_crm_key" class="form-control" value="<?php echo htmlspecialchars($current_key); ?>" required>
        </div>
        <button type="submit" class="btn btn-primary">Update Key</button>
    </form>
</div>

<!-- jQuery (required for AJAX) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLR9F7hPSFQe79gMncbIH20X1PfAdPRVR7P7XZK8Lq" crossorigin="anonymous"></script>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>

<script>
$(document).ready(function() {
    // Handle form submission with AJAX
    $('#updateForm').on('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        $.ajax({
            url: 'php/update_key.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                $('#message').removeClass('d-none alert-danger').addClass('alert-info').text(response);
            },
            error: function() {
                $('#message').removeClass('d-none alert-info').addClass('alert-danger').text('Failed to update the key.');
            }
        });
    });
});
</script>

</body>
</html>
