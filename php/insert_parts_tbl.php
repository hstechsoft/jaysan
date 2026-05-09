<?php
 include 'db_head.php';


$part_name = test_input($_POST['part_name']);
$part_no = test_input($_POST['part_no']);
$des = test_input($_POST['des']);
// $part_image = test_input($_POST['part_image']);
$sub_ass = test_input($_POST['sub_ass']);
$reorder_qty = test_input($_POST['reorder_qty']);
$min_order_qty = test_input($_POST['min_order_qty']);
$Parent = test_input($_POST['Parent']);
$category = test_input($_POST['category']);
$baseunits = test_input($_POST['baseunits']);
$gstrate = test_input($_POST['gstrate']);
$tally_part = test_input($_POST['tally_part']);
$alias_name = test_input($_POST['alias_name']);
$is_sale_item = test_input($_POST['is_sale_item']);
$item_grade = test_input($_POST['item_grade']);
$preference = test_input($_POST['preference']);
$is_godown_available = test_input($_POST['is_godown_available']);
$under_partid = test_input($_POST['under_partid']);
$alternate_unit = test_input($_POST['alternate_unit']);
$base_value = test_input($_POST['base_value']);
$is_bom = test_input($_POST['is_bom']);
$alter_std_rate = test_input($_POST['alter_std_rate']);
$is_gst_appicable = test_input($_POST['is_gst_appicable']);
$hsn_code = test_input($_POST['hsn_code']);
$hsn_des = test_input($_POST['hsn_des']);
$gstdetails = test_input($_POST['gstdetails']);
$type_of_supply = test_input($_POST['type_of_supply']);


$stock_master_json = $_POST['stock_master'];
 $stock_master_json = json_decode($stock_master_json, true);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// do with try catch commit and rollback

try {
    $conn->begin_transaction();
$part_id = 0;
 $sql = "INSERT INTO parts_tbl ( part_name,part_no,des,sub_ass,reorder_qty,min_order_qty,Parent,category,baseunits,gstrate,tally_part,alias_name,is_sale_item,item_grade,preference,is_godown_available,under_partid,alternate_unit,base_value,is_bom,alter_std_rate,is_gst_appicable,hsn_code,hsn_des,gstdetails,type_of_supply) VALUES ($part_name,$part_no,$des,$sub_ass,$reorder_qty,$min_order_qty,$Parent,$category,$baseunits,$gstrate,$tally_part,$alias_name,$is_sale_item,$item_grade,$preference,$is_godown_available,$under_partid,$alternate_unit,$base_value,$is_bom,$alter_std_rate,$is_gst_appicable,$hsn_code,$hsn_des,$gstdetails,$type_of_supply)";

  if ($conn->query($sql) === TRUE) {
    // get insertd id
    $part_id = $conn->insert_id;
  // insert sec_stock_master
  foreach ($stock_master_json as $stock_master) {
      $store_id = ($stock_master['store_id']);
      $store_type = ($stock_master['store_type']);
      $min_qty = ($stock_master['min_qty']);
      $max_qty = ($stock_master['max_qty']);
      $rack = ($stock_master['rack']);
      $bin = ($stock_master['bin']);

      $sql_stock_master = "INSERT INTO sec_stock_master (part_id, store_id, store_type, min_qty, max_qty, rack, bin) VALUES ('$part_id', '$store_id', '$store_type', '$min_qty', '$max_qty', '$rack', '$bin')";
      if ($conn->query($sql_stock_master) !== TRUE) {
          throw new Exception("Error: " . $sql_stock_master . "<br>" . $conn->error);
      }
  }
  } else {
    throw new Exception("Error: " . $sql . "<br>" . $conn->error);
  }
$file_name = '';
//  $file_name = $_POST['file_name'];
if($_FILES['file']['name'] != ''){
  // remove '' from part_no
  $part_no = str_replace("'", "", $part_no);
// get file extension
        $FileType = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        $file_name = $part_no."_".$part_id . "." . $FileType; // Rename file to part_id.extension    
    $dirname =  $part_id;
    $target_path = "../attachment/parts/" . $dirname . "/"; // going up one level to attachment/parts/part_id
   

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path . $file_name; 


       
    
       
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
        $text = $date->format('d-m-Y H:i:s')."(".$part_no . ")";
        $font = realpath(__DIR__ . '/arial.ttf'); // Ensure this path points to a valid TTF font file on your server
        if ($font === false) {
            die("Font file not found!");
        }
        $font_size = 20;
        $text_color = imagecolorallocate($dst, 255, 255, 255); // White color
        $x_position = 10;
        $y_position = $new_height - 10;

        imagettftext($dst, $font_size, 0, $x_position, $y_position, $text_color, $font,  $part_no);

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

        imagettftext($src, $font_size, 0, $x_position, $y_position, $text_color, $font,  $part_no);

        if ($FileType == 'jpg' || $FileType == 'jpeg') {
            imagejpeg($src, $target_path);
        } elseif ($FileType == 'png') {
            imagepng($src, $target_path);
        } elseif ($FileType == 'gif') {
            imagegif($src, $target_path);
        }

        imagedestroy($src);
    }
}


// update part_image in parts_tbl
// Set the part_image to the target path of the uploaded file
$part_image = $file_name;
$sql_update = "UPDATE parts_tbl SET part_image='$part_image' WHERE part_id='$part_id'";
if ($conn->query($sql_update) === TRUE) {
    echo "ok";
} else {    
     throw new Exception("Error updating part_image: " . $conn->error);
}


    $conn->commit();
} catch (Exception $e) {
    $conn->rollback();
    echo "Error: " . $e->getMessage();
}

$conn->close();

 ?>


