<?php
header("Content-Type: application/javascript");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>

window.CSRF_TOKEN = "<?= $_SESSION['csrf_token'] ?>";
