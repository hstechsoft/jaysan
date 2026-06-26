<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_head.php';
$godown_id = $_POST['godown_id'];
$emp_id = $_POST['emp_id'];
// get godown name
$godown_name = '';
$sql_name = "SELECT creditor_name FROM creditors WHERE creditor_id = '$godown_id'";
$result_name = $conn->query($sql_name);
if ($result_name->num_rows > 0) {
    $row_name = $result_name->fetch_assoc();
    $godown_name = $row_name['creditor_name'];
}

if ($_FILES['file']['name'] != '') {
    $dirname = $godown_id;
    $target_path = "../storage/dc/" . $dirname . "/";
  
    if (!file_exists($target_path)) {
        mkdir($target_path, 0755, true);
    }
// add time
    $FileType = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));  
$filename1 =   "dc_" . $godown_id . "_" . time() . "." . $FileType;
    $target_path = $target_path . $filename1; 

  

    // Resize the image
    $max_width = 800;  // Set the desired width
    $max_height = 800; // Set the desired height

    list($width, $height) = getimagesize($_FILES['file']['tmp_name']);
    $ratio = $width / $height;

    if ($width > $max_width || $height > $max_height) {
        if ($ratio > 1) {
            $new_width = $max_width;
            $new_height = $max_width / $ratio;
        } else {
            $new_height = $max_height;
            $new_width = $max_height * $ratio;
        }

        $src = imagecreatefromstring(file_get_contents($_FILES['file']['tmp_name']));
        $dst = imagecreatetruecolor($new_width, $new_height);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

        // Add text to the image
        $date = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
        $text = $date->format('d-m-Y H:i:s')."(".$godown_name . ")";
        $font = realpath(__DIR__ . '/arial.ttf'); // Ensure this path points to a valid TTF font file on your server
        if ($font === false) {
            die("Font file not found!");
        }
        $font_size = 20;
        $text_color = imagecolorallocate($dst, 255, 255, 255); // White color
        $x_position = 10;
        $y_position = $new_height - 10;

        imagettftext($dst, $font_size, 0, $x_position, $y_position, $text_color, $font, $text);

        if ($FileType == 'jpg' || $FileType == 'jpeg') {
            imagejpeg($dst, $target_path);
        } elseif ($FileType == 'png') {
            imagepng($dst, $target_path);
        } elseif ($FileType == 'gif') {
            imagegif($dst, $target_path);
        }

        imagedestroy($src);
        imagedestroy($dst);
    } else {
        // Add text to the image
        $src = imagecreatefromstring(file_get_contents($_FILES['file']['tmp_name']));
        $date = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
        $text = $date->format('d-m-Y H:i:s')."(".$godown_name . ")";
        
        $font = realpath(__DIR__ . '/arial.ttf'); // Ensure this path points to a valid TTF font file on your server
        if ($font === false) {
            die("Font file not found!");
        }
        $font_size = 20;
        $text_color = imagecolorallocate($src, 255, 255, 255); // White color
        $x_position = 10;
        $y_position = $height - 10;

        imagettftext($src, $font_size, 0, $x_position, $y_position, $text_color, $font, $text);

        if ($FileType == 'jpg' || $FileType == 'jpeg') {
            imagejpeg($src, $target_path);
        } elseif ($FileType == 'png') {
            imagepng($src, $target_path);
        } elseif ($FileType == 'gif') {
            imagegif($src, $target_path);
        }

        imagedestroy($src);
    }

    // echo $target_path;

    // insert into dc_attchment
    $sql_insert = "INSERT INTO dc_attachment (godown, path,emp_id) VALUES ('$godown_id', '$filename1', '$emp_id')";
    $conn->query($sql_insert);
    if ($conn->error) {
        echo "Error inserting into database: " . $conn->error;
    }
    else
        {
            echo "Success";
        }
    

} else {
    echo "There was an error uploading the file, please try again!";
}
?>
