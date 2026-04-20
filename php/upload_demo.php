
<?php
  include 'db_head.php';

//  $file_name = $_POST['file_name'];
$targetDir = __DIR__ . '/../uploads11/'; // parent directory
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

    



$conn->close();

 
?>
