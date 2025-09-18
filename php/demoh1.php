<?php
session_start();

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.html');
    exit;
}

echo "<h1>Welcome to the dashboard, " . htmlspecialchars($_SESSION['username']) . "!</h1>";
echo '<a href="php/logout.php">Logout</a>';
?>
