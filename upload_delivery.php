
<?php
 include 'php/db_head.php';
 $did = $_POST['did'];
 $dname = $_POST['dname'];
 $chasis_no = $_POST['chasis_no'];
 $file_name = $_POST['file_name'];
if($_FILES['file']['name'] != ''){
  
  
    $dirname = $did;
    $target_path = "attachment/delivery/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path . $file_name; 

        $FileType = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));    
       
    
       
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
        $text = $date->format('d-m-Y H:i:s')."(".$dname . ")";
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
        $text = $date->format('d-m-Y H:i:s');
        
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

    echo $target_path;

        
}

$conn->close();

 
?>
