<?php
include 'db_head.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $process_name = $_POST['process_name'];
    $process_des = $_POST['process_des'];

    $sql = "INSERT INTO jaysan_process (process_name, process_des) VALUES ('$process_name', '$process_des')";

    if ($conn->query($sql) === TRUE) {
        echo "New process added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
