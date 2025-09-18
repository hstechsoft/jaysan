<?php
include("db_head.php");
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
if (isset($_POST['ext_id'])) {
    $id = test_input($_POST['ext_id']);
    $sql = "DELETE FROM extra_time_master WHERE ext_id = $id";

    if ($conn->query($sql)) {
        echo "ok";
    } else {
        echo $conn->error;
    }
} else {
    echo "Invalid request";
}
?>
