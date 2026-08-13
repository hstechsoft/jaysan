
<?php
 include 'db_head.php';

 $exp_des =test_input($_POST['exp_des']);
 $exp_cat =test_input($_POST['exp_cat']);
 $exp_amount =test_input($_POST['exp_amount']);
 $exp_date =($_POST['exp_date']);
 $exp_emp_id =($_POST['exp_emp_id']);
 $exp_work_id =test_input($_POST['exp_work_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$exp_id = 0;

$sql = "INSERT  INTO  expense (exp_des,exp_cat,exp_amount,exp_date,exp_emp_id,exp_work_id)
 VALUES ($exp_des,$exp_cat,$exp_amount,UNIX_TIMESTAMP('$exp_date') * 1000,$exp_emp_id,$exp_work_id)";
  
  if ($conn->query($sql) === TRUE) {
// get the last inserted id
$exp_id = $conn->insert_id;
    $sql_insert_exp_cat= "INSERT IGNORE INTO exp_cat (exp_cat ) VALUES ( $exp_cat)";
   
    
     if ($conn->query($sql_insert_exp_cat) === TRUE) {
   
     } 
     else {
       echo "Error: " . $sql_insert_exp_cat . "<br>" . $conn->error;
     }

   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
// get empname from employee
$sql_get_empname = "SELECT emp_name FROM employee WHERE emp_id = $exp_emp_id";
$result_get_empname = $conn->query($sql_get_empname);
if ($result_get_empname->num_rows > 0) {
    $row = mysqli_fetch_assoc($result_get_empname);
    $emp_name = $row['emp_name'];
} else {
    $emp_name = '';
}
   

if ($_FILES['file']['name'] != '') {
    $dirname = $exp_emp_id;
    $target_path = "../attachment/expense/" . $dirname . "/";
  
    if (!file_exists($target_path)) {
        mkdir($target_path, 0755, true);
    }

    $FileType = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));    
    $target_path = $target_path . "attach_" . $exp_emp_id . "." . $FileType; 

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
        $text = $date->format('d-m-Y H:i:s')."(".$emp_name . ")";
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

    // update target_path in expense table
    $sql_update = "UPDATE expense SET attachment = '1' WHERE exp_id = $exp_id";
    if ($conn->query($sql_update) === TRUE) {
    } else {
        echo "Error updating record: " . $conn->error;
    }

    echo "ok";
} else {
    echo "There was an error uploading the file, please try again!";
}

$conn->close();

 ?>





